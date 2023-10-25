const BtnReenviarAlternar = (option) => {
    switch (option) {
        case "bloqueado":
            btn_novo_codigo.disabled = true;
            btn_novo_codigo.classList.add("invalido");
            setTimeout(() => {
                BtnReenviarAlternar("desbloqueado");
            }, 10000);
            break;
        case "desbloqueado":
            btn_novo_codigo.disabled = false;
            btn_novo_codigo.classList.remove("invalido");
            break;
    }
}

const requisicaoVerificarCodigoInput = async () => {
    const codigoInput = document.querySelectorAll(".verification-code input")[1].value

    try {
        const reponseVerificarCodigo = await axios.post(`http://localhost:3000/auth/registro/verificacao?codigo=${codigoInput}`)

        const res = reponseVerificarCodigo.data
        Swal.fire(res.message, '', 'success')
        setTimeout(() => window.location.href = res.url, 3000)
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.response.data.message })
    }
}

const requisicaoReenviarCodigo = async () => {
    const inputEmail = document.querySelector("#email")
    const email = inputEmail.value

    try {
        const responseNovoCodigo = await axios.post(`http://localhost:3000/auth/registro/novo-codigo?nomeOuEmail=${email}`)
        const res = responseNovoCodigo.data

        Swal.fire(res.message, '', 'success')
        BtnReenviarAlternar("bloqueado");
    } catch (err) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.response.data.message })
    }
}