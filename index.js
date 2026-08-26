const express = require("express");

const app = express();

app.use(express.json());

// Guarda o último pagamento recebido
let ultimoPagamento = null;

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", req.body);

  const paymentId = req.body?.data?.id;

  if (!paymentId) {
    return res.status(200).json({
      received: true
    });
  }

  if (String(paymentId) === "123456") {
    console.log("Simulação recebida com sucesso.");

    return res.status(200).json({
      received: true,
      simulation: true
    });
  }

  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("MP_ACCESS_TOKEN não configurada.");

      return res.status(500).json({
        received: false
      });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        "Erro ao consultar pagamento:",
        response.status,
        errorText
      );

      return res.status(200).json({
        received: true
      });
    }

    const payment = await response.json();

    console.log("Pagamento consultado:", {
      id: payment.id,
      status: payment.status,
      valor: payment.transaction_amount
    });

    if (
      payment.status === "approved" &&
      Number(payment.transaction_amount) === 19.90
    ) {
      console.log("PAGAMENTO APROVADO - R$ 19,90");

      // Guarda o pagamento aprovado
      ultimoPagamento = {
        id: String(payment.id),
        valor: Number(payment.transaction_amount),
        status: "aprovado"
      };
    }

    return res.status(200).json({
      received: true
    });

  } catch (error) {
    console.error(
      "Erro no processamento:",
      error
    );

    return res.status(200).json({
      received: true
    });
  }
});

app.get("/status", (req, res) => {

  if (!ultimoPagamento) {
    return res.status(200).json({
      aprovado: false
    });
  }

  return res.status(200).json({
    aprovado: true,
    pagamento: ultimoPagamento
  });

});

app.get("/", (req, res) => {
  res.status(200).send(
    "Máquina de Centavos - Webhook funcionando!"
  );
});

module.exports = app;
