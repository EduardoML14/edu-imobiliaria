// Cadastra alguns imóveis iniciais no banco.
// Uso: npm run seed   (só insere se a coleção "imoveis" estiver vazia)
import 'dotenv/config';
import conexao, { colecao } from "./db.js";

const imoveisDemo = [
    {
        titulo: "Apartamento frente mar com 3 suítes",
        descricao: "Apartamento amplo na Avenida Atlântica, com sacada com churrasqueira, vista para o mar e prédio com piscina, academia e salão de festas.",
        tipo: "Apartamento", finalidade: "Venda", preco: 3200000,
        bairro: "Centro", cidade: "Balneário Camboriú",
        area: 148, quartos: 3, suites: 3, banheiros: 4, vagas: 2, destaque: true
    },
    {
        titulo: "Cobertura duplex com piscina privativa",
        descricao: "Cobertura com terraço, piscina privativa, espaço gourmet e vista panorâmica da cidade.",
        tipo: "Cobertura", finalidade: "Venda", preco: 5900000,
        bairro: "Barra Sul", cidade: "Balneário Camboriú",
        area: 260, quartos: 4, suites: 4, banheiros: 5, vagas: 3, destaque: true
    },
    {
        titulo: "Apartamento 2 quartos perto da praia",
        descricao: "Ótima opção para morar ou investir: a duas quadras do mar, mobiliado e com uma vaga de garagem.",
        tipo: "Apartamento", finalidade: "Venda", preco: 980000,
        bairro: "Pioneiros", cidade: "Balneário Camboriú",
        area: 72, quartos: 2, suites: 1, banheiros: 2, vagas: 1, destaque: true
    },
    {
        titulo: "Casa em condomínio fechado",
        descricao: "Casa térrea com jardim, área de lazer e segurança 24h, ideal para famílias.",
        tipo: "Casa", finalidade: "Venda", preco: 2450000,
        bairro: "Ariribá", cidade: "Balneário Camboriú",
        area: 210, quartos: 3, suites: 2, banheiros: 3, vagas: 2, destaque: false
    },
    {
        titulo: "Apartamento mobiliado para aluguel anual",
        descricao: "Apartamento mobiliado e decorado, pronto para morar, com condomínio completo.",
        tipo: "Apartamento", finalidade: "Aluguel", preco: 6500,
        bairro: "Centro", cidade: "Balneário Camboriú",
        area: 90, quartos: 2, suites: 1, banheiros: 2, vagas: 1, destaque: false
    },
    {
        titulo: "Sala comercial em torre empresarial",
        descricao: "Sala com recepção, copa e banheiro privativo em prédio comercial no centro.",
        tipo: "Sala comercial", finalidade: "Aluguel", preco: 3800,
        bairro: "Centro", cidade: "Balneário Camboriú",
        area: 45, quartos: 0, suites: 0, banheiros: 1, vagas: 1, destaque: false
    }
];

const imoveis = colecao("imoveis");
const total = await imoveis.countDocuments();

if (total > 0) {
    console.log(`A coleção já tem ${total} imóveis. Nada foi inserido.`);
} else {
    const agora = new Date();
    const documentos = imoveisDemo.map((imovel, i) => ({
        ...imovel,
        imagens: [],
        criadoEm: new Date(agora.getTime() - i * 1000)
    }));
    await imoveis.insertMany(documentos);
    console.log(`${documentos.length} imóveis iniciais cadastrados!`);
}

await conexao.close();
