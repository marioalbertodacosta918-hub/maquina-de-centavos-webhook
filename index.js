const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  console.log("Webhook recebido:", req.body);

  // Responde imediatamente ao Mercado Pago
  res.status(200).json({ received: true });

  try {
    const paymentId = req.body?.data?.id;

    if (!paymentId) {
      console.log("Notificação sem ID de pagamento.");
      return;
    }

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = await response.json();

    console.log("Status do pagamento:", payment.status);
    console.log("Pagamento completo:", payment);
  } catch (error) {
    console.error("Erro ao consultar pagamento:", error);
  }
});

app.get("/", (req, res) => {
  res.status(200).send("Máquina de Centavos - Webhook funcionando!");
});

module.exports = app;
