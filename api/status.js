
export default async function handler(req, res) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurada"
      });
    }

    const paymentId = "174814588471";

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const payment = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        aprovado: false,
        erro: payment
      });
    }

    if (
      payment.status === "approved" &&
      Number(payment.transaction_amount) === 19.90
    ) {
      return res.status(200).json({
        aprovado: true,
        pagamento: {
          id: String(payment.id),
          valor: Number(payment.transaction_amount),
          status: payment.status
        }
      });
    }

    return res.status(200).json({
      aprovado: false,
      status: payment.status
    });

  } catch (error) {
    return res.status(500).json({
      aprovado: false,
      erro: error.message
    });
  }
}
