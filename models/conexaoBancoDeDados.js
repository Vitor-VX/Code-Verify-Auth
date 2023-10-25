require("dotenv").config()
const mongoose = require("mongoose")

const stringDeConexao = process.env.USERNAME_DATA_BASE

async function conexaoBancoDeDados() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(stringDeConexao)
            console.log("Conexão do banco de dados feita.");
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = conexaoBancoDeDados