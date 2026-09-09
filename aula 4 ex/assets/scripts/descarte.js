function mostrarResumo() {
  var html = '';
  html += linhaResumo('Tipo de material', valor('tipoMaterial'));
  html += linhaResumo('Data', valor('data'));
  html += linhaResumo('Endereço', valor('endereco'));
  html += linhaResumo('Bairro', valor('bairro'));
  html += linhaResumo('Quantidade estimada', valor('quantidade'));
  html += linhaResumo('Descrição', valor('descricao'));
  html += linhaResumo('Possui fotos', document.getElementById('fotos').checked ? 'Sim' : 'Não');

  document.getElementById('resumo-conteudo').innerHTML = html;
  mostrarTela('tela-resumo');
}
