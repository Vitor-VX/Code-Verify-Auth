const express = require("express")
const app = express()
const path = require("path")

// Conexao banco de dados
require("../models/conexaoBancoDeDados")()

// rotas
const rotaRegistro = require("./routers/rotaRegistro")
const rotaLogin = require("./routers/rotaLogin")

// porta
const porta = process.env.PORT || 3000

// cors
const cors = require("cors")

// app.use
app.use(cors())
app.use("/auth/registro", rotaRegistro)
app.use("/auth/login", rotaLogin)
app.use(express.static("src/public"))

app.get("/acesso-api", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/html/index.html"))
    return;
})

app.get("/registro", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/html/registro.html"))
    return;
})

app.use((req, res, next) => {
    res.redirect("/acesso-api")
})

app.listen(porta, () => console.log(`Servidor iniciado na porta: ${porta}`))