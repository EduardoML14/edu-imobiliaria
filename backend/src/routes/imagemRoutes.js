import { controllerGetImagem } from "../controllers/imagemControllers.js";
import verificarAdmin from "../middlewares/verificarAdmin.js";

const getImagemRoutes = (app) => {
    app.get("/imagens/:id", controllerGetImagem);

    // Usada pela tela de login da área administrativa para conferir a senha
    app.post("/login", verificarAdmin, (req, res) => {
        res.status(200).json({ mensagem: "Login realizado" });
    });
}

export default getImagemRoutes;
