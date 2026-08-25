
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método não permitido"
    });
  }

  try {
    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`
        },
        body: JSON.stringify({
          items: [
            {
              title: "Máquina de Centavos",
              quantity: 1,
              currency_id: "BRL",
              unit_price: 19.90
            }
          ],
          notification_url:
            "https://maquina-de-centavos-webhook.vercel.app/webhook"
        })
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Erro ao criar preferência"
    });
  }
}
