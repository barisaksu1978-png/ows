// SCREEN SWITCH — minimum for #intro / data-go navigation
function go(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('show',s.id===id));
  document.querySelectorAll('.navitem').forEach(n=>n.classList.toggle('active',n.dataset.go===id));
  document.body.classList.toggle('shell-mode',id!=='intro');
}
document.querySelectorAll('[data-go]').forEach(el=>el.addEventListener('click',()=>go(el.dataset.go)));
document.body.classList.toggle('shell-mode',!!document.querySelector('.shell-app .screen.show:not(#intro)'));
