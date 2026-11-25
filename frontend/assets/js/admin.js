import {
    login,
    getImoveis,
    salvarImovel,
    removerImovel
} from "./fetchApi.js";
import { escaparHtml, formatarPreco, urlImagem } from "./utils.js";

const CAMPOS_TEXTO = ["titulo", "tipo", "finalidade", "preco", "cidade", "bairro",
    "area", "quartos", "suites", "banheiros", "vagas", "descricao"];

const telaLogin = document.getElementById("tela-login");
const painel = document.getElementById("painel");
const tabelaImoveis = document.getElementById("tabela-imoveis");
const formImovel = document.getElementById("form-imovel");
const retornoImovel = document.getElementById("imovel-retorno");

let modalImovel;
let imoveisCarregados = [];
let idEmEdicao = null;

const alerta = (tipo, texto) =>
    `<div class="alert alert-${tipo} py-2 mb-0">${escaparHtml(texto)}</div>`;

// ---------- Login ----------
const mostrarPainel = () => {
    telaLogin.classList.add("d-none");
    painel.classList.remove("d-none");
    showImoveis();
}

const sair = () => {
    sessionStorage.removeItem("senhaAdmin");
    painel.classList.add("d-none");
    telaLogin.classList.remove("d-none");
}

// Se a senha expirar ou estiver errada, volta para a tela de login
const tratarErro = (error, elemento) => {
    if (error.message === "Acesso não autorizado") {
        sair();
        document.getElementById("login-retorno").innerHTML = alerta("warning", "Sessão expirada. Entre novamente.");
        return;
    }
    elemento.innerHTML = alerta("danger", error.message);
}

function addLoginEvent() {
    const form = document.getElementById("form-login");
    const retorno = document.getElementById("login-retorno");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const senha = document.getElementById("senha").value;
        try {
            await login(senha);
            sessionStorage.setItem("senhaAdmin", senha);
            form.reset();
            retorno.innerHTML = "";
            mostrarPainel();
        } catch (error) {
            retorno.innerHTML = alerta("danger", error.message === "Acesso não autorizado" ? "Senha incorreta." : error.message);
        }
    });

    document.getElementById("sair").addEventListener("click", sair);
}

// ---------- Imóveis ----------
async function showImoveis() {
    tabelaImoveis.innerHTML = `<tr><td colspan="5" class="text-center py-4">Carregando...</td></tr>`;
    try {
        imoveisCarregados = await getImoveis();
        document.getElementById("total-imoveis").textContent = `${imoveisCarregados.length} imóvel(is) cadastrado(s)`;

        if (imoveisCarregados.length === 0) {
            tabelaImoveis.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-secondary">Nenhum imóvel cadastrado ainda.</td></tr>`;
            return;
        }

        tabelaImoveis.innerHTML = imoveisCarregados.map((imovel) => `
            <tr>
                <td>
                    ${imovel.imagens && imovel.imagens.length > 0
                        ? `<img class="miniatura" src="${escaparHtml(urlImagem(imovel.imagens[0]))}" alt="">`
                        : `<div class="miniatura d-flex align-items-center justify-content-center text-secondary"><i class="bi bi-image"></i></div>`}
                </td>
                <td>
                    <a href="imovel.html?id=${imovel._id}" target="_blank" class="fw-semibold">${escaparHtml(imovel.titulo)}</a>
                    ${imovel.destaque ? `<span class="badge text-bg-warning ms-1">Destaque</span>` : ""}
                    <div class="small text-secondary">${escaparHtml(imovel.tipo)} · ${escaparHtml(imovel.bairro || imovel.cidade)}</div>
                </td>
                <td class="d-none d-md-table-cell">${escaparHtml(imovel.finalidade)}</td>
                <td class="text-nowrap">${formatarPreco(imovel)}</td>
                <td class="text-end text-nowrap">
                    <button class="btn btn-sm btn-outline-primary" data-editar="${imovel._id}" aria-label="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" data-remover="${imovel._id}" aria-label="Remover">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>`).join("");
    } catch (error) {
        tabelaImoveis.innerHTML = `<tr><td colspan="5"><div id="erro-imoveis"></div></td></tr>`;
        tratarErro(error, document.getElementById("erro-imoveis"));
    }
}

