const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", req.body);

  const paymentId = req.body?.data?.id;

  if (!paymentId) {
    return res.status(200).json({ received: true });
  }

  // O simulador do Mercado Pago usa IDs fictícios,
  // como 123456. Não devemos consultar esse ID na API.
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
      return res.status(500).json({ received: false });
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

      return res.status(200).json({ received: true });
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

      // Aqui entra a ação da Máquina de Centavos.
    }

    return res.status(200).json({
      received: true
    });

  } catch (error) {
    console.error("Erro no processamento:", error);

    return res.status(200).json({
      received: true
    });
  }
});

app.get("/", (req, res) => {
  res.status(200).send(
    "Máquina de Centavos - Webhook funcionando!"
  );
});

module.exports = app;
