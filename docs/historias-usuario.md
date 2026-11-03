# Histórias de Usuário (v2)

Formato: **Como** \<ator\>, **quero** \<ação\>, **para** \<benefício\>.

| ID | História | Critérios de aceitação | Caso de uso |
|----|----------|------------------------|-------------|
| US01 | Como **cliente**, quero me cadastrar no sistema, para poder fazer pedidos de aluguel. | Informar nome, RG, CPF, endereço, profissão, login, senha e até 3 empregadores com rendimentos. O login deve ser único. | UC01 |
| US02 | Como **usuário**, quero entrar com login e senha, para acessar as funções do meu perfil. | Após entrar, cliente e agente veem atalhos do seu perfil. Opção "Lembrar de mim" mantém a sessão ao fechar o navegador. Login inválido exibe mensagem de erro. Páginas protegidas redirecionam para o login; o link "Cadastre-se" leva ao cadastro. | UC02 |
| US03 | Como **cliente**, quero atualizar meus dados e rendimentos, para manter minha análise financeira correta. | Não é permitido informar mais de 3 rendimentos. | UC03 |
| US04 | Como **cliente**, quero introduzir um pedido de aluguel escolhendo o automóvel e o período, para alugar um carro. | Pedido nasce com status PENDENTE. A data de fim não pode ser anterior à de início. | UC04 |
| US05 | Como **cliente**, quero modificar um pedido, para corrigir o automóvel ou as datas. | Só é possível enquanto o pedido estiver PENDENTE. | UC05 |
| US06 | Como **cliente**, quero consultar meus pedidos e o status de cada um, para acompanhar a análise. | Exibe status, parecer do agente e contrato (quando houver). | UC06 |
| US07 | Como **cliente**, quero cancelar um pedido, para desistir do aluguel. | Só é possível com status PENDENTE ou APROVADO. | UC07 |
| US08 | Como **agente**, quero avaliar financeiramente um pedido, vendo a renda do cliente, para aprovar ou reprovar. | Parecer é obrigatório. Status muda para APROVADO ou REPROVADO. | UC08 |
| US09 | Como **agente**, quero modificar um pedido, para ajustar automóvel ou período. | Só é possível com status PENDENTE ou APROVADO. | UC05 |
| US10 | Como **agente**, quero executar o contrato de um pedido aprovado, para efetivar o aluguel. | Escolher tipo (simples ou com crédito) e o proprietário do automóvel (cliente, empresa ou banco). Pedido passa para CONTRATADO. | UC09 |
| US11 | Como **banco**, quero associar um contrato de crédito ao aluguel, para financiar o cliente. | Informar banco concedente, valor e número de parcelas. | UC10 |
| US12 | Como **agente**, quero cadastrar, alterar e excluir automóveis (matrícula, ano, marca, modelo, placa), para manter a frota disponível. | Não é possível excluir automóvel com pedidos. | UC11 |
| US13 | Como **agente**, quero manter o cadastro de clientes (CRUD), para gerenciar os contratantes. | Não é possível excluir cliente com pedidos. | UC12 |

## Ciclo de vida do pedido

```
PENDENTE ──(agente aprova)──▶ APROVADO ──(agente executa contrato)──▶ CONTRATADO
    │                            │
    ├──(agente reprova)──▶ REPROVADO
    │                            │
    └────(cliente cancela)───────┴──▶ CANCELADO
```
