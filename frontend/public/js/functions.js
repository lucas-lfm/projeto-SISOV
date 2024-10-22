function toggleMenu(model) {
    const menu = document.getElementById("menu-lateral");
    const isActive = menu.classList.contains("ativo");
  
    if (isActive) {
      // Se o menu está ativo, então esconde o menu
      menu.classList.remove("ativo");
    } else {
      // Se o menu não está ativo, então mostra o menu
      menu.classList.add("ativo");
    }
  }
  
  function toggleMenu2() {
    const menu = document.getElementById("menu-lateral");
    menu.classList.toggle("show");
}
