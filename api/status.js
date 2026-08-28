export default async function handler(req, res) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurado"
      });
    }

    const paymentId = req.query.id;

    if (!paymentId) {
      return res.status(400).json({
        aprovado: false,
        erro: "Informe o ID do pagamento"
      });
    }

    const resposta = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        aprovado: false,
        erro: "Erro ao consultar pagamento",
        detalhes: dados
      });
    }

    return res.status(200).json({
      aprovado: dados.status === "approved",
      pagamento: {
        id: dados.id,
        status: dados.status,
        status_detail: dados.status_detail,
        valor: dados.transaction_amount,
        external_reference: dados.external_reference
      }
    });

  } catch (erro) {
    return res.status(500).json({
      aprovado: false,
      erro: "Erro interno",
      detalhes: erro.message
    });
  }
}
