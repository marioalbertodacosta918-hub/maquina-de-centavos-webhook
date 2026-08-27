export default async function handler(req, res) {
  const token = process.env.MP_ACCESS_TOKEN;

  if (!token) {
    return res.status(500).json({
      erro: "MP_ACCESS_TOKEN não configurado"
    });
  }

  try {
    const response = await fetch(
      "https://api.mercadopago.com/users/me",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    return res.status(response.status).json({
      teste: "CONTA_PRODUCAO",
      ok: response.ok,
      id: data.id || null,
      nickname: data.nickname || null,
      email: data.email || null,
      erro: data.error || null,
      mensagem: data.message || null
    });

  } catch (error) {
    return res.status(500).json({
      erro: error.message
    });
  }
}
