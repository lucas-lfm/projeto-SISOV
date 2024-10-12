<!-- markdownlint-disable MD029 -->

# SISOV (Sistema de Identificação e Rastreabilidade de Ovinos)

O **SISOV** é um sistema de rastreabilidade de carne de ovinos desenvolvido para a região dos Inhamuns, no Ceará. Ele visa garantir a rastreabilidade de rebanhos ovinos, seguindo as regras de Identidade Geográfica (IG), e possibilita que tanto produtores quanto consumidores validem informações sobre a origem e a saúde dos animais. O projeto está focado em fornecer uma solução acessível e eficiente para produtores locais.

## Funcionalidades

- **Gestão de Rebanhos:** Cadastro e controle detalhado de ovinos.
- **Rastreabilidade Completa:** Informações completas sobre o animal, desde o nascimento até o abate.
- **Exportação de Dados em PDF:** Geração de relatórios personalizados em formato PDF.
- **Sistema de Contas de Usuários:** Cada usuário gerencia seu próprio rebanho, vinculado ao CPF.
- **Integração com RFID:** Planejada integração com dispositivos de RFID usando Arduino para automação de identificação.

## Estrutura do Projeto

```bash
package.json
├── package-lock.json
├── public
│   ├── css
│   │   └── style.css
│   ├── favicon.ico
│   ├── index.html
│   ├── js
│   │   ├── auth.js
│   │   ├── report.js
│   │   └── script.js
│   └── pages
│       ├── pagina_producao.html
│       ├── pdf-model.html
│       └── registro.html
└── sisov-backend
    ├── config
    │   └── db.json
    ├── controllers
    │   └── authController.js
    ├── data
    │   └── users.json
    ├── middleware
    ├── routes
    │   └── authRoutes.js
    ├── server.js
    └── teste.html
```

### Descrição das Pastas

- **public**: Contém os arquivos de front-end, como HTML, CSS e JavaScript.
- **sisov-backend**: Contém o backend do projeto, incluindo as rotas, controladores e o banco de dados JSON.
- **config**: Inclui o arquivo \`db.json\` com as configurações de banco de dados.
- **controllers**: Gerencia a lógica do sistema de autenticação e outras funcionalidades.
- **routes**: Define as rotas para a comunicação entre o frontend e o backend.

## Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Banco de Dados**: JSON (para prototipagem)
- **Servidor JSON**: JSON Server para desenvolvimento rápido
- **Arduino (futuro)**: Para integração com RFID

## Instalação e Uso

### Pré-requisitos

- [Node.js](https://nodejs.org/)
- [JSON Server](https://github.com/typicode/json-server)

### Instalação

1. Clone este repositório:

```bash
git clone <https://github.com/seu-usuario/sisov.git>
```

2. Navegue até o diretório do projeto:

```bash
cd sisov
```

3. Instale as dependências:

```bash
npm install
```

4. Inicie o JSON Server:

```bash
npm run backend
```

5. Inicie o frontend:

```bash
npm start
```

### Uso

- Acesse a interface do sistema no navegador através de \`<http://localhost:3000\`>.
- Utilize o painel de controle para gerenciar as informações dos ovinos e gerar relatórios em PDF.

## Futuras Implementações

- **Integração IoT**: Uso de RFID com Arduino para automatizar a identificação dos animais.
- **Versão Mobile**: Desenvolvimento de uma versão mobile para facilitar o uso em campo.
- **Suporte a Novos Idiomas**: Inclusão de suporte multilíngue.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir um _pull request_ ou relatar problemas no repositório.

## Licença

Este projeto é licenciado sob a Licença MIT - consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
