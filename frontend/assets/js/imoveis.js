import { getImoveis } from "./fetchApi.js";
import { cardImovel, mensagemVazia, mensagemErro, carregando } from "./utils.js";

const CAMPOS = ["finalidade", "tipo", "cidade", "bairro", "quartos", "precoMax"];

const form = document.getElementById("form-filtros");
const listaImoveis = document.getElementById("lista-imoveis");
const totalResultados = document.getElementById("total-resultados");

// Lê os filtros que estão na URL (ex.: imoveis.html?tipo=Casa)
const filtrosDaUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const filtros = {};
    CAMPOS.forEach((campo) => {
        filtros[campo] = params.get(campo) || "";
    });
    return filtros;
}

const preencherFormulario = (filtros) => {
    CAMPOS.forEach((campo) => {
        document.getElementById(`filtro-${campo}`).value = filtros[campo];
    });
}

const lerFormulario = () => {
    const filtros = {};
    CAMPOS.forEach((campo) => {
        filtros[campo] = document.getElementById(`filtro-${campo}`).value.trim();
    });
    return filtros;
}

async function showImoveis(filtros) {
    listaImoveis.innerHTML = carregando();
    totalResultados.textContent = "";
    try {
        const imoveis = await getImoveis(filtros);
        totalResultados.textContent = imoveis.length === 1
            ? "1 imóvel encontrado"
            : `${imoveis.length} imóveis encontrados`;

        if (imoveis.length === 0) {
            listaImoveis.innerHTML = mensagemVazia("Nenhum imóvel encontrado com esses filtros.");
            return;
        }
        listaImoveis.innerHTML = imoveis.map(cardImovel).join("");
    } catch (error) {
        console.error("Erro ao buscar os imóveis", error);
        listaImoveis.innerHTML = mensagemErro("Não foi possível carregar os imóveis. Tente novamente em instantes.");
    }
}

// Atualiza a URL (para poder compartilhar a busca) e recarrega a lista
const aplicarFiltros = (filtros) => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor) {
            params.append(chave, valor);
        }
    });
    const query = params.toString();
    history.replaceState(null, "", query ? `?${query}` : window.location.pathname);
    showImoveis(filtros);
}

function addFiltrosEvent() {
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        aplicarFiltros(lerFormulario());
    });

    document.getElementById("limpar-filtros").addEventListener("click", () => {
        form.reset();
        aplicarFiltros(lerFormulario());
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const filtros = filtrosDaUrl();
    preencherFormulario(filtros);
    addFiltrosEvent();
    showImoveis(filtros);
});
