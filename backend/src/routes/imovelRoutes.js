import multer from "multer";
import {
    controllerGetImoveis,
    controllerGetImovel,
    controllerPostImovel,
    controllerPutImovel,
    controllerDeleteImovel
} from "../controllers/imovelControllers.js";
import verificarAdmin from "../middlewares/verificarAdmin.js";

// As imagens ficam na memória só até o controller salvá-las no MongoDB
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB por imagem
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Envie apenas arquivos de imagem"));
        }
    }
});

const getImovelRoutes = (app) => {
    // Rotas públicas (site)
    app.get("/imoveis", controllerGetImoveis);
    app.get("/imoveis/:id", controllerGetImovel);

    // Rotas da área administrativa (precisam da senha)
    app.post("/imoveis", verificarAdmin, upload.array("imagens", 10),
        controllerPostImovel);
    app.put("/imoveis/:id", verificarAdmin, upload.array("imagens", 10),
        controllerPutImovel);
    app.delete("/imoveis/:id", verificarAdmin, controllerDeleteImovel);
}

export default getImovelRoutes;
