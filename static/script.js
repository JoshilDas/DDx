let symptoms = [];

// symptoms.json dosyasını yükle
fetch('/static/symptoms.json')
  .then(res => res.json())
  .then(data => symptoms = data);

const input = document.getElementById("symptomInput");
const suggestionsBox = document.getElementById("suggestions");
const selectedBox = document.getElementById("selectedSymptoms");
const hiddenInputs = document.getElementById("hiddenInputs");

const selectedSymptoms = new Set();

input.addEventListener("input", function () {
  const val = this.value.toLowerCase();
  suggestionsBox.innerHTML = "";

  if (val.length === 0) return;

  const filtered = symptoms.filter(s => s.toLowerCase().includes(val) && !selectedSymptoms.has(s));

  filtered.forEach(symptom => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.textContent = symptom;
    div.onclick = () => selectSymptom(symptom);
    suggestionsBox.appendChild(div);
  });
});

function selectSymptom(symptom) {
  if (selectedSymptoms.has(symptom)) return;

  selectedSymptoms.add(symptom);

  // Ekrana chip olarak ekle
  const tag = document.createElement("span");
  tag.classList.add("selected");
  tag.textContent = symptom;
  selectedBox.appendChild(tag);

  // Forma gizli input olarak ekle
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "symptoms[]";
  hidden.value = symptom;
  hiddenInputs.appendChild(hidden);

  // Input ve önerileri temizle
  input.value = "";
  suggestionsBox.innerHTML = "";
}
