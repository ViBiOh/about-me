function toggleKeyboard(event) {
  if ((event.code === 'Enter' || event.code === 'Space')) {
    var element = document.querySelector('#' + event.target.htmlFor);
    if (element) {
      event.preventDefault();
      element.checked = !element.checked;
    }
  }
}
