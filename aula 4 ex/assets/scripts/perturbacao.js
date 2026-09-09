function mostrarResumo() {
  var html = '';
  html += linhaResumo('Origem do barulho', valor('origem'));
  html += linhaResumo('Horário', valor('horario'));
  html += linhaResumo('Endereço afetado', valor('endereco'));
  html += linhaResumo('Frequência', valor('frequencia'));
  html += linhaResumo('Descrição', valor('descricao'));
  html += linhaResumo('Já conversou com o responsável', document.getElementById('conversou').checked ? 'Sim' : 'Não');

  document.getElementById('resumo-conteudo').innerHTML = html;
  mostrarTela('tela-resumo');
}
