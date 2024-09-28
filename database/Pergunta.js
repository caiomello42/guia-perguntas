// Importa o módulo Sequelize, que é um ORM (Object-Relational Mapper) para Node.js
const { Sequelize, DataTypes } = require("sequelize");

// Importa a conexão com o banco de dados definida no arquivo "database"
const connection = require ("./database");

// Define o modelo "Pergunta" que representa uma tabela no banco de dados
// O método define cria um novo modelo, que neste caso é chamado de "pergunta"
const Pergunta = connection.define('pergunta', {
    // Define o campo "titulo" do modelo "pergunta", do tipo STRING (texto curto)
    // O campo "titulo" não pode ser nulo (allowNull: false)
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // Define o campo "descricao" do modelo "pergunta", do tipo TEXT (texto longo)
    // O campo "descricao" também não pode ser nulo (allowNull: false)
    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

// O método sync() sincroniza o modelo "Pergunta" com o banco de dados, ou seja, cria a tabela
// { force: false } significa que, se a tabela já existir, ela não será recriada
// Se fosse { force: true }, a tabela seria apagada e recriada sempre que o código fosse executado, o que poderia resultar em perda de dados
Pergunta.sync({force: false}).then(() => {
    console.log("Tabela Criada");
});

module.exports = Pergunta;
