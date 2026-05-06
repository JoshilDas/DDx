$(document).ready(function() {
    initializeSelect2();
    initializeTheme();
    setupEventListeners();
    syncUploadCards();
});

let activeCategory = 'all';

function initializeSelect2() {
    $('#symptoms').select2({
        placeholder: 'Search and select symptoms',
        multiple: true,
        width: '100%',
        templateResult: formatSymptom,
        templateSelection: formatSymptomSelection
    });
}

function formatSymptom(symptom) {
    if (!symptom.id) {
        return symptom.text;
    }
    return $(`<span><i class="fas fa-circle-notch"></i> ${symptom.text}</span>`);
}

function formatSymptomSelection(symptom) {
    return symptom.text;
}

function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    $('#theme-toggle').on('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const icon = $('#theme-toggle').find('i');
    icon.toggleClass('fa-moon', theme === 'dark');
    icon.toggleClass('fa-sun', theme !== 'dark');
}

function setupEventListeners() {
    $('#symptomForm').on('submit', handleFormSubmission);
    $('.category-btn').on('click', handleCategoryFilter);
    $('#blood-report, #lft-report, #rft-report').on('change', handlePrototypeUploadChange);
}

function syncUploadCards() {
    $('#blood-report, #lft-report, #rft-report').each(function() {
        updateUploadCard($(this));
    });
}

function handlePrototypeUploadChange() {
    if (!isPdfFile(this.files[0])) {
        this.value = '';
        showAlert('Only PDF files are allowed for the prototype report slots.', 'error');
    }
    updateUploadCard($(this));
}

function updateUploadCard($input) {
    const file = $input[0].files[0];
    const card = $input.closest('.upload-card');
    const status = card.find('.upload-status');

    if (file) {
        card.addClass('has-file');
        status.text(file.name);
    } else {
        card.removeClass('has-file');
        status.text('No file selected');
    }
}

function isPdfFile(file) {
    if (!file) {
        return true;
    }
    const name = file.name.toLowerCase();
    return file.type === 'application/pdf' || name.endsWith('.pdf');
}

async function handleFormSubmission(event) {
    event.preventDefault();

    const symptoms = $('#symptoms').val() || [];
    if (!symptoms.length) {
        showAlert('Please select at least one symptom before running the scan.', 'warning');
        return;
    }

    const payload = {
        symptoms: symptoms,
        has_blood_report: hasSelectedFile('#blood-report'),
        has_lft: hasSelectedFile('#lft-report'),
        has_rft: hasSelectedFile('#rft-report')
    };

    try {
        showLoading();

        const response = await $.ajax({
            url: '/predict',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(payload)
        });

        hideLoading();

        if (response.success) {
            renderResults(response, symptoms);
        } else {
            showAlert(response.error || 'Prediction failed.', 'error');
        }
    } catch (error) {
        hideLoading();
        showAlert('Prediction request failed. Please try again.', 'error');
        console.error('Prediction error:', error);
    }
}

function hasSelectedFile(selector) {
    const input = $(selector)[0];
    return Boolean(input && input.files && input.files.length);
}

function renderResults(response, symptoms) {
    const resultsDiv = $('#results');
    const emptyState = $('#empty-state');

    emptyState.addClass('hidden');
    resultsDiv.removeClass('hidden').empty();

    const activeReports = getActiveReports(response.report_flags);

    resultsDiv.append(`
        <div class="selection-summary">
            <strong>Selected symptoms</strong>
            <p>${symptoms.map(formatLabel).join(', ')}</p>
        </div>
    `);

    if (response.ranking_changed) {
        resultsDiv.append(`
            <div class="note-banner">
                <strong>Rankings changed after supplementary report review.</strong>
                <p>${response.refinement_note}</p>
                <div class="pill-row">
                    <span class="pill">${activeReports.join(' + ')}</span>
                    <span class="pill">Ranking change detected</span>
                </div>
            </div>
        `);
    }

    resultsDiv.append(buildPredictionCard(
        'Prediction Intelligence',
        activeReports.length ? 'Presentation view' : 'Symptom view',
        response.refined_predictions
    ));
}

