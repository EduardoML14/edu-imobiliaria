import { API_URL } from "./config.js";

// Lê a resposta da API e lança um erro com a mensagem do back-end quando falhar
const tratarResposta = async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.error || "Erro ao comunicar com o servidor");
    }
    return data;
}

const cabecalhoAdmin = () => ({
    "x-admin-senha": sessionStorage.getItem("senhaAdmin") || ""
});

// ---------- Imóveis (público) ----------
export const getImoveis = async (filtros = {}) => {
    const params = new URLSearchParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
        if (valor !== "" && valor !== undefined && valor !== null) {
            params.append(chave, valor);
        }
    });
    const response = await fetch(`${API_URL}/imoveis?${params.toString()}`);
    return tratarResposta(response);
}

export const getImovel = async (id) => {
    const response = await fetch(`${API_URL}/imoveis/${encodeURIComponent(id)}`);
    return tratarResposta(response);
}

// ---------- Área administrativa ----------
export const login = async (senha) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "x-admin-senha": senha }
    });
    return tratarResposta(response);
}

// "form" é um FormData com os campos do imóvel e as imagens
export const salvarImovel = async (form, id) => {
    const response = await fetch(
        id ? `${API_URL}/imoveis/${id}` : `${API_URL}/imoveis`,
        {
            method: id ? "PUT" : "POST",
            headers: cabecalhoAdmin(),
            body: form
        }
    );
    return tratarResposta(response);
}

export const removerImovel = async (id) => {
    const response = await fetch(`${API_URL}/imoveis/${id}`, {
        method: "DELETE",
        headers: cabecalhoAdmin()
    });
    return tratarResposta(response);
}
