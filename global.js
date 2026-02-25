// ===== AUTENTICAÇÃO (LOCAL) =====
(function authGuard(){
  const path = (window.location.pathname || "").toLowerCase();
  const isLoginPage = path.endsWith("login.html") || path.includes("/login.html");
  if(isLoginPage) return;

  const mode = localStorage.getItem("authMode"); // 'guest' | 'user'
  if(!mode){
    // ainda não escolheu (nem guest, nem user)
    window.location.href = "login.html";
  }
})();

// ===== UI: TOAST =====
(function ensureToastRoot(){
  if(document.getElementById("toastRoot")) return;
  const root = document.createElement("div");
  root.id = "toastRoot";
  document.body.appendChild(root);
})();

window.uiToast = function(message){
  const root = document.getElementById("toastRoot");
  if(!root) return;

  const toast = document.createElement("div");
  toast.className = "ui-toast";
  toast.textContent = message;

  root.appendChild(toast);

  // animação simples
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 250);
  }, 2500);
};

// ===== UI: MODAL (LOGIN OBRIGATÓRIO) =====
window.uiAuthRequiredModal = function(options={}){
  // options: { title, message, onClose }
  const existing = document.getElementById("authModalOverlay");
  if(existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "authModalOverlay";
  overlay.className = "ui-modal-overlay";

  overlay.innerHTML = `
    <div class="ui-modal" role="dialog" aria-modal="true">
      <h3>${options.title || "Login necessário"}</h3>
      <p>${options.message || "Para agendar um horário, você precisa entrar ou criar uma conta."}</p>
      <div class="ui-modal-actions">
        <button class="ui-btn ui-btn-primary" id="goLogin">Fazer login</button>
        <button class="ui-btn" id="goSignup">Criar conta</button>
        <button class="ui-btn ui-btn-ghost" id="closeModal">Agora não</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  function close(){
    overlay.remove();
    if(typeof options.onClose === "function") options.onClose();
  }

  overlay.addEventListener("click", (e) => {
    if(e.target === overlay) close();
  });

  overlay.querySelector("#closeModal").addEventListener("click", close);

  overlay.querySelector("#goLogin").addEventListener("click", () => {
    window.location.href = "login.html#login";
  });

  overlay.querySelector("#goSignup").addEventListener("click", () => {
    window.location.href = "login.html#cadastro";
  });
};

// ===== LOGO VOLTA PARA HOME =====
document.querySelectorAll(".logo").forEach(logo => {
  logo.style.cursor = "pointer";
  logo.addEventListener("click", () => window.location.href = "index.html");
});

// ===== BOTÃO VOLTAR =====
const btnVoltar = document.getElementById("btnVoltar");
if(btnVoltar){
  btnVoltar.addEventListener("click", function(e){
    e.preventDefault();
    window.history.back();
  });
}

// ===== ÍCONE DO USUÁRIO =====
const userIcon = document.querySelector(".iconeuser");
if(userIcon){
  userIcon.style.cursor = "pointer";
  userIcon.addEventListener("click", () => {
    const mode = localStorage.getItem("authMode");
    if(mode === "user"){
      const u = JSON.parse(localStorage.getItem("authUser") || "null");
      const nome = (u && u.nome) ? u.nome : "Usuário";
      // sem alert/prompt: usa modal simples de confirmação
      const overlay = document.createElement("div");
      overlay.className = "ui-modal-overlay";
      overlay.id = "logoutModalOverlay";
      overlay.innerHTML = `
        <div class="ui-modal" role="dialog" aria-modal="true">
          <h3>Sair da conta?</h3>
          <p>Você está logado como <strong>${nome}</strong>.</p>
          <div class="ui-modal-actions">
            <button class="ui-btn ui-btn-primary" id="btnLogout">Sair</button>
            <button class="ui-btn ui-btn-ghost" id="btnCancelLogout">Cancelar</button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      function close(){ overlay.remove(); }
      overlay.addEventListener("click", (e)=>{ if(e.target===overlay) close(); });
      overlay.querySelector("#btnCancelLogout").addEventListener("click", close);
      overlay.querySelector("#btnLogout").addEventListener("click", ()=>{
        localStorage.removeItem("authMode");
        localStorage.removeItem("authUser");
        window.location.href = "login.html";
      });
      return;
    }
    // guest ou sem modo: vai pra tela de login
    window.location.href = "login.html";
  });
}
