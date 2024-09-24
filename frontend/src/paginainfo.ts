export function gerarPaginacao(totalPaginas: number, paginaAtual: number): string {
  const criarItem = (pagina: number | string, ativo: boolean = false, desabilitado: boolean = false): string => {
    const classe = `page-item ${ativo ? 'active' : ''} ${desabilitado ? 'disabled' : ''}`;
    const href = (pagina === 'Next' && !desabilitado) ? `http://localhost:5173/receitas/${paginaAtual + 1}` : 
                  (pagina === 'Previous' && !desabilitado) ? `http://localhost:5173/receitas/${paginaAtual - 1}` : 
                  !desabilitado ? `http://localhost:5173/receitas/${pagina}` : '#';

    return `
      <li class="${classe}">
        <a class="page-link" href="${href}" ${desabilitado ? 'tabindex="-1"' : ''}>
          ${pagina}
        </a>
      </li>
    `;
  };

  let paginacaoHtml = '<ul class="pagination pagination-sm">';

  const paginaAnterior = paginaAtual > 1 ? paginaAtual - 1 : 1;
  paginacaoHtml += criarItem('Previous', paginaAtual === 1, paginaAtual === 1);

  
  for (let i = 1; i <= totalPaginas; i++) {
    paginacaoHtml += criarItem(i, i === paginaAtual);
  }

  const paginaProxima = paginaAtual < totalPaginas ? paginaAtual + 1 : totalPaginas;
  const desabilitado = paginaAtual === totalPaginas;
  paginacaoHtml += criarItem('Next', desabilitado, desabilitado);

  paginacaoHtml += '</ul>';

  return paginacaoHtml;
}
