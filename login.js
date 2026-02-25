// ====== UTIL ======
function getUsers(){
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}
function saveUsers(users){
  localStorage.setItem("usuarios", JSON.stringify(users));
}
function normalizeEmail(email){
  return (email || "").trim().toLowerCase();
}

// ====== UI ======
const msgBox = document.getElementById("msgBox");
function showMsg(text, type="info"){
  if(!msgBox) return;
  msgBox.style.display = "block";
  msgBox.textContent = text;

  if(type === "ok"){
    msgBox.style.borderColor = "rgba(34,197,94,0.35)";
  }else if(type === "warn"){
    msgBox.style.borderColor = "rgba(250,204,21,0.35)";
  }else if(type === "err"){
    msgBox.style.borderColor = "rgba(239,68,68,0.35)";
  }else{
    msgBox.style.borderColor = "rgba(229,231,235,0.20)";
  }
}
function clearMsg(){
  if(!msgBox) return;
  msgBox.style.display = "none";
  msgBox.textContent = "";
}

// ====== Abas (hash) ======
const tabLogin = document.getElementById("tabLogin");
const tabCadastro = document.getElementById("tabCadastro");
function setActiveTab(){
  const h = (window.location.hash || "#login").toLowerCase();
  const isCadastro = h === "#cadastro";
  tabLogin?.classList.toggle("active", !isCadastro);
  tabCadastro?.classList.toggle("active", isCadastro);
}
window.addEventListener("hashchange", setActiveTab);
setActiveTab();

// ====== ENTRAR SEM LOGIN (GUEST) ======
const btnEntrarSemLogin = document.getElementById("btnEntrarSemLogin");
btnEntrarSemLogin?.addEventListener("click", (e) => {
  e.preventDefault();
  localStorage.setItem("authMode", "guest");
  localStorage.removeItem("authUser");
  window.location.href = "index.html";
});

// ====== ELEMENTOS ======
const btnLogin = document.getElementById("btnLogin");
const btnCadastrar = document.getElementById("btnCadastrar");

const loginEmail = document.getElementById("loginEmail");
const loginSenha = document.getElementById("loginSenha");

const cadNome = document.getElementById("cadNome");
const cadEmail = document.getElementById("cadEmail");
const cadSenha = document.getElementById("cadSenha");

// ====== LOGIN (SÓ SE TIVER CADASTRO) ======
btnLogin?.addEventListener("click", () => {
  clearMsg();

  const email = normalizeEmail(loginEmail?.value);
  const senha = (loginSenha?.value || "").trim();

  if(!email || !senha){
    showMsg("Preencha e-mail e senha.", "warn");
    return;
  }

  const users = getUsers();
  const user = users.find(u => u.email === email);

  if(!user){
    showMsg("Esse e-mail não está cadastrado. Crie uma conta.", "warn");
    window.location.hash = "cadastro";
    cadNome?.focus();
    return;
  }

  if(user.senha !== senha){
    showMsg("Senha incorreta.", "err");
    return;
  }

  localStorage.setItem("authMode", "user");
  localStorage.setItem("authUser", JSON.stringify({ nome: user.nome, email: user.email }));

  showMsg("Login feito ✅ Redirecionando...", "ok");
  setTimeout(() => window.location.href = "index.html", 650);
});

// ====== CADASTRO ======
btnCadastrar?.addEventListener("click", () => {
  clearMsg();

  const nome = (cadNome?.value || "").trim();
  const email = normalizeEmail(cadEmail?.value);
  const senha = (cadSenha?.value || "").trim();

  if(!nome || !email || !senha){
    showMsg("Preencha nome, e-mail e senha para cadastrar.", "warn");
    return;
  }

  const users = getUsers();
  const exists = users.some(u => u.email === email);

  if(exists){
    showMsg("Esse e-mail já está cadastrado. Você pode entrar no login.", "warn");
    window.location.hash = "login";
    loginEmail?.focus();
    return;
  }

  users.push({ nome, email, senha });
  saveUsers(users);

  showMsg("Cadastro criado ✅ Agora você já pode entrar.", "ok");

  if(loginEmail) loginEmail.value = email;
  if(loginSenha) loginSenha.value = "";
  if(cadNome) cadNome.value = "";
  if(cadEmail) cadEmail.value = "";
  if(cadSenha) cadSenha.value = "";

  window.location.hash = "login";
  loginEmail?.focus();
});

// ====== ATALHOS (ENTER) ======
[loginEmail, loginSenha].forEach(el => {
  el?.addEventListener("keydown", (ev) => {
    if(ev.key === "Enter") btnLogin?.click();
  });
});
[cadNome, cadEmail, cadSenha].forEach(el => {
  el?.addEventListener("keydown", (ev) => {
    if(ev.key === "Enter") btnCadastrar?.click();
  });
});

// ====== FOCUS INICIAL ======
(function(){
  const h = (window.location.hash || "#login").toLowerCase();
  if(h === "#cadastro") cadNome?.focus();
  else loginEmail?.focus();
})();
