export default async function handler(req, res) {
  // O Mercado Pago espera uma resposta rápida
  if (req.method !== "POST") {
    return res.status(200).json({
      recebido: true,
      mensagem: "Webhook ativo"
    });
  }

  try {
    const token = process.env.MP_ACCESS_TOKEN;

    if (!token) {
      return res.status(500).json({
        recebido: false,
        erro: "MP_ACCESS_TOKEN não configurado"
      });
    }

    const dados = req.body || {};

    console.log(
      "Notificação recebida:",
      JSON.stringify(dados)
    );

    // O Mercado Pago pode enviar o ID em diferentes formatos
    const paymentId =
      dados?.data?.id ||
      dados?.id ||
      dados?.resource?.id;

    // Se não for uma notificação de pagamento,
    // apenas confirmamos o recebimento.
    if (!paymentId) {
      return res.status(200).json({
        recebido: true,
        pagamento: false
      });
    }

    // Consulta o pagamento diretamente no Mercado Pago
    const resposta = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const pagamento = await resposta.json();

    if (!resposta.ok) {
      console.error(
        "Erro ao consultar pagamento:",
        JSON.stringify(pagamento)
      );

      return res.status(200).json({
        recebido: true,
        pagamento: false,
        erro: pagamento
      });
    }

    console.log(
      "Pagamento consultado:",
      JSON.stringify(pagamento)
    );

    // Verifica se o pagamento foi realmente aprovado
    if (pagamento.status === "approved") {
      console.log(
        "PAGAMENTO APROVADO:",
        pagamento.id,
        pagamento.transaction_amount
      );

      return res.status(200).json({
        recebido: true,
        aprovado: true,
        pagamento: {
          id: String(pagamento.id),
          valor: Number(pagamento.transaction_amount),
          status: pagamento.status
        }
      });
    }

    return res.status(200).json({
      recebido: true,
      aprovado: false,
      pagamento: {
        id: String(pagamento.id),
        valor: Number(pagamento.transaction_amount),
        status: pagamento.status
      }
    });

  } catch (error) {
    console.error("Erro no webhook:", error);

    return res.status(500).json({
      recebido: false,
      erro: error.message
    });
  }
}
