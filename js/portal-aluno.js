/**
 * =============================================================================
 * RENOVA SENAI - CONTROLADOR DO PORTAL DO ALUNO (portal-aluno.js)
 * Gestão de Boletim Escolar, Frequência, UCs e Comunicados (Figma Design)
 * =============================================================================
 */

class PortalAlunoController {
  constructor() {
    this.aluno = {
      id: 1,
      ra: 'RA2026-0894',
      nome: 'Mariana Silva',
      cpf: '000.000.000-00',
      curso: 'Técnico em Desenvolvimento de Sistemas',
      turma: 'TDS-2026-1A',
      periodo: 'Tarde',
      termo: '1º Termo',
      escola: 'Escola SENAI Roberto Simonsen - Brás'
    };

    this.boletim = [
      {
        codigo: 'UC-01',
        nome: 'Lógica de Programação e Algoritmos',
        ch: 80,
        docente: 'Prof. Nathan Santana',
        n1: 9.0,
        n2: 8.5,
        media: 8.8,
        aulas: 80,
        faltas: 4,
        frequencia: 95.0,
        status: 'APROVADO'
      },
      {
        codigo: 'UC-02',
        nome: 'Banco de Dados e Modelagem Relacional',
        ch: 100,
        docente: 'Profª. Fernanda Costa',
        n1: 7.5,
        n2: 8.0,
        media: 7.8,
        aulas: 100,
        faltas: 8,
        frequencia: 92.0,
        status: 'APROVADO'
      },
      {
        codigo: 'UC-03',
        nome: 'Desenvolvimento Front-End & UI/UX',
        ch: 120,
        docente: 'Profª. Juliana Rocha',
        n1: 9.5,
        n2: 9.0,
        media: 9.3,
        aulas: 120,
        faltas: 6,
        frequencia: 95.0,
        status: 'APROVADO'
      },
      {
        codigo: 'UC-04',
        nome: 'Desenvolvimento Web Back-End com APIs',
        ch: 120,
        docente: 'Prof. Nathan Santana',
        n1: 8.0,
        n2: 7.5,
        media: 7.8,
        aulas: 120,
        faltas: 16,
        frequencia: 86.7,
        status: 'EM_CURSO'
      }
    ];

    this.comunicados = [
      {
        id: 1,
        data: '12/11/2026',
        titulo: 'Abertura das Inscrições para a Feira Tecnológica SENAI Inova 2026',
        autor: 'Coordenação Pedagógica',
        tipo: 'GERAL',
        conteudo: 'Estão abertas as submissões de projetos inovadores para a feira tecnológica institucional. Procure seu orientador de TCC até dia 20/11.'
      },
      {
        id: 2,
        data: '08/11/2026',
        titulo: 'Prazo Limite para Entrega de Atestados e Justificativas de Outubro',
        autor: 'Secretaria Escolar',
        tipo: 'AVISO',
        conteudo: 'Lembramos que o protocolo de compensação de ausências deve ser feito em até 5 dias úteis após a emissão do atestado médico.'
      }
    ];
  }

  init() {
    this.renderizarBoletim();
    this.renderizarFrequencia();
    this.renderizarMaterias();
    this.renderizarComunicados();
  }

  renderizarBoletim() {
    const tbody = document.getElementById('alunoBoletimTableBody');
    if (!tbody) return;

    // Calcular médias gerais
    let somaMedias = 0;
    let somaFreq = 0;
    let totalFaltas = 0;

    const rows = this.boletim.map(item => {
      somaMedias += item.media;
      somaFreq += item.frequencia;
      totalFaltas += item.faltas;

      const badgeClass = item.status === 'APROVADO' ? 'status-aprovado' : (item.status === 'EM_CURSO' ? 'status-em-curso' : 'status-em-risco');
      const badgeText = item.status === 'APROVADO' ? 'Aprovado' : (item.status === 'EM_CURSO' ? 'Em Curso' : 'Em Risco');

      return `
        <tr>
          <td>
            <strong>${item.codigo}</strong><br>
            <span style="font-size:12px; color:#64748b;">${item.nome}</span>
          </td>
          <td>${item.docente}</td>
          <td><strong>${item.n1.toFixed(1)}</strong></td>
          <td><strong>${item.n2.toFixed(1)}</strong></td>
          <td><strong style="color:#0284c7; font-size:14.5px;">${item.media.toFixed(1)}</strong></td>
          <td>${item.faltas} h</td>
          <td>
            <strong>${item.frequencia.toFixed(1)}%</strong>
            <div class="freq-progress-container">
              <div class="freq-progress-bar ${item.frequencia >= 75 ? 'good' : 'danger'}" style="width: ${item.frequencia}%;"></div>
            </div>
          </td>
          <td><span class="status-badge ${badgeClass}">${badgeText}</span></td>
        </tr>
      `;
    }).join('');

    tbody.innerHTML = rows;

    const mediaGeral = (somaMedias / this.boletim.length).toFixed(1);
    const freqGeral = (somaFreq / this.boletim.length).toFixed(1);

    const elMedia = document.getElementById('statAlunoMediaGeral');
    const elFreq = document.getElementById('statAlunoFreqGeral');
    const elFaltas = document.getElementById('statAlunoTotalFaltas');

    if (elMedia) elMedia.textContent = mediaGeral;
    if (elFreq) elFreq.textContent = `${freqGeral}%`;
    if (elFaltas) elFaltas.textContent = `${totalFaltas}h`;
  }

