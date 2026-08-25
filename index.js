
const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", req.body);

  try {
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      console.log("Notificação sem ID de pagamento.");
      return res.status(200).json({ received: true });
    }

    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      console.error("MP_ACCESS_TOKEN não configurada.");
      return res.status(500).json({ received: false });
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
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
        received: true,
        payment_checked: false
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

      // Aqui vamos colocar a ação da Máquina de Centavos.
    } else {
      console.log(
        "Pagamento não aprovado ou valor diferente de R$ 19,90."
      );
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
  res
    .status(200)
    .send("Máquina de Centavos - Webhook funcionando!");
});

module.exports = app;
