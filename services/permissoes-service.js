const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

// Crie uma instância do router
const router = express.Router();

// Configuração do banco de dados
const sequelize = new Sequelize('permissionamento', 'root', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306, 
});


// Definição do modelo Permissao
const Permissao = sequelize.define('Permissao', {
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
  tableName: 'permissoes', // Define o nome fixo da tabela
  timestamps: false, // Desabilita colunas automáticas como createdAt e updatedAt (opcional)
});

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
    res.status(201).json({ message: "Permissões Works!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar permissão." });
  }
});

// Criar uma nova permissão
router.post("/new", async (req, res) => {
  try {
    const novaPermissao = await Permissao.create(req.body);
    res.status(201).json(novaPermissao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar permissão." });
  }
});

// Listar todas as permissões
router.get("/list", async (req, res) => {
  try {
    const permissoes = await Permissao.findAll();
    res.json(permissoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao listar permissões." });
  }
});

// Obter detalhes de uma permissão específica
router.get("/find/:id", async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (permissao) {
      res.json(permissao);
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar permissão." });
  }
});

// Atualizar uma permissão existente
router.put("/update/:id", async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (permissao) {
      await permissao.update(req.body);
      res.json(permissao);
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao atualizar permissão." });
  }
});

// Excluir uma permissão
router.delete("/delete/:id", async (req, res) => {
  try {
    const permissao = await Permissao.findByPk(req.params.id);
    if (permissao) {
      await permissao.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Permissão não encontrada." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir permissão." });
  }
});

// Exporte o router
module.exports = router;
