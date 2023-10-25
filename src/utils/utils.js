require("dotenv").config()

const enviarEmail = async (enviarEmailPara, codigo) => {
    const sendEmail = require("@sendgrid/mail")
    sendEmail.setApiKey(process.env.SENDGRID_API_KEY)

    msg = {
        to: enviarEmailPara,
        from: 'joaovictorrocha102019@gmail.com',
        subject: 'Verificação',
        text: 'Email de verificação',
        html: `<strong>Seu código de verificação é: ${codigo}</strong>`,
    }

    try {
        await sendEmail.send(msg)
    } catch (error) {
        console.log(error);
    }
}

const numeroDeVerificacao = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    enviarEmail,
    numeroDeVerificacao
}