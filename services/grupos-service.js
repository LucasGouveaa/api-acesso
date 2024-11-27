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

const Permissao = sequelize.define(
  "Permissao",
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
    tableName: "permissoes", // Define o nome fixo da tabela
    timestamps: false, // Desabilita colunas automáticas como createdAt e updatedAt (opcional)
  }
);

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

// Relacionamentos N:M entre Grupos e Permissões, e Grupos e Sistemas
Grupo.belongsToMany(Permissao, {
  through: "Grupos_Permissoes",
  foreignKey: "grupoId",
  timestamps: false
});
Permissao.belongsToMany(Grupo, {
  through: "Grupos_Permissoes",
  foreignKey: "permissaoId",
  timestamps: false

});
Permissao.belongsToMany(Sistema,
  {
    through: "Grupos_Permissoes",
    foreignKey: "permissaoId",
    timestamps: false,
  }
);
Sistema.belongsToMany(Permissao, {
  through: "Grupos_Permissoes",
  foreignKey: "sistemaId",
  timestamps: false,
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

// CRUD de Grupos

// Rota para teste
router.get("/", async (req, res) => {
  try {
    res.status(201).json({ message: "Grupos Works!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro na rota de Grupos." });
  }
});

// Criar um novo grupo
router.post("/new", async (req, res) => {
  try {
    const novoGrupo = await Grupo.create(req.body);
    res.status(201).json(novoGrupo);
  } catch (error) {
    console.error("Erro ao criar grupo:", error);
    res.status(500).json({ message: "Erro ao criar grupo." });
  }
});

// Listar todos os grupos
router.get("/list", async (req, res) => {
  try {
    const grupos = await Grupo.findAll();
    res.json(grupos);
  } catch (error) {
    console.error("Erro ao listar grupos:", error);
    res.status(500).json({ message: "Erro ao listar grupos." });
  }
});

// Obter detalhes de um grupo específico (incluindo permissões e sistemas)
router.get("/find/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id, {
      include: [
        { model: Permissao, through: "Grupos_Permissoes", include: [Sistema] },
        // { model: Sistema, through: "Grupos_Sistemas" },
      ],
    });
    if (grupo) {
      res.json(grupo);
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao buscar grupo:", error);
    res.status(500).json({ message: "Erro ao buscar grupo." });
  }
});

// Atualizar um grupo existente
router.put("/update/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      await grupo.update(req.body);
      res.json(grupo);
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao atualizar grupo:", error);
    res.status(500).json({ message: "Erro ao atualizar grupo." });
  }
});

// Excluir um grupo
router.delete("/delete/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      await grupo.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao excluir grupo:", error);
    res.status(500).json({ message: "Erro ao excluir grupo." });
  }
});

// Associação com Permissões e Sistemas

// Adicionar permissões a um grupo
router.post("/add-permissao/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      const { permissaoId, sistemaId } = req.body;
      await grupo.addPermissao(permissaoId, { through: { sistemaId } });
      res
        .status(201)
        .send({ message: "Permissão adicionada ao grupo com sucesso." });
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao adicionar permissão ao grupo:", error);
    res.status(500).json({ message: "Erro ao adicionar permissão ao grupo." });
  }
});

// Remover permissões de um grupo
router.delete("/delete-permissao/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      const { permissaoId, sistemaId } = req.body;
      await grupo.removePermissao(permissaoId, { through: { sistemaId } });
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao remover permissão do grupo:", error);
    res.status(500).json({ message: "Erro ao remover permissão do grupo." });
  }
});

// Adicionar sistemas a um grupo
router.post("/add-sistema/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      const { sistemaId } = req.body;
      await grupo.addSistema(sistemaId);
      res
        .status(201)
        .send({ message: "Sistema adicionado ao grupo com sucesso." });
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao adicionar sistema ao grupo:", error);
    res.status(500).json({ message: "Erro ao adicionar sistema ao grupo." });
  }
});

// Remover sistemas de um grupo
router.delete("/delete-sistema/:id", async (req, res) => {
  try {
    const grupo = await Grupo.findByPk(req.params.id);
    if (grupo) {
      const { sistemaId } = req.body;
      await grupo.removeSistema(sistemaId);
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Grupo não encontrado." });
    }
  } catch (error) {
    console.error("Erro ao remover sistema do grupo:", error);
    res.status(500).json({ message: "Erro ao remover sistema do grupo." });
  }
});

module.exports = router;
