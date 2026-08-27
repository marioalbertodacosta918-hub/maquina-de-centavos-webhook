
export default async function handler(req, res) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        erro: "MP_ACCESS_TOKEN não configurada"
      });
    }

    const response = await fetch(
      "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      quantidade: data.results?.length || 0,
      pagamentos: (data.results || []).map(p => ({
        id: String(p.id),
        status: p.status,
        valor: Number(p.transaction_amount),
        data: p.date_created,
        status_detail: p.status_detail
      })),
      erro: data.error || null,
      mensagem: data.message || null
    });

  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}
