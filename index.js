const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");
const port = 3000;

// Importa o router
const sistemaRouter = require("./services/sistemas-service.js");
const permissoesRouter = require("./services/permissoes-service.js");
const gruposRouter = require("./services/grupos-service.js");
const usuariosRouter = require("./services/usuarios-service.js");
const autorizacaoRouter = require("./services/autorizacao-service.js");

// Monta o app em uma rota específica
app.use("/sistemas", sistemaRouter);
app.use("/permissoes", permissoesRouter);
app.use("/grupos", gruposRouter);
app.use("/usuarios", usuariosRouter);
app.use("/autorizacao", autorizacaoRouter);

app.use("/documation", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/", (req, res) => {
  res.send("Api de Gerenciamento de Sistemas");
});

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});
