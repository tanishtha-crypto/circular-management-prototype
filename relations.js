function initRelations() {
  const btn = document.createElement('button');
  btn.innerText = '📎 Relations';
  btn.style.position = 'fixed';
  btn.style.bottom = '20px';
  btn.style.right = '20px';

  btn.onclick = function () {
    alert("Open Relations Modal"); // temporary
  };

  document.body.appendChild(btn);
}