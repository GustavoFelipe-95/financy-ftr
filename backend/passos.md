[Back-end]

Ao rodarmos a instalação do apollo, est sendo necesario um postinstall:

pnpm approve-builds
ou


npm warn install-scripts 4 packages have install scripts not yet covered by allowScripts:
npm warn install-scripts   @apollo/protobufjs@1.2.8 (postinstall: node scripts/postinstall)
npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
npm warn install-scripts   workerd@1.20260704.1 (postinstall: node install.js)
npm warn install-scripts   msgpackr-extract@3.0.4 (install: node-gyp-build-optional-packages)
npm warn install-scripts
npm warn install-scripts Run `npm install-scripts ls` to review, or `npm install-scripts approve <pkg>` to allow.

----------------------------------------------------------------------------------------------------------------------------------------------------
npm install-scripts approve @apollo/protobufjs@1.2.8 esbuild@0.28.2 workerd@1.20260704.1 msgpackr-extract@3.0.4 @prisma/engines@7.10.0 prisma@7.10.0
----------------------------------------------------------------------------------------------------------------------------------------------------
npm install-scripts approve esbuild@0.28.2
----------------------------------------------------------------------------------------------------------------------------------------------------

[x] 1. Criar conta e fazer login - `POST /` com as mutations `signup` e `login`
[ ] 2. Ver e gerenciar apenas os próprios dados - `POST /` com `transactions`, `categories` e mutations de CRUD; falta corrigir os field resolvers aninhados
[x] 3. Criar uma transação - `POST /` com a mutation `createTransaction`
[x] 4. Deletar uma transação - `POST /` com a mutation `deleteTransaction`
[x] 5. Editar uma transação - `POST /` com a mutation `updateTransaction`
[x] 6. Listar todas as transações - `POST /` com a query `transactions`
[x] 7. Criar uma categoria - `POST /` com a mutation `createCategory`
[x] 8. Deletar uma categoria - `POST /` com a mutation `deleteCategory`
[x] 9. Editar uma categoria - `POST /` com a mutation `updateCategory`
[x] 10. Listar todas as categorias - `POST /` com a query `categories`

Validação executada: `npm run build` passou. Não existem testes automatizados
na pasta `tests`; as rotas acima foram verificadas no schema, resolvers e
services, não executadas por uma suíte HTTP/E2E.