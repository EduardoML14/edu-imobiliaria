import 'dotenv/config';
import express from "express";
import cors from "cors";
import getImovelRoutes from "./src/routes/imovelRoutes.js";
import getImagemRoutes from "./src/routes/imagemRoutes.js";

const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

// Rota simples para verificar se a API está no ar (usada pelo Render)
app.get("/", (req, res) => {
    res.status(200).json({ mensagem: "API da Edu Imobiliária no ar!" });
});

getImovelRoutes(app);
getImagemRoutes(app);

// Tratamento de erros (ex.: imagem grande demais no upload)
app.use((erro, req, res, next) => {
    console.error(erro.message);
    if (erro.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "Imagem muito grande (máximo 5 MB)" });
    }
    res.status(400).json({ error: erro.message || "Requisição inválida" });
});

// O Render define a porta pela variável PORT
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`Servidor escutando na porta ${PORTA}...`);
});
