/**
 * =============================================================================
 * RENOVA SENAI - CONTROLADOR DO PORTAL DO ORIENTADOR (portal-orientador.js)
 * Gestão de Projetos, Acompanhamento de Entregas e Bancas de TCC (Figma Design)
 * =============================================================================
 */

class PortalOrientadorController {
  constructor() {
    this.orientador = {
      id: 8,
      nome: 'Prof. Carlos Alberto Silva',
      area: 'Orientação Acadêmica e Projetos Integradores',
      unidade: 'Escola SENAI Roberto Simonsen'
    };

    this.projetos = [
      {
        id: 1,
        tema: 'Sistema IoT de Monitoramento de Consumo Energético em Células Fabris',
        turma: 'TDS-2026-1A',
        alunos: ['Arthur Ribeiro Santos', 'Beatriz Souza Lima', 'Caio Fernando Dias'],
        status: 'EM_ANDAMENTO',
        progresso: 75,
        proximaEntrega: '25/11/2026 — Relatório Técnico Fase 3',
        notaParcial: 8.5
      },
      {
        id: 2,
        tema: 'Plataforma Web de Logística Reversa para Indústria 4.0',
        turma: 'TDS-2026-1N',
        alunos: ['Daniel Lima Castro', 'Elena Fernandes', 'Felipe Rocha'],
        status: 'CONCLUIDO',
        progresso: 100,
        proximaEntrega: 'Aguardando Banca Examinadora (05/12)',
        notaParcial: 9.2
      },
      {
        id: 3,
        tema: 'Automação de Triagem Industrial com Visão Computacional',
        turma: 'MEC-2026-1T',
        alunos: ['Gabriel Mendes', 'Helena Pires Santos'],
        status: 'ATRASADO',
        progresso: 45,
        proximaEntrega: '18/11/2026 — Correção Metodológica',
        notaParcial: 6.8
      }
    ];

    this.bancas = [
      {
        id: 1,
        projetoId: 2,
        tema: 'Plataforma Web de Logística Reversa para Indústria 4.0',
        data: '05/12/2026 às 19:30',
        local: 'Auditório Principal / Híbrido',
        avaliadores: ['Prof. Carlos Alberto (Orientador)', 'Prof. Nathan Santana', 'Coord. Paulo Ricardo'],
        criterios: {
          inovacao: 9.0,
          metodologia: 9.5,
          apresentacao: 9.0,
          documentacao: 9.5
        },
        notaFinal: 9.25,
        situacao: 'AGENDADA'
      }
    ];
  }

  init() {
    this.renderizarProjetos();
    this.renderizarEntregas();
    this.renderizarBancas();
  }

