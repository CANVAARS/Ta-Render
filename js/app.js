// js/app.js (Bagian Handler Upload)

const dropZone = document.getElementById('dropZone');
const imageInput = document.getElementById('imageInput');
const imagePreview = document.getElementById('imagePreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewContainer = document.getElementById('previewContainer');
const changeImgBtn = document.getElementById('changeImgBtn');

dropZone.addEventListener('click', (e) => {
  if (e.target !== changeImgBtn) imageInput.click();
});

changeImgBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  imageInput.click();
});

imageInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

dropZone.addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  dropZone.classList.add('dragover'); 
});

dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('dragover');
  if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    imagePreview.src = e.target.result;
    imagePreview.classList.remove('hidden');
    previewContainer.classList.remove('hidden');
    uploadPlaceholder.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}
