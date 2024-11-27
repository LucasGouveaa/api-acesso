const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "API de Gerenciamento de Acesso",
    description: "API para gerenciar usuários, grupos e permissões.",
  },
  host: "localhost:3000",
  basePath: "/",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Sistemas",
      description: "Endpoints para gerenciar sistemas.",
    },
    {
      name: "Permissoes",
      description: "Endpoints para gerenciar permissões.",
    },
    {
      name: "Grupos",
      description: "Endpoints para gerenciar grupos/papéis.",
    },
    {
      name: "Usuarios",
      description: "Endpoints para gerenciar usuários.",
    },
    {
      name: "Autorizacao",
      description: "Endpoints para verificar permissões de usuários.",
    },
  ],
  definitions: {
    Sistema: {
      id: 1,
      nome: "Sistema de RH",
      descricao: "Sistema para gerenciamento de recursos humanos.",
    },
    Permissao: {
      id: 1,
      nome: "ler_dados",
      descricao: "Permissão para ler dados do sistema.",
    },
    Grupo: {
      id: 1,
      nome: "Administrador",
      descricao: "Grupo de administradores do sistema.",
    },
    Usuario: {
      id: 1,
      nome: "João Silva",
      descricao: "Usuário do João Silva para ler dados do sistema",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = [
  "./index.js",
  "./services/sistemas-service.js",
  "./services/permissoes-service.js",
  "./services/grupos-service.js",
  "./services/usuarios-service.js",
  "./services/autorizacao-service.js",
];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./index.js"); // Inicia o servidor após gerar o Swagger
});
