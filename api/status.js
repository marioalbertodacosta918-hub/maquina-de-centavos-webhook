export default async function handler(req, res) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurada"
      });
    }

    /*
     * Consulta os pagamentos recentes do Mercado Pago
     * e procura o último pagamento aprovado de R$ 19,90.
     */

    const response = await fetch(
      "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        aprovado: false,
        erro: data
      });
    }

    const pagamentos = data.results || [];

    const pagamentoAprovado = pagamentos.find(
      (pagamento) =>
        pagamento.status === "approved" &&
        Number(pagamento.transaction_amount) === 19.90
    );

    if (!pagamentoAprovado) {
      return res.status(200).json({
        aprovado: false
      });
    }

    return res.status(200).json({
      aprovado: true,
      pagamento: {
        id: String(pagamentoAprovado.id),
        valor: Number(pagamentoAprovado.transaction_amount),
        status: pagamentoAprovado.status
      }
    });

  } catch (error) {
    return res.status(500).json({
      aprovado: false,
      erro: error.message
    });
  }
}
