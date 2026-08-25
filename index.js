const express = require("express");

const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  console.log("Webhook recebido:", req.body);

  res.status(200).json({
    received: true
  });
});

app.get("/", (req, res) => {
  res.status(200).send("Máquina de Centavos - Webhook funcionando!");
});

module.exports = app;
