const login_container = document.querySelector(".login-container form")
login_container.addEventListener("submit", async evt => {
    evt.preventDefault()
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const responseVerificarUsuarioSenha = await axios.post("http://localhost:3000/auth/login", {
            nomeOuEmail: username,
            senha: password
        })

        const res = responseVerificarUsuarioSenha.data
        Swal.fire({ title: "Seu código de acesso:", html: `<input type="text" value="${res.message}" readonly>`, showCloseButton: true });
    } catch (err) {
        if (err.response.status === 400) {
            const form_login = document.querySelector("#form-login")
            form_login.innerHTML = ""
            form_login.innerHTML = err.response.data.html

            BtnReenviarAlternar("bloqueado");
            
            form_login.addEventListener("submit", evt => {
                evt.preventDefault()

                requisicaoVerificarCodigoInput()
            })
            
            document.querySelector("#btn_novo_codigo").addEventListener("click", evt => {
                evt.preventDefault()

                requisicaoReenviarCodigo()
            })
        }
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.response.data.message })
    }
})