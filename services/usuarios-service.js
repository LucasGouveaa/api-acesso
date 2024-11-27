const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const router = express.Router();

// Configuração do banco de dados
const sequelize = new Sequelize("permissionamento", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
  port: 3306,
});

// Definição dos modelos
const Usuario = sequelize.define(
  "Usuario",
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
    tableName: "usuarios", // Define o nome fixo da tabela
    timestamps: false, // Desabilita colunas automáticas como createdAt e updatedAt (opcional)
  }
);

const Grupo = sequelize.define(
  "Grupo",
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
    tableName: "grupos", // Define o nome fixo da tabela
    timestamps: false, // Desabilita colunas automáticas como createdAt e updatedAt (opcional)
  }
);

// Relacionamento N:M entre Usuários e Grupos
Usuario.belongsToMany(Grupo, {
  through: "Usuarios_Grupos",
  foreignKey: "usuarioId",
  timestamps: false
});
Grupo.belongsToMany(Usuario, {
  through: "Usuarios_Grupos",
  foreignKey: "grupoId",
  timestamps: false
});

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

// CRUD de Usuários

router.get("/", async (req, res) => {
  try {
    res.status(201).json({ message: "Usuarios Works!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro na rota de Usuarios." });
  }
});

// Criar um novo usuário
router.post("/new", async (req, res) => {
  try {
    const novoUsuario = await Usuario.create(req.body);
    res.status(201).json(novoUsuario);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ message: "Erro ao criar usuário." });
  }
});

// Listar todos os usuários
router.get("/list", async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ message: "Erro ao listar usuários." });
  }
});

// Obter detalhes de um usuário específico (incluindo grupos)
router.get("/find/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: Grupo,
    });
    if (usuario) {
      res.json(usuario);
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ message: "Erro ao buscar usuário." });
  }
});

// Atualizar um usuário existente
router.put("/update/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      await usuario.update(req.body);
      res.json(usuario);
    } else {
      res.status(404).json({
        message: "Usuário não encontrado.",
      });
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
});

// Excluir um usuário
router.delete("/delete/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      await usuario.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ message: "Erro ao excluir usuário." });
  }
});

// Associação com Grupos

// Adicionar grupos a um usuário
router.post("/add-grupo/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      const { grupoId } = req.body;
      await usuario.addGrupo(grupoId);
      res
        .status(201)
        .send({ message: "Grupo adicionado ao usuário com sucesso." });
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao adicionar grupo ao usuário:", error);
    res.status(500).json({ message: "Erro ao adicionar grupo ao usuário." });
  }
});

// Remover grupos de um usuário
router.delete("/delete-grupo/:id", async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (usuario) {
      const { grupoId } = req.body;
      await usuario.removeGrupo(grupoId);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Usuário não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao remover grupo do usuário:", error);
    res.status(500).json({ message: "Erro ao remover grupo do usuário." });
  }
});

module.exports = router;
