import { getImovel } from "./fetchApi.js";
import { EMPRESA } from "./config.js";
import {
    escaparHtml,
    formatarPreco,
    urlImagem,
    semFoto,
    linkWhatsapp,
    mensagemErro,
    carregando
} from "./utils.js";

const detalhe = document.getElementById("detalhe-imovel");

const montarGaleria = (imovel) => {
    const imagens = imovel.imagens || [];
    if (imagens.length === 0) {
        return `<div class="galeria">${semFoto()}</div>`;
    }

    const itens = imagens.map((caminho, i) => `
        <div class="carousel-item ${i === 0 ? "active" : ""}">
            <img src="${escaparHtml(urlImagem(caminho))}" class="d-block w-100" alt="Foto ${i + 1} do imóvel ${escaparHtml(imovel.titulo)}">
        </div>`).join("");

    const controles = imagens.length > 1 ? `
        <button class="carousel-control-prev" type="button" data-bs-target="#galeria-imovel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#galeria-imovel" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Próxima</span>
        </button>` : "";

    return `
        <div id="galeria-imovel" class="carousel slide galeria">
            <div class="carousel-inner">${itens}</div>
            ${controles}
        </div>`;
}

const itemCaracteristica = (icone, valor, rotulo) => `
    <div class="col-4 col-md">
        <div class="item-caracteristica">
            <i class="bi ${icone}" aria-hidden="true"></i>
            <div class="fw-bold">${valor}</div>
            <small class="text-secondary">${rotulo}</small>
        </div>
    </div>`;

const montarDetalhe = (imovel) => {
    const local = [imovel.bairro, imovel.cidade].filter(Boolean).map(escaparHtml).join(", ");
    const mensagemPadrao = `Olá! Tenho interesse no imóvel "${imovel.titulo}". Gostaria de mais informações.`;
    const assuntoEmail = encodeURIComponent(`Interesse no imóvel: ${imovel.titulo}`);

    return `
    <div class="col-lg-8 mb-4">
        ${montarGaleria(imovel)}

        <div class="mt-4">
            <span class="badge ${imovel.finalidade === "Aluguel" ? "text-bg-info" : "text-bg-warning"} mb-2">${escaparHtml(imovel.finalidade)}</span>
            <span class="badge text-bg-light mb-2">${escaparHtml(imovel.tipo)}</span>
            <h1 class="h2">${escaparHtml(imovel.titulo)}</h1>
            <p class="text-secondary"><i class="bi bi-geo-alt"></i> ${local}</p>
            <p class="display-6 fw-bold" style="color: var(--primary-color);">${formatarPreco(imovel)}</p>
        </div>

        <div class="row g-2 my-4">
            ${itemCaracteristica("bi-arrows-fullscreen", `${imovel.area || "-"} m²`, "Área")}
            ${itemCaracteristica("bi-door-closed", imovel.quartos || 0, "Quartos")}
            ${itemCaracteristica("bi-star", imovel.suites || 0, "Suítes")}
            ${itemCaracteristica("bi-droplet", imovel.banheiros || 0, "Banheiros")}
            ${itemCaracteristica("bi-car-front", imovel.vagas || 0, "Vagas")}
        </div>

        <div class="info-box">
            <h2 class="h4">Descrição</h2>
            <p class="mb-0" style="white-space: pre-line;">${escaparHtml(imovel.descricao) || "Sem descrição."}</p>
        </div>
    </div>

    <div class="col-lg-4">
        <div class="info-box card-interesse">
            <h2 class="h5">Gostou deste imóvel?</h2>
            <p class="text-secondary small">Fale direto com o corretor e agende uma visita.</p>
            <a class="btn btn-whatsapp w-100 mb-2" href="${linkWhatsapp(mensagemPadrao)}" target="_blank" rel="noopener">
                <i class="bi bi-whatsapp"></i> Conversar no WhatsApp
            </a>
            <a class="btn btn-outline-secondary w-100" href="mailto:${EMPRESA.email}?subject=${assuntoEmail}">
                <i class="bi bi-envelope"></i> Enviar e-mail
            </a>
        </div>
    </div>`;
}

async function showImovel() {
    const id = new URLSearchParams(window.location.search).get("id");
    if (!id) {
        detalhe.innerHTML = mensagemErro("Imóvel não informado.");
        return;
    }

    detalhe.innerHTML = carregando();
    try {
        const imovel = await getImovel(id);
        document.title = `${imovel.titulo} | Edu Imobiliária`;
        document.getElementById("breadcrumb-titulo").textContent = imovel.titulo;
        detalhe.innerHTML = montarDetalhe(imovel);
    } catch (error) {
        console.error("Erro ao buscar o imóvel", error);
        detalhe.innerHTML = mensagemErro(error.message);
    }
}

document.addEventListener("DOMContentLoaded", showImovel);
