// Configurações gerais do site.
// Ao publicar, troque API_PRODUCAO pelo endereço do back-end no Render.
const API_LOCAL = "http://localhost:3000";
const API_PRODUCAO = "https://edu-imobiliaria-api.onrender.com";

const rodandoLocal = ["localhost", "127.0.0.1", ""].includes(window.location.hostname);

export const API_URL = rodandoLocal ? API_LOCAL : API_PRODUCAO;

// Dados de contato da imobiliária exibidos no site
export const EMPRESA = {
    nome: "Edu Imobiliária",
    whatsapp: "5547999999999", // só números, com 55 + DDD
    telefone: "(47) 99999-9999",
    email: "contato@eduimobiliaria.com.br",
    instagram: "https://www.instagram.com/",
    endereco: "Balneário Camboriú - SC"
};
