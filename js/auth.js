/**
 * =============================================================================
 * RENOVA SENAI - AUTENTICAÇÃO E SESSÃO (auth.js)
 * Login por CPF ou E-mail, Perfis de Professor e Coordenação, e Controle de Acesso
 * =============================================================================
 */

const SESSION_KEY = 'renova_senai_session';

class AuthService {
  constructor() {
    this.currentUser = this.loadSession();
  }

  loadSession() {
    const raw = localStorage.getItem(SESSION_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  setPerfil(perfil) {
    if (this.currentUser) {
      this.currentUser.perfil = perfil.toUpperCase();
      this.saveSession(this.currentUser);
    }
  }

  login(identificador, senha) {
    let clean = (identificador || '').trim().toLowerCase();
    if (!clean || clean === '000.000.000-00') {
      clean = 'mariana.silva@sp.senai.br';
    }

    // Busca usuário no banco local
    let usuario = window.db ? window.db.getUsuarioPorCpfOuEmail(clean) : null;

    // Se não encontrou usuário exato, mapeia inteligentemente pelo que foi digitado
    if (!usuario) {
      if (clean.includes('coord') || clean.includes('paulo')) {
        usuario = window.db.getUsuarioById(2); // Paulo Ricardo (Coordenação)
      } else if (clean.includes('nathan')) {
        usuario = window.db.getUsuarioById(1); // Nathan Santana Matos (Docente)
      } else {
        // Padrão de apresentação: MARIANA SILVA (id: 5)
        usuario = (window.db && window.db.getUsuarioById(5)) || {
          id: 5,
          nome: 'MARIANA SILVA',
          email: 'mariana.silva@sp.senai.br',
          cpf: '000.000.000-00',
          perfil: 'PROFESSOR',
          matriculaFuncional: 'SENAI-DOC-2026-102'
        };

        // Se o usuário digitou e-mail ou CPF próprio
        if (clean.includes('@') && clean !== 'mariana.silva@sp.senai.br') {
          usuario.email = clean;
        } else if (clean.replace(/\D/g, '').length >= 6 && clean !== '00000000000') {
          usuario.cpf = identificador.trim();
        }
      }
    }

    this.saveSession({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cpf: usuario.cpf,
      perfil: usuario.perfil,
      matriculaFuncional: usuario.matriculaFuncional
    });

    return this.currentUser;
  }

  logout(reload = false) {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
    if (reload) {
      window.location.reload();
    } else if (window.app && typeof window.app.mostrarLogin === 'function') {
      window.app.mostrarLogin();
    }
  }

  limparSessao() {
    this.currentUser = null;
    localStorage.removeItem(SESSION_KEY);
  }

  isAuthenticated() {
    return !!this.currentUser;
  }

  getUser() {
    return this.currentUser;
  }

  isProfessor() {
    return this.currentUser && this.currentUser.perfil === 'PROFESSOR';
  }

  isCoordenacao() {
    return this.currentUser && (this.currentUser.perfil === 'COORDENACAO' || this.currentUser.perfil === 'ADMINISTRADOR');
  }
}

window.auth = new AuthService();
