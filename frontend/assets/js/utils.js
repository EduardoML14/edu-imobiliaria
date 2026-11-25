import { API_URL, EMPRESA } from "./config.js";

// Evita que textos digitados por usuários virem HTML na página (proteção contra XSS)
export const escaparHtml = (texto) => String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const formatarPreco = (imovel) => {
    const valor = Number(imovel.preco || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    });
    return imovel.finalidade === "Aluguel" ? `${valor}/mês` : valor;
}

// As imagens salvas pelo back-end vêm como "/imagens/<id>"
export const urlImagem = (caminho) => caminho.startsWith("http") ? caminho : `${API_URL}${caminho}`;

export const semFoto = () => `
    <div class="sem-foto">
        <i class="bi bi-buildings" aria-hidden="true"></i>
        <span>Foto em breve</span>
    </div>`;

export const linkWhatsapp = (mensagem) =>
    `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(mensagem)}`;

export const cardImovel = (imovel) => {
    const foto = imovel.imagens && imovel.imagens.length > 0
        ? `<img src="${escaparHtml(urlImagem(imovel.imagens[0]))}" alt="Foto do imóvel: ${escaparHtml(imovel.titulo)}" loading="lazy">`
        : semFoto();

    const local = [imovel.bairro, imovel.cidade].filter(Boolean).map(escaparHtml).join(", ");

    return `
    <div class="col-sm-6 col-lg-4">
        <article class="card card-imovel">
            <a href="imovel.html?id=${imovel._id}" class="text-decoration-none text-reset">
                <div class="foto">
                    ${foto}
                    <span class="badge etiqueta ${imovel.finalidade === "Aluguel" ? "text-bg-info" : "text-bg-warning"}">
                        ${escaparHtml(imovel.finalidade)}
                    </span>
                </div>
                <div class="card-body">
                    <p class="text-uppercase small text-secondary mb-1">${escaparHtml(imovel.tipo)}</p>
                    <h3 class="card-title">${escaparHtml(imovel.titulo)}</h3>
                    <p class="small text-secondary mb-2"><i class="bi bi-geo-alt"></i> ${local}</p>
                    <div class="caracteristicas mb-3">
                        ${imovel.area ? `<span><i class="bi bi-arrows-fullscreen"></i> ${imovel.area} m²</span>` : ""}
                        ${imovel.quartos ? `<span><i class="bi bi-door-closed"></i> ${imovel.quartos} quarto(s)</span>` : ""}
                        ${imovel.vagas ? `<span><i class="bi bi-car-front"></i> ${imovel.vagas} vaga(s)</span>` : ""}
                    </div>
                    <p class="preco mb-0">${formatarPreco(imovel)}</p>
                </div>
            </a>
        </article>
    </div>`;
}

export const mensagemVazia = (texto) => `
    <div class="col-12 text-center text-secondary py-5">
        <i class="bi bi-search fs-1 d-block mb-2"></i>
        ${texto}
    </div>`;

export const mensagemErro = (texto) => `
    <div class="col-12">
        <div class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i> ${escaparHtml(texto)}
        </div>
    </div>`;

export const carregando = () => `
    <div class="col-12 text-center py-5">
        <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">Carregando...</span>
        </div>
    </div>`;
