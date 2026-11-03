# 🚗 Sistema de Aluguel de Carros (AlugaCar) 👨‍💻

> [!NOTE]
> Sistema web para gestão de aluguéis de automóveis: clientes fazem, modificam, consultam e cancelam pedidos; agentes (empresas e bancos) avaliam financeiramente os pedidos e executam os contratos, com ou sem crédito bancário.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Projeto desenvolvido no <b>Laboratório 02</b> da disciplina <b>Desenvolvimento de Interfaces Web (DIW)</b> do curso de Engenharia de Software da PUC Minas. O sistema permite efetuar, cancelar e modificar pedidos de aluguel pela Internet, com <i>cadastro prévio obrigatório</i>, <i>análise financeira</i> feita pelos agentes e <i>execução de contratos</i>, que podem estar associados a um contrato de crédito concedido por um banco. Foi construído com <b>HTML5, CSS3, JavaScript</b>, <b>Bootstrap 5</b> e <b>JSON Server</b> como API REST simulada.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/cc-puc.jpg" alt="Logo do Projeto" width="120px"/>
      </div>
    </td>
  </tr>
</table>

---

## 🚧 Status do Projeto

![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue?style=for-the-badge) ![HTML5](https://img.shields.io/badge/HTML5-007ec6?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-007ec6?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-007ec6?style=for-the-badge&logo=javascript&logoColor=white) ![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-007ec6?style=for-the-badge&logo=bootstrap&logoColor=white) ![JSON Server](https://img.shields.io/badge/JSON_Server-0.17.4-007ec6?style=for-the-badge&logo=json&logoColor=white)

---

## 📚 Índice
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Diagramas](#diagramas)
  - [Histórico de versões dos modelos](#histórico-de-versões-dos-modelos)
- [Instalação e Execução](#-instalação-e-execução)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Licença](#-licença)

---

## 📝 Sobre o Projeto

O sistema apoia a gestão de aluguéis de automóveis e só pode ser utilizado após cadastro prévio.

- **Clientes** (usuários individuais) introduzem, modificam, consultam e cancelam pedidos de aluguel. Sobre eles são armazenados RG, CPF, nome, endereço, profissão e até **3** entidades empregadoras com os respectivos rendimentos.
- **Agentes** (empresas e bancos) modificam e avaliam os pedidos. Após a análise financeira, os pedidos com parecer positivo ficam disponíveis para a execução do contrato.
- **Automóveis** são registrados com matrícula, ano, marca, modelo e placa. Dependendo do contrato, o automóvel é registrado como propriedade do cliente, de uma empresa ou de um banco.
- O aluguel pode estar associado a um **contrato de crédito** concedido por um dos bancos agentes.

Contexto: projeto acadêmico (DIW – PUC Minas, 2º período).

---

## ✨ Funcionalidades Principais

- 🔐 **Cadastro e login** de clientes e agentes (sessão simulada no `localStorage`).
- 👤 **CRUD de clientes** com até 3 empregadores/rendimentos e cálculo da renda total.
- 🚘 **CRUD de automóveis** (agentes).
- 📝 **Pedidos de aluguel**: o cliente cria, modifica, consulta o status e cancela.
- 📊 **Avaliação financeira**: o agente vê a renda do cliente e aprova ou reprova com parecer.
- 📄 **Execução de contratos** simples ou com **contrato de crédito** (banco, valor e parcelas), registrando o proprietário do automóvel.

**Ciclo de vida do pedido:** `PENDENTE → APROVADO | REPROVADO → CONTRATADO`, com `CANCELADO` disponível ao cliente enquanto o pedido estiver pendente ou aprovado.

---

## 🛠 Tecnologias Utilizadas

### 💻 Front-end
* **Estrutura e lógica:** HTML5, CSS3 e JavaScript (ES Modules)
* **Interface:** Bootstrap 5.3.3 e Bootstrap Icons 1.11.3 (via CDN)
* **Comunicação:** Fetch API

### 🖥️ Back-end
* **API e persistência:** JSON Server 0.17.4 (API REST simulada a partir do `db.json`)

---

## 🏗 Arquitetura

A aplicação é um front-end em JavaScript puro organizado em camadas, inspirado no padrão **MVC**, que consome a API REST do JSON Server. Os pacotes correspondem aos dois subsistemas descritos no enunciado:

| Subsistema | Pacotes | Responsabilidade |
|---|---|---|
| **Gestão de pedidos e contratos** | `models`, `services`, `controllers` | Entidades e regras de negócio (`models`), acesso à API REST via Fetch (`services`) e coordenação de cada página (`controllers`). |
| **Construção dinâmica das páginas web** | páginas HTML, `views` | Páginas com Bootstrap e funções que montam tabelas, formulários, navbar e alertas dinamicamente (`views`). |

- **models:** `Usuario`, `Cliente`/`Emprego`, `Agente`/`Empresa`/`Banco`, `Automovel`, `Pedido`, `Contrato`/`ContratoCredito`. As regras de transição de status ficam em `Pedido` (ex.: `avaliar()`, `cancelar()`, `marcarComoContratado()`).
- **services:** `Api` (Fetch genérico), `BaseService` (CRUD genérico que converte JSON em instâncias dos modelos) e um serviço por recurso. `ContratoService.executar()` grava o contrato, marca o pedido como `CONTRATADO` e atualiza o proprietário do automóvel.
- **controllers:** um por página; tratam eventos, chamam os serviços e repassam os dados às views.
- **views:** geram o HTML dinâmico (com escape de texto para evitar injeção de HTML).

**Trade-offs:** a autenticação é apenas simulada (senha em texto no `db.json` e sessão no `localStorage`), adequada a um protótipo acadêmico, mas não a produção.

### Diagramas

Os diagramas foram feitos em **PlantUML** e ficam versionados em [`docs/diagramas`](./docs/diagramas). As histórias de usuário estão em [`docs/historias-usuario.md`](./docs/historias-usuario.md).

| Casos de Uso | Classes |
| :---: | :---: |
| <img src="docs/diagramas/v1/casos-de-uso.png" alt="Diagrama de Casos de Uso" width="400px"> | <img src="docs/diagramas/v1/classes.png" alt="Diagrama de Classes" width="400px"> |
| **Pacotes (Visão Lógica)** | **Componentes** |
| <img src="docs/diagramas/v1/pacotes.png" alt="Diagrama de Pacotes" width="400px"> | <img src="docs/diagramas/v1/componentes.png" alt="Diagrama de Componentes" width="400px"> |

### Histórico de versões dos modelos

| Versão | Data | Alterações |
|---|---|---|
| v1 | 03/11/2026 | Versão inicial: casos de uso, histórias de usuário, classes, pacotes e componentes. |

---

## 🔧 Instalação e Execução

### Pré-requisitos
* **Node.js** versão LTS (v18 ou superior)
* **npm**

### 📦 Instalação de Dependências

```bash
npm install
```

### ⚡ Como Executar a Aplicação

```bash
npm start
```

O JSON Server sobe em `http://localhost:3000` servindo **a API** (`/clientes`, `/agentes`, `/automoveis`, `/pedidos`, `/contratos`) e **as páginas** da pasta `src`. Acesse `http://localhost:3000/login.html`.

> [!IMPORTANT]
> As páginas usam ES Modules, por isso precisam ser abertas via servidor (`npm start`) e não com duplo clique no arquivo HTML.

### 👥 Usuários de teste

| Perfil | Login | Senha |
|---|---|---|
| Cliente | `maria` | `123` |
| Cliente | `joao` | `123` |
| Agente (Empresa) | `locadora` | `123` |
| Agente (Banco) | `banco` | `123` |

---

## 📂 Estrutura de Pastas

```
.
├── db.json                    # 💾 Base de dados do JSON Server
├── package.json               # 📦 Dependências e script "npm start"
├── README.md
├── docs/
│   ├── historias-usuario.md   # 📝 Histórias de usuário
│   └── diagramas/
│       └── v1/                # 📐 Casos de uso, classes, pacotes e componentes (.puml/.png)
└── src/
    ├── index.html             # 🏠 Início (atalhos por perfil)
    ├── login.html             # 🔐 Login
    ├── clientes.html          # 👤 Cadastro / CRUD de clientes
    ├── automoveis.html        # 🚘 CRUD de automóveis (agentes)
    ├── pedidos.html           # 📝 Pedidos do cliente
    ├── avaliacao.html         # 📊 Avaliação de pedidos e contratos (agentes)
    ├── css/style.css
    └── js/
        ├── models/            # Entidades e regras de negócio
        ├── services/          # Acesso à API (Fetch) e sessão
        ├── controllers/       # Lógica de cada página
        └── views/             # Construção dinâmica do HTML
```

---

## 🎥 Demonstração

| Tela | Captura de Tela |
| :---: | :---: |
| **Login** | **Meus pedidos (cliente)** |
| _captura aqui_ | _captura aqui_ |
| **Avaliação de pedidos (agente)** | **Cadastro de clientes** |
| _captura aqui_ | _captura aqui_ |

---

## 🔗 Documentações utilizadas

* 📖 [Bootstrap 5 – Documentação](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
* 📖 [JSON Server – Repositório e documentação](https://github.com/typicode/json-server/tree/v0)
* 📖 [Fetch API (MDN)](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
* 📖 [PlantUML](https://plantuml.com/pt/)
* 📖 [Repositório da disciplina](https://github.com/joaopauloaramuni/desenvolvimento-de-interfaces-web)

---

## 👥 Autores

| 👤 Nome | :octocat: GitHub |
|---------|-----------------|
| Thiago Duarte | [Thz002](https://github.com/Thz002) |

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) – pelo apoio institucional e estrutura acadêmica.
* [**Prof. Dr. João Paulo Aramuni**](https://github.com/joaopauloaramuni) – pelos ensinamentos em Desenvolvimento de Interfaces Web.

---

## 📄 Licença

Este projeto é distribuído sob a **Licença MIT**.
