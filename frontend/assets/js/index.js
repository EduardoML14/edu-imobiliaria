import { getImoveis } from "./fetchApi.js";
import { cardImovel, mensagemVazia, mensagemErro, carregando, linkWhatsapp } from "./utils.js";

const listaDestaques = document.getElementById("lista-destaques");

// Busca os imóveis marcados como destaque e mostra até 6 cards
async function showDestaques() {
    listaDestaques.innerHTML = carregando();
    try {
        const imoveis = await getImoveis({ destaque: "true" });
        if (imoveis.length === 0) {
            listaDestaques.innerHTML = mensagemVazia("Nenhum imóvel em destaque no momento.");
            return;
        }
        listaDestaques.innerHTML = imoveis.slice(0, 6).map(cardImovel).join("");
    } catch (error) {
        console.error("Erro ao buscar os destaques", error);
        listaDestaques.innerHTML = mensagemErro("Não foi possível carregar os imóveis. Tente novamente em instantes.");
    }
}

// A busca rápida leva para a página de imóveis com os filtros na URL
function addBuscaEvent() {
    const form = document.getElementById("form-busca");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        const campos = {
            finalidade: "busca-finalidade",
            tipo: "busca-tipo",
            bairro: "busca-bairro",
            quartos: "busca-quartos"
        };
        Object.entries(campos).forEach(([chave, id]) => {
            const valor = document.getElementById(id).value.trim();
            if (valor) {
                params.append(chave, valor);
            }
        });
        window.location.href = `imoveis.html?${params.toString()}`;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    showDestaques();
    addBuscaEvent();
    document.getElementById("cta-whatsapp").href =
        linkWhatsapp("Olá! Gostaria de uma avaliação do meu imóvel.");
});
