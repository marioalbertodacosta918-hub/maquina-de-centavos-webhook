export default async function handler(req, res) {
  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        erro: "MP_ACCESS_TOKEN não configurado"
      });
    }

    const response = await fetch(
      "https://api.mercadopago.com/users/me",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      ok: response.ok,
      id: data.id || null,
      nickname: data.nickname || null,
      email: data.email || null,
      error: data.error || null,
      message: data.message || null
    });

  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}
