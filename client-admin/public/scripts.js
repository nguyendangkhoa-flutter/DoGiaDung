document.addEventListener('DOMContentLoaded', () => {
    const openModalButton = document.getElementById('openModal');
    const closeModalButton = document.getElementById('closeModal');
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('modal');
  
    openModalButton.addEventListener('click', () => {
      overlay.style.display = 'block';
      modal.style.display = 'block';
    });
  
    closeModalButton.addEventListener('click', () => {
      overlay.style.display = 'none';
      modal.style.display = 'none';
    });
  
    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      modal.style.display = 'none';
    });
  });
  