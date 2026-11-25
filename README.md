# Edu Imobiliária - Sistema Web

Projeto de extensão da disciplina de **Programação Web** (Univali, 2º semestre de 2026), orientado pelo Prof. Dr. Jhonatan Alves.
Sistema Web para a **Edu Imobiliária** (Balneário Camboriú/SC): site para divulgar os imóveis e levar o cliente direto ao WhatsApp do corretor, com uma área restrita para o corretor cadastrar os imóveis.

Equipe: Maria Eliza Vieira Perfeto, Fabio Gomes, Eduardo Zambenedetti e Eduardo Moreira Lima.

## Acesse

| | Endereço |
|---|---|
| Site | https://edu-imobiliaria.netlify.app |
| Área do corretor | https://edu-imobiliaria.netlify.app/admin.html |
| API | https://edu-imobiliaria.onrender.com |

## Funcionalidades

**Site (público)**
- Página inicial com busca rápida e imóveis em destaque
- Lista de imóveis com filtros (finalidade, tipo, cidade, bairro, quartos e preço máximo)
- Página de detalhes do imóvel com galeria de fotos, características e botão de WhatsApp
- Botões de WhatsApp e e-mail em cada imóvel e formulário de contato que abre a mensagem no WhatsApp
- O site **não coleta nem guarda dados pessoais** dos visitantes: o contato acontece direto pelo WhatsApp ou e-mail da imobiliária
- Páginas Sobre e Contato
- Layout responsivo (celular, tablet e computador) com Bootstrap

**Área do corretor (`admin.html`, protegida por senha)**
- Cadastrar, editar e remover imóveis, com envio de até 10 fotos por vez
- Marcar imóveis como destaque na página inicial

## Tecnologias

| Parte | Tecnologias |
|---|---|
| Front-end | HTML, CSS, JavaScript (módulos ES), Bootstrap 5.3 e Bootstrap Icons |
| Back-end | Node.js, Express 5, Multer (upload de imagens), CORS, dotenv |
| Banco de dados | MongoDB Atlas (driver oficial `mongodb`) |
| Hospedagem sugerida | Back-end no Render, front-end no GitHub Pages ou Netlify, banco no MongoDB Atlas |

O front e o back são dois projetos separados, como visto em aula. O back-end segue o padrão MVC das aulas:

```
edu-imobiliaria/
├── backend/
│   ├── server.js                 # Servidor Express
│   ├── api.http                  # Testes das rotas (extensão REST Client do VS Code)
│   ├── .env.example              # Modelo das variáveis de ambiente
│   └── src/
│       ├── config/               # Conexão com o MongoDB e script de dados iniciais
│       ├── routes/               # Rotas (URLs) da API
│       ├── controllers/          # Lógica de cada rota
│       ├── models/               # Acesso às coleções do banco
│       └── middlewares/          # Verificação da senha da área do corretor
└── frontend/
    ├── index.html, imoveis.html, imovel.html, sobre.html, contato.html, admin.html
    ├── partials/                 # navbar e footer carregados em todas as páginas
    └── assets/
        ├── css/global.css
        └── js/                   # config.js, fetchApi.js, utils.js e um script por página
```

### Rotas da API

| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| GET | `/imoveis` | público | Lista imóveis. Filtros por query: `tipo`, `finalidade`, `cidade`, `bairro`, `quartos`, `precoMin`, `precoMax`, `destaque=true` |
| GET | `/imoveis/:id` | público | Detalhes de um imóvel |
| POST | `/imoveis` | corretor | Cadastra imóvel (`multipart/form-data`, fotos no campo `imagens`) |
| PUT | `/imoveis/:id` | corretor | Atualiza imóvel (`manterImagens` = JSON com as fotos que continuam) |
| DELETE | `/imoveis/:id` | corretor | Remove imóvel e suas fotos |
| GET | `/imagens/:id` | público | Devolve uma foto |
| POST | `/login` | corretor | Confere a senha da área do corretor |

As rotas "corretor" exigem o cabeçalho `x-admin-senha` com a senha definida em `SENHA_ADMIN`.

**Senha da área do corretor:** não existe senha fixa no código. Ela é a que a equipe escolher na variável `SENHA_ADMIN` (no `.env` para rodar no computador e em **Environment** no Render). Use uma senha forte, não coloque no GitHub e passe ao corretor pessoalmente.

As fotos são salvas no próprio MongoDB (coleção `imagens`) e não na pasta `uploads/` como na aula 10, porque o disco dos planos gratuitos do Render é apagado a cada deploy/reinício.

## Como rodar no seu computador

Pré-requisitos: Node.js 18 ou mais novo e um cluster gratuito no MongoDB Atlas (passo a passo na aula 9).

1. Back-end:
   ```bash
   cd backend
   npm install
   cp .env.example .env      # no Windows: copy .env.example .env
   ```
   Abra o `.env` e preencha `STRING_CONEXAO` (string do Atlas com a senha do usuário do banco) e `SENHA_ADMIN`.
   ```bash
   npm run seed   # opcional: cadastra 6 imóveis iniciais
   npm start      # API em http://localhost:3000
   ```
2. Front-end: abra a pasta `frontend` no VS Code e use a extensão **Live Server** (botão "Go Live") em `index.html`.
   Não abra o HTML com dois cliques (endereço `file://`), porque a navbar e o footer são carregados com `fetch`.
3. Acesse a área do corretor pelo link no rodapé ("Área do corretor") com a senha do `.env`.

Erros comuns ao conectar no banco:
- `querySrv ECONNREFUSED`: a rede do computador bloqueou a consulta de DNS do Atlas. Coloque `DNS_PUBLICO=true` no `.env`.
- `SSL alert number 80` ou `Server selection timed out`: o IP não está liberado no Atlas. Em **Network Access**, adicione `0.0.0.0/0`.

## Como publicar (Parte III)

### 1. Banco (MongoDB Atlas)
- Em **Network Access**, adicione o IP `0.0.0.0/0` (permite a conexão a partir do Render).
- Use a mesma string de conexão do `.env`.

### 2. Back-end (Render)
1. Suba este projeto para um repositório no GitHub (o `.gitignore` já impede o envio do `.env` e da `node_modules`).
2. No Render: **New > Web Service** e escolha o repositório.
3. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
4. Em **Environment**, crie as variáveis `STRING_CONEXAO`, `NOME_BANCO`, `SENHA_ADMIN` e `FRONTEND_URL` (endereço do front publicado, ex.: `https://usuario.github.io`).
5. Depois do deploy, copie a URL do serviço (ex.: `https://edu-imobiliaria-api.onrender.com`).

No plano gratuito o Render "dorme" depois de 15 minutos sem acesso; a primeira visita depois disso pode levar cerca de 1 minuto para carregar os imóveis.

### 3. Front-end (GitHub Pages ou Netlify)
1. Em `frontend/assets/js/config.js`, troque `API_PRODUCAO` pela URL do Render.
2. Publique a pasta `frontend`:
   - **Netlify**: Add new site > Import from GitHub, **Base directory** `frontend`, sem build command, **Publish directory** `frontend`.
   - **GitHub Pages**: publique a pasta `frontend` (por exemplo, com um repositório só do front ou com uma GitHub Action).

## Onde alterar os dados da imobiliária

- `frontend/assets/js/config.js`: WhatsApp, telefone, e-mail, Instagram e endereço (objeto `EMPRESA`)
- `frontend/sobre.html`: texto "Quem somos"
- Imóveis: cadastrados, editados e removidos pela área do corretor
