const form_registro_email = document.querySelector("#form-registro-email")
const form_registro = document.querySelector("#form-registro")
const btn_novo_codigo = document.querySelector("#btn_novo_codigo")
const inputEmail = document.querySelector("#email")

form_registro_email.addEventListener("submit", async evt => {
    evt.preventDefault()

    const inputs = document.querySelectorAll("#form-registro-email input")

    try {
        const responseRegistro = await axios.post("http://localhost:3000/auth/registro/user-registro", {
            usuario: inputs[0].value,
            email: inputs[1].value,
            senha: inputs[2].value
        })

        const res = responseRegistro.data
        Swal.fire(res.message, '', 'success')
        form_registro_email.style.display = "none"
        form_registro.style.display = "flex"
        inputEmail.value = inputs[1].value

        // chamamos a funcao para alternar a opcao para reenviar o codigo
        BtnReenviarAlternar("bloqueado");
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.response.data.message })
    }
})

form_registro.addEventListener("submit", evt => {
    evt.preventDefault()

    requisicaoVerificarCodigoInput()
})

btn_novo_codigo.addEventListener("click", evt => {
    evt.preventDefault();
    
    requisicaoReenviarCodigo()
});
