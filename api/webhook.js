export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      recebido: true,
      mensagem: "Webhook ativo"
    });
  }

  try {
    const dados = req.body || {};

    console.log("Webhook Mercado Pago:", JSON.stringify(dados));

    return res.status(200).json({
      recebido: true
    });

  } catch (error) {
    console.error("Erro no webhook:", error);

    return res.status(500).json({
      recebido: false,
      erro: error.message
    });
  }
}
