const BASE_URL = 'http://localhost:3000';

async function requisicao(caminho, opcoes = {}) {
  const resposta = await fetch(`${BASE_URL}/${caminho}`, {
    headers: { 'Content-Type': 'application/json' },
    ...opcoes,
  });
  if (!resposta.ok) throw new Error(`Erro ${resposta.status} ao acessar /${caminho}`);
  return resposta.json();
}

export const Api = {
  listar(recurso, filtros = {}) {
    const query = new URLSearchParams(filtros).toString();
    return requisicao(query ? `${recurso}?${query}` : recurso);
  },

  buscar(recurso, id) {
    return requisicao(`${recurso}/${id}`);
  },

  criar(recurso, dados) {
    return requisicao(recurso, { method: 'POST', body: JSON.stringify(dados) });
  },

  atualizar(recurso, id, dados) {
    return requisicao(`${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(dados) });
  },

  remover(recurso, id) {
    return requisicao(`${recurso}/${id}`, { method: 'DELETE' });
  },
};
