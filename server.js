//configurando o servidor

const express = require("express")

const server = express()

// configurar para apresentar arquivos Estaticos - middleware
server.use(express.static('public'))

//Configura o DB
const mysql     =    require('mysql');
const connection      =    mysql.createPool({
    connectionLimit : 100, //important
    host            : 'localhost',
    user            : 'root',
    password        : '@@123456',
    database        : 'dbDoeSangue',
    debug    :  false
});

connection.query('SELECT * from donors', function (err, rows, fields) {
    if (!err)
        console.log('Database: ', 'ok, conectado');
    else
        console.log('Error while performing Query.');
});

// CREATE TABLE `dbDoeSangue`.`donors` (
//     `id` INT NOT NULL,
//     `name` VARCHAR(150) NULL,
//     `email` VARCHAR(150) NULL,
//     `blood` VARCHAR(3) NULL,
//     PRIMARY KEY (`id`));

// INSERT INTO `dbDoeSangue`.`donors` (`id`, `name`, `email`, `blood`) VALUES ('2', 'Robson Marques', 'robson@gmail.com', 'A+');

//habilitar body do form  - middleware
server.use(express.urlencoded({ extended: true }))

// config a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true,
})

//configura a apresentação da pagina
server.get("/", function (req, res) {

    connection.query('SELECT * from donors', function (err, rows) {
        if (err) return res.send("erro buscando dados")

        const donors = rows
        return res.render("index.html", {donors})
    });

})

server.post("/", function (req, res) {
    //pegar dados do formulario
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios.")
    }

    //colocar valores no DB
    const values  = {name: name, email:email, blood:blood};
    const query = connection.query('INSERT INTO donors SET ?', values, function (err) {
        if(err) return res.send("Erro no Banco de Dados.")
        return res.redirect("./")
    })

})

// ligar o servidor e permitir o acesso na porta 3000
server.listen(3000, function () {
    console.log("iniciei o server")
})
