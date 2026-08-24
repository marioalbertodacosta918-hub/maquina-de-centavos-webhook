
const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", req.body);

  res.status(200).send("OK");
});

app.get("/", (req, res) => {
  res.send("Máquina de Centavos - Webhook funcionando!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando na porta ${PORT}`);
});