function buildPredictionCard(title, badge, predictions) {
    return `
        <section class="prediction-card">
            <div class="prediction-card-header">
                <div>
                    <h4>${title}</h4>
                    <p class="prediction-meta">Top 3 disease candidates</p>
                </div>
                <span class="prediction-badge">${badge}</span>
            </div>
            <div class="prediction-list">
                ${predictions.map((prediction, index) => buildPredictionItem(prediction, index)).join('')}
            </div>
        </section>
    `;
}

function buildPredictionItem(prediction, index) {
    const probability = (prediction.probability * 100).toFixed(1);
    const symptoms = Array.isArray(prediction.symptoms) && prediction.symptoms.length
        ? prediction.symptoms.map(formatLabel).join(', ')
        : 'No supporting symptom list available';

    const precautions = Array.isArray(prediction.precautions) && prediction.precautions.length
        ? `<ul>${prediction.precautions.map(item => `<li>${item}</li>`).join('')}</ul>`
        : '<p>No precautions available.</p>';

    return `
        <article class="prediction-item ${index === 0 ? 'top-ranked' : ''}">
            <div class="prediction-title">
                <h5>${index + 1}. ${prediction.disease}</h5>
                <p>${prediction.confidence_level} confidence</p>
            </div>
            <div class="probability-track">
                <div class="probability-bar" style="width: ${probability}%"></div>
            </div>
            <div class="prediction-meta">
                <p><strong>Probability:</strong> ${probability}%</p>
                <p><strong>Common symptoms:</strong> ${symptoms}</p>
                <p><strong>Description:</strong> ${prediction.description || 'No description available.'}</p>
                <div><strong>Precautions:</strong>${precautions}</div>
            </div>
        </article>
    `;
}

function getActiveReports(reportFlags) {
    if (!reportFlags) {
        return [];
    }

    const reports = [];
    if (reportFlags.has_blood_report) {
        reports.push('CBC/Blood Report');
    }
    if (reportFlags.has_lft) {
        reports.push('LFT');
    }
    if (reportFlags.has_rft) {
        reports.push('RFT');
    }
    return reports;
}

function formatLabel(value) {
    return String(value).replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
}

function handleCategoryFilter() {
    $('.category-btn').removeClass('active');
    $(this).addClass('active');
    activeCategory = $(this).data('category');
    applySymptomFilters();
}

function applySymptomFilters() {
    const selectedValues = $('#symptoms').val() || [];
    $('#symptoms option').each(function() {
        const value = $(this).attr('value');
        const normalizedText = $(this).text().toLowerCase();
        const shouldShow = selectedValues.includes(value)
            || activeCategory === 'all'
            || SYMPTOM_CATEGORIES[activeCategory].some(token => normalizedText.includes(token));

        $(this).prop('disabled', !shouldShow);
        $(this).prop('hidden', !shouldShow && !selectedValues.includes(value));
    });

    $('#symptoms').trigger('change.select2');
}

function showLoading() {
    $('.loading-overlay').removeClass('hidden');
}

function hideLoading() {
    $('.loading-overlay').addClass('hidden');
}

function showAlert(message, type) {
    $('.alert').remove();

    const alert = $(`<div class="alert alert-${type}">${message}</div>`);
    $('.result-panel').prepend(alert);

    setTimeout(() => {
        alert.fadeOut(250, function() {
            $(this).remove();
        });
    }, 3500);
}

const SYMPTOM_CATEGORIES = {
    common: ['fever', 'headache', 'fatigue', 'pain'],
    pain: ['pain', 'ache', 'sore', 'hurt'],
    respiratory: ['cough', 'breath', 'chest', 'throat'],
    digestive: ['stomach', 'nausea', 'vomit', 'diarr', 'appetite']
};