  renderizarFrequencia() {
    const list = document.getElementById('alunoFreqList');
    if (!list) return;

    list.innerHTML = this.boletim.map(item => {
      const limiteFaltas = Math.floor(item.ch * 0.25);
      const faltasRestantes = Math.max(0, limiteFaltas - item.faltas);
      const isRisco = item.frequencia < 75;

      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:16px; margin-bottom:12px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div>
              <strong style="color:#0f172a; font-size:14.5px;">${item.nome}</strong> (${item.codigo})
              <div style="font-size:12px; color:#64748b;">Carga Horária: ${item.ch}h &bull; Docente: ${item.docente}</div>
            </div>
            <div style="text-align:right;">
              <span style="font-size:17px; font-weight:800; color:${isRisco ? '#dc2626' : '#16a34a'};">${item.frequencia.toFixed(1)}%</span>
            </div>
          </div>
          <div class="freq-progress-container" style="max-width:100%; height:10px;">
            <div class="freq-progress-bar ${isRisco ? 'danger' : 'good'}" style="width:${item.frequencia}%;"></div>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11.5px; color:#64748b; margin-top:8px;">
            <span>Faltas registradas: <strong>${item.faltas} horas</strong></span>
            <span>Limite máximo (25%): <strong>${limiteFaltas} horas</strong> (Restam: ${faltasRestantes}h)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderizarMaterias() {
    const container = document.getElementById('alunoMateriasContainer');
    if (!container) return;

    container.innerHTML = this.boletim.map(item => {
      return `
        <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:20px; box-shadow:0 4px 12px rgba(0,0,0,0.02);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
            <div>
              <span class="status-badge status-em-curso" style="margin-bottom:6px;">${item.codigo}</span>
              <h3 style="margin:0; font-size:16px; font-weight:700; color:#0f172a;">${item.nome}</h3>
            </div>
            <span style="font-size:12px; font-weight:700; color:#0284c7; background:#e0f2fe; padding:4px 10px; border-radius:6px;">${item.ch} Horas</span>
          </div>
          <p style="font-size:13px; color:#64748b; margin:0 0 14px 0; line-height:1.45;">
            Docente titular: <strong>${item.docente}</strong><br>
            Aulas ministradas no laboratório de informática especializada e práticas de bancada.
          </p>
          <div style="border-top:1px solid #f1f5f9; padding-top:12px; display:flex; justify-content:space-between; font-size:12px;">
            <span>Situação: <strong>${item.status === 'APROVADO' ? 'Concluída' : 'Em Andamento'}</strong></span>
            <span style="color:#0284c7; font-weight:600; cursor:pointer;" onclick="window.app.mostrarToast('Plano de Ensino disponível para download na secretaria.', 'info')">Ver Plano de Ensino &rarr;</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderizarComunicados() {
    const list = document.getElementById('alunoComunicadosList');
    if (!list) return;

    list.innerHTML = this.comunicados.map(c => {
      return `
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-left:4px solid #b91c1c; border-radius:8px; padding:16px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
            <strong style="color:#0f172a; font-size:14.5px;">${c.titulo}</strong>
            <span style="font-size:11.5px; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:4px;">${c.data}</span>
          </div>
          <p style="font-size:13px; color:#475569; margin:0 0 8px 0; line-height:1.45;">${c.conteudo}</p>
          <div style="font-size:11.5px; color:#94a3b8;">Origem: <strong>${c.autor}</strong></div>
        </div>
      `;
    }).join('');
  }

  exportarBoletimPDF() {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      window.app.mostrarToast('Biblioteca de PDF indisponível.', 'error');
      return;
    }

    const doc = new window.jspdf.jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(195, 22, 28); // Vermelho SENAI
    doc.text('SENAI-SP — SERVIÇO NACIONAL DE APRENDIZAGEM INDUSTRIAL', 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text('BOLETIM ESCOLAR OFICIAL — HISTÓRICO DE RENDIMENTO E FREQUÊNCIA', 14, 28);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Aluno(a): ${this.aluno.nome}  |  RA: ${this.aluno.ra}  |  CPF: ${this.aluno.cpf}`, 14, 38);
    doc.text(`Curso: ${this.aluno.curso}  |  Turma: ${this.aluno.turma} (${this.aluno.periodo})`, 14, 44);
    doc.text(`Unidade: ${this.aluno.escola}  |  Emissão: ${new Date().toLocaleDateString('pt-BR')}`, 14, 50);

    const headers = [['Código', 'Unidade Curricular', 'Docente', '1º Bim', '2º Bim', 'Média', 'Faltas', 'Freq %', 'Situação']];
    const data = this.boletim.map(b => [
      b.codigo,
      b.nome,
      b.docente,
      b.n1.toFixed(1),
      b.n2.toFixed(1),
      b.media.toFixed(1),
      `${b.faltas}h`,
      `${b.frequencia.toFixed(1)}%`,
      b.status === 'APROVADO' ? 'Aprovado' : 'Em Curso'
    ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 56,
      theme: 'grid',
      headStyles: { fillColor: [195, 22, 28], textColor: 255, fontStyle: 'bold' },
      styles: { fontSize: 8.5, cellPadding: 3 }
    });

    const finalY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text('Documento gerado eletronicamente pelo Sistema Acadêmico Integrado Renova SENAI.', 14, finalY);
    doc.text('A frequência mínima obrigatória para aprovação regimental é de 75%.', 14, finalY + 5);

    doc.save(`Boletim_${this.aluno.nome.replace(/\s+/g, '_')}_2026.pdf`);
    window.app.mostrarToast('Boletim em PDF exportado com sucesso!', 'success');
  }
}

window.portalAlunoController = new PortalAlunoController();

