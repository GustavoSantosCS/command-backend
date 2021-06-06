<h1 align="center">
  <img src="./.github/logo-command.svg" width="300"/>
</h1>

<h5 align="center">
  Command | Comanda Digital | Backend
</h5>

<h5 align="center">
  Projeto backend construído durante o 8° Semestre do Curso de Engenharia de Software| Universidade do Estado de Santa Catarina
</h5>

<p align="center">
  <img src="https://img.shields.io/static/v1?label=Plataforma&message=PC&color=575757&labelColor=4fbd17">

  <img alt="TCC" src="https://img.shields.io/static/v1?label=Command&labelColor=4fbd17&message=Backend&color=575757">

  <img src="https://img.shields.io/static/v1?label=License&labelColor=4fbd17&message=MIT&color=575757">

  <img src="https://img.shields.io/static/v1?label=Author&labelColor=4fbd17&message=GustavoSantosCS&color=575757">

  <img src="https://img.shields.io/static/v1?label=Language&labelColor=4fbd17&message=JavaScript&color=575757">

  <a href="https://travis-ci.com/GustavoSantosCS/commad-backend">
    <img src="https://travis-ci.com/GustavoSantosCS/commad-backend.svg?branch=main">
  </a>

  <a href="https://coveralls.io/github/GustavoSantosCS/commad-backend">
    <img src="https://coveralls.io/repos/github/GustavoSantosCS/commad-backend/badge.svg">
  </a>
</p>

<p align="center">
  <a href="#descricao">Descrição</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#funcionalidades">Funcionalidades</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#instalacao">Instalação</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#licenca">Licença</a>&nbsp;&nbsp;&nbsp;
</p>

<h2 id="descricao">:page_facing_up: Descrição</h2>

O Command é uma aplicação web e mobile para realizar pedidos em restaurantes tanto de produto e de musica. Command está sendo desenvolvido com trabalho de conclusão de curso de Engenharia de Software da CEAVI/UDESC.

<h2 id="tecnologias">:hammer: Tecnologias</h2>

Este projeto foi desenvolvido com as seguintes tecnologias

- [Node.js](https://nodejs.org/pt-br/)
- [TypeScript](https://www.typescriptlang.org/)
- [Typeorm.js](https://typeorm.io/#/)
- [Jest.js](https://jestjs.io/pt-BR/)
- [Supertest](https://www.npmjs.com/package/supertest)
- [Travis](https://travis-ci.com/)
- [Coveralls](https://coveralls.io/)
- [Express.js](https://expressjs.com/pt-br/)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)
- [UUID](https://www.npmjs.com/package/uuid)
- [Faker](https://www.npmjs.com/package/faker)
- [Husky](https://www.npmjs.com/package/husky)
- [lint-staged](https://www.npmjs.com/package/lint-staged)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Prettier](https://www.npmjs.com/package/prettier)
- [git-commit-msg-linter](https://www.npmjs.com/package/git-commit-msg-linter")

<h2 id="funcionalidades">:clipboard: Funcionalidades </h2>

- [ ] Manter conta <strong><small>(em desenvolvimento)</small></strong>
- [ ] Autenticar usuário
- [ ] Manter estabelecimento
- [ ] Manter produtos
- [ ] Manter musicas
- [ ] Manter lista de reprodução do estabelecimento
- [ ] Criar e manter enquetes
- [ ] Responder enquetes
- [ ] Fazer pedidos de produto
- [ ] Fazer pedidos de musica

<h2 id="instalacao">:closed_book: Instalação </h2>

<h3>Pré-requisitos </h3>

<h4>Dependências: </h4>

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/pt-br/) <strong><small>(já contido no docker)</small></strong>
- [PostgreSQL](https://www.postgresql.org/) <strong><small>(já contido no docker)</small></strong>
- [Docker](https://www.docker.com/)
- [Docker-Compose](https://docs.docker.com/compose/gettingstarted/)

<p>Esse script é para rodar com o docker, caso não queira usar o docker compile o código com typescript</p>

```bash

# Clone este repositório.
$ git clone https://github.com/GustavoSantosCS/commad-backend commad-backend

# Vá para a pasta commad-backend

$ cd commad-backend

# Execute aplicação

$ npm run up / yarn up

# O app vai está rodando na porta 3333 - acesse <http://localhost:3333>

```

<h2 id="licenca">:memo: Licença </h2>

<p>
  Copyright © 2020 <a href="https://https://github.com/GustavoSantosCS">Gustavo Santos</a>.
</p>
<p>
  This project is under the <a href="./.github/LICENSE">MIT</a> license. See the archive LICENSE for more details.
</p>

---
<p align="center">Desenvolvido por Gustavo Santos com 💚</p>
