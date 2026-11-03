# Sistema de Aluguel de Carros (Vértice Automóveis)

Trabalho do Laboratório 02 da disciplina de Desenvolvimento de Interfaces Web (DIW), Engenharia de Software, PUC Minas.

O sistema serve para gerenciar aluguéis de carros pela internet. O cliente faz o pedido de aluguel e acompanha o andamento. Os agentes (empresas e bancos) fazem a análise financeira do pedido e, se aprovarem, executam o contrato, que pode ou não ter um crédito concedido por um banco.

<imagem da tela de login aqui>

## Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Diagramas](#diagramas)
- [Como executar](#como-executar)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Telas](#telas)
- [Referências](#referências)
- [Autor](#autor)
- [Licença](#licença)

## Sobre o projeto

Requisitos principais do enunciado:

- O sistema só pode ser usado depois de um cadastro.
- Clientes podem criar, modificar, consultar e cancelar pedidos de aluguel.
- Agentes (empresas e bancos) podem modificar e avaliar pedidos. Pedidos com parecer positivo seguem para a execução do contrato.
- Do cliente são guardados RG, CPF, nome, endereço, profissão e até 3 empregadores com os respectivos rendimentos.
- Do automóvel são guardados matrícula, ano, marca, modelo e placa. Dependendo do contrato, o carro fica registrado como propriedade do cliente, de uma empresa ou de um banco.
- O aluguel pode estar ligado a um contrato de crédito de um dos bancos.

## Funcionalidades

- Login de clientes e agentes, com opção "Lembrar de mim"
- Cadastro de clientes (CRUD completo para os agentes; o cliente edita os próprios dados)
- Cadastro de automóveis (agentes)
- Pedidos de aluguel: o cliente cria, altera, cancela e acompanha o status
- Avaliação financeira: o agente vê a renda do cliente e aprova ou reprova com um parecer
- Execução do contrato, simples ou com crédito (banco, valor e parcelas)

Status possíveis de um pedido:

```
PENDENTE -> APROVADO -> CONTRATADO
PENDENTE -> REPROVADO
PENDENTE ou APROVADO -> CANCELADO (pelo cliente)
```

## Tecnologias

- HTML5, CSS3 e JavaScript (módulos ES6)
- Bootstrap 5.3 e Bootstrap Icons
- JSON Server 0.17.4 como API REST, com os dados no `db.json`
- Fetch API para as requisições
- PlantUML para os diagramas

## Arquitetura

O front-end foi dividido em camadas, seguindo a ideia do MVC:

- `models`: classes do domínio e regras de negócio (`Cliente`, `Agente`, `Automovel`, `Pedido`, `Contrato` etc.). As mudanças de status do pedido ficam na classe `Pedido`.
- `services`: comunicação com o JSON Server via Fetch. Tem um CRUD genérico (`BaseService`) e um service para cada recurso, além do `SessaoService`, que cuida do login.
- `controllers`: um por página. Recebem os eventos da tela e chamam os services.
- `views`: montam o HTML das tabelas, formulários, navbar e alertas.

O enunciado divide o sistema em dois subsistemas. No código, `models`, `services` e `controllers` formam a gestão de pedidos e contratos, e as páginas HTML junto com `views` formam a construção dinâmica das páginas.

O login é só uma simulação: a senha fica em texto no `db.json` e a sessão no `localStorage` (ou no `sessionStorage`, quando "Lembrar de mim" está desmarcado). Para um protótipo da disciplina isso atende, mas não seria seguro em produção.

## Diagramas

Os arquivos `.puml` estão em `docs/diagramas`, separados por versão. As histórias de usuário estão em `docs/historias-usuario.md`.

| Versão | O que mudou |
|---|---|
| v1 | Versão inicial: casos de uso, classes, pacotes e componentes. |
| v2 | Entrada da tela de login: `LoginController` no diagrama de pacotes, tela de login e armazenamento da sessão no diagrama de componentes, ligação entre "Autenticar" e "Cadastrar-se" no diagrama de casos de uso. O diagrama de classes não mudou. |

Diagramas atuais (v2):

Casos de uso

<imagem do diagrama de casos de uso aqui>

Classes

<imagem do diagrama de classes aqui>

Pacotes

<imagem do diagrama de pacotes aqui>

Componentes

<imagem do diagrama de componentes aqui>

## Como executar

Pré-requisito: Node.js 18 ou superior.

```bash
npm install
npm start
```

Depois é só abrir `http://localhost:3000`. O JSON Server entrega a API e as páginas da pasta `src` na mesma porta. Como as páginas usam módulos JavaScript, elas não funcionam abrindo o arquivo HTML direto no navegador.

Usuários para teste (senha `123` para todos):

| Perfil | Login |
|---|---|
| Cliente | `maria` |
| Cliente | `joao` |
| Empresa | `locadora` |
| Banco | `banco` |

## Estrutura de pastas

```
.
├── db.json                 dados do JSON Server
├── package.json
├── docs/
│   ├── historias-usuario.md
│   └── diagramas/
│       ├── v1/
│       └── v2/
└── src/
    ├── login.html
    ├── index.html          início, com atalhos por perfil
    ├── clientes.html       cadastro e CRUD de clientes
    ├── automoveis.html     CRUD de automóveis
    ├── pedidos.html        pedidos do cliente
    ├── avaliacao.html      avaliação de pedidos e contratos
    ├── css/
    ├── img/
    └── js/
        ├── models/
        ├── services/
        ├── controllers/
        └── views/
```

## Telas

Login

<imagem da tela de login aqui>

Cadastro de cliente

<imagem da tela de cadastro de cliente aqui>

Pedidos do cliente

<imagem da tela de pedidos do cliente aqui>

Avaliação de pedidos (agente)

<imagem da tela de avaliação de pedidos aqui>

Execução de contrato

<imagem do modal de execução de contrato aqui>

Automóveis

<imagem da tela de automóveis aqui>

## Referências

- [Documentação do Bootstrap 5](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [JSON Server](https://github.com/typicode/json-server/tree/v0)
- [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [PlantUML](https://plantuml.com/pt/)
- [Repositório da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-de-interfaces-web)

## Autor

Thiago Duarte - [github.com/Thz002](https://github.com/Thz002)

## Licença

MIT
