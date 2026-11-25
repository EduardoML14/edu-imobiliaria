// Prepara o banco de dados: cria as coleções e os índices e cadastra os imóveis iniciais.
// Uso: npm run seed   (os imóveis só são inseridos se a coleção "imoveis" estiver vazia)
import 'dotenv/config';
import fs from "node:fs";
import { BSON } from "mongodb";
import conexao from "./db.js";

const db = conexao.db(process.env.NOME_BANCO || "edu_imobiliaria");

// 1. Coleções usadas pelo sistema
const existentes = (await db.listCollections({}, { nameOnly: true }).toArray()).map((c) => c.name);
for (const nome of ["imoveis", "imagens"]) {
    if (!existentes.includes(nome)) {
        await db.createCollection(nome);
        console.log(`Coleção "${nome}" criada.`);
    }
}

// 2. Índices das buscas do site (lista ordenada por destaque/data e filtros por finalidade/tipo)
const imoveis = db.collection("imoveis");
await imoveis.createIndex({ destaque: -1, criadoEm: -1 });
await imoveis.createIndex({ finalidade: 1, tipo: 1 });
console.log("Índices conferidos.");

// 3. Dados mínimos (arquivo database/imoveis.json, no formato JSON estendido do MongoDB)
const total = await imoveis.countDocuments();

if (total > 0) {
    console.log(`A coleção já tem ${total} imóveis. Nada foi inserido.`);
} else {
    const arquivo = new URL("../../database/imoveis.json", import.meta.url);
    const documentos = BSON.EJSON.parse(fs.readFileSync(arquivo, "utf8"));
    await imoveis.insertMany(documentos);
    console.log(`${documentos.length} imóveis iniciais cadastrados!`);
}

await conexao.close();
