function toggle(elementId, className) {
  const element = document.getElemenytById(elementId);
  
  if (element) {
    element.classList.toggle(className);
  }
}
