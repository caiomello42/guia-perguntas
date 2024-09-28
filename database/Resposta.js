// Importa o módulo Sequelize, que é um ORM (Object-Relational Mapper) para Node.js
// Sequelize facilita a interação com o banco de dados, permitindo que você use
// objetos JavaScript para realizar operações em tabelas.
const { Sequelize, DataTypes } = require("sequelize");

// Importa a conexão com o banco de dados definida no arquivo "database"
// Essa conexão provavelmente contém as configurações necessárias para se comunicar
// com o banco de dados, como credenciais, nome do banco e configurações de host.
const connection = require ("./database");

// Define o modelo 'Resposta' usando a conexão e a função define do Sequelize.
// O modelo representa a tabela 'resposta' no banco de dados e inclui dois campos:
// 1. 'corpo': campo de texto que armazenará o conteúdo da resposta;
// 2. 'perguntaId': um campo inteiro que relaciona a resposta à pergunta correspondente.
const Resposta = connection.define('resposta', {
    corpo: {
        type: DataTypes.TEXT, // Define o tipo de dado como texto (TEXT).
        allowNull: false      // Define que o campo 'corpo' não pode ser nulo.
    },
    perguntaId: {
        type: DataTypes.INTEGER, // Define o tipo de dado como inteiro (INTEGER).
        allowNull: false         // Define que o campo 'perguntaId' não pode ser nulo.
    }
});

// Sincroniza o modelo 'Resposta' com o banco de dados, criando a tabela se ela não existir.
// O parâmetro {force: false} garante que, se a tabela já existir, ela não será recriada.
Resposta.sync({force: false});

// Exporta o modelo 'Resposta' para que possa ser utilizado em outros arquivos do projeto.
module.exports = Resposta;
