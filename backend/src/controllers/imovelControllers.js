import { ObjectId } from "mongodb";
import {
    getImoveis,
    getImovelPorId,
    createImovel,
    updateImovel,
    deleteImovel
} from "../models/imovelModels.js";
import { createImagem, deleteImagens } from "../models/imagemModels.js";

export const TIPOS = ["Apartamento", "Casa", "Cobertura", "Terreno", "Sala comercial"];
export const FINALIDADES = ["Venda", "Aluguel"];

// Escapa caracteres especiais para usar o texto do usuário dentro de uma RegExp
const escaparRegex = (texto) => texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const numero = (valor) => {
    if (valor === undefined || valor === null || valor === "") {
        return 0;
    }
    const convertido = Number(valor);
    return Number.isFinite(convertido) && convertido >= 0 ? convertido : NaN;
}

// Monta o objeto do imóvel a partir do formulário (multipart/form-data envia tudo como texto)
const montarImovel = (body) => {
    const imovel = {
        titulo: (body.titulo || "").trim(),
        descricao: (body.descricao || "").trim(),
        tipo: body.tipo,
        finalidade: body.finalidade,
        preco: numero(body.preco),
        bairro: (body.bairro || "").trim(),
        cidade: (body.cidade || "").trim(),
        area: numero(body.area),
        quartos: numero(body.quartos),
        suites: numero(body.suites),
        banheiros: numero(body.banheiros),
        vagas: numero(body.vagas),
        destaque: body.destaque === "true" || body.destaque === true
    };

    const erros = [];
    if (!imovel.titulo) erros.push("título");
    if (!TIPOS.includes(imovel.tipo)) erros.push("tipo");
    if (!FINALIDADES.includes(imovel.finalidade)) erros.push("finalidade");
    if (!imovel.cidade) erros.push("cidade");
    if (!(imovel.preco > 0)) erros.push("preço");
    for (const campo of ["area", "quartos", "suites", "banheiros", "vagas"]) {
        if (Number.isNaN(imovel[campo])) erros.push(campo);
    }

    return { imovel, erros };
}

// Salva no banco as imagens recebidas pelo multer e devolve as URLs
const salvarImagens = async (arquivos = []) => {
    const urls = [];
    for (const arquivo of arquivos) {
        const _id = new ObjectId();
        await createImagem({
            _id: _id,
            tipo: arquivo.mimetype,
            dados: arquivo.buffer,
            criadoEm: new Date()
        });
        urls.push(`/imagens/${_id}`);
    }
    return urls;
}

const idDaUrl = (url) => url.split("/").pop();

export const controllerGetImoveis = async (req, res) => {
    const { tipo, finalidade, cidade, bairro, precoMin, precoMax, quartos, destaque } = req.query;
    const filtro = {};

    if (tipo) filtro.tipo = tipo;
    if (finalidade) filtro.finalidade = finalidade;
    if (cidade) filtro.cidade = { $regex: escaparRegex(cidade), $options: "i" };
    if (bairro) filtro.bairro = { $regex: escaparRegex(bairro), $options: "i" };
    if (quartos) filtro.quartos = { $gte: Number(quartos) };
    if (destaque === "true") filtro.destaque = true;
    if (precoMin || precoMax) {
        filtro.preco = {};
        if (precoMin) filtro.preco.$gte = Number(precoMin);
        if (precoMax) filtro.preco.$lte = Number(precoMax);
    }

    try {
        const imoveis = await getImoveis(filtro);
        res.status(200).json(imoveis);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao buscar os imóveis" });
    }
}

export const controllerGetImovel = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
    }
    try {
        const imovel = await getImovelPorId(id);
        if (!imovel) {
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }
        res.status(200).json(imovel);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao buscar o imóvel" });
    }
}

export const controllerPostImovel = async (req, res) => {
    const { imovel, erros } = montarImovel(req.body);
    if (erros.length > 0) {
        return res.status(400).json({ error: `Campos inválidos: ${erros.join(", ")}` });
    }
    try {
        imovel.imagens = await salvarImagens(req.files);
        imovel.criadoEm = new Date();
        const resultado = await createImovel(imovel);
        res.status(201).json({ _id: resultado.insertedId, ...imovel });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao salvar o imóvel" });
    }
}

export const controllerPutImovel = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
    }
    const { imovel, erros } = montarImovel(req.body);
    if (erros.length > 0) {
        return res.status(400).json({ error: `Campos inválidos: ${erros.join(", ")}` });
    }
    try {
        const atual = await getImovelPorId(id);
        if (!atual) {
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }

        // "manterImagens" vem do front como JSON com as URLs que não foram removidas
        let manter = atual.imagens || [];
        if (req.body.manterImagens !== undefined) {
            try {
                const lista = JSON.parse(req.body.manterImagens);
                manter = (atual.imagens || []).filter((url) => lista.includes(url));
            } catch {
                return res.status(400).json({ error: "manterImagens inválido" });
            }
        }
        const removidas = (atual.imagens || []).filter((url) => !manter.includes(url));
        await deleteImagens(removidas.map(idDaUrl));

        const novas = await salvarImagens(req.files);
        imovel.imagens = [...manter, ...novas];
        imovel.atualizadoEm = new Date();

        const atualizado = await updateImovel(id, imovel);
        res.status(200).json(atualizado);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao atualizar o imóvel" });
    }
}

export const controllerDeleteImovel = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Imóvel não encontrado" });
    }
    try {
        const imovel = await getImovelPorId(id);
        if (!imovel) {
            return res.status(404).json({ error: "Imóvel não encontrado" });
        }
        await deleteImagens((imovel.imagens || []).map(idDaUrl));
        await deleteImovel(id);
        res.status(200).json({ mensagem: "Imóvel removido" });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao remover o imóvel" });
    }
}
