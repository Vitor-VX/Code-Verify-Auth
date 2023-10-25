const mongoose = require("mongoose")

const modelTarefas = new mongoose.Schema({ tafera: String, concluida: Boolean, criacao: Date })
const modelLoginAcessoApi = new mongoose.Schema({ username: String, password: String, email: String, acesso: String, registrado: Boolean })
const modelVerificacoes = new mongoose.Schema({ username: String, verificao: Number })

const TarefasModel = mongoose.connection.useDb("tarefas-api").model('tarefa', modelTarefas)
const LoginAcessoApiModel = mongoose.connection.useDb("tarefas-api").model('user', modelLoginAcessoApi)
const VerificacoesModel = mongoose.connection.useDb("tarefas-api").model('verificacoes', modelVerificacoes)

module.exports = {
    TarefasModel,
    LoginAcessoApiModel,
    VerificacoesModel
}