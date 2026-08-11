// js/app.js

import { buildPrompt } from './engine.js';
import { 
  RENDERING_LIGHTING, 
  PHOTOGRAPHY_LIGHTING, 
  RENDERING_OUTPUT, 
  PHOTOGRAPHY_OUTPUT 
} from './presets.js';

let currentTrack = 'rendering';

document.addEventListener('DOMContentLoaded', () => {
  const btnRendering = document.getElementById('btnRendering');
  const btnPhotography = document.getElementById('btnPhotography');
  const lightingSelect = document.getElementById('lightingPreset');
  const outputSelect = document.getElementById('outputPreset');
  const generateBtn = document.getElementById('generateBtn');
  const resultPrompt = document.getElementById('resultPrompt');
  const copyBtn = document.getElementById('copyBtn');

  const dropZone = document.getElementById('dropZone');
  const imageInput = document.getElementById('imageInput');
  const imagePreview = document.getElementById('imagePreview');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const previewContainer = document.getElementById('previewContainer');
  const changeImgBtn = document.getElementById('changeImgBtn');

  function populateSelect(selectEl, library) {
    if (!selectEl) return;
    selectEl.innerHTML = '';
    Object.keys(library).forEach(key => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = library[key].name;
      selectEl.appendChild(option);
    });
  }

  function updateTrackUI() {
    if (currentTrack === 'rendering') {
      if (btnRendering) btnRendering.classList.add('active');
      if (btnPhotography) btnPhotography.classList.remove('active');
      populateSelect(lightingSelect, RENDERING_LIGHTING);
      populateSelect(outputSelect, RENDERING_OUTPUT);
    } else {
      if (btnPhotography) btnPhotography.classList.add('active');
      if (btnRendering) btnRendering.classList.remove('active');
      populateSelect(lightingSelect, PHOTOGRAPHY_LIGHTING);
      populateSelect(outputSelect, PHOTOGRAPHY_OUTPUT);
    }
  }

  if (btnRendering) {
    btnRendering.addEventListener('click', () => { currentTrack = 'rendering'; updateTrackUI(); });
  }
  if (btnPhotography) {
    btnPhotography.addEventListener('click', () => { currentTrack = 'photography'; updateTrackUI(); });
  }

  if (dropZone && imageInput) {
    dropZone.addEventListener('click', (e) => {
      if (e.target !== changeImgBtn) imageInput.click();
    });

    if (changeImgBtn) {
      changeImgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        imageInput.click();
      });
    }

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
  }

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (imagePreview) {
        imagePreview.src = e.target.result;
        imagePreview.classList.remove('hidden');
      }
      if (previewContainer) previewContainer.classList.remove('hidden');
      if (uploadPlaceholder) uploadPlaceholder.classList.add('hidden');
    };
    reader.readAsDataURL(file);
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => {
      const type = document.getElementById('renderType')?.value || 'exterior';
      const style = document.getElementById('designStyle')?.value || 'Modern Minimalist';
      const lightingKey = lightingSelect?.value;
      const outputKey = outputSelect?.value;

      const prompt = buildPrompt({
        type,
        style,
        track: currentTrack,
        lightingKey,
        outputKey
      });

      if (resultPrompt) resultPrompt.value = prompt;
    });
  }

  if (copyBtn && resultPrompt) {
    copyBtn.addEventListener('click', () => {
      if (!resultPrompt.value) return;
      navigator.clipboard.writeText(resultPrompt.value);
      alert('Prompt berhasil disalin ke clipboard!');
    });
  }

  // Inisialisasi awal pilihan dropdown
  updateTrackUI();
});
