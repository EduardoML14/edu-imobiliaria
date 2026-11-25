import { EMPRESA } from "./config.js";
import { linkWhatsapp } from "./utils.js";

// Carrega pedaços de HTML repetidos (navbar e footer) em todas as páginas
const carregarParte = async (arquivo, idElemento) => {
    const elemento = document.getElementById(idElemento);
    if (!elemento) {
        return;
    }
    const response = await fetch(arquivo);
    elemento.innerHTML = await response.text();
}

const loadNavbar = async () => {
    await carregarParte("partials/navbar.html", "navbar-pagina");

    // Destaca no menu a página atual (definida em <body data-pagina="...">)
    const paginaAtual = document.body.dataset.pagina;
    const linkAtivo = document.querySelector(`.navbar-edu [data-pagina="${paginaAtual}"]`);
    if (linkAtivo) {
        linkAtivo.classList.add("active");
        linkAtivo.setAttribute("aria-current", "page");
    }

    const botaoWhatsapp = document.getElementById("navbar-whatsapp");
    if (botaoWhatsapp) {
        botaoWhatsapp.href = linkWhatsapp("Olá! Vim pelo site da Edu Imobiliária e gostaria de mais informações.");
    }
}

const loadFooter = async () => {
    await carregarParte("partials/footer.html", "footer-pagina");

    const whatsapp = document.getElementById("footer-whatsapp");
    if (whatsapp) {
        whatsapp.href = linkWhatsapp("Olá! Vim pelo site da Edu Imobiliária.");
        whatsapp.textContent = EMPRESA.telefone;
        document.getElementById("footer-email").href = `mailto:${EMPRESA.email}`;
        document.getElementById("footer-email").textContent = EMPRESA.email;
        document.getElementById("footer-instagram").href = EMPRESA.instagram;
        document.getElementById("footer-endereco").textContent = EMPRESA.endereco;
        document.getElementById("ano-atual").textContent = new Date().getFullYear();
    }
}

document.addEventListener("DOMContentLoaded", loadNavbar);
document.addEventListener("DOMContentLoaded", loadFooter);
