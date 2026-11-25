# Edu Imobiliária - Sistema Web

Projeto de extensão da disciplina de **Programação Web** (Univali, 2º semestre de 2026), orientado pelo Prof. Dr. Jhonatan Alves.
Equipe: Maria Eliza Vieira Perfeto, Fabio Gomes, Eduardo Zambenedetti e Eduardo Moreira Lima.

## Sobre o projeto

**A empresa parceira:** a Edu Imobiliária é um escritório imobiliário de pequeno porte em Balneário Camboriú/SC, cidade com mercado imobiliário muito competitivo e grande presença de profissionais e empresas do setor. Para se destacar, a imobiliária precisa de um canal próprio para divulgar seus imóveis, fortalecer sua identidade comercial e facilitar o contato com potenciais clientes.

**O sistema:** um site para fortalecer a presença digital da imobiliária. O cliente pesquisa os imóveis com filtros, vê fotos e características e fala direto com o corretor pelo WhatsApp ou e-mail. O corretor tem uma área restrita, protegida por senha, para cadastrar, editar e remover os imóveis e as fotos, sem precisar mexer no código.

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

## Arquitetura

O sistema segue a arquitetura **cliente-servidor**, com o front-end separado do back-end:

```
Navegador ──> Front-end estático (Netlify)
                 │  fetch (HTTP/JSON)
                 ▼
              API REST Node.js + Express (Render) ──> MongoDB Atlas
```

- O **front-end** é composto por páginas HTML, CSS e JavaScript que rodam no navegador. Ele não acessa o banco: busca os dados na API com `fetch`.
- O **back-end** é uma API REST organizada em camadas (rotas → controllers → models), no padrão MVC visto em aula.
- O **banco de dados** (MongoDB Atlas) guarda os imóveis (coleção `imoveis`) e as fotos (coleção `imagens`).
- O site não guarda dados pessoais dos visitantes: o contato acontece direto pelo WhatsApp ou e-mail da imobiliária.

## Tecnologias

| Parte | Tecnologias |
|---|---|
| Front-end | HTML, CSS, JavaScript (módulos ES), Bootstrap 5.3 e Bootstrap Icons |
| Back-end | Node.js, Express 5, Multer (upload de imagens), CORS, dotenv |
| Banco de dados | MongoDB Atlas (driver oficial `mongodb`) |
| Hospedagem | Front-end no Netlify, back-end no Render e banco no MongoDB Atlas |

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

As fotos são salvas no próprio MongoDB (coleção `imagens`) e não na pasta `uploads/` como na aula 10, porque o disco dos planos gratuitos do Render é apagado a cada deploy/reinício.

## Como configurar e rodar localmente

Pré-requisitos: Node.js 18 ou mais novo e um cluster gratuito no MongoDB Atlas (passo a passo na aula 9).

### 1. Instalar as dependências e criar o `.env`

```bash
cd backend
npm install
cp .env.example .env      # no Windows: copy .env.example .env
```

### 2. Variáveis de ambiente

O modelo está em [`backend/.env.example`](backend/.env.example). O arquivo `.env` não vai para o GitHub.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `STRING_CONEXAO` | sim | String de conexão do MongoDB Atlas (Connect > Drivers), com a senha do usuário do banco |
| `NOME_BANCO` | não | Nome do banco de dados. Padrão: `edu_imobiliaria` |
| `SENHA_ADMIN` | sim | Senha da área do corretor |
| `FRONTEND_URL` | não | Endereço do front-end publicado, para o CORS. Vazia libera qualquer origem (use vazia no computador) |
| `DNS_PUBLICO` | não | `true` só se aparecer o erro `querySrv ECONNREFUSED` ao conectar |
| `PORT` | não | Porta da API. Padrão: `3000` (o Render define sozinho) |

### 3. Executar a API

```bash
npm run dev    # desenvolvimento: reinicia sozinho a cada alteração
npm start      # execução normal (é o comando usado no Render)
```

A API fica em http://localhost:3000. Para testar as rotas, use o arquivo [`backend/api.http`](backend/api.http) com a extensão REST Client do VS Code.

