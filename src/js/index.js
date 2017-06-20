function toggle(elementId, className) {
  const element = document.getElemenytById(elementId);
  
  if (element.classList.contains(className)) {
    element.classList.remove(className);
  } else {
    element.classList.add(className);
  }
}
