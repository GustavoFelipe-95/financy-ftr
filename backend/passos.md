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

[] O usuário pode criar uma conta e fazer login
[] O usuário pode ver e gerenciar apenas as transações e categorias criadas por ele
[] Deve ser possível criar uma transação
[] Deve ser possível deletar uma transação
[] Deve ser possível editar uma transação
[] Deve ser possível listar todas as transações
[] Deve ser possível criar uma categoria
[] Deve ser possível deletar uma categoria
[] Deve ser possível editar uma categoria
[] Deve ser possível listar todas as categorias