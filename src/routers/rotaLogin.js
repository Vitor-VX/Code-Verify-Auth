const express = require("express")
const router = express.Router()

router.use(express.json())

// Model's
const {
    LoginAcessoApiModel
} = require("../../models/modelsApi")

const { enviarEmail , numeroDeVerificacao} = require("../utils/utils")

router.post("/", async (req, res) => {
    const { nomeOuEmail, senha } = req.body
    const codigo = numeroDeVerificacao()

    try {
        const usuarioEncontrado = await LoginAcessoApiModel.findOne({ $or: [{ username: nomeOuEmail }, { email: nomeOuEmail }], password: senha });
        if (!usuarioEncontrado) {
            res.status(401).json({ message: "Usúario ou senha incorretos" })
            return;
        }

        // Se o usúario por algum motivo o usuario pulou a etapa de verificacao ele é verificado na hora do login
        if (usuarioEncontrado.registrado !== false) {
            const tokenAcesso = usuarioEncontrado.acesso

            res.status(200).json({ message: tokenAcesso })
            return;
        }

        enviarEmail(usuarioEncontrado.email, codigo)
        res.status(400).json({
            message: "Não verificado!", html: `<div class="verification-code">
        <input type="text" readonly id="email" value="${nomeOuEmail}">
        <input type="text" placeholder="Código de Verificação">
        <button type="submit">Finalizar registro</button>
        <button id="btn_novo_codigo" class="invalido">Solicitar um novo código</button>
    </div>`
        })
    } catch (err) {
        res.status(500).json({ message: "Erro interno no servidor." })
    }
})

module.exports = router