import { EMPRESA } from "./config.js";
import { linkWhatsapp } from "./utils.js";

const preencherDadosEmpresa = () => {
    document.getElementById("contato-whatsapp").href =
        linkWhatsapp("Olá! Vim pelo site da Edu Imobiliária e gostaria de mais informações.");
    document.getElementById("contato-telefone").textContent = EMPRESA.telefone;
    document.getElementById("contato-email").href = `mailto:${EMPRESA.email}`;
    document.getElementById("contato-email").textContent = EMPRESA.email;
    document.getElementById("contato-instagram").href = EMPRESA.instagram;
    document.getElementById("contato-endereco").textContent = EMPRESA.endereco;
}

// O site não guarda os dados do visitante: a mensagem é montada aqui
// e aberta direto no WhatsApp da imobiliária.
const addFormEvent = () => {
    const form = document.getElementById("form-contato");
    const retorno = document.getElementById("contato-retorno");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nome = document.getElementById("contato-nome").value.trim();
        const mensagem = document.getElementById("contato-mensagem").value.trim();

        if (!mensagem) {
            retorno.innerHTML = `<div class="alert alert-warning mb-0">Escreva a sua mensagem.</div>`;
            return;
        }

        const texto = nome ? `Olá! Meu nome é ${nome}.\n${mensagem}` : `Olá!\n${mensagem}`;
        window.open(linkWhatsapp(texto), "_blank", "noopener");
        retorno.innerHTML = "";
    });
}

document.addEventListener("DOMContentLoaded", () => {
    preencherDadosEmpresa();
    addFormEvent();
});
