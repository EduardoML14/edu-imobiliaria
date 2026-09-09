function mostrarTela(idTela) {
  var telas = document.querySelectorAll('.tela');
  for (var i = 0; i < telas.length; i++) {
    telas[i].classList.remove('ativa');
  }
  document.getElementById(idTela).classList.add('ativa');
}

function valor(id) {
  var v = document.getElementById(id).value;
  return v ? v : '-';
}

function linhaResumo(chave, valor) {
  return '<div class="resumo-item"><span>' + chave + '</span><strong>' + valor + '</strong></div>';
}

function enviarDenuncia() {
  var protocolo = 'DEN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 899999);
  document.getElementById('numero-protocolo').innerText = 'Protocolo: ' + protocolo;
  mostrarTela('tela-sucesso');
}
