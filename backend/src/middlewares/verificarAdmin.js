// Protege as rotas da área administrativa.
// O front envia a senha no cabeçalho "x-admin-senha" e ela é comparada
// com a variável de ambiente SENHA_ADMIN (definida no .env / no Render).
const verificarAdmin = (req, res, next) => {
    const senhaCorreta = process.env.SENHA_ADMIN;

    if (!senhaCorreta) {
        return res.status(500).json({ error: "SENHA_ADMIN não configurada no servidor" });
    }

    if (req.get("x-admin-senha") !== senhaCorreta) {
        return res.status(401).json({ error: "Acesso não autorizado" });
    }

    next();
}

export default verificarAdmin;
