const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const router = express.Router(); // Cria uma instância do router

// Configuração do banco de dados
const sequelize = new Sequelize("permissionamento", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

// Definição do modelo Sistema
const Sistema = sequelize.define(
  "Sistema",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: "sistemas", // Define o nome fixo da tabela
    timestamps: false, // Desabilita colunas automáticas como createdAt e updatedAt (opcional)
  }
);

// Sincronização com o banco de dados
(async () => {
  try {
    await sequelize.sync();
    console.log("Banco de dados sincronizado!");
  } catch (error) {
    console.error("Erro ao sincronizar o banco de dados:", error);
  }
})();

router.use(bodyParser.json());

// Endpoints da API REST

// Rota para teste
router.get("/", async (req, res) => {
  try {
    res.status(201).json({ message: "Sistemas Works!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro na rota de Sistemas" });
  }
});

// Criar um novo sistema
router.post("/new", async (req, res) => {
  try {
    const novoSistema = await Sistema.create(req.body);
    res.status(201).json(novoSistema);
  } catch (error) {
    console.error("Erro ao criar sistema:", error);
    res.status(500).json({ message: "Erro ao criar sistema." });
  }
});

// Listar todos os sistemas
router.get("/list", async (req, res) => {
  try {
    const sistemas = await Sistema.findAll();
    res.json(sistemas);
  } catch (error) {
    console.error("Erro ao listar sistemas:", error);
    res.status(500).json({ message: "Erro ao listar sistemas." });
  }
});

// Obter detalhes de um sistema específico
router.get("/find/:id", async (req, res) => {
  try {
    const sistema = await Sistema.findByPk(req.params.id);
    if (sistema) {
      res.json(sistema);
    } else {
      res.status(404).json({ message: "Sistema não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar sistema:", error);
    res.status(500).json({ message: "Erro ao buscar sistema." });
  }
});

// Atualizar um sistema existente
router.put("/update/:id", async (req, res) => {
  try {
    const sistema = await Sistema.findByPk(req.params.id);
    if (sistema) {
      await sistema.update(req.body);
      res.json(sistema);
    } else {
      res.status(404).json({ message: "Sistema não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao atualizar sistema:", error);
    res.status(500).json({ message: "Erro ao atualizar sistema." });
  }
});

// Excluir um sistema
router.delete("/delete/:id", async (req, res) => {
  try {
    const sistema = await Sistema.findByPk(req.params.id);
    if (sistema) {
      await sistema.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Sistema não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao excluir sistema:", error);
    res.status(500).json({ message: "Erro ao excluir sistema." });
  }
});

module.exports = router; // Exporta o router
