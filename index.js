// Importa o framework Express
const express = require("express");

// Inicializa a aplicação Express
const app = express();

// Importa o módulo body-parser para o projeto
// O body-parser é um middleware que facilita a análise do corpo das requisições HTTP,
// permitindo que os dados enviados através de formulários ou JSON sejam acessados
// diretamente via req.body. Ele é útil para manipular informações de formulários
// ou requisições do tipo POST.
const bodyParser = require("body-parser");

const connection = require("./database/database"); // Importa o módulo de conexão com o banco de dados

// Importa o modelo "Pergunta" do arquivo "Pergunta.js" dentro da pasta "database"
// O caminho precisa estar correto e o arquivo "Pergunta.js" deve existir no diretório especificado
// Verifique também se o arquivo está exportando o modelo corretamente com "module.exports = Pergunta;"
// Caso contrário, o require não funcionará corretamente
// Certifique-se de que o nome do arquivo e o caminho são exatos, levando em consideração maiúsculas e minúsculas
const Pergunta = require("./database/Pergunta");

// Importa o modelo ou módulo 'Resposta' do arquivo 'Resposta.js'
// localizado no diretório 'database'.
const Resposta = require("./database/Resposta");


// Teste de conexão com o banco de dados
connection
    .authenticate() // Tenta autenticar a conexão com o banco de dados
    .then(() => {
        console.log("Conexão feita com o banco de dados"); // Mensagem exibida se a conexão for bem-sucedida
    })
    .catch((msgErro) => {
        console.log(msgErro); // Exibe a mensagem de erro caso a conexão falhe
    });


// Define o EJS como motor de renderização de views
// O EJS permite que você use arquivos .ejs como templates dinâmicos para suas páginas HTML
app.set('view engine', 'ejs');


// Define a pasta "public" como o diretório de arquivos estáticos
// Isso permite servir arquivos como imagens, CSS e JavaScript diretamente ao cliente
app.use(express.static('public'));


// Configura o body-parser para processar dados de formulários (URL-encoded) com objetos simples
app.use(bodyParser.urlencoded({ extended: false }));


// Configura o body-parser para processar dados em formato JSON
app.use(bodyParser.json());


// Rota GET para a página inicial ("/")
app.get("/", (req, res) => { 
    // Consulta ao banco de dados para encontrar todas as perguntas
    // A função findAll do Sequelize é usada para buscar todos os registros da tabela Pergunta
    Pergunta.findAll({ 
        // 'raw: true' retorna os resultados como objetos simples de JavaScript, sem os métodos do Sequelize
        raw: true, 
        // Ordena os resultados pelo campo 'id' em ordem decrescente (ou seja, da pergunta mais recente para a mais antiga)
        order: [['id', 'DESC']] 
    }).then(perguntas => {
        // Quando os dados forem recuperados, a função de callback 'then' é executada
        // Renderiza a página "index" passando as perguntas recuperadas para o template
        res.render("index",{
            perguntas: perguntas // As perguntas são enviadas para o template como um objeto para serem exibidas na página
        });
    });
});


// Define uma rota para "/perguntar"
// Quando o usuário acessa "/perguntar", o servidor renderiza o template "perguntar.ejs"
app.get("/perguntar", (req, res) => {
    res.render("perguntar");
});


// Rota para lidar com o envio do formulário de uma nova pergunta
// O método post() define a rota "/salvarpergunta" que será chamada quando o formulário for enviado via POST
app.post("/salvarpergunta", (req, res) => {
    // Captura os dados enviados no corpo da requisição (req.body) pelo formulário
    // "titulo" e "descricao" são os nomes dos campos no formulário
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;

    // Usa o modelo "Pergunta" para criar uma nova entrada no banco de dados com os dados capturados
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    })
    // Após salvar a pergunta no banco de dados, redireciona o usuário de volta para a página inicial "/"
    .then(() => {
        res.redirect("/");
    });
});


// Rota que recebe uma requisição GET para o endpoint "/pergunta/:id"
app.get("/pergunta/:id", (req, res) => {
    
    // Obtém o parâmetro 'id' da URL
    var id = req.params.id;
    
    // Realiza uma consulta no banco de dados para encontrar uma pergunta com o 'id' correspondente
    Pergunta.findOne({
        where: { id: id } // Condição de busca no banco de dados: id igual ao id passado na URL
    }).then(pergunta => {
        
        // Verifica se a pergunta foi encontrada
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id}
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta, 
                    respostas: respostas
                });
            });
            
        } else {
            // Se a pergunta não for encontrada, redireciona para a página inicial
            res.redirect("/");
        }
    });
});


app.post("/responder", (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta; 
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + perguntaId);
    });
});


// Inicia o servidor na porta 8092
// Quando o servidor é iniciado, ele escuta conexões na porta 8092
app.listen(8092, () => {
    // Exibe uma mensagem no console quando o servidor estiver ativo
    console.log("App Rodando!");
});

