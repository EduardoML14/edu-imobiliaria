# Banco de dados

Banco MongoDB (Atlas) com o nome definido em `NOME_BANCO` (padrão `edu_imobiliaria`).

## Coleções

| Coleção | Conteúdo |
|---|---|
| `imoveis` | Imóveis cadastrados: título, descrição, tipo, finalidade, preço, bairro, cidade, área, quartos, suítes, banheiros, vagas, destaque, lista de fotos (`imagens`) e data de cadastro (`criadoEm`) |
| `imagens` | Fotos dos imóveis: tipo do arquivo (`tipo`), conteúdo binário (`dados`) e data de envio (`criadoEm`) |

Exemplo de documento da coleção `imoveis`:

```json
{
  "titulo": "Apartamento frente mar com 3 suítes",
  "descricao": "Apartamento amplo na Avenida Atlântica...",
  "tipo": "Apartamento",
  "finalidade": "Venda",
  "preco": 3200000,
  "bairro": "Centro",
  "cidade": "Balneário Camboriú",
  "area": 148,
  "quartos": 3,
  "suites": 3,
  "banheiros": 4,
  "vagas": 2,
  "destaque": true,
  "imagens": ["/imagens/6745f0c2a1b2c3d4e5f60718"],
  "criadoEm": { "$date": "2026-11-24T12:00:00.000Z" }
}
```

- `tipo`: `Apartamento`, `Casa`, `Cobertura`, `Terreno` ou `Sala comercial`
- `finalidade`: `Venda` ou `Aluguel` (no aluguel, `preco` é o valor mensal)
- `imagens`: endereços das fotos na API (`/imagens/<id do documento na coleção imagens>`)

## Arquivos desta pasta

- `imoveis.json`: dados mínimos (6 imóveis, 3 em destaque), no formato JSON estendido do MongoDB.

## Criar as coleções e os dados mínimos

Com o `.env` configurado, dentro da pasta `backend`:

```bash
npm run seed
```

O script `src/config/seed.js`:
1. cria as coleções `imoveis` e `imagens`, se ainda não existirem;
2. cria os índices usados nas buscas do site;
3. insere os imóveis de `imoveis.json`, só se a coleção `imoveis` estiver vazia (pode rodar mais de uma vez sem duplicar).

Alternativa sem Node, com o [MongoDB Database Tools](https://www.mongodb.com/docs/database-tools/mongoimport/):

```bash
mongoimport --uri "SUA_STRING_DE_CONEXAO" --db edu_imobiliaria --collection imoveis --jsonArray --file database/imoveis.json
```
