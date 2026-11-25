import dns from "node:dns";
import conectarAoBanco from "./dbConfig.js";

// Alguns computadores (redes de empresa, antivírus, VPN) recusam a consulta de DNS
// que a string "mongodb+srv://" do Atlas faz. Com DNS_PUBLICO=true no .env,
// o Node passa a usar os DNS do Google e da Cloudflare. No Render não é necessário.
if (process.env.DNS_PUBLICO === "true") {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

// Uma única conexão compartilhada por todos os models
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

const db = conexao.db(process.env.NOME_BANCO || "edu_imobiliaria");

export const colecao = (nome) => db.collection(nome);

export default conexao;
