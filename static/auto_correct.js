// static/auto_correct.js

let symptoms = [];               // { label: "Itching", value: "itching" }, …
const selectedSet = new Set();   // Seçilen value’ları saklayacağımız Set

// 1) Sayfa açılır açılmaz /api/symptoms'ten semptom listesini al
fetch('/api/symptoms')
  .then(res => {
    if (!res.ok) throw new Error('Failed to load symptoms');
    return res.json();
  })
  .then(data => {
    // data = [ {label:"Itching",value:"itching"}, {label:"Fatigue",value:"fatigue"}, … ]
    symptoms = data;
  })
  .catch(err => console.error('Symptom load error:', err));

// 2) DOM referanslarını al
const input = document.getElementById("symptomInput");
const suggestionsBox = document.getElementById("suggestions");
const selectedBox = document.getElementById("selectedSymptoms");
const hiddenInputs = document.getElementById("hiddenInputs");

// 3) Input’a her tuş vuruşunda autocomplete işlemi
input.addEventListener("input", function () {
  const val = this.value.trim().toLowerCase();
  suggestionsBox.innerHTML = "";

  if (val === "") return; // Boşsa öneri göstermiyoruz

  // 4) Filtre: label içinde val geçiyor ve value henüz seçilmemiş
  const filtered = symptoms.filter(item =>
    item.label.toLowerCase().includes(val) &&
    !selectedSet.has(item.value)
  );

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    // Ekranda “Skin Rash” yerine “Skin Rash” görünmesi için:
    div.textContent = item.label;
    div.onclick = () => {
      selectSymptom(item);
    };
    suggestionsBox.appendChild(div);
  });
});

// 5) Bir semptom seçildiğinde çalışan fonksiyon
function selectSymptom(item) {
  if (selectedSet.has(item.value)) return;

  // 5.a) Görsel “chip” ekle
  const tag = document.createElement("span");
  tag.classList.add("selected");
  tag.textContent = item.label;  // Üstünde label gösterelim (ör. "Skin Rash")
  selectedBox.appendChild(tag);

  // 5.b) Form için hidden input ekle
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = "symptoms";     // Flask'te request.form.getlist('symptoms')
  hidden.value = item.value;
  hiddenInputs.appendChild(hidden);

  // 5.c) İşaretlenen value’yu Set’e ekle ki tekrar önerilmesin
  selectedSet.add(item.value);

  // 5.d) Input ve öneri kutusunu temizle
  input.value = "";
  suggestionsBox.innerHTML = "";
}
