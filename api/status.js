export default async function handler(req, res) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurado"
      });
    }

    const paymentId = "174912356395";

    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const pagamento = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        aprovado: false,
        erro: pagamento
      });
    }

    return res.status(200).json({
      aprovado: pagamento.status === "approved",
      pagamento: {
        id: String(pagamento.id),
        status: pagamento.status,
        status_detail: pagamento.status_detail,
        valor: Number(pagamento.transaction_amount)
      }
    });

  } catch (error) {
    return res.status(500).json({
      aprovado: false,
      erro: error.message
    });
  }
}
