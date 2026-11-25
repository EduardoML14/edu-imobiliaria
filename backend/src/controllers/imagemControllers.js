import { ObjectId } from "mongodb";
import { getImagemPorId } from "../models/imagemModels.js";

export const controllerGetImagem = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Imagem não encontrada" });
    }
    try {
        const imagem = await getImagemPorId(id);
        if (!imagem) {
            return res.status(404).json({ error: "Imagem não encontrada" });
        }
        res.set("Content-Type", imagem.tipo);
        res.set("Cache-Control", "public, max-age=604800");
        res.send(Buffer.from(imagem.dados.buffer));
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Falha ao buscar a imagem" });
    }
}