### 4. Executar o front-end

Abra a pasta `frontend` no VS Code e use a extensão **Live Server** (botão "Go Live") em `index.html`.
Não abra o HTML com dois cliques (endereço `file://`), porque a navbar e o footer são carregados com `fetch`.
Rodando em `localhost`/`127.0.0.1`, o front usa a API local automaticamente; publicado, usa a API do Render (ver `frontend/assets/js/config.js`).

### Erros comuns ao conectar no banco

- `querySrv ECONNREFUSED`: a rede do computador bloqueou a consulta de DNS do Atlas. Coloque `DNS_PUBLICO=true` no `.env`.
- `SSL alert number 80` ou `Server selection timed out`: o IP não está liberado no Atlas. Em **Network Access**, adicione `0.0.0.0/0`.

## Como popular o banco

Com o `.env` configurado, rode dentro da pasta `backend`:

```bash
npm run seed
```

O script [`backend/src/config/seed.js`](backend/src/config/seed.js) cadastra 6 imóveis iniciais (apartamentos, cobertura, casa e sala comercial, para venda e aluguel), sendo 3 em destaque. Ele só insere se a coleção `imoveis` estiver vazia, então pode ser rodado mais de uma vez sem duplicar. O banco e as coleções são criados automaticamente no primeiro cadastro. Fotos são adicionadas pela área do corretor.

## Credenciais de teste

O sistema tem um único tipo de acesso restrito: a **área do corretor** (`admin.html`), que pede só uma senha (não há cadastro de usuários).

- **No seu computador:** a senha é o valor de `SENHA_ADMIN` no seu `.env`. No `.env.example` ela vem como `troque-esta-senha`.
- **No site publicado:** a senha de produção não fica no repositório, porque ele é público e qualquer pessoa poderia alterar os imóveis da imobiliária. Ela é enviada ao professor junto com a entrega no AVA e passada ao corretor pessoalmente.

## Como publicar (deploy)

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
4. Em **Environment**, crie as variáveis `STRING_CONEXAO`, `NOME_BANCO`, `SENHA_ADMIN` e `FRONTEND_URL` (endereço do front publicado, sem barra no final; neste projeto: `https://edu-imobiliaria.netlify.app`).
5. Depois do deploy, copie a URL do serviço (neste projeto: `https://edu-imobiliaria.onrender.com`).

No plano gratuito o Render "dorme" depois de 15 minutos sem acesso; a primeira visita depois disso pode levar cerca de 1 minuto para carregar os imóveis.

### 3. Front-end (Netlify)
1. Em `frontend/assets/js/config.js`, troque `API_PRODUCAO` pela URL do Render.
2. No Netlify: **Add new site > Import an existing project**, escolha o repositório e configure **Base directory** `frontend`, **Build command** vazio e **Publish directory** `frontend`.
3. Deixe o site público (**Make public**) e copie o endereço para a variável `FRONTEND_URL` do Render.

## Como usar a área do corretor

1. Acesse `admin.html` (link "Área do corretor" no rodapé do site) e entre com a senha.
2. **Novo imóvel**: preencha título, tipo, finalidade, preço e cidade (campos obrigatórios), as características e a descrição, e escolha até 10 fotos (máx. 5 MB cada).
3. Marque **Mostrar em destaque** para o imóvel aparecer na página inicial.
4. **Editar** (ícone de lápis): altere os dados, marque "remover" nas fotos que devem sair e adicione fotos novas.
5. **Remover** (ícone de lixeira): apaga o imóvel e as fotos dele. Essa ação não pode ser desfeita.
6. Clique em **Sair** ao terminar, principalmente em computadores compartilhados.

No plano gratuito do Render a API "dorme" depois de 15 minutos sem uso; a primeira página aberta depois disso pode levar cerca de 1 minuto para carregar.

## Onde alterar os dados da imobiliária

- `frontend/assets/js/config.js`: WhatsApp, telefone, e-mail, Instagram e endereço (objeto `EMPRESA`)
- `frontend/sobre.html`: texto "Quem somos"
- Imóveis: cadastrados, editados e removidos pela área do corretor