  renderizarProjetos() {
    const grid = document.getElementById('orientadorProjetosGrid');
    if (!grid) return;

    grid.innerHTML = this.projetos.map(p => {
      const statusClass = p.status === 'CONCLUIDO' ? 'status-aprovado' : (p.status === 'EM_ANDAMENTO' ? 'status-em-curso' : 'status-em-risco');
      const statusText = p.status === 'CONCLUIDO' ? 'Concluído' : (p.status === 'EM_ANDAMENTO' ? 'Em Andamento' : 'Atenção / Atraso');

      return `
        <div class="orientador-projeto-card">
          <div class="projeto-card-header">
            <span class="status-badge ${statusClass}">${statusText}</span>
            <span style="font-size:12px; font-weight:700; color:#64748b;">${p.turma}</span>
          </div>
          <h3 class="projeto-card-title">${p.tema}</h3>
          
          <div style="margin: 12px 0;">
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px;">
              <span>Progresso de Orientação</span>
              <strong>${p.progresso}%</strong>
            </div>
            <div class="freq-progress-container" style="max-width:100%; height:6px;">
              <div class="freq-progress-bar ${p.progresso >= 70 ? 'good' : 'warn'}" style="width:${p.progresso}%;"></div>
            </div>
          </div>

          <div class="projeto-alunos-list">
            <strong>Equipe de Alunos:</strong><br>
            ${p.alunos.map(a => `&bull; ${a}`).join('<br>')}
          </div>

          <div style="font-size:12px; color:#475569; background:#f8fafc; padding:10px; border-radius:6px; margin-bottom:12px;">
            <strong>Próximo Marco:</strong><br>${p.proximaEntrega}
          </div>

          <div class="projeto-card-footer">
            <span style="font-size:12px; color:#64748b;">Nota Parcial: <strong style="color:#0284c7; font-size:14px;">${p.notaParcial}</strong></span>
            <button type="button" class="btn-projeto-action" onclick="window.portalOrientadorController.abrirModalFeedback(${p.id})">
              Registrar Parecer &rarr;
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Atualizar indicadores numéricos
    const elTot = document.getElementById('statOrientadorTotalProjetos');
    const elAtivos = document.getElementById('statOrientadorProjetosAtivos');
    const elBancas = document.getElementById('statOrientadorBancasPendentes');

    if (elTot) elTot.textContent = this.projetos.length;
    if (elAtivos) elAtivos.textContent = this.projetos.filter(p => p.status === 'EM_ANDAMENTO').length;
    if (elBancas) elBancas.textContent = this.bancas.length;
  }

  renderizarEntregas() {
    const timeline = document.getElementById('orientadorTimelineContainer');
    if (!timeline) return;

    timeline.innerHTML = `
      <div class="timeline-list">
        <div class="timeline-item completed">
          <h4 class="timeline-title">Fase 1: Submissão e Aprovação da Proposta de Projeto</h4>
          <p style="font-size:12.5px; color:#64748b; margin:0 0 4px 0;">Todos os 3 grupos enviaram a proposta metodológica inicial.</p>
          <span class="timeline-date">Concluído em 15/09/2026 &bull; Parecer Homologado</span>
        </div>

        <div class="timeline-item completed">
          <h4 class="timeline-title">Fase 2: Levantamento de Requisitos e Arquitetura</h4>
          <p style="font-size:12.5px; color:#64748b; margin:0 0 4px 0;">Entrega do diagrama de blocos, modelagem de banco de dados e protótipos.</p>
          <span class="timeline-date">Concluído em 20/10/2026 &bull; Revisado com correções</span>
        </div>

        <div class="timeline-item">
          <h4 class="timeline-title">Fase 3: Implementação e Protótipo Funcional (Atual)</h4>
          <p style="font-size:12.5px; color:#64748b; margin:0 0 4px 0;">Apresentação do software ou hardware funcionando no laboratório.</p>
          <span class="timeline-date" style="color:#0284c7; font-weight:700;">Prazo Vigente: 25/11/2026 &bull; Em acompanhamento</span>
        </div>

        <div class="timeline-item pending">
          <h4 class="timeline-title">Fase 4: Artigo Científico e Banca Examinadora Final</h4>
          <p style="font-size:12.5px; color:#64748b; margin:0 0 4px 0;">Defesa pública perante banca avaliadora composta por docentes e coordenação.</p>
          <span class="timeline-date">Previsto para 05/12 a 12/12/2026</span>
        </div>
      </div>
    `;
  }

  renderizarBancas() {
    const container = document.getElementById('orientadorBancasContainer');
    if (!container) return;

    container.innerHTML = this.bancas.map(b => {
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:22px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px;">
            <div>
              <span class="status-badge status-aprovado" style="margin-bottom:6px;">Banca Confirmada</span>
              <h3 style="margin:0; font-size:16px; font-weight:700; color:#0f172a;">${b.tema}</h3>
              <div style="font-size:12.5px; color:#64748b; margin-top:4px;">
                <strong>Data e Local:</strong> ${b.data} &bull; ${b.local}
              </div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:12px; color:#64748b;">Média Estimada</span>
              <div style="font-size:22px; font-weight:800; color:#0284c7;">${b.notaFinal.toFixed(2)}</div>
            </div>
          </div>

          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-bottom:16px;">
            <strong style="font-size:13px; color:#0f172a;">Banca Examinadora:</strong>
            <div style="font-size:12.5px; color:#475569; margin-top:4px;">
              ${b.avaliadores.map(av => `&bull; ${av}`).join(' &nbsp;|&nbsp; ')}
            </div>
          </div>

          <!-- Rúbrica de Avaliação Interativa -->
          <h4 style="font-size:13.5px; margin:0 0 10px 0; color:#0f172a;">Critérios de Avaliação Regimental (Pesos Equivalentes):</h4>
          <div class="banca-rubrica-grid">
            <div class="banca-rubrica-item">
              <div class="banca-rubrica-label">
                <span>1. Inovação & Solução</span>
                <span id="labelCrit1">9.0</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value="9.0" class="banca-rubrica-slider" oninput="document.getElementById('labelCrit1').textContent=this.value">
            </div>
            <div class="banca-rubrica-item">
              <div class="banca-rubrica-label">
                <span>2. Metodologia & Código</span>
                <span id="labelCrit2">9.5</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value="9.5" class="banca-rubrica-slider" oninput="document.getElementById('labelCrit2').textContent=this.value">
            </div>
            <div class="banca-rubrica-item">
              <div class="banca-rubrica-label">
                <span>3. Postura & Apresentação</span>
                <span id="labelCrit3">9.0</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value="9.0" class="banca-rubrica-slider" oninput="document.getElementById('labelCrit3').textContent=this.value">
            </div>
            <div class="banca-rubrica-item">
              <div class="banca-rubrica-label">
                <span>4. Documentação Escrita</span>
                <span id="labelCrit4">9.5</span>
              </div>
              <input type="range" min="0" max="10" step="0.5" value="9.5" class="banca-rubrica-slider" oninput="document.getElementById('labelCrit4').textContent=this.value">
            </div>
          </div>

          <div style="text-align:right; margin-top:14px;">
            <button type="button" class="btn btn-primary" onclick="window.app.mostrarToast('Parecer e pontuação da banca gravados no sistema!', 'success')">
              Salvar Avaliação da Banca
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  abrirModalFeedback(projetoId) {
    const proj = this.projetos.find(p => p.id === projetoId);
    if (!proj) return;
    const parecer = prompt(`Informe o parecer de orientação para o projeto:\n"${proj.tema}"`, 'Trabalho com excelente evolução técnica. Ajustar apenas a conclusão do relatório.');
    if (parecer) {
      window.app.mostrarToast('Parecer de orientação acadêmica registrado com sucesso!', 'success');
    }
  }
}

window.portalOrientadorController = new PortalOrientadorController();

