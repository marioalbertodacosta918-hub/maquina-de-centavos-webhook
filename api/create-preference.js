export default async function handler(req, res) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        erro: "MP_ACCESS_TOKEN não configurado"
      });
    }

    // Identificador único desta compra
    const referencia = "maquina-centavos-" + Date.now();

    const resposta = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          items: [
            {
              id: "maquina-centavos-1990",
              title: "Máquina de Centavos",
              description: "Produto digital Máquina de Centavos",
              quantity: 1,
              currency_id: "BRL",
              unit_price: 19.90
            }
          ],

          external_reference: referencia,

          back_urls: {
            success:
              "https://maquina-de-centavos-webhook.vercel.app/sucesso",

            failure:
              "https://maquina-de-centavos-webhook.vercel.app/erro",

            pending:
              "https://maquina-de-centavos-webhook.vercel.app/pendente"
          },

          auto_return: "approved",

          notification_url:
            "https://maquina-de-centavos-webhook.vercel.app/webhook"
        })
      }
    );

    const dados = await resposta.json();

    if (!resposta.ok) {
      return res.status(resposta.status).json({
        erro: "Mercado Pago recusou a criação da preferência",
        detalhes: dados
      });
    }

    if (!dados.init_point) {
      return res.status(500).json({
        erro: "Mercado Pago não retornou o link de pagamento",
        resposta: dados
      });
    }

    return res.redirect(302, dados.init_point);

  } catch (erro) {
    return res.status(500).json({
      erro: "Erro ao criar preferência",
      detalhes: erro.message
    });
  }
}
