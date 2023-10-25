const { enviarEmail, numeroDeVerificacao } = require("../utils/utils")
const jwt = require("jsonwebtoken")

const express = require("express")
const router = express.Router()
require("dotenv").config()

// Model's
const {
    VerificacoesModel,
    LoginAcessoApiModel
} = require("../../models/modelsApi")

router.use(express.json())

router.post("/user-registro", async (req, res) => {
    const { usuario, email, senha } = req.body
    const codigoDeVerificacao = numeroDeVerificacao()

    if (!usuario || !email || !senha) {
        res.status(422).json({ message: "Todos os campos são necessários!" })
        return;
    }

    try {
        const verificarUsuarioExistente = await LoginAcessoApiModel.findOne({ $or: [{ username: usuario }, { email: email }] })
        if (verificarUsuarioExistente) {
            const msg = verificarUsuarioExistente.username === usuario ? "Usúario já existe!" : "Esse email já está registrado!"
            res.status(401).json({ message: msg })
            return;
        }

        // usúario não existe registro ele
        await LoginAcessoApiModel.create({
            username: usuario,
            email,
            password: senha,
            acesso: "",
            registrado: false
        })

        const criarVerificacao = VerificacoesModel.create(({
            username: usuario,
            verificao: codigoDeVerificacao
        }))

        const codigoEmail = enviarEmail(email, codigoDeVerificacao)

        Promise.all([criarVerificacao, codigoEmail])
            .then(() => {
                res.status(200).json({ message: "Usuário cadastrado com sucesso!" });
            })
            .catch(error => {
                res.status(500).json({ message: "Erro ao enviar o email!" });
            });

    } catch (error) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

router.post("/verificacao", async (req, res) => {
    const { codigo } = req.query

    if (!codigo) {
        res.status(422).json({ message: "Campo inválido." })
        return;
    }

    try {
        const verificarCodigo = await VerificacoesModel.findOne({ verificao: codigo })

        if (!verificarCodigo) {
            res.status(401).json({ message: "Código inválido!", btn_reenviar: true })
            return;
        }

        const secret = process.env.SECRET
        const token = jwt.sign({
            nome_registrado: verificarCodigo.username
        }, secret)

        await LoginAcessoApiModel.updateOne(
            { username: verificarCodigo.username },
            { $set: { acesso: token, registrado: true } }
        )

        // Limpar o codigo de verificacao
        verificarCodigo.verificao = null
        await verificarCodigo.save();

        res.status(200).json({ message: "Verificação concluída!", url: "/acesso-api" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

router.post("/novo-codigo", async (req, res) => {
    const { nomeOuEmail } = req.query
    const novoCodigo = numeroDeVerificacao()

    try {
        const usuario = await LoginAcessoApiModel.findOne({ $or: [{ username: nomeOuEmail }, { email: nomeOuEmail }] });
        if (usuario) {
            const atualizarCodigo = await VerificacoesModel.updateOne(
                { username: usuario.username },
                { $set: { verificao: novoCodigo } }
            )
            const novoCodigoEmail = await enviarEmail(usuario.email, novoCodigo)

            Promise.all([atualizarCodigo, novoCodigoEmail])
                .then(() => {
                    res.status(200).json({ message: "Novo código enviado." })
                })
                .catch(err => {
                    res.status(500).json({ message: "Erro ao tentar enviar um novo código." })
                })
        }
    } catch (err) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

module.exports = router