export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  const paymentId = req.query.id;

  if (!paymentId) {
    return res.status(400).json({
      error: "Informe o ID do pagamento"
    });
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const payment = await response.json();

    return res.status(response.status).json({
      id: payment.id,
      status: payment.status,
      status_detail: payment.status_detail,
      transaction_amount: payment.transaction_amount
    });
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar o Mercado Pago"
    });
  }
}
