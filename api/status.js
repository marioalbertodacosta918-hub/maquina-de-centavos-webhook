export default async function handler(req, res) {
  try {
    const accessToken = process.env.MP_ACCESS_TOKEN;

    if (!accessToken) {
      return res.status(500).json({
        aprovado: false,
        erro: "MP_ACCESS_TOKEN não configurada"
      });
    }

    const response = await fetch(
      "https://api.mercadopago.com/v1/payments/search?sort=date_created&criteria=desc&limit=1",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const pagamento = data.results?.[0];

    if (
      pagamento &&
      pagamento.status === "approved" &&
      Number(pagamento.transaction_amount) === 19.90
    ) {
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
    console.error("Erro ao consultar pagamento:", error);

    return res.status(500).json({
      aprovado: false,
      erro: "Erro ao consultar pagamento"
    });
  }
}
