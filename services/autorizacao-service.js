const express = require("express");
const bodyParser = require("body-parser");
// const { Sequelize, DataTypes } = require("sequelize");
const axios = require("axios"); // Para fazer requisições HTTP

const router = express.Router();

// Configuração do banco de dados (caso este serviço precise de um banco)

// ... (definição de modelos, caso necessário)

// URLs dos outros serviços (substitua pelas URLs corretas)
const usuariosServiceUrl = "http://localhost:3000/usuarios"; // URL do serviço de Usuários
const gruposServiceUrl = "http://localhost:3000/grupos"; // URL do serviço de Grupos

router.use(bodyParser.json());

// Endpoint para obter as permissões de um usuário
router.post("/", async (req, res) => {
  try {
    const usuarioId = req.body.usuarioId;

    // 1. Obter os grupos do usuário
    const gruposResponse = await axios.get(
      `${usuariosServiceUrl}/find/${usuarioId}`
    );
    const grupos = gruposResponse.data.Grupos;
    let permissoes = [];

    // 2. Para cada grupo, obter as permissões no sistema especificado

    for (const grupo of grupos) {
      const grupoId = grupo.id;
      const permissoesResponse = await axios.get(
        `${gruposServiceUrl}/find/${grupoId}`
      );
      console.log(permissoesResponse)
      permissoes = permissoes.concat(permissoesResponse.data);
    }


    // 3. Remover permissões duplicadas
    permissoes = permissoes.filter(
      (permissao, index, self) =>
        index === self.findIndex((p) => p.id === permissao.id)
    );

    res.json(permissoes);
  } catch (error) {
    console.error("Erro ao obter permissões do usuário:", error);
    res.status(500).json({ message: "Erro ao obter permissões do usuário." });
  }
});

module.exports = router;
