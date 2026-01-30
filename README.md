
# Project Base Node.js

Este projeto é um **boilerplate** para a criação de novas aplicações Node.js, pronto para CI/CD e publicação em Docker.

## Objetivo

Fornecer uma estrutura inicial organizada e padronizada, facilitando o desenvolvimento de novos projetos com Node.js, promovendo boas práticas e agilidade na configuração inicial.

## Estrutura do Projeto

- **src/**: Código-fonte principal
   - **controllers/**: Lógica dos controladores
   - **repositories/**: Acesso a dados
   - **routes/**: Definição das rotas
   - **services/**: Lógica de negócio
- **tests/**: Testes automatizados (unitários e de integração)
- **index.js**: Ponto de entrada da aplicação
- **package.json**: Gerenciamento de dependências
- **eslint.config.js**: Configuração do ESLint

---

## 🚀 Como rodar localmente

```bash
npm install
npm start
```
Acesse em [http://localhost:3000](http://localhost:3000).

---

## 🐳 Publicação e uso com Docker

### Build da imagem

```bash
docker build -t meu-app-node .
```

### Rodando o container

```bash
docker run -p 3000:3000 meu-app-node
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

---

## ⚙️ Pipeline CI/CD

O projeto está pronto para integração contínua (CI) e entrega contínua (CD) usando ferramentas como GitHub Actions, GitLab CI ou outros.

### Exemplo de etapas da pipeline:

1. Instalação de dependências
2. Execução dos testes automatizados
3. Build da aplicação
4. Build e push da imagem Docker para um registry (Docker Hub, GitHub Packages, etc)
5. Deploy automático (opcional)

#### Exemplo de workflow com GitHub Actions (`.github/workflows/ci.yml`):

```yaml
name: CI/CD

on:
   push:
      branches: [main]

jobs:
   build-and-push:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v4

         - name: Setup Node.js
            uses: actions/setup-node@v4
            with:
               node-version: '20'

         - name: Install dependencies
            run: npm install

         - name: Run tests
            run: npm test

         - name: Build Docker image
            run: docker build -t meu-usuario/meu-app-node:${{ github.sha }} .

         - name: Login to Docker Hub
            uses: docker/login-action@v3
            with:
               username: ${{ secrets.DOCKERHUB_USERNAME }}
               password: ${{ secrets.DOCKERHUB_TOKEN }}

         - name: Push Docker image
            run: docker push meu-usuario/meu-app-node:${{ github.sha }}
```

> **Obs:** Configure as secrets `DOCKERHUB_USERNAME` e `DOCKERHUB_TOKEN` no repositório.

---

## Recomendações

- Utilize o ESLint para manter o padrão de código.
- Organize novas funcionalidades seguindo a estrutura proposta.
- Escreva testes para garantir a qualidade do código.
- Use caminhos relativos nos imports para garantir compatibilidade com Docker e Node.js ES Modules.
- O servidor deve escutar em `0.0.0.0` para funcionar no Docker.

---

Sinta-se à vontade para customizar este boilerplate conforme as necessidades do seu projeto!
