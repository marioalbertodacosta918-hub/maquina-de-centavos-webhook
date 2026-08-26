export default async function handler(req, res) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurada"
      });
    }

    // Busca os pagamentos recentes aprovados
    const response = await fetch(
      "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=10",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      }
    );

    const dados = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        aprovado: false,
        erro: dados
      });
    }

    const pagamentos = dados.results || [];

    // Procura o pagamento aprovado de R$ 19,90
    const pagamento = pagamentos.find((p) => {
      return (
        p.status === "approved" &&
        Number(p.transaction_amount) === 19.90
      );
    });

    if (pagamento) {
      return res.status(200).json({
        aprovado: true,
        pagamento: {
          id: String(pagamento.id),
          valor: Number(pagamento.transaction_amount),
          status: pagamento.status
        }
      });
    }

    return res.status(200).json({
      aprovado: false
    });

  } catch (error) {
    console.error("Erro:", error);

    return res.status(500).json({
      aprovado: false,
      erro: error.message
    });
  }
}
