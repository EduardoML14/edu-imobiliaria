import { ObjectId } from "mongodb";
import { colecao } from "../config/db.js";

const imoveis = () => colecao("imoveis");

export const getImoveis = async (filtro = {}) => {
    return imoveis()
        .find(filtro)
        .sort({ destaque: -1, criadoEm: -1 })
        .toArray();
}

export const getImovelPorId = async (id) => {
    return imoveis().findOne({ _id: new ObjectId(id) });
}

export const createImovel = async (novoImovel) => {
    return imoveis().insertOne(novoImovel);
}

export const updateImovel = async (id, dados) => {
    return imoveis().findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: dados },
        { returnDocument: "after" }
    );
}

export const deleteImovel = async (id) => {
    return imoveis().deleteOne({ _id: new ObjectId(id) });
}
