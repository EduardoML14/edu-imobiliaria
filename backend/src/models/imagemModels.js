import { ObjectId } from "mongodb";
import { colecao } from "../config/db.js";

// As imagens ficam salvas no próprio MongoDB (e não na pasta uploads/),
// porque o disco dos servidores gratuitos (ex.: Render) é apagado a cada deploy.
const imagens = () => colecao("imagens");

export const createImagem = async (novaImagem) => {
    return imagens().insertOne(novaImagem);
}

export const getImagemPorId = async (id) => {
    return imagens().findOne({ _id: new ObjectId(id) });
}

export const deleteImagens = async (ids) => {
    const objectIds = ids
        .filter((id) => ObjectId.isValid(id))
        .map((id) => new ObjectId(id));
    if (objectIds.length === 0) {
        return { deletedCount: 0 };
    }
    return imagens().deleteMany({ _id: { $in: objectIds } });
}