const abrirFormulario = (imovel = null) => {
    idEmEdicao = imovel ? imovel._id : null;
    formImovel.reset();
    retornoImovel.innerHTML = "";
    document.getElementById("titulo-modal").textContent = imovel ? "Editar imóvel" : "Novo imóvel";

    if (imovel) {
        CAMPOS_TEXTO.forEach((campo) => {
            document.getElementById(campo).value = imovel[campo] ?? "";
        });
        document.getElementById("destaque").checked = Boolean(imovel.destaque);
    }

    const imagens = imovel ? imovel.imagens || [] : [];
    document.getElementById("bloco-imagens-atuais").classList.toggle("d-none", imagens.length === 0);
    document.getElementById("imagens-atuais").innerHTML = imagens.map((caminho, i) => `
        <div class="miniatura-remover">
            <img class="miniatura" src="${escaparHtml(urlImagem(caminho))}" alt="Foto ${i + 1}">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="remover-${i}" data-caminho="${escaparHtml(caminho)}">
                <label class="form-check-label" for="remover-${i}">remover</label>
            </div>
        </div>`).join("");

    modalImovel.show();
}

function addImovelEvents() {
    document.getElementById("novo-imovel").addEventListener("click", () => abrirFormulario());

    // Botões de editar e remover da tabela
    tabelaImoveis.addEventListener("click", async (e) => {
        const botaoEditar = e.target.closest("[data-editar]");
        const botaoRemover = e.target.closest("[data-remover]");

        if (botaoEditar) {
            const imovel = imoveisCarregados.find((item) => item._id === botaoEditar.dataset.editar);
            abrirFormulario(imovel);
        }

        if (botaoRemover) {
            const imovel = imoveisCarregados.find((item) => item._id === botaoRemover.dataset.remover);
            if (!confirm(`Remover o imóvel "${imovel.titulo}"? Esta ação não pode ser desfeita.`)) {
                return;
            }
            try {
                await removerImovel(imovel._id);
                showImoveis();
            } catch (error) {
                alert(error.message);
            }
        }
    });

    formImovel.addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = new FormData();
        CAMPOS_TEXTO.forEach((campo) => {
            form.append(campo, document.getElementById(campo).value.trim());
        });
        form.append("destaque", document.getElementById("destaque").checked);

        const arquivos = document.getElementById("imagens").files;
        if (arquivos.length > 10) {
            retornoImovel.innerHTML = alerta("warning", "Envie no máximo 10 fotos por vez.");
            return;
        }
        for (const arquivo of arquivos) {
            form.append("imagens", arquivo);
        }

        // Na edição, envia a lista de fotos que continuam no imóvel
        if (idEmEdicao) {
            const manter = [...document.querySelectorAll("#imagens-atuais input[type=checkbox]")]
                .filter((checkbox) => !checkbox.checked)
                .map((checkbox) => checkbox.dataset.caminho);
            form.append("manterImagens", JSON.stringify(manter));
        }

        const botao = document.getElementById("salvar-imovel");
        botao.disabled = true;
        botao.textContent = "Salvando...";
        try {
            await salvarImovel(form, idEmEdicao);
            modalImovel.hide();
            showImoveis();
        } catch (error) {
            tratarErro(error, retornoImovel);
        } finally {
            botao.disabled = false;
            botao.textContent = "Salvar";
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    modalImovel = new bootstrap.Modal(document.getElementById("modal-imovel"));
    addLoginEvent();
    addImovelEvents();

    // Mantém o login enquanto a aba do navegador estiver aberta
    if (sessionStorage.getItem("senhaAdmin")) {
        mostrarPainel();
    }
});
