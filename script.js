const serviceDetails = {
  dashboards: {
    title: "Custom built dashboards",
    text:
      "Includes KPI planning, data prep, interactive filters, trend visuals, executive summaries, deployment guidance, and documentation for ongoing updates.",
  },
  pipelines: {
    title: "ETL and data pipelines",
    text:
      "Includes file ingestion, cleaning rules, validation checks, transformation logic, refresh logs, error monitoring, and dashboard-ready output tables.",
  },
  statistics: {
    title: "Statistical analysis",
    text:
      "Includes hypothesis testing, regression, subgroup comparisons, forecasting, assumptions checks, plain-language interpretation, and presentation-ready tables.",
  },
  evaluation: {
    title: "Survey and program evaluation",
    text:
      "Includes survey cleaning, response tracking, outcome measures, referral or service metrics, group comparisons, and leadership-ready reporting.",
  },
  legacy: {
    title: "Legacy script transcription",
    text:
      "SAS, SPSS, and R scripts can be translated into readable Python with comments, reproducible outputs, validation checks, and cleaner reporting workflows.",
  },
  predictive: {
    title: "Predictive analytics",
    text:
      "Includes risk scoring, forecast models, segmentation, model diagnostics, feature interpretation, and monitoring views for non-technical decision makers.",
  },
};

const detailPanel = document.querySelector("#service-detail");
const serviceCards = document.querySelectorAll(".service-card");

serviceCards.forEach((card) => {
  card.addEventListener("click", () => {
    const detail = serviceDetails[card.dataset.detail];
    serviceCards.forEach((item) => item.classList.remove("active"));
    card.classList.add("active");
    detailPanel.innerHTML = `<h3>${detail.title}</h3><p>${detail.text}</p>`;
  });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

function googleTranslateElementInit() {
  if (!window.google || !window.google.translate) {
    return;
  }

  new window.google.translate.TranslateElement(
    { pageLanguage: "en", layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE },
    "google_translate_element"
  );
}

function setGoogleTranslateCookie(languageCode) {
  const value = languageCode === "en" ? "/en/en" : `/en/${languageCode}`;
  const expires = "expires=Fri, 31 Dec 9999 23:59:59 GMT";
  document.cookie = `googtrans=${value}; ${expires}; path=/`;
  document.cookie = `googtrans=${value}; ${expires}; domain=${window.location.hostname}; path=/`;
}

function chooseWebsiteLanguage(languageCode) {
  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    combo.value = languageCode;
    combo.dispatchEvent(new Event("change"));
    return;
  }

  setGoogleTranslateCookie(languageCode);
  window.location.reload();
}

const languageWidget = document.querySelector("[data-language-widget]");

if (languageWidget) {
  document.addEventListener("click", (event) => {
    if (!languageWidget.contains(event.target)) {
      languageWidget.removeAttribute("open");
    }
  });
}

document.querySelectorAll("[data-translate-lang]").forEach((button) => {
  button.addEventListener("click", () => {
    chooseWebsiteLanguage(button.dataset.translateLang || "en");
  });
});

const conversionOptions = {
  csv: "Ready for dashboard import, Excel export, and cleaned CSV output.",
  xls: "Ready for Excel cleanup, CSV export, and dashboard preparation.",
  xlsx: "Ready for Excel cleanup, CSV export, and dashboard preparation.",
  pdf: "Can be reviewed for table extraction, text extraction, summaries, or report-ready conversion.",
  doc: "Can be prepared for PDF, plain text, structured notes, or report content extraction.",
  docx: "Can be prepared for PDF, plain text, structured notes, or report content extraction.",
  txt: "Ready for structured text cleanup, CSV preparation, summaries, or report content extraction.",
  json: "Ready for flattening into tables, CSV export, and dashboard-ready data.",
  png: "Can be prepared for image review, OCR text extraction, or report-ready assets.",
  jpg: "Can be prepared for image review, OCR text extraction, or report-ready assets.",
  jpeg: "Can be prepared for image review, OCR text extraction, or report-ready assets.",
};

function formatFileSize(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  const units = ["bytes", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size = size / 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "programmetrics-output.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function filenameFromDisposition(disposition) {
  if (!disposition) {
    return "";
  }

  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match ? match[1] : "";
}

function setFileInputFile(input, file) {
  const transfer = new DataTransfer();
  transfer.items.add(file);
  input.files = transfer.files;
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char]));
}

function renderStudioDashboardPreview(analysis, targetShell = null) {
  const shell = targetShell || document.getElementById("studio-preview-shell");
  const empty = targetShell ? null : document.getElementById("studio-preview-empty");
  if (!shell || !analysis) {
    return;
  }

  if (empty) {
    empty.style.display = "none";
  }

  const missingEntries = Object.entries(analysis.missing_values || {}).filter(([, count]) => Number(count) > 0);
  const categoryEntries = Object.entries(analysis.category_summary || {}).filter(([field]) => !isStudioBadVisualField(field, studioDisplayName(analysis, field))).sort(([a], [b]) => (a === dashboardConfig.groupField ? -1 : b === dashboardConfig.groupField ? 1 : studioFieldScore(b, analysis, "category") - studioFieldScore(a, analysis, "category")));
  const previewRows = analysis.preview_rows || [];
  const previewColumns = previewRows.length ? Object.keys(previewRows[0]).slice(0, 6) : [];

  shell.replaceChildren();
  shell.classList.add("visible");

  const header = document.createElement("div");
  header.className = "dashboard-preview-header";
  header.innerHTML = `<span>Preview with your real file</span><strong>${escapeHtml(analysis.source_file || "Uploaded file")}</strong>`;
  shell.appendChild(header);

  const stats = document.createElement("div");
  stats.className = "dashboard-kpi-grid";
  [
    ["Rows", analysis.rows ?? 0],
    ["Columns", analysis.columns ?? 0],
    ["Duplicates", analysis.duplicate_rows ?? 0],
    ["Fields Missing", missingEntries.length],
  ].forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "dashboard-kpi-card";
    card.innerHTML = `<strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span>`;
    stats.appendChild(card);
  });
  shell.appendChild(stats);

  const answerPanel = document.createElement("section");
  answerPanel.className = "dashboard-preview-panel";
  answerPanel.innerHTML = `<h4>What this dashboard tells me</h4><div class="dashboard-insight-cards">${insightCards.map((insight) => `<article>${escapeHtml(insight)}</article>`).join("")}</div>`;
  shell.appendChild(answerPanel);

  const visualGrid = document.createElement("div");
  visualGrid.className = "dashboard-visual-grid";

  const categoryPanel = document.createElement("section");
  categoryPanel.className = "dashboard-preview-panel";
  categoryPanel.innerHTML = "<h4>Top category chart</h4>";
  if (categoryEntries.length) {
    const selectedCategoryField = dashboardConfig.groupField || dashboardConfig.reasonField || categoryEntries[0]?.[0];
    const column = selectedCategoryField || categoryEntries[0]?.[0];
    const counts = analysis.category_summary?.[column] || categoryEntries[0]?.[1] || {};
    const maxCount = Math.max(...Object.values(counts).map(Number), 1);
    const label = document.createElement("p");
    label.className = "dashboard-chart-label";
    label.textContent = column;
    categoryPanel.appendChild(label);
    Object.entries(counts).slice(0, 6).forEach(([name, count]) => {
      const row = document.createElement("div");
      row.className = "dashboard-bar-row";
      row.innerHTML = `<span>${escapeHtml(name)}</span><div><i style="width:${Math.max(8, Math.round((Number(count) / maxCount) * 100))}%"></i></div><b>${escapeHtml(count)}</b>`;
      categoryPanel.appendChild(row);
    });
  } else {
    categoryPanel.innerHTML += "<p>No categorical chart fields were detected yet.</p>";
  }
  categoryPanel.dataset.dashboardTab = "visuals";
  visualGrid.appendChild(categoryPanel);
  if (analysis.recipe === "surveyReferral") {
    const surveyFields = Object.assign({}, getSurveyVisualFields(analysis), { date: dashboardConfig.trendField || getSurveyVisualFields(analysis).date, organization: dashboardConfig.groupField || getSurveyVisualFields(analysis).organization, reason: dashboardConfig.reasonField || getSurveyVisualFields(analysis).reason, age: dashboardConfig.numericField || getSurveyVisualFields(analysis).age });
    const surveyKpiPanel = document.createElement("section");
    surveyKpiPanel.className = "dashboard-preview-panel dashboard-tile-wide survey-dashboard-tile";
    surveyKpiPanel.dataset.dashboardTab = "visuals";
    const usableRecords = usableSurveyRecordCount(analysis, surveyFields);
    const significantFindings = [surveyFields.organization, surveyFields.reason, surveyFields.date, missingEntries.length ? "Missing response patterns" : ""].filter(Boolean).length;
    surveyKpiPanel.innerHTML = `<h4>Survey / Referral Dashboard</h4><div class="survey-kpi-row"><div><strong>${escapeHtml(analysis.rows || 0)}</strong><span>Response count</span></div><div><strong>${escapeHtml(usableRecords)}</strong><span>Usable records</span></div><div><strong>${escapeHtml(significantFindings)}</strong><span>Significant findings</span></div><div><strong>${escapeHtml(dateSummary.length ? formatStudioDate(dateSummary[0].start) : "Not detected")}</strong><span>Earliest date</span></div></div><p>ProgramMetrics detected survey-style fields and prioritized response counts, readable question labels, referral or denial trends, organization comparison, and missing response quality checks.</p>`;
    visualGrid.appendChild(surveyKpiPanel);

    if (surveyFields.organization) {
      const counts = topCountsForField(analysis, surveyFields.organization, locked ? 5 : 10);
      const maxOrg = Math.max(...counts.map(([, count]) => Number(count)), 1);
      const orgPanel = document.createElement("section");
      orgPanel.className = "dashboard-preview-panel dashboard-tile";
      orgPanel.dataset.dashboardTab = "visuals";
      orgPanel.innerHTML = `<h4>Shelter / Organization Comparison</h4><p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, surveyFields.organization))}</p>${counts.map(([name, count]) => `<div class="dashboard-bar-row"><span>${escapeHtml(name)}</span><div><i style="width:${pct((Number(count) / maxOrg) * 100)}"></i></div><b>${escapeHtml(count)}</b></div>`).join("")}`;
      visualGrid.appendChild(orgPanel);
    }

    if (surveyFields.reason) {
      const counts = topCountsForField(analysis, surveyFields.reason, locked ? 5 : 8);
      const total = counts.reduce((sum, [, count]) => sum + Number(count), 0) || 1;
      const reasonPanel = document.createElement("section");
      reasonPanel.className = "dashboard-preview-panel dashboard-tile";
      reasonPanel.dataset.dashboardTab = "visuals";
      reasonPanel.innerHTML = `<h4>Referral / Denial Reason Distribution</h4><div class="dashboard-donut-list">${counts.map(([name, count]) => `<span><i style="--share:${Math.max(8, Math.round((Number(count) / total) * 100))}%"></i><b>${escapeHtml(name)}</b><em>${escapeHtml(count)}</em></span>`).join("")}</div>`;
      visualGrid.appendChild(reasonPanel);
    }

    if (surveyFields.organization && surveyFields.reason && surveyFields.organization !== surveyFields.reason) {
      const crosstab = crossTabCounts(analysis, surveyFields.organization, surveyFields.reason, locked ? 4 : 6, locked ? 4 : 5);
      if (crosstab.rows.length && crosstab.columns.length) {
        const matrixPanel = document.createElement("section");
        matrixPanel.className = "dashboard-preview-panel dashboard-tile-wide analytics-matrix-panel";
        matrixPanel.dataset.dashboardTab = "visuals";
        matrixPanel.innerHTML = `<h4>Segment Breakdown Matrix</h4><p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, surveyFields.organization))} by ${escapeHtml(studioDisplayName(analysis, surveyFields.reason))}</p><div class="analytics-matrix"><table><thead><tr><th>${escapeHtml(studioDisplayName(analysis, surveyFields.organization))}</th>${crosstab.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${crosstab.rows.map((rowName) => `<tr><th>${escapeHtml(rowName)}</th>${crosstab.columns.map((columnName) => `<td>${escapeHtml(crosstab.matrix[rowName]?.[columnName] || 0)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        visualGrid.appendChild(matrixPanel);
      }
    }

    if (surveyFields.age && analysis.numeric_summary?.[surveyFields.age]?.histogram) {
      const bins = analysis.numeric_summary[surveyFields.age].histogram;
      const maxAge = Math.max(...bins.map((bin) => bin.count), 1);
      const agePanel = document.createElement("section");
      agePanel.className = "dashboard-preview-panel dashboard-tile";
      agePanel.dataset.dashboardTab = "visuals";
      agePanel.innerHTML = `<h4>Youth Age Distribution</h4><div class="dashboard-trend-bars histogram-bars">${bins.map((bin) => `<div><i style="height:${pct((bin.count / maxAge) * 100)}"></i><span>${escapeHtml(bin.label)}</span><b>${escapeHtml(bin.count)}</b></div>`).join("")}</div>`;
      visualGrid.appendChild(agePanel);
    }
  }

  const missingPanel = document.createElement("section");
  missingPanel.className = "dashboard-preview-panel";
  missingPanel.innerHTML = "<h4>Missing value focus</h4>";
  if (missingEntries.length) {
    const maxMissing = Math.max(...missingEntries.map(([, count]) => Number(count)), 1);
    missingEntries.slice(0, 6).forEach(([column, count]) => {
      const row = document.createElement("div");
      row.className = "dashboard-bar-row missing-bar";
      row.innerHTML = `<span>${escapeHtml(column)}</span><div><i style="width:${Math.max(8, Math.round((Number(count) / maxMissing) * 100))}%"></i></div><b>${escapeHtml(count)}</b>`;
      missingPanel.appendChild(row);
    });
  } else {
    missingPanel.innerHTML += "<p>No missing values were detected in table-ready fields.</p>";
  }
  missingPanel.dataset.dashboardTab = "missing";
  visualGrid.appendChild(missingPanel);

  const missingPercentPanel = document.createElement("section");
  missingPercentPanel.className = `dashboard-preview-panel dashboard-tile${canPreviewFeature("missingReview", preview) ? "" : " locked-preview-panel"}`;
  missingPercentPanel.dataset.dashboardTab = "missing";
  missingPercentPanel.innerHTML = "<h4>Top Fields by Missing Percentage</h4>";
  if (missingPercentEntries.length) {
    missingPercentEntries.slice(0, locked ? 5 : 10).forEach(([column, percent]) => {
      missingPercentPanel.innerHTML += `<div class="dashboard-bar-row missing-bar"><span>${escapeHtml(studioDisplayName(analysis, column))}</span><div><i style="width:${pct(percent)}"></i></div><b>${escapeHtml(percent)}%</b></div>`;
    });
  } else {
    missingPercentPanel.innerHTML += "<p>No fields have coded missing values.</p>";
  }
  visualGrid.appendChild(missingPercentPanel);

  const sampleMissingPanel = document.createElement("section");
  sampleMissingPanel.className = "dashboard-preview-panel dashboard-tile-wide";
  sampleMissingPanel.dataset.dashboardTab = "missing";
  sampleMissingPanel.innerHTML = `<h4>Sample Rows with Missing Values</h4><p>These examples show why missing rows and missing cells are different.</p>${detailList((missingProfile.sampleRows || []).slice(0, locked ? 4 : 8).map((row) => `Row ${row.row}: ${row.missingFields} missing cells - ${row.preview}`))}`;
  visualGrid.appendChild(sampleMissingPanel);

  const heatmapPanel = document.createElement("section");
  heatmapPanel.className = "dashboard-preview-panel dashboard-tile";
  heatmapPanel.dataset.dashboardTab = "visuals";
  heatmapPanel.innerHTML = `<h4>Field Completeness Heatmap</h4><div class="field-heatmap">${Object.entries(missingProfile.byColumn || {}).slice(0, 48).map(([column, count]) => { const complete = analysis.rows ? Math.round(100 - (Number(count) / analysis.rows) * 100) : 100; return `<span title="${escapeHtml(studioDisplayName(analysis, column))}: ${complete}% complete" style="--complete:${complete}%">${escapeHtml(studioDisplayName(analysis, column).slice(0, 14))}</span>`; }).join("")}</div>`;
  visualGrid.appendChild(heatmapPanel);
  shell.appendChild(visualGrid);

  const cleaningPanel = document.createElement("section");
  cleaningPanel.className = "dashboard-preview-panel";
  const cleaningItems = (analysis.cleaning_steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  cleaningPanel.innerHTML = `<h4>Automatic cleaning checks</h4><ul>${cleaningItems}</ul>`;
  shell.appendChild(cleaningPanel);

  if (previewRows.length && previewColumns.length) {
    const tablePanel = document.createElement("section");
    tablePanel.className = "dashboard-preview-panel dashboard-table-panel";
    const head = previewColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
    const rows = previewRows.slice(0, 6).map((row) => `<tr>${previewColumns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>`).join("");
    tablePanel.innerHTML = `<h4>Data preview</h4><div class="dashboard-table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
    shell.appendChild(tablePanel);
  }
}

function renderInsightPanel(panel, analysis) {
  if (!panel || !analysis) {
    return;
  }

  const missingEntries = Object.entries(analysis.missing_values || {}).filter(([, count]) => count > 0);
  panel.replaceChildren();

  const title = document.createElement("h4");
  title.textContent = "Report build status";
  panel.appendChild(title);

  const answer = document.createElement("p");
  answer.textContent = "Dashboard preview generated. Review the visual report panel, then download a report/export if needed.";
  panel.appendChild(answer);

  const stats = document.createElement("div");
  stats.className = "insight-stats";
  [
    ["Rows", analysis.rows],
    ["Columns", analysis.columns],
    ["Duplicates", analysis.duplicate_rows],
    ["Fields Missing Values", missingEntries.length],
  ].forEach(([label, value]) => {
    const stat = document.createElement("span");
    stat.innerHTML = `<strong>${value ?? 0}</strong>${label}`;
    stats.appendChild(stat);
  });
  panel.appendChild(stats);
  panel.classList.add("visible");
  renderStudioDashboardPreview(analysis);
}
function setupFileConverter(inputId, resultId, languageId, formatId, buttonId, analyzeButtonId, insightPanelId) {
  const input = document.getElementById(inputId);
  const result = document.getElementById(resultId);
  const language = document.getElementById(languageId);
  const format = document.getElementById(formatId);
  const button = document.getElementById(buttonId);
  const analyzeButton = document.getElementById(analyzeButtonId);
  const insightPanel = document.getElementById(insightPanelId);
  const uploadZone = input ? input.closest(".upload-zone") : null;
  const convertLabel = button ? button.textContent.trim() : "Convert file";
  const analyzeLabel = analyzeButton ? analyzeButton.textContent.trim() : "Analyze file";

  if (!input || !result) {
    return;
  }

  const updateResult = () => {
    if (inputId === "studio-file-converter-input" && input.files && input.files[0]) {
      activeStudioExampleAnalysis = null;
      activeStudioUploadedAnalysis = null;
      activeStudioRawImport = null;
      activeStudioDataSetup = null;
      activeStudioDashboardConfig = null;
      const setupPanel = document.getElementById("studio-data-setup-panel");
      if (setupPanel) setupPanel.hidden = true;
    }
    const file = input.files && input.files[0];
    const selectedLanguage = language ? language.value : "English";
    const selectedFormat = format ? format.options[format.selectedIndex].text : "Text report";

    if (!file) {
      result.textContent = `Select a file to see ${selectedLanguage} conversion options.`;
      return;
    }

    const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "unknown";
    const option = conversionOptions[extension] || "Custom conversion review available for this file type.";
    const languageNote = selectedLanguage === "English"
      ? "English output selected."
      : `${selectedLanguage} output selected for translated dashboard labels, summaries, and reports.`;

    const summary = document.createElement("small");
    summary.textContent = `${formatFileSize(file.size)} | .${extension} | ${selectedFormat} | ${option} ${languageNote}`;
    result.textContent = file.name;
    result.appendChild(summary);
    if (inputId === "studio-file-converter-input") {
      setStudioAnalysisStatus("Ready to analyze");
      updateStudioDownloadButton();
    }
  };

  const submitFile = async (endpoint) => {
    const file = input.files && input.files[0];
    if (!file) {
      result.textContent = "Choose or drop a file first.";
      return null;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("language", language ? language.value : "English");
    formData.append("format", format ? format.value : "txt");
    if (inputId === "studio-file-converter-input") {
      const unlocked = getUnlockedStudioAccess();
      formData.append("access", unlocked.access);
      formData.append("plan", unlocked.label);
    }

    const response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let message = endpoint.includes("analyze") ? "Analysis failed." : "Conversion failed.";
      try {
        const payload = await response.json();
        message = payload.error || message;
      } catch (error) {
        message = await response.text();
      }
      throw new Error(message);
    }

    return response;
  };

  const convertFile = async () => {
    if (inputId === "studio-file-converter-input") {
      await studioDownloadCurrentOutput(input, result, format, language, button, convertLabel);
      return;
    }
    if (button) {
      button.disabled = true;
      button.textContent = "Converting...";
    }
    result.textContent = "Uploading to ProgramMetrics API...";

    try {
      const response = await submitFile("/api/convert");
      if (!response) {
        return;
      }
      const blob = await response.blob();
      const filename = filenameFromDisposition(response.headers.get("Content-Disposition"));
      downloadBlob(blob, filename);
      result.textContent = `Converted file downloaded${filename ? `: ${filename}` : "."}`;
    } catch (error) {
      result.textContent = `${error.message} Start the local ProgramMetrics API server, then try again.`;
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = convertLabel;
      }
    }
  };

  const analyzeFile = async () => {
    if (inputId === "studio-file-converter-input") {
      await analyzeStudioUploadedFile(input, result, analyzeButton, analyzeLabel, insightPanel);
      return;
    }
    if (analyzeButton) {
      analyzeButton.disabled = true;
      analyzeButton.textContent = "Analyzing...";
    }
    result.textContent = "Checking data quality and generating insights...";

    try {
      const response = await submitFile("/api/analyze");
      if (!response) {
        return;
      }
      const payload = await response.json();
      renderInsightPanel(insightPanel, payload.analysis);
      result.textContent = "Dashboard preview generated. Review the visual panel and download a report/export when ready.";
    } catch (error) {
      result.textContent = `${error.message} Analysis works best with CSV, Excel, and JSON table files.`;
    } finally {
      if (analyzeButton) {
        analyzeButton.disabled = false;
        analyzeButton.textContent = analyzeLabel;
      }
    }
  };

  input.addEventListener("change", () => {
    updateResult();
    if (inputId === "studio-file-converter-input" && input.files && input.files[0]) {
      analyzeFile();
    }
  });

  if (language) {
    language.addEventListener("change", updateResult);
  }

  if (format) {
    format.addEventListener("change", updateResult);
  }

  if (button) {
    button.addEventListener("click", convertFile);
  }

  if (analyzeButton) {
    analyzeButton.addEventListener("click", analyzeFile);
  }

  if (uploadZone) {
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        uploadZone.classList.add("drag-over");
      });
    });

    ["dragleave", "drop"].forEach((eventName) => {
      uploadZone.addEventListener(eventName, (event) => {
        event.preventDefault();
        uploadZone.classList.remove("drag-over");
      });
    });

    uploadZone.addEventListener("drop", (event) => {
      const file = event.dataTransfer.files && event.dataTransfer.files[0];
      if (file) {
        setFileInputFile(input, file);
      }
    });
  }
}

let activeStudioExampleAnalysis = null;
let activeStudioUploadedAnalysis = null;
let activeStudioRawImport = null;
let activeStudioDataSetup = null;
let activeStudioDashboardConfig = null;
let activeBrandLogoDataUrl = "";
let activeStudioFeatureKey = "packageSelection";
let activeStudioPackageId = "data-clean";
let activeStudioLevelId = "essential";

const studioPackageLevelInsights = {
  essential: "Know what is wrong with your data.",
  professional: "Understand what your data says.",
  premium: "Explain the story behind the data.",
  complete: "Present actionable insights to leadership.",
  executive: "Present actionable insights to leadership.",
  custom: "Build a custom executive analytics system."
};

const analyticsPackages = [
  {
    id: "data-clean",
    name: "Data Clean Package",
    shortName: "Data Clean",
    startingPrice: 49,
    description: "Prepare messy spreadsheets for reporting.",
    bestFor: ["Cleaning spreadsheets", "Missing-value review", "Duplicate checks", "File validation"],
    previewFocus: "Cleaned file readiness, missingness, duplicates, validation, and data quality scoring.",
    levels: [
      { id: "essential", name: "Essential", price: 49, deliverables: ["Cleaned CSV", "Missing value report", "Duplicate report", "Data quality score", "Basic validation summary"], exports: ["csv", "missing_csv", "duplicate_csv", "json", "summary"] },
      { id: "professional", name: "Professional", price: 59, deliverables: ["Excel workbook", "Data dictionary", "Missing value coding report", "Field type analysis", "Cleaning recommendations"], exports: ["xlsx", "dictionary_xlsx", "missing_csv", "json", "summary"] },
      { id: "premium", name: "Premium", price: 69, deliverables: ["Interactive cleaning dashboard", "Before/after comparisons", "Downloadable quality report", "Data profile report", "Branded PDF summary"], exports: ["html", "pdf", "png", "json", "summary"] },
      { id: "complete", name: "Complete", price: 79, deliverables: ["Interactive HTML dashboard", "Executive data quality summary", "Audit trail", "Processing log", "ZIP package"], exports: ["zip", "html", "pdf", "csv", "missing_csv", "duplicate_csv", "dictionary_xlsx", "json", "summary"] }
    ]
  },
  {
    id: "management-dashboard",
    name: "Management Dashboard Package",
    shortName: "Management Dashboard",
    startingPrice: 199,
    description: "Create dashboards and executive-ready reports.",
    bestFor: ["Program managers", "Directors", "Grant reporting", "Monthly reporting"],
    previewFocus: "Operational KPIs, executive summaries, dashboard pages, charts, and management reporting deliverables.",
    levels: [
      { id: "essential", name: "Essential", price: 199, deliverables: ["Interactive dashboard", "Executive PDF", "Word report", "KPI dashboard", "PNG dashboard image"], exports: ["html", "pdf", "docx", "png", "summary"] },
      { id: "professional", name: "Professional", price: 229, deliverables: ["Multiple dashboard pages", "Additional charts", "Organization branding", "Executive summary", "Recommendations"], exports: ["html", "pdf", "docx", "pptx", "png", "json"] },
      { id: "premium", name: "Premium", price: 249, deliverables: ["Presentation graphics", "Executive infographic", "Dashboard thumbnails", "Interactive navigation", "Expanded analytics"], exports: ["zip", "html", "pdf", "docx", "pptx", "png", "json"] }
    ]
  },
  {
    id: "analytics",
    name: "Analytics Package",
    shortName: "Analytics",
    startingPrice: 499,
    description: "Generate statistical summaries, trends, and deeper insights.",
    bestFor: ["Analysts", "Evaluators", "Researchers", "Quality improvement teams"],
    previewFocus: "Statistical summaries, trend analysis, forecasts, outlier review, correlations, and recommendations.",
    levels: [
      { id: "essential", name: "Essential", price: 499, deliverables: ["Statistical analysis", "Trend analysis", "Forecasts", "Descriptive statistics", "Recommendations"], exports: ["html", "pdf", "xlsx", "json", "summary"] },
      { id: "professional", name: "Professional", price: 599, deliverables: ["Correlation analysis", "Advanced charts", "Outlier review", "Benchmark comparisons", "Expanded narrative"], exports: ["zip", "html", "pdf", "docx", "xlsx", "png", "json"] },
      { id: "premium", name: "Premium", price: 699, deliverables: ["Predictive insights", "Multi-page analytics workbook", "Advanced statistical appendix", "Publication-quality graphics", "Reusable workflow template"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"] }
    ]
  },
  {
    id: "executive-intelligence",
    name: "Executive Intelligence Package",
    shortName: "Executive Intelligence",
    startingPrice: 1999,
    description: "Create a complete board-ready reporting suite.",
    bestFor: ["Leadership", "Funders", "Board meetings", "Government reporting"],
    previewFocus: "Board-ready dashboards, AI-style narratives, presentation-ready visuals, and executive reporting suites.",
    levels: [
      { id: "essential", name: "Essential", price: 1999, deliverables: ["Board-ready dashboard", "Executive PDF", "PowerPoint", "Word report", "HTML dashboard", "AI narrative"], exports: ["zip", "html", "pdf", "docx", "pptx", "png", "json"] },
      { id: "professional", name: "Professional", price: 2499, deliverables: ["Executive briefing", "Board presentation", "Strategic recommendations", "Advanced branding", "Multi-report package"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json"] },
      { id: "premium", name: "Premium", price: 2999, deliverables: ["Publication graphics", "Enhanced executive storytelling", "Multiple dashboard themes", "Presentation-ready visuals", "Expanded appendix"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"] },
      { id: "executive", name: "Complete / Executive", price: 3500, deliverables: ["Unlimited export formats", "Complete branded reporting suite", "Multi-file analytics", "Workflow templates", "Metadata package", "Processing audit", "Consulting-grade deliverables", "Enterprise-ready ZIP package"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "csv", "missing_csv", "duplicate_csv", "dictionary_xlsx", "png", "json", "summary"] }
    ]
  },
  {
    id: "enterprise-suite",
    name: "Enterprise Executive Suite",
    shortName: "Enterprise Suite",
    startingPrice: 3500,
    customQuote: true,
    description: "Custom branded analytics systems, recurring workflows, multi-file analysis, and consulting-grade deliverables.",
    bestFor: ["Custom quote", "Recurring reporting", "Multi-file systems", "Consulting-grade delivery"],
    previewFocus: "Custom executive analytics system planning, workflow design, multi-file strategy, and enterprise package scoping.",
    levels: [
      { id: "custom", name: "Custom Quote", price: 3500, displayPrice: "$3,500+", deliverables: ["Custom branded analytics system", "Recurring workflow design", "Multi-file analysis", "Consulting-grade deliverables", "Enterprise implementation plan"], exports: ["zip", "html", "pdf", "docx", "pptx", "xlsx", "png", "json", "summary"] }
    ]
  }
];

const studioExportCatalog = {
  zip: "ZIP Package: Everything",
  html: "Interactive Dashboard HTML",
  pdf: "Executive Summary PDF",
  docx: "Word Executive Report DOCX",
  pptx: "PowerPoint Presentation PPTX",
  xlsx: "Excel Workbook XLSX",
  csv: "Cleaned Data CSV",
  missing_csv: "Missing Value Report CSV",
  duplicate_csv: "Duplicate Review CSV",
  dictionary_xlsx: "Field Dictionary XLSX",
  png: "Dashboard / Infographic Image",
  json: "JSON Metadata",
  summary: "Processing Summary"
};

function flattenStudioPackages() {
  const plans = {};
  let access = 1;
  analyticsPackages.forEach((pkg) => {
    pkg.levels.forEach((level) => {
      const key = `${pkg.id}-${level.id}`;
      plans[key] = {
        ...level,
        key,
        packageId: pkg.id,
        packageName: pkg.name,
        packageShortName: pkg.shortName,
        packageDescription: pkg.description,
        bestFor: pkg.bestFor,
        previewFocus: pkg.previewFocus,
        customQuote: Boolean(pkg.customQuote),
        access: access++,
        label: `${pkg.name} - ${level.name}`,
        priceLabel: level.displayPrice || `$${Number(level.price).toLocaleString()}`,
        insightPromise: studioPackageLevelInsights[level.id] || studioPackageLevelInsights.essential,
        summary: `${studioPackageLevelInsights[level.id] || "Preview your selected deliverables."} ${pkg.description}`,
      };
    });
  });
  return plans;
}

const studioPackageSummaries = flattenStudioPackages();
const legacyStudioPlanMap = {
  t1l1: "data-clean-essential",
  t1l2: "data-clean-professional",
  t1l3: "management-dashboard-essential",
  t2l1: "management-dashboard-professional",
  t2l2: "management-dashboard-premium",
  t2l3: "analytics-essential",
  t3: "analytics-premium",
  t4: "executive-intelligence-executive"
};
const studioFeatureCards = {
  packageSelection: { title: "Analytics Package Selection", outputType: "selected_package", previewPlan: "data-clean-essential", requiredAccess: 1, actionLabel: "Export package", lockedAction: "Upgrade to export", lockedCopy: "Preview the selected package with your real file. Upgrade only when you are ready to export." }
};
const studioFeatureRequirements = {
  upload: 1,
  conversion: 1,
  duplicateChecks: studioPackageSummaries["data-clean-essential"].access,
  missingReview: studioPackageSummaries["data-clean-essential"].access,
  cleanupNotes: studioPackageSummaries["data-clean-professional"].access,
  cleanedExport: studioPackageSummaries["data-clean-essential"].access,
  report: studioPackageSummaries["management-dashboard-essential"].access,
  dashboard: studioPackageSummaries["management-dashboard-essential"].access,
  branded: studioPackageSummaries["management-dashboard-professional"].access,
  jsonPackage: studioPackageSummaries["data-clean-essential"].access,
  translatedReport: studioPackageSummaries["management-dashboard-professional"].access,
  reusableWorkflow: studioPackageSummaries["analytics-premium"].access,
  recurringReport: studioPackageSummaries["analytics-professional"].access,
  workflowActivation: studioPackageSummaries["executive-intelligence-executive"].access,
  advancedAnalytics: studioPackageSummaries["analytics-essential"].access,
};
const studioOutputRequirements = { selected_package: 1 };

function normalizeStudioPlanKey(value) {
  return studioPackageSummaries[value] ? value : legacyStudioPlanMap[value] || "data-clean-essential";
}

function getStudioPackage(packageId = activeStudioPackageId) {
  return analyticsPackages.find((pkg) => pkg.id === packageId) || analyticsPackages[0];
}

function getStudioPlanFromSelection(packageId = activeStudioPackageId, levelId = activeStudioLevelId) {
  const pkg = getStudioPackage(packageId);
  const level = pkg.levels.find((item) => item.id === levelId) || pkg.levels[0];
  return studioPackageSummaries[`${pkg.id}-${level.id}`] || Object.values(studioPackageSummaries)[0];
}

function setActiveStudioPlan(planKey) {
  const normalized = normalizeStudioPlanKey(planKey);
  const plan = studioPackageSummaries[normalized] || studioPackageSummaries["data-clean-essential"];
  activeStudioPackageId = plan.packageId;
  activeStudioLevelId = plan.id;
  return plan;
}

function populateStudioPlanSelect(select, includeNone = false) {
  if (!select) return;
  const rawValue = select.value;
  const currentValue = rawValue === "none" ? "none" : normalizeStudioPlanKey(rawValue);
  const options = [];
  if (includeNone) options.push(`<option value="none">No current package</option>`);
  analyticsPackages.forEach((pkg) => {
    const optionHtml = pkg.levels.map((level) => {
      const plan = studioPackageSummaries[`${pkg.id}-${level.id}`];
      return `<option value="${escapeHtml(plan.key)}" data-access="${escapeHtml(plan.access)}">${escapeHtml(plan.packageShortName)} - ${escapeHtml(level.name)} - ${escapeHtml(plan.priceLabel)}</option>`;
    }).join("");
    options.push(`<optgroup label="${escapeHtml(pkg.name)}">${optionHtml}</optgroup>`);
  });
  select.innerHTML = options.join("");
  if (includeNone && currentValue === "none") select.value = "none";
  else select.value = studioPackageSummaries[currentValue] ? currentValue : "data-clean-essential";
}

function setupStudioPackageAccess() {
  const accessSelect = document.getElementById("studio-access-select");
  const packageSelect = document.getElementById("studio-package-select");
  if (!packageSelect && !accessSelect && !document.getElementById("studio-package-grid")) return;

  populateStudioPlanSelect(accessSelect);
  populateStudioPlanSelect(packageSelect);

  const packageCard = document.getElementById("active-package-card");
  const packageLabel = document.getElementById("studio-package-label");
  const packageGrid = document.getElementById("studio-package-grid");
  const levelGrid = document.getElementById("studio-level-grid");
  const deliverablesList = document.getElementById("studio-deliverables-list");
  const exportPreviewList = document.getElementById("studio-export-preview-list");
  const comparison = document.getElementById("studio-package-comparison");
  const selectedSummary = document.getElementById("studio-selected-package-summary");
  const gatedItems = document.querySelectorAll("[data-required-access]");
  const storageKey = "programmetrics_unlocked_plan";

  const params = new URLSearchParams(window.location.search);
  const checkoutAccess = params.get("access") || params.get("plan");
  if (checkoutAccess && studioPackageSummaries[normalizeStudioPlanKey(checkoutAccess)]) {
    sessionStorage.setItem(storageKey, normalizeStudioPlanKey(checkoutAccess));
  }

  const storedAccess = normalizeStudioPlanKey(sessionStorage.getItem(storageKey) || accessSelect?.value || "data-clean-essential");
  if (accessSelect) accessSelect.value = storedAccess;
  setActiveStudioPlan(normalizeStudioPlanKey(packageSelect?.value || storedAccess));
  if (packageSelect) packageSelect.value = getStudioPlanFromSelection().key;

  const currentUnlocked = () => studioPackageSummaries[normalizeStudioPlanKey(accessSelect?.value)] || studioPackageSummaries["data-clean-essential"];
  const currentPreview = () => getStudioPlanFromSelection();

  const renderPackageCards = () => {
    if (!packageGrid) return;
    packageGrid.innerHTML = analyticsPackages.map((pkg) => {
      const selected = pkg.id === activeStudioPackageId;
      const best = pkg.bestFor.slice(0, 4).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
      const deliverables = pkg.levels[pkg.levels.length - 1].deliverables.slice(0, 4).map((item) => `<span>${escapeHtml(item)}</span>`).join("");
      return `<button class="studio-package-card${selected ? " is-selected" : ""}" type="button" data-package-id="${escapeHtml(pkg.id)}"><span class="package-card-kicker">Starting at ${escapeHtml(pkg.customQuote ? "$3,500+" : `$${pkg.startingPrice}`)}</span><strong>${escapeHtml(pkg.name)}</strong><p>${escapeHtml(pkg.description)}</p><em>Best for</em><ul>${best}</ul><div class="package-deliverable-preview">${deliverables}</div><b>${escapeHtml(pkg.customQuote ? "Contact for custom quote" : "Select package")}</b></button>`;
    }).join("");
    packageGrid.querySelectorAll("[data-package-id]").forEach((button) => {
      button.addEventListener("click", () => {
        const pkg = getStudioPackage(button.dataset.packageId);
        activeStudioPackageId = pkg.id;
        activeStudioLevelId = pkg.levels[0].id;
        applyAccess(true);
      });
    });
  };

  const renderLevelCards = () => {
    if (!levelGrid) return;
    const pkg = getStudioPackage();
    levelGrid.innerHTML = pkg.levels.map((level) => {
      const plan = studioPackageSummaries[`${pkg.id}-${level.id}`];
      const selected = level.id === activeStudioLevelId;
      return `<button class="studio-level-card${selected ? " is-selected" : ""}" type="button" data-level-id="${escapeHtml(level.id)}"><span>${escapeHtml(level.name)}</span><strong>${escapeHtml(plan.priceLabel)}</strong><p>${escapeHtml(plan.insightPromise)}</p><small>${escapeHtml(level.deliverables.slice(0, 3).join(" | "))}</small></button>`;
    }).join("");
    levelGrid.querySelectorAll("[data-level-id]").forEach((button) => {
      button.addEventListener("click", () => {
        activeStudioLevelId = button.dataset.levelId;
        applyAccess(true);
      });
    });
  };

  const renderComparison = () => {
    if (!comparison) return;
    const rows = [
      ["Cleaned data", ["Included", "Included", "Included", "Included"]],
      ["Missing value report", ["Included", "Included", "Included", "Included"]],
      ["Duplicate review", ["Included", "Included", "Included", "Included"]],
      ["Dashboard", ["Premium+", "Included", "Included", "Included"]],
      ["PDF report", ["Premium+", "Included", "Included", "Included"]],
      ["Word report", ["-", "Included", "Professional+", "Included"]],
      ["PowerPoint", ["-", "Premium", "Premium", "Included"]],
      ["Advanced analytics", ["-", "Premium", "Included", "Included"]],
      ["Forecasting", ["-", "Premium", "Essential+", "Included"]],
      ["AI narrative", ["-", "Professional+", "Professional+", "Included"]],
      ["Branding", ["Premium+", "Professional+", "Premium", "Included"]],
      ["ZIP package", ["Complete", "Premium", "Professional+", "Included"]]
    ];
    comparison.innerHTML = `<h4>Package comparison</h4><div class="studio-comparison-table"><table><thead><tr><th>Deliverable</th><th>Data Clean</th><th>Management Dashboard</th><th>Analytics</th><th>Executive Intelligence</th></tr></thead><tbody>${rows.map(([name, values]) => `<tr><th>${escapeHtml(name)}</th>${values.map((value) => `<td>${value === "Included" ? "✓" : escapeHtml(value)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  };

  function applyAccess(refreshPreview = false) {
    const plan = getStudioPlanFromSelection();
    const unlocked = currentUnlocked();
    const lockedPreview = shouldWatermark(plan, unlocked);
    if (packageSelect) packageSelect.value = plan.key;
    const format = document.getElementById("studio-output-format");
    if (format) format.value = "selected_package";
    if (packageLabel) packageLabel.textContent = "Analytics Package Studio";
    renderPackageCards();
    renderLevelCards();
    renderComparison();

    if (selectedSummary) {
      selectedSummary.innerHTML = `<div><span>Selected package</span><strong>${escapeHtml(plan.packageName)}</strong></div><div><span>Output level</span><strong>${escapeHtml(plan.name)} - ${escapeHtml(plan.priceLabel)}</strong></div><div><span>Preview status</span><strong>${lockedPreview ? "Preview only" : "Ready to export"}</strong></div><p>${escapeHtml(plan.insightPromise)}</p>`;
    }
    if (packageCard) {
      packageCard.innerHTML = `<div><span>Selected package</span><strong>${escapeHtml(plan.packageShortName)}</strong></div><div><span>Output level</span><strong>${escapeHtml(plan.name)} - ${escapeHtml(plan.priceLabel)}</strong></div><div><span>Export access</span><strong>${lockedPreview ? "Upgrade to export" : "Download available"}</strong></div><small>${escapeHtml(plan.previewFocus)}</small>`;
    }
    if (deliverablesList) deliverablesList.innerHTML = plan.deliverables.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
    if (exportPreviewList) exportPreviewList.innerHTML = (plan.exports || []).map((kind) => `<li>${escapeHtml(studioExportCatalog[kind] || kind)}</li>`).join("");

    gatedItems.forEach((item) => {
      const required = Number(item.dataset.requiredAccess || "1");
      const unlockedItem = accessValue(unlocked) >= required;
      item.classList.toggle("is-locked", !unlockedItem);
      item.classList.toggle("is-unlocked", unlockedItem);
    });
    updateStudioDownloadButton();
    updateStudioBrandingVisibility?.();
    if (refreshPreview && activeStudioUploadedAnalysis) {
      refreshActiveStudioPreview(`Previewing ${plan.packageName} - ${plan.name}.`);
    }
  }

  accessSelect?.addEventListener("change", () => {
    if (accessSelect.value && studioPackageSummaries[normalizeStudioPlanKey(accessSelect.value)]) {
      accessSelect.value = normalizeStudioPlanKey(accessSelect.value);
      sessionStorage.setItem(storageKey, accessSelect.value);
    }
    applyAccess(true);
  });
  packageSelect?.addEventListener("change", () => {
    setActiveStudioPlan(packageSelect.value);
    applyAccess(true);
  });
  document.getElementById("studio-output-format")?.addEventListener("change", updateStudioDownloadButton);
  applyAccess(false);
}

function getUnlockedStudioAccess() {
  const accessSelect = document.getElementById("studio-access-select");
  return studioPackageSummaries[normalizeStudioPlanKey(accessSelect?.value)] || studioPackageSummaries["data-clean-essential"];
}

function getStudioAccess() {
  const packageSelect = document.getElementById("studio-package-select");
  if (packageSelect?.value) setActiveStudioPlan(packageSelect.value);
  return getStudioPlanFromSelection();
}

function accessValue(level) {
  if (typeof level === "number") return level;
  if (typeof level === "string") return studioPackageSummaries[normalizeStudioPlanKey(level)]?.access || 0;
  return Number(level?.access || 0);
}

function getLevelLabelByAccess(requiredAccess) {
  const entry = Object.values(studioPackageSummaries).find((plan) => plan.access === Number(requiredAccess));
  return entry ? `${entry.packageShortName} - ${entry.name}` : `Package access ${requiredAccess}`;
}

function setStudioAnalysisStatus(step, isComplete = false) {
  const status = document.getElementById("studio-analysis-status");
  if (!status) return;
  status.classList.toggle("is-complete", isComplete);
  status.innerHTML = `<span>${escapeHtml(step)}</span>`;
}

function waitForStudioStatus() {
  return new Promise((resolve) => setTimeout(resolve, 130));
}

async function runStudioStatusSteps(steps) {
  for (const step of steps) {
    setStudioAnalysisStatus(step);
    await waitForStudioStatus();
  }
}

function getSelectedStudioFeature() {
  const plan = getStudioAccess();
  return {
    title: `${plan.packageName} - ${plan.name} Preview`,
    outputType: "selected_package",
    previewPlan: plan.key,
    requiredAccess: plan.access,
    actionLabel: plan.customQuote ? "Contact for quote" : "Export package",
    lockedAction: plan.customQuote ? "Contact for custom quote" : `Upgrade to export ${plan.name} - ${plan.priceLabel}`,
    lockedCopy: `${plan.packageName} can be previewed with your real file. Upgrade only when you are ready to export ${plan.name} deliverables.`,
  };
}

function updateStudioDownloadButton() {
  const button = document.getElementById("studio-convert-button");
  if (!button) return;
  const plan = getStudioAccess();
  const unlockedOutput = canDownloadOutput("selected_package", getUnlockedStudioAccess());
  button.textContent = unlockedOutput ? "Export package" : `Upgrade to export - ${plan.priceLabel}`;
  button.classList.toggle("is-output-locked", !unlockedOutput);
  if (unlockedOutput) {
    button.removeAttribute("data-checkout-url");
    button.removeAttribute("aria-label");
  } else {
    button.dataset.checkoutUrl = getCheckoutUrlForOutput("selected_package");
    button.setAttribute("aria-label", `Upgrade to export ${plan.packageName} ${plan.name} for ${plan.priceLabel}.`);
  }
}

function canUploadRealFile(unlockedLevel) {
  return accessValue(unlockedLevel) >= studioFeatureRequirements.upload;
}

function canPreviewFeature(feature, selectedPreviewLevel) {
  return accessValue(selectedPreviewLevel) >= (studioFeatureRequirements[feature] || 1);
}

function canDownloadOutput(outputType, unlockedLevel) {
  const required = outputType === "selected_package" ? accessValue(getStudioAccess()) : getRequiredLevelForOutput(outputType);
  return accessValue(unlockedLevel) >= required;
}

function canUseFullRows(unlockedLevel) {
  return accessValue(unlockedLevel) >= studioFeatureRequirements.cleanedExport;
}

function shouldWatermark(selectedPreviewLevel, unlockedLevel) {
  return accessValue(selectedPreviewLevel) > accessValue(unlockedLevel);
}

function getRequiredLevelForOutput(outputType) {
  if (outputType === "selected_package") return accessValue(getStudioAccess());
  return studioOutputRequirements[outputType] || accessValue(getStudioAccess());
}

function getPlanKeyForAccess(requiredAccess) {
  return Object.keys(studioPackageSummaries).find((key) => studioPackageSummaries[key].access === accessValue(requiredAccess)) || getStudioAccess().key;
}

function getCheckoutUrlForOutput(outputType) {
  const targetPlan = outputType === "selected_package" ? getStudioAccess().key : getPlanKeyForAccess(getRequiredLevelForOutput(outputType));
  return `checkout.html?plan=${encodeURIComponent(targetPlan)}`;
}

function syncPreviewToOutputFormat() {
  const packageSelect = document.getElementById("studio-package-select");
  if (packageSelect) packageSelect.value = getStudioAccess().key;
}
function canUseBranding(unlockedLevel) {
  return accessValue(unlockedLevel) >= studioFeatureRequirements.branded;
}

function canExportBrandedReport(unlockedLevel) {
  return canUseBranding(unlockedLevel);
}

function getBrandingFieldValue(id) {
  const field = document.getElementById(id);
  return field ? String(field.value || "").trim() : "";
}

function getBrandingSettings() {
  const unlocked = getUnlockedStudioAccess();
  const preview = getStudioAccess();
  const settings = {
    reportName: getBrandingFieldValue("studio-brand-title") || getBrandingFieldValue("studio-brand-org"),
    organization: getBrandingFieldValue("studio-brand-org"),
    programName: getBrandingFieldValue("studio-brand-program"),
    subtitle: getBrandingFieldValue("studio-brand-subtitle"),
    reportDate: getBrandingFieldValue("studio-brand-date"),
    logoDataUrl: activeBrandLogoDataUrl,
    primaryColor: getBrandingFieldValue("studio-brand-primary") || "#2563eb",
    accentColor: getBrandingFieldValue("studio-brand-accent") || "#14b8a6",
    secondaryColor: getBrandingFieldValue("studio-brand-secondary") || "#0f766e",
    font: getBrandingFieldValue("studio-brand-font") || "Inter / system sans",
    style: getBrandingFieldValue("studio-brand-style") || "Clean and professional",
    preparedFor: getBrandingFieldValue("studio-brand-prepared-for"),
    preparedBy: getBrandingFieldValue("studio-brand-prepared-by"),
    footerNote: getBrandingFieldValue("studio-brand-footer"),
    confidentialFooter: getBrandingFieldValue("studio-brand-confidential"),
    contact: getBrandingFieldValue("studio-brand-contact"),
    website: getBrandingFieldValue("studio-brand-website"),
    mission: getBrandingFieldValue("studio-brand-mission"),
    executiveNotes: getBrandingFieldValue("studio-brand-executive-notes"),
    canExport: canExportBrandedReport(unlocked),
    visibleInPreview: accessValue(preview) >= studioFeatureRequirements.branded,
  };
  settings.hasBranding = Boolean(settings.reportName || settings.organization || settings.programName || settings.subtitle || settings.logoDataUrl || settings.preparedFor || settings.preparedBy || settings.footerNote || settings.confidentialFooter || settings.contact || settings.website || settings.mission || settings.executiveNotes);
  settings.previewOnly = settings.visibleInPreview && !settings.canExport;
  return settings;
}

function applyBrandingToPreview(brandingSettings) {
  const branding = brandingSettings || getBrandingSettings();
  if (!branding.visibleInPreview) return null;
  return {
    ...branding,
    title: branding.reportName || "ProgramMetrics Studio Report",
    subtitle: branding.subtitle || "Dashboard preview from your uploaded file",
    lockLabel: "Branding preview \u2014 upgrade required to export",
  };
}

function studioExportOptionsHtml(locked = false) {
  const plan = getStudioAccess();
  const lock = locked ? "Locked - " : "";
  const exportKinds = plan.exports && plan.exports.length ? plan.exports : ["html", "pdf", "csv", "json"];
  return `<div class="studio-export-menu" data-export-locked="${locked ? "true" : "false"}">
    <label>
      <span>Export menu</span>
      <select class="studio-export-kind">
        ${exportKinds.map((kind) => `<option value="${escapeHtml(kind)}">${escapeHtml(lock + (studioExportCatalog[kind] || kind))}</option>`).join("")}
      </select>
    </label>
    <button class="button mini studio-export-action" type="button">${locked ? "Export locked" : "Export selected package"}</button>
  </div>`;
}
function studioUpgradeButtonHtml(outputType = getSelectedStudioFeature().outputType) {
  const plan = getStudioAccess();
  return `<a class="button mini secondary-mini studio-upgrade-action" href="${escapeHtml(getCheckoutUrlForOutput(outputType))}">Upgrade to export ${escapeHtml(plan.name)} - ${escapeHtml(plan.priceLabel)}</a>`;
}
function showStudioMessage(title, message, actionHtml = "") {
  showStudioDetailPanel(title, `<p>${escapeHtml(message)}</p>${actionHtml}`);
}

function setupStudioExportMenus(root = document) {
  root.querySelectorAll(".studio-export-menu").forEach((menu) => {
    const button = menu.querySelector(".studio-export-action");
    const select = menu.querySelector(".studio-export-kind");
    if (!button || !select || button.dataset.bound === "true") return;
    button.dataset.bound = "true";
    button.addEventListener("click", () => {
      if (menu.dataset.exportLocked === "true") {
        showStudioMessage("Export locked", "This export is locked. You can preview this dashboard, but full downloads require upgrade.", studioUpgradeButtonHtml());
        return;
      }
      downloadStudioExport(select.value);
    });
  });
}

function csvFromObjects(rows) {
  if (!rows || !rows.length) return "";
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row || {}).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [columns.map(quote).join(","), ...rows.map((row) => columns.map((column) => quote(row[column])).join(","))].join("\r\n");
}

function missingReportCsv(analysis) {
  const rows = Object.entries(analysis.missing_values || {}).map(([column, missing]) => ({
    column,
    missing_cells: missing,
    missing_percent: analysis.rows ? Math.round((Number(missing) / Number(analysis.rows)) * 1000) / 10 : 0,
  }));
  return csvFromObjects(rows);
}

function duplicateReportCsv(analysis) {
  const duplicateRows = (analysis.duplicate_samples || []).length ? analysis.duplicate_samples : [{ duplicate_rows: analysis.duplicate_rows || 0, method: "Full-row match across previewed columns" }];
  return csvFromObjects(duplicateRows);
}

function fieldDictionaryRows(analysis) {
  const columns = analysis.column_names || analysis.detected_fields || [];
  const numeric = analysis.numeric_summary || {};
  const missing = analysis.missing_values || {};
  const dateFields = new Set((analysis.date_summary || []).map((item) => item.column));
  return columns.map((column) => ({
    field: column,
    type: dateFields.has(column) ? "date" : numeric[column] ? "numeric" : "text/category",
    missing_cells: missing[column] || 0,
    suggested_use: dateFields.has(column) ? "Trend analysis" : numeric[column] ? "Measures and distributions" : "Grouping, filters, labels, or notes",
  }));
}

function metadataJson(analysis) {
  return JSON.stringify({
    generatedBy: "ProgramMetrics Studio",
    sourceFile: analysis.source_file,
    rows: analysis.rows,
    columns: analysis.columns,
    qualityScore: analysis.quality_score,
    qualityBreakdown: analysis.quality_breakdown,
    dateSummary: analysis.date_summary,
    topMissingColumns: analysis.top_missing_columns,
    fieldDictionary: fieldDictionaryRows(analysis),
    recommendations: analysis.cleaning_steps,
  }, null, 2);
}

function executiveSummaryHtml(analysis) {
  const branding = applyBrandingToPreview(getBrandingSettings());
  const header = brandingReportHeaderHtml(branding) || `<header><h1>ProgramMetrics Executive Analytics Package</h1><p>${escapeHtml(analysis.source_file || "Uploaded file")}</p></header>`;
  return `<!doctype html><html><head><meta charset="utf-8"><title>ProgramMetrics Executive Analytics</title><style>body{font-family:Arial,sans-serif;margin:0;background:#eef4fb;color:#071525}.page{max-width:1160px;margin:0 auto;padding:34px}header,.tile{background:#fff;border:1px solid #dbe4ef;border-radius:14px;padding:22px;margin:0 0 18px;box-shadow:0 18px 40px rgba(15,23,42,.08)}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.kpis strong{display:block;color:#2563eb;font-size:34px}.bar{display:grid;grid-template-columns:180px 1fr 54px;gap:10px;align-items:center;margin:9px 0}.bar i{display:block;height:12px;border-radius:999px;background:#14b8a6}@media(max-width:800px){.kpis{grid-template-columns:1fr}.bar{grid-template-columns:1fr}}</style></head><body><main class="page">${header}<section class="tile"><h2>What this dashboard tells me</h2><p>${escapeHtml(analysis.answer || "")}</p></section><section class="kpis"><div class="tile"><strong>${escapeHtml(analysis.rows || 0)}</strong>Rows</div><div class="tile"><strong>${escapeHtml(analysis.columns || 0)}</strong>Columns</div><div class="tile"><strong>${escapeHtml(analysis.missing_value_count || 0)}</strong>Missing values</div><div class="tile"><strong>${escapeHtml(analysis.quality_score || "-")}</strong>Quality score</div></section><section class="tile"><h2>Recommended actions</h2><ul>${(analysis.cleaning_steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul></section></main></body></html>`;
}

function executiveSvg(analysis) {
  const quality = Number(analysis.quality_score) || 0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#eef4fb"/><rect x="54" y="54" width="1092" height="567" rx="28" fill="#fff" stroke="#dbe4ef"/><text x="90" y="122" font-family="Arial" font-size="34" font-weight="700" fill="#071525">ProgramMetrics Executive Analytics</text><text x="90" y="164" font-family="Arial" font-size="19" fill="#53647f">${escapeHtml(analysis.source_file || "Uploaded file")}</text><g transform="translate(90 218)"><rect width="220" height="130" rx="18" fill="#f8fafc" stroke="#dbe4ef"/><text x="24" y="50" font-family="Arial" font-size="42" font-weight="700" fill="#2563eb">${escapeHtml(analysis.rows || 0)}</text><text x="24" y="90" font-family="Arial" font-size="18" fill="#53647f">Rows</text></g><g transform="translate(340 218)"><rect width="220" height="130" rx="18" fill="#f8fafc" stroke="#dbe4ef"/><text x="24" y="50" font-family="Arial" font-size="42" font-weight="700" fill="#2563eb">${escapeHtml(analysis.columns || 0)}</text><text x="24" y="90" font-family="Arial" font-size="18" fill="#53647f">Columns</text></g><g transform="translate(590 218)"><rect width="220" height="130" rx="18" fill="#f8fafc" stroke="#dbe4ef"/><text x="24" y="50" font-family="Arial" font-size="42" font-weight="700" fill="#2563eb">${escapeHtml(analysis.missing_value_count || 0)}</text><text x="24" y="90" font-family="Arial" font-size="18" fill="#53647f">Missing Values</text></g><g transform="translate(840 218)"><rect width="220" height="130" rx="18" fill="#ecfeff" stroke="#14b8a6"/><text x="24" y="50" font-family="Arial" font-size="42" font-weight="700" fill="#0f766e">${quality}</text><text x="24" y="90" font-family="Arial" font-size="18" fill="#53647f">Quality Score</text></g><text x="90" y="430" font-family="Arial" font-size="23" font-weight="700" fill="#071525">Summary</text><text x="90" y="468" font-family="Arial" font-size="18" fill="#334155">${escapeHtml(String(analysis.answer || "Uploaded data has been analyzed for dashboard-ready reporting.").slice(0, 130))}</text></svg>`;
}

function zipStringBytes(value) {
  return new TextEncoder().encode(String(value));
}

function crc32(bytes) {
  let crc = -1;
  for (let i = 0; i < bytes.length; i += 1) {
    crc ^= bytes[i];
    for (let j = 0; j < 8; j += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ -1) >>> 0;
}

function uint16(value) {
  return [value & 255, (value >>> 8) & 255];
}

function uint32(value) {
  return [value & 255, (value >>> 8) & 255, (value >>> 16) & 255, (value >>> 24) & 255];
}

function buildZipBlob(files) {
  const chunks = [];
  const central = [];
  let offset = 0;
  files.forEach((file) => {
    const name = zipStringBytes(file.name);
    const data = file.bytes || zipStringBytes(file.content || "");
    const crc = crc32(data);
    const local = new Uint8Array([80, 75, 3, 4, ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0), ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0), ...name, ...data]);
    chunks.push(local);
    central.push(new Uint8Array([80, 75, 1, 2, ...uint16(20), ...uint16(20), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0), ...uint32(crc), ...uint32(data.length), ...uint32(data.length), ...uint16(name.length), ...uint16(0), ...uint16(0), ...uint16(0), ...uint16(0), ...uint32(0), ...uint32(offset), ...name]));
    offset += local.length;
  });
  const centralSize = central.reduce((total, item) => total + item.length, 0);
  const end = new Uint8Array([80, 75, 5, 6, ...uint16(0), ...uint16(0), ...uint16(files.length), ...uint16(files.length), ...uint32(centralSize), ...uint32(offset), ...uint16(0)]);
  return new Blob([...chunks, ...central, end], { type: "application/zip" });
}

function buildStudioZipPackage(analysis) {
  const html = executiveSummaryHtml(analysis);
  const csv = csvFromObjects(analysis.preview_rows || []);
  const missing = missingReportCsv(analysis);
  const duplicate = duplicateReportCsv(analysis);
  const dictionaryCsv = csvFromObjects(fieldDictionaryRows(analysis));
  const metadata = metadataJson(analysis);
  const processing = [`Source file: ${analysis.source_file}`, `Rows: ${analysis.rows}`, `Columns: ${analysis.columns}`, `Quality score: ${analysis.quality_score}`, "", ...(analysis.cleaning_steps || [])].join("\r\n");
  const svg = executiveSvg(analysis);
  return buildZipBlob([
    { name: "dashboard/interactive-dashboard.html", content: html },
    { name: "reports/executive-summary.pdf.html", content: html },
    { name: "reports/word-report.docx.html", content: html },
    { name: "reports/data-quality-report.pdf.html", content: html },
    { name: "slides/executive-presentation.pptx.html", content: html },
    { name: "data/cleaned-data.csv", content: csv },
    { name: "data/missing-value-report.csv", content: missing },
    { name: "data/duplicate-review.csv", content: duplicate },
    { name: "data/field-dictionary.xlsx.csv", content: dictionaryCsv },
    { name: "images/dashboard-overview.svg", content: svg },
    { name: "images/chart-images/executive-infographic.svg", content: svg },
    { name: "metadata/metadata.json", content: metadata },
    { name: "metadata/processing-summary.txt", content: processing },
    { name: "README.pdf.html", content: `<h1>ProgramMetrics Executive Analytics Package</h1><p>This browser-generated package includes dashboard, report, data, image, and metadata assets from the current session.</p>` },
  ]);
}

function downloadStudioExport(kind) {
  const analysis = activeStudioUploadedAnalysis || activeStudioExampleAnalysis;
  const feature = getSelectedStudioFeature();
  if (!analysis) return;
  if (!canDownloadOutput(feature.outputType, getUnlockedStudioAccess())) {
    window.location.href = getCheckoutUrlForOutput(feature.outputType);
    return;
  }
  const safeName = String(analysis.source_file || "programmetrics").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "programmetrics";
  const html = executiveSummaryHtml(analysis);
  const exports = {
    zip: [buildStudioZipPackage(analysis), `${safeName}-executive-analytics-package.zip`],
    html: [new Blob([html], { type: "text/html;charset=utf-8" }), `${safeName}-interactive-dashboard.html`],
    pdf: [new Blob([html], { type: "text/html;charset=utf-8" }), `${safeName}-executive-summary-pdf-ready.html`],
    docx: [new Blob([html], { type: "text/html;charset=utf-8" }), `${safeName}-word-report-docx-ready.html`],
    pptx: [new Blob([html], { type: "text/html;charset=utf-8" }), `${safeName}-presentation-pptx-ready.html`],
    xlsx: [new Blob([csvFromObjects(analysis.preview_rows || [])], { type: "text/csv;charset=utf-8" }), `${safeName}-excel-workbook.csv`],
    csv: [new Blob([csvFromObjects(analysis.preview_rows || [])], { type: "text/csv;charset=utf-8" }), `${safeName}-cleaned-data.csv`],
    missing_csv: [new Blob([missingReportCsv(analysis)], { type: "text/csv;charset=utf-8" }), `${safeName}-missing-value-report.csv`],
    duplicate_csv: [new Blob([duplicateReportCsv(analysis)], { type: "text/csv;charset=utf-8" }), `${safeName}-duplicate-review.csv`],
    dictionary_xlsx: [new Blob([csvFromObjects(fieldDictionaryRows(analysis))], { type: "text/csv;charset=utf-8" }), `${safeName}-field-dictionary.csv`],
    png: [new Blob([executiveSvg(analysis)], { type: "image/svg+xml;charset=utf-8" }), `${safeName}-executive-infographic.svg`],
    json: [new Blob([metadataJson(analysis)], { type: "application/json;charset=utf-8" }), `${safeName}-metadata.json`],
    summary: [new Blob([(analysis.cleaning_steps || []).join("\r\n")], { type: "text/plain;charset=utf-8" }), `${safeName}-processing-summary.txt`],
  };
  const [blob, filename] = exports[kind] || exports.zip;
  downloadBlob(blob, filename);
}
function brandingReportHeaderHtml(branding) {
  if (!branding) return "";
  const logo = branding.logoDataUrl ? `<img src="${escapeHtml(branding.logoDataUrl)}" alt="Report logo">` : "";
  const meta = [branding.organization || "", branding.programName || "", branding.preparedFor ? `Prepared for ${branding.preparedFor}` : "", branding.preparedBy ? `Prepared by ${branding.preparedBy}` : "", branding.reportDate || "", branding.style || ""].filter(Boolean).map(escapeHtml).join(" | ");
  return `<header class="brand-report-header" style="border-top-color:${escapeHtml(branding.primaryColor)}"><div>${logo}<div><p>${escapeHtml(branding.style)}</p><h1>${escapeHtml(branding.reportName || "ProgramMetrics Studio Report")}</h1><h2>${escapeHtml(branding.subtitle || "Dashboard preview from your uploaded file")}</h2></div></div><small>${meta}</small></header>`;
}

function getPreviewLimitRows(unlockedLevel, selectedPreviewLevel) {
  const unlocked = accessValue(unlockedLevel);
  const preview = accessValue(selectedPreviewLevel);
  if (preview > unlocked) return 25;
  if (unlocked >= studioFeatureRequirements.cleanedExport) return 250;
  if (unlocked >= studioFeatureRequirements.duplicateChecks) return 50;
  return 25;
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function rowsFromDelimitedText(text) {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim().length);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]).map((header, index) => header || `Column ${index + 1}`);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = values[index] ?? "";
      return row;
    }, {});
  });
}


function parseDelimitedMatrix(text, delimiter = ",") {
  const source = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === delimiter && !quoted) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current.trim());
      if (row.some((value) => String(value || "").trim().length)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  if (row.some((value) => String(value || "").trim().length)) rows.push(row);
  return rows;
}

function cleanStudioFieldLabel(value, fallback) {
  const text = String(value ?? "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text || fallback;
}

function uniqueStudioName(name, used) {
  const base = cleanStudioFieldLabel(name, "Field");
  let candidate = base;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${base} ${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
}

function rowLooksLikeImportMetadata(row) {
  const cells = (row || []).map((value) => String(value || "").trim()).filter(Boolean);
  if (!cells.length) return false;
  const metadataHits = cells.filter((value) => /^(importid|recipient|external|startdate|enddate|status|duration|recordeddate|responseid|locationlatitude|locationlongitude)$/i.test(value) || /^QID\d+/i.test(value) || /^\$?\{.+\}$/.test(value)).length;
  return metadataHits / cells.length > 0.28;
}

function rowLooksLikeCodes(row) {
  const cells = (row || []).map((value) => String(value || "").trim()).filter(Boolean);
  if (!cells.length) return false;
  const codeHits = cells.filter((value) => /^(q\d+|[a-z]+_?\d+|startdate|enddate|status|duration|responseid|recipient)/i.test(value) || /#\d+_\d+/.test(value)).length;
  return codeHits / cells.length > 0.35;
}

function rowLooksLikeLabels(row) {
  const cells = (row || []).map((value) => String(value || "").trim()).filter(Boolean);
  if (!cells.length) return false;
  const longCells = cells.filter((value) => value.length > 18 || /\?|shelter|organization|referral|denial|reason|youth|client|participant|program|date/i.test(value)).length;
  return longCells / cells.length > 0.25;
}

function detectStudioDataSetup(matrix) {
  const firstRows = matrix.slice(0, 8);
  let codeRow = firstRows.findIndex(rowLooksLikeCodes) + 1;
  let labelRow = firstRows.findIndex((row, index) => index + 1 !== codeRow && rowLooksLikeLabels(row)) + 1;
  let metadataRow = firstRows.findIndex(rowLooksLikeImportMetadata) + 1;
  if (!codeRow) codeRow = 1;
  if (!labelRow && matrix.length > 1) labelRow = 2;
  if (!metadataRow && matrix.length > 2 && rowLooksLikeImportMetadata(matrix[2])) metadataRow = 3;
  if (!metadataRow && matrix.length > 2 && (matrix[2] || []).some((value) => /^QID\d+/i.test(String(value || "")))) metadataRow = 3;
  let dataStartsAt = Math.max(codeRow, labelRow || 0, metadataRow || 0) + 1;
  if (codeRow === 1 && labelRow === 2 && (!metadataRow || metadataRow === 3)) dataStartsAt = 4;
  const labelSignals = matrix[labelRow - 1] || [];
  const surveyLike = Boolean(labelRow && labelSignals.some((value) => /shelter|organization|referral|denial|reason|youth|client|participant|program|question|survey/i.test(String(value || "")))) || firstRows.some(rowLooksLikeImportMetadata);
  return {
    codeRow,
    labelRow: labelRow || codeRow,
    dataStartsAt: Math.min(Math.max(dataStartsAt, 2), Math.max(matrix.length, 2)),
    omitRows: metadataRow ? [metadataRow] : [],
    useLabels: surveyLike,
    combineDates: true,
    surveyLike,
    message: surveyLike ? "ProgramMetrics detected survey metadata rows. Review before generating visuals." : "ProgramMetrics detected the likely header and first data row. Review before generating visuals.",
    chartExcludeFields: [],
  };
}

function getStudioSetupOrDefault(matrix) {
  const detected = detectStudioDataSetup(matrix);
  return Object.assign({}, detected, activeStudioDataSetup || {});
}

function parseOmittedRows(value) {
  return String(value || "").split(",").map((item) => Number(item.trim())).filter((item) => Number.isFinite(item) && item > 0);
}

function getDatePartRole(name) {
  const text = String(name || "").toLowerCase();
  if (/\bmonth\b|#1_1|_month|month$/.test(text)) return "month";
  if (/\bday\b|#2_1|_day|day$/.test(text)) return "day";
  if (/\byear\b|#3_1|_year|year$/.test(text)) return "year";
  return "";
}

function dateGroupName(parts) {
  const joined = parts.map((part) => `${part.code} ${part.label}`).join(" ");
  if (/referral|denial/i.test(joined)) return "Referral / Denial Date";
  if (/start/i.test(joined)) return "Start Date";
  if (/end/i.test(joined)) return "End Date";
  return "Combined Date";
}

function buildRowsFromStudioSetup(matrix, setup) {
  const codeRow = matrix[Math.max(0, Number(setup.codeRow || 1) - 1)] || [];
  const labelRow = matrix[Math.max(0, Number(setup.labelRow || setup.codeRow || 1) - 1)] || [];
  const width = Math.max(codeRow.length, labelRow.length, ...matrix.map((row) => row.length));
  const used = new Set();
  const fields = Array.from({ length: width }, (_, index) => {
    const code = cleanStudioFieldLabel(codeRow[index], `Column ${index + 1}`);
    const label = cleanStudioFieldLabel(labelRow[index], code);
    const display = uniqueStudioName(setup.useLabels ? label : code, used);
    return { index, code, label, display, role: getDatePartRole(`${code} ${label}`) };
  });
  const omit = new Set(parseOmittedRows(setup.omitRows || []).concat([Number(setup.codeRow), Number(setup.labelRow)]).filter((row) => row > 0));
  const dataStart = Math.max(1, Number(setup.dataStartsAt || 2));
  const rows = [];
  matrix.forEach((rawRow, rawIndex) => {
    const oneBased = rawIndex + 1;
    if (oneBased < dataStart || omit.has(oneBased)) return;
    const row = {};
    fields.forEach((field) => {
      row[field.display] = rawRow[field.index] ?? "";
    });
    if (Object.values(row).some((value) => String(value ?? "").trim())) rows.push(row);
  });
  const datePartColumns = [];
  const dateCombinationFields = [];
  if (setup.combineDates) {
    for (let index = 0; index < fields.length - 2; index += 1) {
      const group = fields.slice(index, index + 3);
      const roles = group.map((field) => field.role).join("|");
      if (roles === "month|day|year") {
        const name = uniqueStudioName(dateGroupName(group), new Set(Object.keys(rows[0] || {})));
        rows.forEach((row) => {
          const month = Number(row[group[0].display]);
          const day = Number(row[group[1].display]);
          const year = Number(row[group[2].display]);
          row[name] = Number.isFinite(month) && Number.isFinite(day) && Number.isFinite(year) ? `${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}/${year}` : "";
        });
        group.forEach((field) => datePartColumns.push(field.display));
        dateCombinationFields.push({ name, parts: group.map((field) => field.display) });
      }
    }
  }
  const labelMap = fields.reduce((map, field) => {
    map[field.display] = field.label;
    return map;
  }, {});
  dateCombinationFields.forEach((field) => { labelMap[field.name] = field.name; });
  return { rows, labelMap, fields, datePartColumns, dateCombinationFields };
}

function studioDisplayName(analysis, column) {
  return (analysis?.label_map && analysis.label_map[column]) || column;
}

function inferStudioRecipe(rows, columns, labelMap) {
  const joined = columns.concat(Object.values(labelMap || {})).join(" ").toLowerCase();
  if (/survey|question|response|recipient|referral|denial|shelter|organization|youth|participant|client|program/.test(joined)) return "surveyReferral";
  return "business";
}


function getStudioDataSetupPanel() {
  let panel = document.getElementById("studio-data-setup-panel");
  if (!panel) {
    const upload = document.querySelector(".upload-zone");
    panel = document.createElement("section");
    panel.id = "studio-data-setup-panel";
    panel.className = "studio-data-setup-panel";
    panel.hidden = true;
    upload?.insertAdjacentElement("afterend", panel);
  }
  return panel;
}

function renderStudioDataSetupPanel(matrix, setup) {
  const panel = getStudioDataSetupPanel();
  if (!panel || !matrix?.length) return;
  const maxCols = Math.min(8, Math.max(...matrix.slice(0, 10).map((row) => row.length), 1));
  const rowsHtml = matrix.slice(0, 10).map((row, index) => `<tr><th>${index + 1}</th>${Array.from({ length: maxCols }, (_, columnIndex) => `<td>${escapeHtml(row[columnIndex] ?? "")}</td>`).join("")}</tr>`).join("");
  panel.hidden = false;
  panel.innerHTML = `<div class="studio-data-setup-heading"><div><p class="template-label">Data Setup</p><h4>Review import rows before analysis</h4><p>${escapeHtml(setup.message || "Review before generating visuals.")}</p></div><button class="button mini secondary-mini" type="button" id="studio-regenerate-setup">Regenerate visuals</button></div><div class="studio-setup-controls"><label><span>Variable code row</span><input id="studio-setup-code-row" type="number" min="1" value="${escapeHtml(setup.codeRow || 1)}" /></label><label><span>Variable label row</span><input id="studio-setup-label-row" type="number" min="1" value="${escapeHtml(setup.labelRow || 2)}" /></label><label><span>Data starts at row</span><input id="studio-setup-data-row" type="number" min="1" value="${escapeHtml(setup.dataStartsAt || 2)}" /></label><label><span>Rows to omit</span><input id="studio-setup-omit-rows" type="text" value="${escapeHtml((setup.omitRows || []).join(", "))}" placeholder="3, 5" /></label><label><span>Field names in visuals</span><select id="studio-setup-name-mode"><option value="labels" ${setup.useLabels ? "selected" : ""}>Use full labels</option><option value="codes" ${!setup.useLabels ? "selected" : ""}>Use short variable names</option></select></label><label class="studio-setup-check"><input id="studio-setup-combine-dates" type="checkbox" ${setup.combineDates ? "checked" : ""} /><span>Combine month/day/year columns into one date field</span></label></div><div class="studio-setup-table-wrap"><table><thead><tr><th>Row</th>${Array.from({ length: maxCols }, (_, index) => `<th>Column ${index + 1}</th>`).join("")}</tr></thead><tbody>${rowsHtml}</tbody></table></div>`;
  panel.querySelector("#studio-regenerate-setup")?.addEventListener("click", regenerateStudioFromSetupControls);
}

function collectStudioDataSetupControls() {
  const current = activeStudioDataSetup || {};
  return Object.assign({}, current, {
    codeRow: Number(document.getElementById("studio-setup-code-row")?.value || current.codeRow || 1),
    labelRow: Number(document.getElementById("studio-setup-label-row")?.value || current.labelRow || current.codeRow || 1),
    dataStartsAt: Number(document.getElementById("studio-setup-data-row")?.value || current.dataStartsAt || 2),
    omitRows: parseOmittedRows(document.getElementById("studio-setup-omit-rows")?.value || current.omitRows || ""),
    useLabels: (document.getElementById("studio-setup-name-mode")?.value || (current.useLabels ? "labels" : "codes")) === "labels",
    combineDates: Boolean(document.getElementById("studio-setup-combine-dates")?.checked),
  });
}

function regenerateStudioFromSetupControls() {
  if (!activeStudioRawImport?.matrix) return;
  activeStudioDataSetup = collectStudioDataSetupControls();
  const prepared = buildRowsFromStudioSetup(activeStudioRawImport.matrix, activeStudioDataSetup);
  renderStudioDataSetupPanel(activeStudioRawImport.matrix, activeStudioDataSetup);
  activeStudioUploadedAnalysis = buildStudioAnalysisFromRows(prepared.rows, { name: activeStudioRawImport.fileName, size: activeStudioRawImport.fileSize || 0 }, activeStudioRawImport.sourceKind, Object.assign({}, prepared, { setup: activeStudioDataSetup }));
  renderStudioDashboardPreview(activeStudioUploadedAnalysis);
  renderInsightPanel(document.getElementById("studio-insight-panel"), activeStudioUploadedAnalysis);
  updateStudioDownloadButton();
  const result = document.getElementById("studio-converter-result");
  if (result) result.textContent = `Data setup applied. Missing values and visuals now use data starting at row ${activeStudioDataSetup.dataStartsAt}.`;
}

function isStudioBadVisualField(column, label = column) {
  const text = `${column || ""} ${label || ""}`.toLowerCase();
  return /please enter your name|\bname\b|additional information|click to write|write the question|\btext\b|importid|responseid|recipient|external data|duration|locationlatitude|locationlongitude|startdate|enddate|recordeddate/.test(text);
}

function studioFieldScore(column, analysis, purpose = "category") {
  const label = studioDisplayName(analysis, column);
  const text = `${column || ""} ${label || ""}`.toLowerCase();
  if (isStudioBadVisualField(column, label)) return -1000;
  let score = 0;
  if (/shelter|organization|site|location/.test(text)) score += purpose === "group" ? 120 : 80;
  if (/referral|denial|reason|categor|category|source|agency|placement/.test(text)) score += purpose === "reason" ? 120 : 70;
  if (/gender|race|ethnicity|county|status|outcome/.test(text)) score += 45;
  if (/age|youth/.test(text)) score += purpose === "numeric" ? 80 : 20;
  if (/date|month|year/.test(text)) score += purpose === "date" ? 120 : -20;
  const counts = analysis.category_summary?.[column] || null;
  if (counts) {
    const unique = Object.keys(counts).filter((name) => name !== "Other" && name !== "Missing").length;
    if (unique >= 2 && unique <= 12) score += 25;
    if (unique > 20) score -= 35;
  }
  return score;
}

function sortedStudioFields(analysis, purpose, fields) {
  return (fields || []).slice().sort((a, b) => studioFieldScore(b, analysis, purpose) - studioFieldScore(a, analysis, purpose));
}

function getStudioDashboardConfig(analysis) {
  const categoryFields = Object.keys(analysis.category_summary || {}).filter((field) => !isStudioBadVisualField(field, studioDisplayName(analysis, field)));
  const numericFields = Object.keys(analysis.numeric_summary || {}).filter((field) => !isStudioBadVisualField(field, studioDisplayName(analysis, field)));
  const dateFields = (analysis.date_summary || []).map((item) => item.column);
  const survey = getSurveyVisualFields(analysis);
  const defaults = {
    trendField: survey.date || sortedStudioFields(analysis, "date", dateFields)[0] || "",
    groupField: survey.organization || sortedStudioFields(analysis, "group", categoryFields)[0] || "",
    reasonField: survey.reason || sortedStudioFields(analysis, "reason", categoryFields)[0] || "",
    numericField: survey.age || sortedStudioFields(analysis, "numeric", numericFields)[0] || "",
    missingFocus: (analysis.top_missing_columns || [])[0]?.[0] || "",
  };
  return Object.assign({}, defaults, activeStudioDashboardConfig || {});
}

function studioSelectOptions(fields, selected, analysis, emptyLabel = "Auto select") {
  return [`<option value="">${escapeHtml(emptyLabel)}</option>`].concat((fields || []).map((field) => `<option value="${escapeHtml(field)}" ${field === selected ? "selected" : ""}>${escapeHtml(studioDisplayName(analysis, field))}</option>`)).join("");
}

function applyStudioDashboardControls(container, analysis) {
  container.querySelectorAll("[data-studio-dashboard-control]").forEach((control) => {
    control.addEventListener("change", () => {
      activeStudioDashboardConfig = Object.assign({}, activeStudioDashboardConfig || {}, { [control.dataset.studioDashboardControl]: control.value });
      renderStudioDashboardPreview(analysis);
    });
  });
}

function topCountsForField(analysis, field, limit = 8) {
  const source = analysis.chart_rows || analysis.preview_rows || [];
  return Object.entries(countValues(source, field)).filter(([name]) => name && name !== "Missing" && !/^\{?"?ImportId/i.test(name) && !/^QID\d+/i.test(name)).sort((a, b) => Number(b[1]) - Number(a[1])).slice(0, limit);
}


function crossTabCounts(analysis, rowField, columnField, rowLimit = 6, columnLimit = 5) {
  const source = analysis.chart_rows || analysis.preview_rows || [];
  if (!rowField || !columnField || rowField === columnField) return { rows: [], columns: [], matrix: {} };
  const rowCounts = topCountsForField(analysis, rowField, rowLimit).map(([name]) => name);
  const columnCounts = topCountsForField(analysis, columnField, columnLimit).map(([name]) => name);
  const matrix = {};
  rowCounts.forEach((rowName) => {
    matrix[rowName] = {};
    columnCounts.forEach((columnName) => { matrix[rowName][columnName] = 0; });
  });
  source.forEach((row) => {
    const rowValue = String(row[rowField] || "Missing");
    const columnValue = String(row[columnField] || "Missing");
    if (matrix[rowValue] && Object.prototype.hasOwnProperty.call(matrix[rowValue], columnValue)) matrix[rowValue][columnValue] += 1;
  });
  return { rows: rowCounts, columns: columnCounts, matrix };
}

function concentrationSummary(counts) {
  const entries = (counts || []).map(([, count]) => Number(count)).filter((count) => count > 0);
  const total = entries.reduce((sum, count) => sum + count, 0) || 1;
  const top = entries[0] || 0;
  const topThree = entries.slice(0, 3).reduce((sum, count) => sum + count, 0);
  return { topShare: Math.round((top / total) * 100), topThreeShare: Math.round((topThree / total) * 100), total };
}

function selectedFieldNarrative(analysis, config) {
  const parts = [];
  if (config.groupField) parts.push(`Compare by ${studioDisplayName(analysis, config.groupField)}`);
  if (config.reasonField) parts.push(`break down ${studioDisplayName(analysis, config.reasonField)}`);
  if (config.trendField) parts.push(`trend using ${studioDisplayName(analysis, config.trendField)}`);
  if (config.numericField) parts.push(`profile ${studioDisplayName(analysis, config.numericField)}`);
  return parts.length ? parts.join("; ") : "Choose dashboard variables to customize the analysis.";
}
function usableSurveyRecordCount(analysis, fields) {
  const source = analysis.chart_rows || analysis.preview_rows || [];
  const important = [fields.organization, fields.reason, fields.date, fields.age].filter(Boolean);
  if (!important.length) return Math.max(0, analysis.rows || 0);
  const usableSample = source.filter((row) => important.some((field) => !isStudioMissingValue(row[field]))).length;
  if (!source.length) return 0;
  return Math.round((usableSample / source.length) * (analysis.rows || source.length));
}
function getSurveyVisualFields(analysis) {
  const columns = analysis.column_names || [];
  const find = (patterns) => sortedStudioFields(analysis, "group", columns).find((column) => !isStudioBadVisualField(column, studioDisplayName(analysis, column)) && patterns.some((pattern) => pattern.test(`${column} ${studioDisplayName(analysis, column)}`)));
  return {
    organization: find([/shelter/i, /organization/i, /site/i, /location/i]),
    reason: sortedStudioFields(analysis, "reason", columns).find((column) => !isStudioBadVisualField(column, studioDisplayName(analysis, column)) && [/reason/i, /categor/i, /referral/i, /denial/i, /placement/i].some((pattern) => pattern.test(`${column} ${studioDisplayName(analysis, column)}`))),
    age: sortedStudioFields(analysis, "numeric", Object.keys(analysis.numeric_summary || {})).find((column) => /age|youth/i.test(`${column} ${studioDisplayName(analysis, column)}`)) || find([/age/i, /youth.*age/i]),
    date: sortedStudioFields(analysis, "date", (analysis.date_summary || []).map((item) => item.column))[0] || (analysis.date_summary || [])[0]?.column,
  };
}
function rowsFromJsonText(text) {
  const parsed = JSON.parse(text);
  const records = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.data) ? parsed.data : [parsed];
  return records.map((record) => {
    if (record && typeof record === "object" && !Array.isArray(record)) return record;
    return { value: record };
  });
}

function rowsFromPlainText(text) {
  return text.split(/\r?\n/).filter((line) => line.trim()).map((line, index) => ({ line: index + 1, text: line.trim() }));
}

function normalizeRows(rows) {
  const columns = Array.from(rows.reduce((set, row) => {
    Object.keys(row || {}).forEach((key) => set.add(key));
    return set;
  }, new Set()));
  return rows.map((row) => columns.reduce((clean, column) => {
    clean[column] = row?.[column] ?? "";
    return clean;
  }, {}));
}

function duplicateRowCount(rows) {
  const seen = new Set();
  let duplicates = 0;
  rows.forEach((row) => {
    const key = JSON.stringify(row);
    if (seen.has(key)) duplicates += 1;
    seen.add(key);
  });
  return duplicates;
}

function quantile(sorted, q) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const base = Math.floor(pos);
  const rest = pos - base;
  return sorted[base + 1] !== undefined ? sorted[base] + rest * (sorted[base + 1] - sorted[base]) : sorted[base];
}

function numericColumnSummary(rows, columns) {
  return columns.reduce((summary, column) => {
    const values = rows.map((row) => Number(row[column])).filter((value) => Number.isFinite(value));
    const nonMissingCount = rows.filter((row) => !isStudioMissingValue(row[column])).length;
    if (values.length >= Math.max(3, Math.round(nonMissingCount * 0.7))) {
      const sorted = values.slice().sort((a, b) => a - b);
      const mean = values.reduce((total, value) => total + value, 0) / values.length;
      const variance = values.reduce((total, value) => total + Math.pow(value - mean, 2), 0) / Math.max(1, values.length - 1);
      const q1 = quantile(sorted, 0.25);
      const median = quantile(sorted, 0.5);
      const q3 = quantile(sorted, 0.75);
      const iqr = q3 - q1;
      const lowerFence = q1 - 1.5 * iqr;
      const upperFence = q3 + 1.5 * iqr;
      const binCount = Math.min(8, Math.max(4, Math.ceil(Math.sqrt(values.length))));
      const min = sorted[0];
      const max = sorted[sorted.length - 1];
      const width = Math.max((max - min) / binCount, 1);
      const histogram = Array.from({ length: binCount }, (_, index) => ({ label: `${Math.round(min + width * index)}-${Math.round(index === binCount - 1 ? max : min + width * (index + 1))}`, count: 0 }));
      values.forEach((value) => {
        const index = Math.min(binCount - 1, Math.max(0, Math.floor((value - min) / width)));
        histogram[index].count += 1;
      });
      summary[column] = { min, max, mean, median, q1, q3, standardDeviation: Math.sqrt(Math.max(0, variance)), outlierCount: values.filter((value) => value < lowerFence || value > upperFence).length, validCount: values.length, missingCount: rows.length - values.length, histogram };
    }
    return summary;
  }, {});
}

function parseStudioDateValue(value) {
  const text = String(value ?? "").trim();
  if (!text || /^\d+(\.\d+)?$/.test(text)) return null;
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime()) || parsed.getFullYear() < 1900 || parsed.getFullYear() > 2100) return null;
  return parsed;
}

function summarizeDateColumns(rows, columns) {
  const summaries = [];
  columns.forEach((column) => {
    const nonMissing = rows.map((row) => row[column]).filter((value) => !isStudioMissingValue(value));
    const dated = nonMissing.map((value) => parseStudioDateValue(value)).filter(Boolean);
    if (dated.length < Math.max(3, Math.round(nonMissing.length * 0.6))) return;
    const sorted = dated.slice().sort((a, b) => a - b);
    const spanDays = Math.max(1, Math.round((sorted[sorted.length - 1] - sorted[0]) / 86400000));
    const bucketMode = spanDays > 1500 ? "year" : spanDays > 540 ? "quarter" : "month";
    const buckets = dated.reduce((counts, date) => {
      const key = bucketMode === "year" ? `${date.getFullYear()}` : bucketMode === "quarter" ? `${date.getFullYear()} Q${Math.floor(date.getMonth() / 3) + 1}` : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      counts[key] = (counts[key] || 0) + 1;
      return counts;
    }, {});
    summaries.push({ column, count: dated.length, start: sorted[0], end: sorted[sorted.length - 1], buckets, bucketMode, missing: rows.length - dated.length });
  });
  return summaries.sort((a, b) => b.count - a.count);
}

function topCategorySummary(rows, columns, numericColumns, dateColumns) {
  const dateNames = new Set(dateColumns.map((item) => item.column));
  return columns.filter((column) => !numericColumns.includes(column) && !dateNames.has(column)).reduce((summary, column) => {
    const counts = countValues(rows, column);
    const entries = Object.entries(counts).filter(([name]) => name && name !== "Missing").sort((a, b) => Number(b[1]) - Number(a[1]));
    if (entries.length < 2 || entries.length > Math.max(75, rows.length * 0.85)) return summary;
    const top = entries.slice(0, 7);
    const other = entries.slice(7).reduce((total, [, count]) => total + Number(count), 0);
    summary[column] = Object.fromEntries(other ? top.concat([["Other", other]]) : top);
    return summary;
  }, {});
}

function formatStudioDate(date) {
  return date ? date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "not detected";
}

function buildDashboardNarrative({ rows, columns, missingEntries, missingTotal, duplicates, dateSummary, categorySummary, qualityScore, feature, recipe }) {
  const parts = [`This file contains ${rows.length} records across ${columns.length} fields.`];
  if (recipe === "surveyReferral") parts.push("The data appears to track survey, referral, denial, program, or participant responses, so ProgramMetrics is prioritizing response counts, organization comparisons, referral reasons, date trends, and missing response quality checks.");
  if (dateSummary.length) {
    const primary = dateSummary[0];
    parts.push(`${primary.column} ranges from ${formatStudioDate(primary.start)} to ${formatStudioDate(primary.end)}, so a trend view is more useful than individual date bars.`);
  }
  const firstCategory = Object.entries(categorySummary || {})[0];
  if (firstCategory) {
    const [column, counts] = firstCategory;
    const top = Object.entries(counts).slice(0, 3).map(([name, count]) => `${name} (${count})`).join(", ");
    parts.push(`${column} has the clearest category pattern, led by ${top}.`);
  }
  if (missingTotal > 0 && missingEntries.length) {
    const topMissing = missingEntries.slice(0, 3).map(([column, count]) => `${column} (${count} blanks)`).join(", ");
    parts.push(`Missing values are concentrated in ${topMissing}, which may affect reporting accuracy if those fields are required.`);
  } else {
    parts.push("No major missing-value pattern was detected in the previewed fields.");
  }
  if (duplicates > 0) parts.push(`${duplicates} possible duplicate records were found and should be reviewed before export.`);
  parts.push(qualityScore >= 85 ? "The file looks ready for a dashboard after a light review." : qualityScore >= 70 ? "Review missing values and duplicate records before using this for final reporting." : "Clean key fields before relying on this for reporting or client-ready output.");
  parts.push(`${feature.title} is the selected output for this preview.`);
  return parts.join(" ");
}

function showStudioDetailPanel(title, html) {
  let panel = document.getElementById("studio-detail-panel");
  if (!panel) {
    panel = document.createElement("div");
    panel.id = "studio-detail-panel";
    panel.className = "studio-detail-panel";
    panel.innerHTML = `<div class="studio-detail-card"><button type="button" class="studio-detail-close" aria-label="Close details">Close</button><div class="studio-detail-content"></div></div>`;
    document.body.appendChild(panel);
    panel.addEventListener("click", (event) => {
      if (event.target === panel || event.target.classList.contains("studio-detail-close")) panel.classList.remove("visible");
    });
  }
  const content = panel.querySelector(".studio-detail-content");
  if (content) content.innerHTML = `<h3>${escapeHtml(title)}</h3>${html}`;
  panel.classList.add("visible");
}

function detailList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}
function isStudioMissingValue(value, codes = activeStudioMissingCodes) {
  if (value === null || value === undefined) return true;
  const text = String(value).trim();
  return codes.some((code) => String(code).trim() === text);
}

function calculateMissingProfile(rows, columns, codes = activeStudioMissingCodes) {
  const byColumn = {};
  const sampleRows = [];
  let missingCells = 0;
  let missingRows = 0;
  rows.forEach((row, index) => {
    let rowMissing = 0;
    columns.forEach((column) => {
      if (isStudioMissingValue(row[column], codes)) {
        byColumn[column] = (byColumn[column] || 0) + 1;
        missingCells += 1;
        rowMissing += 1;
      } else if (!Object.prototype.hasOwnProperty.call(byColumn, column)) {
        byColumn[column] = 0;
      }
    });
    if (rowMissing > 0) {
      missingRows += 1;
      if (sampleRows.length < 8) sampleRows.push({ row: index + 1, missingFields: rowMissing, preview: columns.slice(0, 4).map((column) => `${studioDisplayName({ label_map: {} }, column)}: ${row[column] ?? ""}`).join(" | ") });
    }
  });
  const totalCells = Math.max(1, rows.length * Math.max(1, columns.length));
  const entries = Object.entries(byColumn).filter(([, count]) => Number(count) > 0).sort((a, b) => Number(b[1]) - Number(a[1]));
  return { byColumn, missingRows, missingCells, missingColumns: entries.length, missingPercent: Math.round((missingCells / totalCells) * 1000) / 10, entries, sampleRows };
}

function buildInsightCards(analysis) {
  const dateSummary = analysis.date_summary || [];
  const missing = analysis.missing_profile || {};
  const insights = [`This file contains ${analysis.rows || 0} records across ${analysis.columns || 0} fields.`];
  if (dateSummary.length) insights.push(`${studioDisplayName(analysis, dateSummary[0].column)} spans ${formatStudioDate(dateSummary[0].start)} to ${formatStudioDate(dateSummary[0].end)}, so monthly trend analysis is recommended.`);
  if (Number(analysis.duplicate_rows) > 0) insights.push(`${analysis.duplicate_rows} possible duplicate records were detected and should be reviewed.`);
  if (Number(missing.missingCells) > 0) insights.push(`${missing.missingColumns || 0} fields contain coded blanks, covering ${missing.missingCells || 0} missing cells across ${missing.missingRows || 0} rows.`);
  insights.push(Number(analysis.quality_score) >= 85 ? "This file is ready for dashboard preview after a light review." : "This file is ready for preview, but should be cleaned before final reporting.");
  return insights.slice(0, 5);
}

function missingDetailHtml(analysis) {
  const profile = analysis.missing_profile || {};
  const entries = profile.entries || [];
  const rows = profile.sampleRows || [];
  return `<p>Missing rows are records that contain at least one blank or coded missing value. Missing cells are the total number of blank or coded missing fields across the dataset. A file can have many missing cells concentrated in the same rows.</p><div class="missing-detail-grid"><b>${escapeHtml(profile.missingRows || 0)}</b><span>Missing rows</span><b>${escapeHtml(profile.missingCells || 0)}</b><span>Missing cells</span><b>${escapeHtml(profile.missingColumns || 0)}</b><span>Fields with blanks</span><b>${escapeHtml(profile.missingPercent || 0)}%</b><span>Missing percent</span></div><h4>Top missing columns</h4>${detailList(entries.slice(0, 10).map(([column, count]) => `${studioDisplayName(analysis, column)}: ${count} missing cells (${analysis.rows ? Math.round((Number(count) / analysis.rows) * 1000) / 10 : 0}%)`))}<h4>Sample rows with missing values</h4>${detailList(rows.map((row) => `Row ${row.row}: ${row.missingFields} missing fields - ${row.preview}`))}<p>Recommendation: review high-missing fields, decide which codes should count as missing, and clean or filter fields before final export.</p>`;
}

function qualityDetailHtml(analysis) {
  const quality = analysis.quality_breakdown || {};
  const items = [["Completeness", quality.completenessScore], ["Duplicate score", quality.duplicateScore], ["Date consistency", quality.dateConsistencyScore], ["Formatting", quality.formattingScore], ["Field usability", quality.requiredCoverageScore], ["Numeric validity", quality.numericValidityScore], ["Categorical usability", quality.categoricalUsabilityScore], ["Outlier check", quality.outlierScore]];
  return `<div class="quality-detail-score"><strong>${escapeHtml(analysis.quality_score || "-")}</strong><span>Overall quality score</span></div><p>Your quality score reflects completeness, duplicates, date consistency, formatting, field usability, numeric validity, categorical usability, and unusual-value checks.</p>${items.map(([label, value]) => `<div class="dashboard-bar-row quality-bar"><span>${escapeHtml(label)}</span><div><i style="width:${Math.max(4, Math.min(100, Number(value) || 0))}%"></i></div><b>${escapeHtml(value ?? "-")}</b></div>`).join("")}`;
}
function buildStudioAnalysisFromRows(rows, file, sourceKind, setupMetadata = {}) {
  const unlocked = getUnlockedStudioAccess();
  const preview = getStudioAccess();
  const feature = getSelectedStudioFeature();
  const normalizedRows = normalizeRows(rows).slice(0, 2000);
  const columns = normalizedRows.length ? Object.keys(normalizedRows[0]) : [];
  const labelMap = setupMetadata.labelMap || {};
  const visualColumns = columns.filter((column) => !(setupMetadata.datePartColumns || []).includes(column));
  const recipe = inferStudioRecipe(normalizedRows, columns, labelMap);
  const originalMissingProfile = calculateMissingProfile(normalizedRows, columns, defaultStudioMissingCodes);
  const missingProfile = calculateMissingProfile(normalizedRows, columns);
  const missingValues = missingProfile.byColumn;
  const numericSummary = numericColumnSummary(normalizedRows, visualColumns);
  const numericColumns = Object.keys(numericSummary);
  const dateSummary = summarizeDateColumns(normalizedRows, visualColumns);
  const categorySummary = topCategorySummary(normalizedRows.slice(0, 500), visualColumns.filter((column) => !isStudioBadVisualField(column, labelMap[column] || column)), numericColumns, dateSummary);
  const dateColumns = new Set(dateSummary.map((item) => item.column));
  const categoricalColumns = Object.keys(categorySummary);
  const fieldTypeCounts = { date: dateSummary.length, numeric: numericColumns.length, categorical: categoricalColumns.length, other: Math.max(0, visualColumns.length - dateSummary.length - numericColumns.length - categoricalColumns.length) };
  const missingTotal = missingProfile.missingCells;
  const duplicates = duplicateRowCount(normalizedRows);
  const totalCells = Math.max(1, normalizedRows.length * Math.max(1, columns.length));
  const completenessScore = Math.max(0, Math.round(100 - (missingTotal / totalCells) * 100));
  const duplicateScore = Math.max(0, Math.round(100 - (duplicates / Math.max(1, normalizedRows.length)) * 100));
  const dateConsistencyScore = dateSummary.length ? Math.min(100, Math.round((dateSummary[0].count / Math.max(1, normalizedRows.length)) * 100)) : 100;
  const requiredCoverageScore = Math.max(0, Math.round(100 - (Object.values(missingValues).filter((count) => Number(count) > normalizedRows.length * 0.25).length / Math.max(1, columns.length)) * 100));
  const formattingScore = Math.max(55, Math.round((completenessScore + requiredCoverageScore) / 2));
  const numericValidityScore = numericColumns.length ? Math.max(60, 100 - Math.round(Object.values(numericSummary).reduce((total, item) => total + (item.outlierCount || 0), 0) / Math.max(1, normalizedRows.length) * 100)) : 92;
  const categoricalUsabilityScore = Math.min(100, Math.max(62, Object.keys(categorySummary).length * 14 + 62));
  const outlierScore = numericColumns.length ? numericValidityScore : 92;
  const qualityScore = Math.round((completenessScore * 0.3) + (duplicateScore * 0.16) + (dateConsistencyScore * 0.12) + (requiredCoverageScore * 0.14) + (formattingScore * 0.1) + (numericValidityScore * 0.09) + (categoricalUsabilityScore * 0.05) + (outlierScore * 0.04));
  const qualityBreakdown = { completenessScore, duplicateScore, dateConsistencyScore, requiredCoverageScore, formattingScore, numericValidityScore, categoricalUsabilityScore, outlierScore };
  const previewLimit = getPreviewLimitRows(unlocked, preview);
  const locked = shouldWatermark(preview, unlocked);
  const missingEntries = missingProfile.entries;
  const narrative = buildDashboardNarrative({ rows: normalizedRows, columns, missingEntries, missingTotal, duplicates, dateSummary, categorySummary, qualityScore, feature, recipe });
  const cleaningSteps = [
    "Detected fields and table shape from the uploaded file",
    canPreviewFeature("duplicateChecks", preview) ? "Reviewed duplicate records" : "Duplicate checks are available in limited preview",
    canPreviewFeature("missingReview", preview) ? "Counted missing values by field" : "Missing-value review is available in limited preview",
    canPreviewFeature("cleanedExport", preview) ? "Prepared cleaned-export preview" : "Cleaned export can be previewed before purchase",
    canPreviewFeature("branded", preview) ? "Mapped branded report sections" : "Branded report structure can be previewed before purchase",
    canPreviewFeature("translatedReport", preview) ? "Prepared translated report setup preview" : "Translated report setup can be previewed before purchase",
    canPreviewFeature("recurringReport", preview) ? "Outlined recurring report setup" : "Recurring report setup can be previewed before purchase",
    canPreviewFeature("workflowActivation", preview) ? "Mapped workflow activation steps" : "Workflow setup can be previewed before purchase",
    canPreviewFeature("advancedAnalytics", preview) ? "Previewed advanced analytics signals" : "Advanced analytics can be previewed before purchase",
  ];

  return {
    is_example: false,
    source_kind: sourceKind,
    source_file: file?.name || "Uploaded file",
    file_size: file ? formatFileSize(file.size) : "Browser session",
    rows: normalizedRows.length,
    columns: columns.length,
    column_names: columns,
    detected_fields: visualColumns,
    duplicate_rows: canPreviewFeature("duplicateChecks", preview) ? duplicates : "Preview locked",
    missing_values: canPreviewFeature("missingReview", preview) ? missingValues : {},
    original_missing_profile: originalMissingProfile,
    missing_profile: missingProfile,
    missing_rows: missingProfile.missingRows,
    missing_value_count: missingTotal,
    missing_columns_count: missingProfile.missingColumns,
    missing_percent: missingProfile.missingPercent,
    missing_codes: activeStudioMissingCodes.slice(),
    label_map: labelMap,
    data_setup: setupMetadata.setup || null,
    setup_message: setupMetadata.setup?.message || "",
    recipe,
    date_part_columns: setupMetadata.datePartColumns || [],
    date_combination_fields: setupMetadata.dateCombinationFields || [],
    numeric_summary: numericSummary,
    category_summary: categorySummary,
    date_summary: dateSummary,
    quality_breakdown: qualityBreakdown,
    top_missing_columns: missingEntries.slice(0, 8),
    preview_rows: normalizedRows.slice(0, previewLimit),
    chart_rows: normalizedRows.slice(0, locked ? Math.min(250, normalizedRows.length) : Math.min(1000, normalizedRows.length)),
    preview_limit: previewLimit,
    quality_score: canPreviewFeature("missingReview", preview) ? qualityScore : "Preview locked",
    cleaning_steps: cleaningSteps,
    package_label: preview.label,
    unlocked_label: unlocked.label,
    preview_label: preview.label,
    watermark: locked,
    locked,
    answer: narrative,
    insights: buildInsightCards({ rows: normalizedRows.length, columns: columns.length, duplicate_rows: duplicates, missing_profile: missingProfile, date_summary: dateSummary, quality_score: qualityScore }),
  };
}

function readStudioFileAsAnalysis(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "txt";
        let rows;
        let sourceKind;
        if (extension === "json") {
          rows = rowsFromJsonText(text);
          sourceKind = "JSON";
          activeStudioRawImport = null;
          resolve(buildStudioAnalysisFromRows(rows, file, sourceKind));
          return;
        }
        if (["csv", "tsv"].includes(extension)) {
          sourceKind = extension.toUpperCase();
          const matrix = parseDelimitedMatrix(text, extension === "tsv" ? "\t" : ",");
          activeStudioRawImport = { matrix, sourceKind, fileName: file.name, fileSize: file.size };
          if (!activeStudioDataSetup) activeStudioDataSetup = detectStudioDataSetup(matrix);
          const prepared = buildRowsFromStudioSetup(matrix, activeStudioDataSetup);
          renderStudioDataSetupPanel(matrix, activeStudioDataSetup);
          resolve(buildStudioAnalysisFromRows(prepared.rows, file, sourceKind, Object.assign({}, prepared, { setup: activeStudioDataSetup })));
          return;
        }
        sourceKind = "Text";
        rows = rowsFromPlainText(text);
        activeStudioRawImport = null;
        resolve(buildStudioAnalysisFromRows(rows, file, sourceKind));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error("The file could not be read in this browser session."));
    reader.readAsText(file);
  });
}
async function analyzeStudioUploadedFile(input, result, analyzeButton, analyzeLabel, insightPanel) {
  const file = input.files && input.files[0];
  if (!canUploadRealFile(getUnlockedStudioAccess())) {
    result.textContent = "Upload is available in Studio. Choose a file to begin.";
    return;
  }
  if (!file) {
    result.textContent = "Choose or drop a file first.";
    return;
  }
  activeStudioExampleAnalysis = null;
  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Previewing...";
  }
  result.textContent = "Processing this file in the current browser session...";
  try {
    await runStudioStatusSteps(["Reading file", "Detecting survey setup", "Detecting columns", "Checking missing values", "Checking duplicates", "Building preview"]);
    activeStudioUploadedAnalysis = await readStudioFileAsAnalysis(file);
    renderStudioDashboardPreview(activeStudioUploadedAnalysis);
    renderInsightPanel(insightPanel, activeStudioUploadedAnalysis);
    const limit = activeStudioUploadedAnalysis.preview_limit;
    setStudioAnalysisStatus("Ready to preview", true);
    updateStudioDownloadButton();
    result.textContent = `${activeStudioUploadedAnalysis.locked ? "Preview only - upgrade to export. " : "Preview generated. "}Showing first ${limit} rows from this browser session.`;
  } catch (error) {
    result.textContent = `${error.message} CSV, JSON, and plain text files can be previewed directly in the browser session.`;
  } finally {
    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.textContent = analyzeLabel;
    }
  }
}

function csvFromRows(rows) {
  if (!rows.length) return "";
  const columns = Object.keys(rows[0]);
  const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  return [columns.map(quote).join(",")].concat(rows.map((row) => columns.map((column) => quote(row[column])).join(","))).join("\n");
}

function reportHtmlFromAnalysis(analysis, formatLabel) {
  const columns = (analysis.preview_rows?.length ? Object.keys(analysis.preview_rows[0]) : []).slice(0, 8);
  const head = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = (analysis.preview_rows || []).map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column])}</td>`).join("")}</tr>`).join("");
  const branding = getBrandingSettings();
  const exportBranding = canExportBrandedReport(getUnlockedStudioAccess()) && (branding.hasBranding || formatLabel === "Branded report");
  const brandedHeader = exportBranding ? brandingReportHeaderHtml(branding) : `<h1>ProgramMetrics Studio ${escapeHtml(formatLabel)}</h1>`;
  const brandedFooter = exportBranding && (branding.footerNote || branding.contact) ? `<footer>${branding.footerNote ? `<p>${escapeHtml(branding.footerNote)}</p>` : ""}${branding.contact ? `<small>${escapeHtml(branding.contact)}</small>` : ""}</footer>` : "";
  const watermark = analysis.watermark ? "body:before{content:'ProgramMetrics Preview';position:fixed;top:42%;left:-10%;right:-10%;transform:rotate(-28deg);font-size:82px;font-weight:900;color:rgba(37,99,235,.16);z-index:9999;pointer-events:none;white-space:nowrap}" : "";
  return `<!doctype html><html><head><meta charset="utf-8"><title>ProgramMetrics Studio ${escapeHtml(formatLabel)}</title><style>body{font-family:Arial,sans-serif;margin:36px;color:#071525;background:#f8fafc;line-height:1.5;position:relative}${watermark}.card,section{background:#fff;border:1px solid #dbe4ef;border-radius:8px;padding:18px;margin:14px 0}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kpis strong{display:block;color:#2563eb;font-size:28px}.brand-report-header{background:#fff;border:1px solid #dbe4ef;border-top:8px solid #2563eb;border-radius:8px;padding:24px;margin-bottom:18px}.brand-report-header>div{display:flex;gap:16px;align-items:center}.brand-report-header img{width:72px;height:72px;object-fit:contain;border:1px solid #dbe4ef;border-radius:8px}.brand-report-header p{margin:0;color:#0f766e;font-weight:700;text-transform:uppercase;font-size:12px}.brand-report-header h1{margin:4px 0;color:#071525}.brand-report-header h2{margin:0;color:#475569;font-size:18px;font-weight:600}.brand-report-header small,footer{color:#64748b}table{width:100%;border-collapse:collapse;background:#fff}th,td{border:1px solid #dbe4ef;padding:8px;text-align:left;font-size:13px}th{background:#eef6ff}@media(max-width:800px){.kpis{grid-template-columns:1fr}.brand-report-header>div{display:block}}</style></head><body>${brandedHeader}<p><strong>Selected output:</strong> ${escapeHtml(getSelectedStudioFeature().title)}</p><p>${escapeHtml(analysis.answer)}</p><div class="kpis"><div class="card"><strong>${escapeHtml(analysis.rows)}</strong>Rows</div><div class="card"><strong>${escapeHtml(analysis.columns)}</strong>Columns</div><div class="card"><strong>${escapeHtml(analysis.duplicate_rows)}</strong>Duplicates</div><div class="card"><strong>${escapeHtml(analysis.quality_score)}</strong>Quality score</div></div><section><h2>Session preview rows</h2><p>Showing first ${escapeHtml(analysis.preview_limit)} rows.</p><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>${brandedFooter}</body></html>`;
}

async function studioDownloadCurrentOutput(input, result, format, language, button, convertLabel) {
  const outputType = getSelectedStudioFeature().outputType;
  const unlocked = getUnlockedStudioAccess();
  const required = getRequiredLevelForOutput(outputType);
  if (!canDownloadOutput(outputType, unlocked)) {
    const checkoutUrl = getCheckoutUrlForOutput(outputType);
    result.innerHTML = `Preview only - upgrade to export. <strong>${escapeHtml(format?.options[format.selectedIndex]?.text || outputType)}</strong> requires ${escapeHtml(getLevelLabelByAccess(required))}. Opening checkout now.`;
    updateStudioDownloadButton();
    window.location.href = checkoutUrl;
    return;
  }
  if (button) {
    button.disabled = true;
    button.textContent = "Preparing...";
  }
  try {
    if (!activeStudioUploadedAnalysis) {
      const file = input.files && input.files[0];
      if (!file) {
        result.textContent = "Choose a file and generate a preview first.";
        return;
      }
      activeStudioUploadedAnalysis = await readStudioFileAsAnalysis(file);
    }
    const analysis = activeStudioUploadedAnalysis;
    if (outputType === "selected_package") {
      const plan = getStudioAccess();
      const preferredExport = (plan.exports || []).includes("zip") ? "zip" : (plan.exports || ["html"])[0];
      downloadStudioExport(preferredExport);
      result.textContent = `Unlocked export prepared for ${plan.packageName} - ${plan.name}.`;
      return;
    }
    let blob;
    let filename;
    if (outputType === "csv") {
      blob = new Blob([csvFromRows(analysis.preview_rows || [])], { type: "text/csv;charset=utf-8" });
      filename = "programmetrics-cleaned-preview.csv";
    } else if (outputType === "advanced_analytics") {
      blob = buildStudioZipPackage(analysis);
      filename = "programmetrics-executive-analytics-package.zip";
    } else if (outputType === "json" || outputType === "reusable_workflow" || outputType === "workflow_package") {
      blob = new Blob([metadataJson(analysis)], { type: "application/json;charset=utf-8" });
      filename = outputType === "reusable_workflow" ? "programmetrics-reusable-report-workflow.json" : outputType === "workflow_package" ? "programmetrics-workflow-package.json" : "programmetrics-studio-package.json";
    } else if (outputType === "dashboard_summary" || outputType === "quality_review" || outputType === "branded_report") {
      blob = new Blob([reportHtmlFromAnalysis(analysis, getSelectedStudioFeature().title)], { type: "text/html;charset=utf-8" });
      filename = outputType === "dashboard_summary" ? "programmetrics-dashboard-summary.html" : outputType === "quality_review" ? "programmetrics-quality-review.html" : "programmetrics-branded-report.html";
    } else if (["html", "pdf"].includes(outputType)) {
      blob = new Blob([reportHtmlFromAnalysis(analysis, outputType === "pdf" ? "PDF-ready report" : "HTML report")], { type: "text/html;charset=utf-8" });
      filename = outputType === "pdf" ? "programmetrics-pdf-ready-report.html" : "programmetrics-report.html";
    } else {
      const text = `${analysis.source_file}\nSelected output: ${getSelectedStudioFeature().title}\nRows: ${analysis.rows}\nColumns: ${analysis.columns}\nQuality score: ${analysis.quality_score}\n\n${analysis.cleaning_steps.join("\n")}`;
      blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      filename = "programmetrics-session-summary.txt";
    }
    downloadBlob(blob, filename);
    result.textContent = `Unlocked download prepared: ${filename}. Download any outputs before ending your session.`;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = convertLabel;
    }
  }
}

function renderStudioDashboardPreview(analysis, targetShell = null) {
  const shell = targetShell || document.getElementById("studio-preview-shell");
  const empty = targetShell ? null : document.getElementById("studio-preview-empty");
  if (!shell || !analysis) return;
  if (empty) empty.style.display = "none";

  const unlocked = getUnlockedStudioAccess();
  const preview = getStudioAccess();
  const feature = getSelectedStudioFeature();
  const dashboardConfig = getStudioDashboardConfig(analysis);
  const chartRows = analysis.chart_rows || analysis.preview_rows || [];
  const categoryFieldsForControls = Object.keys(analysis.category_summary || {}).filter((field) => !isStudioBadVisualField(field, studioDisplayName(analysis, field)));
  const numericFieldsForControls = Object.keys(analysis.numeric_summary || {}).filter((field) => !isStudioBadVisualField(field, studioDisplayName(analysis, field)));
  const dateFieldsForControls = (analysis.date_summary || []).map((item) => item.column);
  const missingFieldsForControls = Object.keys(analysis.missing_profile?.byColumn || {}).filter((field) => !isStudioBadVisualField(field, studioDisplayName(analysis, field)));
  const locked = shouldWatermark(preview, unlocked) || Boolean(analysis.watermark);
  const previewRows = analysis.preview_rows || [];
  const previewColumns = previewRows.length ? Object.keys(previewRows[0]).slice(0, 6) : [];
  const missingEntries = (analysis.top_missing_columns || Object.entries(analysis.missing_values || {})).filter(([, count]) => Number(count) > 0);
  const categoryEntries = Object.entries(analysis.category_summary || {}).filter(([field]) => !isStudioBadVisualField(field, studioDisplayName(analysis, field))).sort(([a], [b]) => (a === dashboardConfig.groupField ? -1 : b === dashboardConfig.groupField ? 1 : studioFieldScore(b, analysis, "category") - studioFieldScore(a, analysis, "category")));
  const dateSummary = analysis.date_summary || [];
  const quality = analysis.quality_breakdown || {};
  const missingProfile = analysis.missing_profile || {};
  const originalMissingProfile = analysis.original_missing_profile || missingProfile;
  const missingPercentEntries = Object.entries(missingProfile.byColumn || {}).filter(([, count]) => Number(count) > 0).map(([column, count]) => [column, analysis.rows ? Math.round((Number(count) / analysis.rows) * 1000) / 10 : 0]).sort((a, b) => Number(b[1]) - Number(a[1]));
  const numericEntries = Object.entries(analysis.numeric_summary || {});
  const insightCards = analysis.insights || buildInsightCards(analysis);
  const pct = (value) => `${Math.max(4, Math.min(100, Math.round(Number(value) || 0)))}%`;
  const selectedPlan = Object.keys(studioPackageSummaries).find((key) => studioPackageSummaries[key].access === preview.access) || "t1l3";
  const upgradeButton = locked ? `<a class="button mini secondary-mini" href="checkout.html?plan=${selectedPlan}">Upgrade to export full dashboard</a>` : "";
  const exportControls = locked ? `${studioExportOptionsHtml(true)}${studioUpgradeButtonHtml(feature.outputType)}` : studioExportOptionsHtml(false);

  shell.replaceChildren();
  shell.classList.add("visible");
  shell.classList.toggle("is-watermarked", locked);
  document.getElementById("studio-open-preview")?.removeAttribute("disabled");

  const featureHeader = document.createElement("section");
  featureHeader.className = `studio-selected-feature${locked ? " is-locked" : " is-unlocked"}`;
  featureHeader.innerHTML = `<span>Previewing: ${escapeHtml(feature.title)}</span><h4>${escapeHtml(analysis.source_file || "Uploaded file")}</h4><p>${escapeHtml(locked ? feature.lockedCopy : "This dashboard is ready to export from your uploaded file.")}</p><small>${escapeHtml(locked ? "ProgramMetrics Preview watermark and limited rows are applied." : "Click a KPI card to inspect the details before export.")}</small><button class="button mini secondary-mini" type="button" id="studio-adjust-data-setup">Adjust data setup</button>${exportControls}`;
  shell.appendChild(featureHeader);
  featureHeader.querySelector("#studio-adjust-data-setup")?.addEventListener("click", () => document.getElementById("studio-data-setup-panel")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  setupStudioExportMenus(featureHeader);

  const canvas = document.createElement("div");
  canvas.className = "dashboard-canvas";
  shell.appendChild(canvas);

  const header = document.createElement("div");
  header.className = "dashboard-preview-header";
  const dateText = dateSummary.length ? `${studioDisplayName(analysis, dateSummary[0].column)}: ${formatStudioDate(dateSummary[0].start)} to ${formatStudioDate(dateSummary[0].end)}` : "No date range detected";
  header.innerHTML = `<span>Preview with your real file</span><strong>${escapeHtml(feature.title)}</strong><small>${escapeHtml(analysis.file_size || "Current browser session")} | ${escapeHtml(dateText)}</small>`;
  header.dataset.dashboardTab = "overview";
  canvas.appendChild(header);
  const controlsPanel = document.createElement("section");
  controlsPanel.className = "dashboard-control-strip";
  controlsPanel.innerHTML = `<div><strong>Build this dashboard</strong><span>${escapeHtml(selectedFieldNarrative(analysis, dashboardConfig))}</span></div><label><span>Trend date</span><select data-studio-dashboard-control="trendField">${studioSelectOptions(dateFieldsForControls, dashboardConfig.trendField, analysis, "Best date field")}</select></label><label><span>Compare by</span><select data-studio-dashboard-control="groupField">${studioSelectOptions(sortedStudioFields(analysis, "group", categoryFieldsForControls), dashboardConfig.groupField, analysis, "Best group field")}</select></label><label><span>Break down by</span><select data-studio-dashboard-control="reasonField">${studioSelectOptions(sortedStudioFields(analysis, "reason", categoryFieldsForControls), dashboardConfig.reasonField, analysis, "Best category field")}</select></label><label><span>Measure</span><select data-studio-dashboard-control="numericField">${studioSelectOptions(sortedStudioFields(analysis, "numeric", numericFieldsForControls), dashboardConfig.numericField, analysis, "Best numeric field")}</select></label><label><span>Missing focus</span><select data-studio-dashboard-control="missingFocus">${studioSelectOptions(missingFieldsForControls, dashboardConfig.missingFocus, analysis, "Top missing field")}</select></label>`;
  canvas.appendChild(controlsPanel);
  applyStudioDashboardControls(controlsPanel, analysis);

  const stats = document.createElement("div");
  stats.className = "dashboard-kpi-grid";
  [
    { label: "Total records", value: analysis.rows ?? 0, title: "Rows and Records", detail: detailList([`${analysis.rows || 0} records were detected in this preview.`, "Rows usually represent people, events, transactions, services, or form submissions.", locked ? `Locked previews show only the first ${analysis.preview_limit} rows.` : "Exports can include the available cleaned output for this selected feature."]) },
    { label: "Total fields", value: analysis.columns ?? 0, title: "Field Summary", detail: `<p>${escapeHtml(analysis.columns || 0)} fields were detected.</p>${detailList((analysis.detected_fields || []).slice(0, 16).map((field) => `Detected field: ${studioDisplayName(analysis, field)}`))}` },
    { label: "Missing rows", value: missingProfile.missingRows ?? 0, title: "Missing Rows", detail: missingDetailHtml(analysis) },
    { label: "Missing cells", value: missingProfile.missingCells ?? 0, title: "Missing Cells", detail: missingDetailHtml(analysis) },
    { label: "Fields with blanks", value: missingProfile.missingColumns ?? 0, title: "Fields with Blanks", detail: missingDetailHtml(analysis) },
    { label: "Missing %", value: `${missingProfile.missingPercent ?? 0}%`, title: "Missing Percentage", detail: missingDetailHtml(analysis) },
    { label: "Quality score", value: canPreviewFeature("missingReview", preview) ? analysis.quality_score ?? "-" : "Preview", title: "Quality Score Breakdown", detail: qualityDetailHtml(analysis) },
  ].forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "dashboard-kpi-card is-clickable";
    card.innerHTML = `<strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span><small>View details</small>`;
    card.addEventListener("click", () => showStudioDetailPanel(item.title, item.detail));
    stats.appendChild(card);
  });
  dateSummary.length && [ { label: "Date Range", value: `${formatStudioDate(dateSummary[0].start)} - ${formatStudioDate(dateSummary[0].end)}`, title: "Date Range Detail", detail: detailList([`Earliest date: ${formatStudioDate(dateSummary[0].start)}`, `Latest date: ${formatStudioDate(dateSummary[0].end)}`, `Detected date field: ${studioDisplayName(analysis, dateSummary[0].column)}`, "Records are grouped by month so the chart stays readable."]) } ].forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "dashboard-kpi-card is-clickable";
    card.innerHTML = `<strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span><small>View details</small>`;
    card.addEventListener("click", () => showStudioDetailPanel(item.title, item.detail));
    stats.appendChild(card);
  });
  [{ label: "Duplicates", value: analysis.duplicate_rows ?? 0, title: "Duplicate Review", detail: detailList([`${analysis.duplicate_rows || 0} possible duplicate rows were detected.`, "Detection uses repeated full-row values within the uploaded data preview.", Number(analysis.duplicate_rows) > 0 ? "Review duplicate records before creating final reports." : "No obvious duplicates were found in the previewed data."]) }].forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "dashboard-kpi-card is-clickable";
    card.innerHTML = `<strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(item.label)}</span><small>View details</small>`;
    card.addEventListener("click", () => showStudioDetailPanel(item.title, item.detail));
    stats.appendChild(card);
  });
  stats.dataset.dashboardTab = "overview";
  canvas.appendChild(stats);

  const answerPanel = document.createElement("section");
  answerPanel.className = "dashboard-preview-panel dashboard-tile-wide";
  answerPanel.innerHTML = `<h4>What this dashboard tells me</h4><div class="dashboard-insight-cards">${insightCards.map((insight) => `<article>${escapeHtml(insight)}</article>`).join("")}</div>`;
  answerPanel.dataset.dashboardTab = "overview";
  canvas.appendChild(answerPanel);

  const visualGrid = document.createElement("div");
  visualGrid.className = "dashboard-visual-grid dashboard-visual-grid-wide";
  const overviewPanel = document.createElement("section");
  overviewPanel.className = "dashboard-preview-panel dashboard-tile";
  overviewPanel.innerHTML = `<h4>Data Overview</h4><div class="dashboard-mini-list"><span>Source</span><b>${escapeHtml(analysis.source_kind || "Uploaded file")}</b><span>Detected fields</span><b>${escapeHtml((analysis.detected_fields || []).slice(0, 5).map((field) => studioDisplayName(analysis, field)).join(", ") || "None")}</b><span>Suggested view</span><b>${dateSummary.length ? "Trend and category dashboard" : "Category and quality dashboard"}</b></div>`;
  overviewPanel.dataset.dashboardTab = "overview";
  visualGrid.appendChild(overviewPanel);

  const trendPanel = document.createElement("section");
  trendPanel.className = "dashboard-preview-panel dashboard-tile";
  if (dateSummary.length) {
    const primary = dateSummary.find((item) => item.column === dashboardConfig.trendField) || dateSummary[0];
    const entries = Object.entries(primary.buckets).sort(([a], [b]) => a.localeCompare(b)).slice(-12);
    const max = Math.max(...entries.map(([, count]) => Number(count)), 1);
    trendPanel.innerHTML = `<h4>Records by Start Month</h4><p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, primary.column))}</p><div class="dashboard-trend-bars">${entries.map(([label, count]) => `<div><i style="height:${pct((Number(count) / max) * 100)}"></i><span>${escapeHtml(label.slice(2))}</span><b>${escapeHtml(count)}</b></div>`).join("")}</div>`;
  } else {
    trendPanel.innerHTML = `<h4>Records Over Time</h4><p>No reliable date field was detected. Add or standardize a date field to unlock trend views.</p>`;
  }
  trendPanel.dataset.dashboardTab = "visuals";
  visualGrid.appendChild(trendPanel);

  const categoryPanel = document.createElement("section");
  categoryPanel.className = "dashboard-preview-panel dashboard-tile";
  categoryPanel.innerHTML = "<h4>Top Categories</h4>";
  if (categoryEntries.length) {
    const selectedCategoryField = dashboardConfig.groupField || dashboardConfig.reasonField || categoryEntries[0]?.[0];
    const column = selectedCategoryField || categoryEntries[0]?.[0];
    const counts = analysis.category_summary?.[column] || categoryEntries[0]?.[1] || {};
    const maxCount = Math.max(...Object.values(counts).map(Number), 1);
    categoryPanel.innerHTML += `<p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, column))}</p>`;
    Object.entries(counts).slice(0, locked ? 5 : 8).forEach(([name, count]) => {
      categoryPanel.innerHTML += `<div class="dashboard-bar-row"><span>${escapeHtml(name)}</span><div><i style="width:${pct((Number(count) / maxCount) * 100)}"></i></div><b>${escapeHtml(count)}</b></div>`;
    });
  } else {
    categoryPanel.innerHTML += "<p>No readable category field was detected yet.</p>";
  }
  categoryPanel.dataset.dashboardTab = "visuals";
  visualGrid.appendChild(categoryPanel);
  if (analysis.recipe === "surveyReferral") {
    const surveyFields = Object.assign({}, getSurveyVisualFields(analysis), { date: dashboardConfig.trendField || getSurveyVisualFields(analysis).date, organization: dashboardConfig.groupField || getSurveyVisualFields(analysis).organization, reason: dashboardConfig.reasonField || getSurveyVisualFields(analysis).reason, age: dashboardConfig.numericField || getSurveyVisualFields(analysis).age });
    const surveyKpiPanel = document.createElement("section");
    surveyKpiPanel.className = "dashboard-preview-panel dashboard-tile-wide survey-dashboard-tile";
    surveyKpiPanel.dataset.dashboardTab = "visuals";
    const usableRecords = usableSurveyRecordCount(analysis, surveyFields);
    const significantFindings = [surveyFields.organization, surveyFields.reason, surveyFields.date, missingEntries.length ? "Missing response patterns" : ""].filter(Boolean).length;
    surveyKpiPanel.innerHTML = `<h4>Survey / Referral Dashboard</h4><div class="survey-kpi-row"><div><strong>${escapeHtml(analysis.rows || 0)}</strong><span>Response count</span></div><div><strong>${escapeHtml(usableRecords)}</strong><span>Usable records</span></div><div><strong>${escapeHtml(significantFindings)}</strong><span>Significant findings</span></div><div><strong>${escapeHtml(dateSummary.length ? formatStudioDate(dateSummary[0].start) : "Not detected")}</strong><span>Earliest date</span></div></div><p>ProgramMetrics detected survey-style fields and prioritized response counts, readable question labels, referral or denial trends, organization comparison, and missing response quality checks.</p>`;
    visualGrid.appendChild(surveyKpiPanel);

    if (surveyFields.organization) {
      const counts = topCountsForField(analysis, surveyFields.organization, locked ? 5 : 10);
      const maxOrg = Math.max(...counts.map(([, count]) => Number(count)), 1);
      const orgPanel = document.createElement("section");
      orgPanel.className = "dashboard-preview-panel dashboard-tile";
      orgPanel.dataset.dashboardTab = "visuals";
      orgPanel.innerHTML = `<h4>Shelter / Organization Comparison</h4><p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, surveyFields.organization))}</p>${counts.map(([name, count]) => `<div class="dashboard-bar-row"><span>${escapeHtml(name)}</span><div><i style="width:${pct((Number(count) / maxOrg) * 100)}"></i></div><b>${escapeHtml(count)}</b></div>`).join("")}`;
      visualGrid.appendChild(orgPanel);
    }

    if (surveyFields.reason) {
      const counts = topCountsForField(analysis, surveyFields.reason, locked ? 5 : 8);
      const total = counts.reduce((sum, [, count]) => sum + Number(count), 0) || 1;
      const reasonPanel = document.createElement("section");
      reasonPanel.className = "dashboard-preview-panel dashboard-tile";
      reasonPanel.dataset.dashboardTab = "visuals";
      reasonPanel.innerHTML = `<h4>Referral / Denial Reason Distribution</h4><div class="dashboard-donut-list">${counts.map(([name, count]) => `<span><i style="--share:${Math.max(8, Math.round((Number(count) / total) * 100))}%"></i><b>${escapeHtml(name)}</b><em>${escapeHtml(count)}</em></span>`).join("")}</div>`;
      visualGrid.appendChild(reasonPanel);
    }

    if (surveyFields.organization && surveyFields.reason && surveyFields.organization !== surveyFields.reason) {
      const crosstab = crossTabCounts(analysis, surveyFields.organization, surveyFields.reason, locked ? 4 : 6, locked ? 4 : 5);
      if (crosstab.rows.length && crosstab.columns.length) {
        const matrixPanel = document.createElement("section");
        matrixPanel.className = "dashboard-preview-panel dashboard-tile-wide analytics-matrix-panel";
        matrixPanel.dataset.dashboardTab = "visuals";
        matrixPanel.innerHTML = `<h4>Segment Breakdown Matrix</h4><p class="dashboard-chart-label">${escapeHtml(studioDisplayName(analysis, surveyFields.organization))} by ${escapeHtml(studioDisplayName(analysis, surveyFields.reason))}</p><div class="analytics-matrix"><table><thead><tr><th>${escapeHtml(studioDisplayName(analysis, surveyFields.organization))}</th>${crosstab.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${crosstab.rows.map((rowName) => `<tr><th>${escapeHtml(rowName)}</th>${crosstab.columns.map((columnName) => `<td>${escapeHtml(crosstab.matrix[rowName]?.[columnName] || 0)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
        visualGrid.appendChild(matrixPanel);
      }
    }

    if (surveyFields.age && analysis.numeric_summary?.[surveyFields.age]?.histogram) {
      const bins = analysis.numeric_summary[surveyFields.age].histogram;
      const maxAge = Math.max(...bins.map((bin) => bin.count), 1);
      const agePanel = document.createElement("section");
      agePanel.className = "dashboard-preview-panel dashboard-tile";
      agePanel.dataset.dashboardTab = "visuals";
      agePanel.innerHTML = `<h4>Youth Age Distribution</h4><div class="dashboard-trend-bars histogram-bars">${bins.map((bin) => `<div><i style="height:${pct((bin.count / maxAge) * 100)}"></i><span>${escapeHtml(bin.label)}</span><b>${escapeHtml(bin.count)}</b></div>`).join("")}</div>`;
      visualGrid.appendChild(agePanel);
    }
  }

  const missingPanel = document.createElement("section");
  missingPanel.className = `dashboard-preview-panel dashboard-tile${canPreviewFeature("missingReview", preview) ? "" : " locked-preview-panel"}`;
  missingPanel.innerHTML = "<h4>Missing Value Summary</h4>";
  if (missingEntries.length) {
    const maxMissing = Math.max(...missingEntries.map(([, count]) => Number(count)), 1);
    missingEntries.slice(0, locked ? 5 : 8).forEach(([column, count]) => {
      missingPanel.innerHTML += `<div class="dashboard-bar-row missing-bar"><span>${escapeHtml(studioDisplayName(analysis, column))}</span><div><i style="width:${pct((Number(count) / maxMissing) * 100)}"></i></div><b>${escapeHtml(count)}</b></div>`;
    });
  } else {
    missingPanel.innerHTML += "<p>No missing values were detected in table-ready fields.</p>";
  }
  missingPanel.dataset.dashboardTab = "missing";
  visualGrid.appendChild(missingPanel);

  const missingPercentPanel = document.createElement("section");
  missingPercentPanel.className = `dashboard-preview-panel dashboard-tile${canPreviewFeature("missingReview", preview) ? "" : " locked-preview-panel"}`;
  missingPercentPanel.dataset.dashboardTab = "missing";
  missingPercentPanel.innerHTML = "<h4>Top Fields by Missing Percentage</h4>";
  if (missingPercentEntries.length) {
    missingPercentEntries.slice(0, locked ? 5 : 10).forEach(([column, percent]) => {
      missingPercentPanel.innerHTML += `<div class="dashboard-bar-row missing-bar"><span>${escapeHtml(studioDisplayName(analysis, column))}</span><div><i style="width:${pct(percent)}"></i></div><b>${escapeHtml(percent)}%</b></div>`;
    });
  } else {
    missingPercentPanel.innerHTML += "<p>No fields have coded missing values.</p>";
  }
  visualGrid.appendChild(missingPercentPanel);

  const sampleMissingPanel = document.createElement("section");
  sampleMissingPanel.className = "dashboard-preview-panel dashboard-tile-wide";
  sampleMissingPanel.dataset.dashboardTab = "missing";
  sampleMissingPanel.innerHTML = `<h4>Sample Rows with Missing Values</h4><p>These examples show why missing rows and missing cells are different.</p>${detailList((missingProfile.sampleRows || []).slice(0, locked ? 4 : 8).map((row) => `Row ${row.row}: ${row.missingFields} missing cells - ${row.preview}`))}`;
  visualGrid.appendChild(sampleMissingPanel);

  const heatmapPanel = document.createElement("section");
  heatmapPanel.className = "dashboard-preview-panel dashboard-tile";
  heatmapPanel.dataset.dashboardTab = "visuals";
  heatmapPanel.innerHTML = `<h4>Field Completeness Heatmap</h4><div class="field-heatmap">${Object.entries(missingProfile.byColumn || {}).slice(0, 48).map(([column, count]) => { const complete = analysis.rows ? Math.round(100 - (Number(count) / analysis.rows) * 100) : 100; return `<span title="${escapeHtml(studioDisplayName(analysis, column))}: ${complete}% complete" style="--complete:${complete}%">${escapeHtml(studioDisplayName(analysis, column).slice(0, 14))}</span>`; }).join("")}</div>`;
  visualGrid.appendChild(heatmapPanel);

  const qualityPanel = document.createElement("section");
  qualityPanel.className = "dashboard-preview-panel dashboard-tile";
  [["Completeness", quality.completenessScore], ["Duplicate check", quality.duplicateScore], ["Date consistency", quality.dateConsistencyScore], ["Field coverage", quality.requiredCoverageScore], ["Formatting", quality.formattingScore], ["Outlier check", quality.outlierScore]].forEach(([label, value], index) => {
    qualityPanel.innerHTML += index === 0 ? "<h4>Quality Score Breakdown</h4>" : "";
    qualityPanel.innerHTML += `<div class="dashboard-bar-row quality-bar"><span>${escapeHtml(label)}</span><div><i style="width:${pct(value)}"></i></div><b>${escapeHtml(value ?? "-")}</b></div>`;
  });
  qualityPanel.dataset.dashboardTab = "quality";
  visualGrid.appendChild(qualityPanel);

  const duplicatePanel = document.createElement("section");
  duplicatePanel.className = "dashboard-preview-panel dashboard-tile";
  duplicatePanel.innerHTML = `<h4>Possible Duplicate Review</h4><strong class="dashboard-large-number">${escapeHtml(analysis.duplicate_rows)}</strong><p>${Number(analysis.duplicate_rows) > 0 ? "Review possible duplicate rows before final reporting." : "No obvious duplicate records were detected in the previewed data."}</p>`;
  duplicatePanel.dataset.dashboardTab = "quality";
  visualGrid.appendChild(duplicatePanel);

  const completenessPanel = document.createElement("section");
  completenessPanel.className = "dashboard-preview-panel dashboard-tile";
  completenessPanel.innerHTML = `<h4>Field Completeness</h4><div class="dashboard-ring" style="--score:${pct(quality.completenessScore)}"><strong>${escapeHtml(quality.completenessScore ?? "-")}</strong><span>Completeness</span></div><p>${missingEntries.length ? "High-blank fields should be reviewed, filtered, or marked optional." : "Fields appear complete enough for a first dashboard preview."}</p>`;
  completenessPanel.dataset.dashboardTab = "quality";
  visualGrid.appendChild(completenessPanel);

  const actionsPanel = document.createElement("section");
  actionsPanel.className = "dashboard-preview-panel dashboard-tile";
  actionsPanel.innerHTML = `<h4>Recommended Cleaning Actions</h4><ul>${(analysis.cleaning_steps || []).slice(0, locked ? 5 : 8).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>${exportControls}`;
  actionsPanel.dataset.dashboardTab = "executive";
  visualGrid.appendChild(actionsPanel);
  const fieldTypePanel = document.createElement("section");
  fieldTypePanel.className = "dashboard-preview-panel dashboard-tile";
  fieldTypePanel.dataset.dashboardTab = "stats";
  const typeCounts = analysis.field_type_counts || {};
  const typeRows = [["Date", typeCounts.date || 0], ["Numeric", typeCounts.numeric || 0], ["Categorical", typeCounts.categorical || 0], ["Text / ID / other", typeCounts.other || 0]];
  const typeMax = Math.max(...typeRows.map(([, count]) => Number(count)), 1);
  fieldTypePanel.innerHTML = `<h4>Field Type Breakdown</h4>${typeRows.map(([label, count]) => `<div class="dashboard-bar-row quality-bar"><span>${escapeHtml(label)}</span><div><i style="width:${pct((Number(count) / typeMax) * 100)}"></i></div><b>${escapeHtml(count)}</b></div>`).join("")}`;
  visualGrid.appendChild(fieldTypePanel);
  canvas.appendChild(visualGrid);

  const executivePanel = document.createElement("section");
  executivePanel.className = "dashboard-preview-panel dashboard-tile-wide";
  executivePanel.dataset.dashboardTab = "executive";
  executivePanel.innerHTML = `<h4>Executive Summary</h4><p>${escapeHtml(analysis.answer || "Your uploaded file has been prepared for executive-level reporting.")}</p><ul>${(analysis.cleaning_steps || []).slice(0, 5).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>`;
  canvas.appendChild(executivePanel);

  const exportPanel = document.createElement("section");
  exportPanel.className = `dashboard-preview-panel dashboard-tile-wide${locked ? " locked-preview-panel" : ""}`;
  exportPanel.dataset.dashboardTab = "exports";
  exportPanel.innerHTML = `<h4>Exports</h4><p>${escapeHtml(locked ? "Your file preview is limited. Upgrade to export the full analytics package." : "Choose a professional output package generated from this uploaded file.")}</p>${exportControls}`;
  canvas.appendChild(exportPanel);
  setupStudioExportMenus(exportPanel);

  const missingCodingPanel = document.createElement("section");
  missingCodingPanel.className = `dashboard-preview-panel dashboard-tile-wide${locked ? " locked-preview-panel" : ""}`;
  missingCodingPanel.dataset.dashboardTab = "missing";
  const newlyCodedCells = Math.max(0, (missingProfile.missingCells || 0) - (originalMissingProfile.missingCells || 0));
  missingCodingPanel.innerHTML = `<h4>Missing Value Coding</h4><p>Missing rows are records with at least one missing value. Missing cells are every blank or coded missing field in the file. One row can contain many missing cells.</p><div class="missing-code-chips">${activeStudioMissingCodes.map((code) => `<button type="button" data-code="${escapeHtml(code)}" title="Remove this missing code">${escapeHtml(code === "" ? "empty string" : code)} <span aria-hidden="true">x</span></button>`).join("")}</div><div class="missing-code-controls"><input id="studio-missing-code-input" type="text" placeholder="Add custom missing code" /><button class="button mini secondary-mini" type="button" id="studio-add-missing-code">Add code</button><button class="button mini" type="button" id="studio-reset-missing-codes">Reset defaults</button></div><label class="missing-column-picker"><span>Apply to selected columns</span><select id="studio-missing-column-select" multiple>${(analysis.column_names || []).slice(0, 80).map((column) => `<option selected>${escapeHtml(column)}</option>`).join("")}</select><small>Column selection is previewed in-session. Global coding remains the default for exports.</small></label><div class="missing-code-summary"><div><b>${escapeHtml(originalMissingProfile.missingRows || 0)}</b><span>Original missing rows</span></div><div><b>${escapeHtml(originalMissingProfile.missingCells || 0)}</b><span>Original missing cells</span></div><div><b>${escapeHtml(missingProfile.missingRows || 0)}</b><span>Recoded missing rows</span></div><div><b>${escapeHtml(missingProfile.missingCells || 0)}</b><span>Recoded missing cells</span></div><div><b>${escapeHtml(newlyCodedCells)}</b><span>Newly coded cells</span></div><div><b>${escapeHtml(missingProfile.missingColumns || 0)}</b><span>Affected columns</span></div></div><p>${escapeHtml(locked ? "Unlock to export the full missing-value coding report." : "Download a missing-value report from the Exports tab.")}</p>`;
  canvas.appendChild(missingCodingPanel);
  const addMissingCode = missingCodingPanel.querySelector("#studio-add-missing-code");
  const resetMissingCodes = missingCodingPanel.querySelector("#studio-reset-missing-codes");
  addMissingCode?.addEventListener("click", () => {
    const input = missingCodingPanel.querySelector("#studio-missing-code-input");
    const value = String(input?.value || "").trim();
    if (value && !activeStudioMissingCodes.includes(value)) activeStudioMissingCodes.push(value);
    refreshActiveStudioPreview("Missing-value coding updated.");
  });
  resetMissingCodes?.addEventListener("click", () => {
    activeStudioMissingCodes = defaultStudioMissingCodes.slice();
    refreshActiveStudioPreview("Missing-value coding reset.");
  });

  const descriptivePanel = document.createElement("section");
  descriptivePanel.className = "dashboard-preview-panel dashboard-tile-wide";
  descriptivePanel.dataset.dashboardTab = "stats";
  const numericRows = numericEntries.slice(0, locked ? 4 : 10).map(([column, item]) => `<tr><td>${escapeHtml(column)}</td><td>${escapeHtml(Math.round(item.mean * 100) / 100)}</td><td>${escapeHtml(Math.round(item.median * 100) / 100)}</td><td>${escapeHtml(item.min)}</td><td>${escapeHtml(item.max)}</td><td>${escapeHtml(Math.round(item.standardDeviation * 100) / 100)}</td><td>${escapeHtml(Math.round(item.q1 * 100) / 100)} / ${escapeHtml(Math.round(item.q3 * 100) / 100)}</td><td>${escapeHtml(item.outlierCount)}</td></tr>`).join("");
  const histogram = numericEntries[0]?.[1]?.histogram || [];
  const histogramMax = Math.max(...histogram.map((bin) => bin.count), 1);
  descriptivePanel.innerHTML = `<h4>Descriptive Statistics</h4><div class="stats-dashboard-grid"><div><strong>${escapeHtml(numericEntries.length)}</strong><span>Numeric fields</span></div><div><strong>${escapeHtml(Object.keys(analysis.category_summary || {}).length)}</strong><span>Categorical fields</span></div><div><strong>${escapeHtml((analysis.date_summary || []).length)}</strong><span>Date fields</span></div><div><strong>${escapeHtml(missingProfile.missingColumns || 0)}</strong><span>Fields with blanks</span></div></div>${histogram.length ? `<h5>Numeric distribution: ${escapeHtml(numericEntries[0][0])}</h5><div class="dashboard-trend-bars histogram-bars">${histogram.map((bin) => `<div><i style="height:${pct((bin.count / histogramMax) * 100)}"></i><span>${escapeHtml(bin.label)}</span><b>${escapeHtml(bin.count)}</b></div>`).join("")}</div>` : ""}<div class="dashboard-table-wrap"><table><thead><tr><th>Field</th><th>Mean</th><th>Median</th><th>Min</th><th>Max</th><th>Std dev</th><th>Q1 / Q3</th><th>Outliers</th></tr></thead><tbody>${numericRows || `<tr><td colspan="8">No reliable numeric fields were detected.</td></tr>`}</tbody></table></div>`;
  canvas.appendChild(descriptivePanel);

  if (preview.access >= studioFeatureRequirements.advancedAnalytics) {
    const outlierTotal = Object.values(analysis.numeric_summary || {}).reduce((total, item) => total + Number(item.outlierCount || 0), 0);
    const trendReady = dateSummary.length ? "Ready" : "Needs date setup";
    const selectedReasonCounts = dashboardConfig.reasonField ? topCountsForField(analysis, dashboardConfig.reasonField, 8) : [];
    const concentration = concentrationSummary(selectedReasonCounts);
    const advancedCards = [
      ["forecasting", "Forecasting Readiness", `<div class="advanced-readiness-grid"><div><strong>${escapeHtml(trendReady)}</strong><span>Trend status</span></div><div><strong>${escapeHtml(dateSummary[0]?.bucketMode || "None")}</strong><span>Best time grain</span></div><div><strong>${escapeHtml(dateSummary[0]?.count || 0)}</strong><span>Dated records</span></div></div><p>${dateSummary.length ? "ProgramMetrics can trend records over time and preview volume changes by period." : "Choose or combine a date field in Data Setup to unlock forecasting previews."}</p>`],
      ["advanced", "Advanced Analytics", `<div class="advanced-readiness-grid"><div><strong>${escapeHtml(outlierTotal)}</strong><span>Potential outliers</span></div><div><strong>${escapeHtml(concentration.topShare)}%</strong><span>Top category share</span></div><div><strong>${escapeHtml(concentration.topThreeShare)}%</strong><span>Top 3 concentration</span></div></div><p>ProgramMetrics reviews outliers, concentration, field usability, missingness, and segmentation readiness from the selected dashboard variables.</p>${selectedReasonCounts.length ? `<div class="analytics-rank-list">${selectedReasonCounts.slice(0, 5).map(([name, count], index) => `<span><b>${escapeHtml(index + 1)}</b><em>${escapeHtml(name)}</em><strong>${escapeHtml(count)}</strong></span>`).join("")}</div>` : ""}`],
      ["dictionary", "Data Dictionary", `<div class="dashboard-table-wrap"><table><thead><tr><th>Field</th><th>Type</th><th>Use</th></tr></thead><tbody>${(analysis.detected_fields || []).slice(0, locked ? 8 : 18).map((field) => `<tr><td>${escapeHtml(studioDisplayName(analysis, field))}</td><td>${escapeHtml(dateFieldsForControls.includes(field) ? "Date" : numericFieldsForControls.includes(field) ? "Numeric" : categoryFieldsForControls.includes(field) ? "Category" : "Text / other")}</td><td>${escapeHtml(isStudioBadVisualField(field, studioDisplayName(analysis, field)) ? "Reference only" : "Dashboard candidate")}</td></tr>`).join("")}</tbody></table></div>`],
      ["appendix", "Appendix", `<p>Processing used the selected Data Setup rows, omitted metadata rows, current missing-value codes, and dashboard field selections. Locked previews remain watermarked and export-limited.</p>`],
    ];
    advancedCards.forEach(([tab, title, html]) => {
      const panel = document.createElement("section");
      panel.className = "dashboard-preview-panel dashboard-tile-wide advanced-analytics-panel";
      panel.dataset.dashboardTab = tab;
      panel.innerHTML = `<h4>${escapeHtml(title)}</h4>${html}`;
      canvas.appendChild(panel);
    });
  }

  if (previewRows.length && previewColumns.length) {
    const tablePanel = document.createElement("section");
    tablePanel.className = `dashboard-preview-panel dashboard-table-panel${locked ? " locked-preview-panel" : ""}`;
    const head = previewColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
    const rows = previewRows.slice(0, locked ? Math.min(25, previewRows.length) : previewRows.length).map((row) => `<tr>${previewColumns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>`).join("");
    tablePanel.innerHTML = `<h4>Limited Data Preview</h4><p>Showing first ${escapeHtml(locked ? Math.min(25, analysis.preview_limit || previewRows.length) : analysis.preview_limit || previewRows.length)} rows.</p><div class="dashboard-table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>${exportControls}`;
    tablePanel.dataset.dashboardTab = "exports";
    canvas.appendChild(tablePanel);
  }
  setupDashboardTabs(canvas, preview.access);
}
function normalizedRowsForRender(analysis) {
  return (analysis.preview_rows || []).length ? analysis.preview_rows : [];
}

function countValues(rows, column) {
  return rows.reduce((counts, row) => {
    const value = String(row[column] || "Missing");
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function buildGeneratedExampleAnalysis() {
  const templateSelect = document.getElementById("studio-template-type");
  const templateKey = studioExampleTemplates[templateSelect?.value] ? templateSelect.value : "general";
  const template = studioExampleTemplates[templateKey];
  const selected = getStudioAccess();
  const access = selected.access;
  const rows = template.rows;
  const columns = template.columns;
  const numericColumns = columns.filter((column) => rows.some((row) => typeof row[column] === "number"));
  const numericSummary = {};
  numericColumns.forEach((column) => {
    const values = rows.map((row) => Number(row[column])).filter((value) => Number.isFinite(value));
    if (values.length) {
      numericSummary[column] = {
        min: Math.min(...values),
        max: Math.max(...values),
        mean: values.reduce((total, value) => total + value, 0) / values.length,
        median: values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)],
      };
    }
  });
  const categoryColumns = columns.filter((column) => !numericColumns.includes(column)).slice(1, 5);
  const categorySummary = {};
  categoryColumns.forEach((column) => {
    categorySummary[column] = countValues(rows, column);
  });
  const baseSteps = ["Standardized column names", "Checked duplicate records", "Counted missing values by field"];
  const tierSteps = [];
  if (access >= 3) tierSteps.push("Prepared cleaned export and basic dashboard insight summary");
  if (access >= 4) tierSteps.push("Applied branded report structure preview");
  if (access >= 5) tierSteps.push("Added translated report setup preview");
  if (access >= 6) tierSteps.push("Added recurring report layout preview");
  if (access >= 7) tierSteps.push("Mapped workflow rules and integration points");
  if (access >= 8) tierSteps.push("Added advanced analytics and automation signals");
  return {
    is_example: true,
    watermark: true,
    source_file: `${template.title} - generated by ProgramMetrics.io`,
    rows: rows.length,
    columns: columns.length,
    column_names: columns,
    duplicate_rows: access >= 2 ? 0 : "Locked",
    missing_values: access >= 2 ? Object.fromEntries(columns.map((column) => [column, 0])) : {},
    numeric_summary: access >= 3 ? numericSummary : {},
    category_summary: categorySummary,
    date_summary: dateSummary,
    quality_breakdown: qualityBreakdown,
    top_missing_columns: missingEntries.slice(0, 8),
    preview_rows: rows,
    cleaning_steps: baseSteps.concat(tierSteps),
    package_label: selected.label,
    template_label: template.title,
    answer: `${template.title} shown with ${selected.label}. This generated example demonstrates how ProgramMetrics changes the preview as higher tiers unlock cleanup checks, report exports, branded structure, translation setup, workflow rules, and advanced analytics.`,
  };
}

function generatedExampleReportHtml(analysis) {
  const columns = (analysis.preview_rows?.length ? Object.keys(analysis.preview_rows[0]) : []).slice(0, 8);
  const head = columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
  const body = (analysis.preview_rows || []).map((row) => `<tr>${columns.map((column) => `<td>${escapeHtml(row[column])}</td>`).join("")}</tr>`).join("");
  const categories = Object.entries(analysis.category_summary || {}).map(([column, counts]) => {
    const max = Math.max(...Object.values(counts).map(Number), 1);
    const bars = Object.entries(counts).map(([label, count]) => `<div class="bar"><span>${escapeHtml(label)}</span><i style="width:${Math.max(8, Math.round((Number(count) / max) * 100))}%"></i><b>${escapeHtml(count)}</b></div>`).join("");
    return `<section><h2>${escapeHtml(column)}</h2>${bars}</section>`;
  }).join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>ProgramMetrics.io Example Report</title><style>body{font-family:Arial,sans-serif;margin:36px;color:#071525;background:#f8fafc;line-height:1.5;position:relative}body:before{content:"ProgramMetrics.io EXAMPLE";position:fixed;top:42%;left:-10%;right:-10%;transform:rotate(-28deg);font-size:86px;font-weight:900;color:rgba(37,99,235,.14);z-index:9999;pointer-events:none;white-space:nowrap}.card,section{background:#fff;border:1px solid #dbe4ef;border-radius:8px;padding:18px;margin:14px 0}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kpis strong{display:block;color:#2563eb;font-size:28px}.bar{display:grid;grid-template-columns:150px 1fr 42px;gap:10px;align-items:center;margin:10px 0}.bar i{display:block;height:12px;background:#5eead4;border-radius:999px}table{width:100%;border-collapse:collapse;background:#fff}th,td{border:1px solid #dbe4ef;padding:8px;text-align:left;font-size:13px}th{background:#eef6ff}@media(max-width:800px){.kpis{grid-template-columns:1fr}.bar{grid-template-columns:1fr}}</style></head><body><h1>ProgramMetrics.io Generated Example</h1><p><strong>${escapeHtml(analysis.template_label)}</strong> | ${escapeHtml(analysis.package_label)}</p><p>${escapeHtml(analysis.answer)}</p><div class="kpis"><div class="card"><strong>${escapeHtml(analysis.rows)}</strong>Rows</div><div class="card"><strong>${escapeHtml(analysis.columns)}</strong>Columns</div><div class="card"><strong>${escapeHtml(analysis.duplicate_rows)}</strong>Duplicates</div><div class="card"><strong>Example</strong>Watermarked</div></div>${categories}<section><h2>Tier-specific Studio steps</h2><ul>${analysis.cleaning_steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul></section><section><h2>Example data preview</h2><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section></body></html>`;
}

function downloadGeneratedExampleReport() {
  if (!activeStudioExampleAnalysis) {
    return false;
  }
  const html = generatedExampleReportHtml(activeStudioExampleAnalysis);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  downloadBlob(blob, "programmetrics-watermarked-example-report.html");
  return true;
}

function loadGeneratedStudioExample() {
  activeStudioExampleAnalysis = buildGeneratedExampleAnalysis();
  renderStudioDashboardPreview(activeStudioExampleAnalysis);
  const panel = document.getElementById("studio-insight-panel");
  if (panel) {
    renderInsightPanel(panel, activeStudioExampleAnalysis);
  }
  const result = document.getElementById("studio-converter-result");
  if (result) {
    result.textContent = "Generated ProgramMetrics example loaded. Downloads from this example are watermarked.";
  }
}

function updateStudioFeatureCards() {
  updateStudioDownloadButton();
}

function selectStudioFeature(featureKey, refreshPreview = true) {
  activeStudioFeatureKey = featureKey || "packageSelection";
  updateStudioDownloadButton();
  if (refreshPreview && activeStudioUploadedAnalysis) {
    const plan = getStudioAccess();
    refreshActiveStudioPreview(`Previewing ${plan.packageName} - ${plan.name}.`);
  }
}

function setupStudioFeatureCards() {
  activeStudioFeatureKey = "packageSelection";
  updateStudioDownloadButton();
}function setupDashboardTabs(canvas, accessValueForTabs = 1) {
  if (!canvas || canvas.querySelector(".dashboard-tabs")) return;
  const tabs = [
    ["overview", "Overview"],
    ["quality", "Data Quality"],
    ["stats", "Descriptive Statistics"],
    ["missing", "Missing Values"],
    ["visuals", "Visual Analytics"],
    ["advanced", "Advanced Analytics"],
    ["executive", "Executive Report"],
    ["exports", "Exports"],
  ];
  const tabBar = document.createElement("div");
  tabBar.className = "dashboard-tabs";
  tabBar.innerHTML = tabs.map(([key, label], index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-dashboard-tab-button="${key}">${label}</button>`).join("");
  canvas.prepend(tabBar);

  const activate = (key) => {
    tabBar.querySelectorAll("button").forEach((button) => button.classList.toggle("active", button.dataset.dashboardTabButton === key));
    canvas.querySelectorAll("[data-dashboard-tab]").forEach((section) => {
      section.hidden = section.dataset.dashboardTab !== key;
    });
  };
  tabBar.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-dashboard-tab-button]");
    if (button) activate(button.dataset.dashboardTabButton);
  });
  activate("overview");
}

function openStudioFullScreenPreview() {
  const analysis = activeStudioUploadedAnalysis || activeStudioExampleAnalysis;
  if (!analysis) return;
  const modal = document.createElement("div");
  modal.className = "studio-fullscreen-preview";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  const fullscreenLocked = !canDownloadOutput(getSelectedStudioFeature().outputType, getUnlockedStudioAccess());
  modal.innerHTML = `<div class="studio-fullscreen-toolbar"><div class="studio-fullscreen-brand">ProgramMetrics Studio</div><div class="studio-fullscreen-file" title="${escapeHtml(analysis.source_file || "Uploaded file")}">${escapeHtml(analysis.source_file || "Uploaded file")}</div><div class="studio-fullscreen-output">${escapeHtml(getSelectedStudioFeature().title)}</div><div class="studio-fullscreen-status ${fullscreenLocked ? "is-locked" : "is-unlocked"}">${fullscreenLocked ? "Preview only - export locked" : "Export unlocked"}</div><div class="studio-fullscreen-actions"><button type="button" data-action="fit">Fit</button><button type="button" data-action="zoom-out">-</button><button type="button" data-action="zoom-in">+</button>${studioExportOptionsHtml(fullscreenLocked)}${studioUpgradeButtonHtml(getSelectedStudioFeature().outputType)}<button type="button" data-action="close">Close</button></div></div><div class="studio-fullscreen-body"><div class="studio-preview-shell visible"></div></div>`;
  document.body.appendChild(modal);
  const shell = modal.querySelector(".studio-preview-shell");
  renderStudioDashboardPreview(analysis, shell);
  setupStudioExportMenus(modal);
  let zoom = 1;
  const setZoom = (value) => {
    zoom = Math.max(0.55, Math.min(1.45, value));
    const canvas = shell.querySelector(".dashboard-canvas");
    if (canvas) {
      canvas.style.transform = `scale(${zoom})`;
      canvas.style.transformOrigin = "top center";
    }
  };
  modal.addEventListener("click", (event) => {
    const action = event.target.closest("button")?.dataset.action;
    if (action === "close") modal.remove();
    if (action === "fit") setZoom(1);
    if (action === "zoom-in") setZoom(zoom + 0.1);
    if (action === "zoom-out") setZoom(zoom - 0.1);
  });
  const closeOnEscape = (event) => {
    if (event.key === "Escape") {
      modal.remove();
      document.removeEventListener("keydown", closeOnEscape);
    }
  };
  document.addEventListener("keydown", closeOnEscape);
}

function setupInteractivePreviewButton() {
  const button = document.getElementById("studio-open-preview");
  if (!button || button.dataset.bound === "true") return;
  button.dataset.bound = "true";
  button.addEventListener("click", openStudioFullScreenPreview);
}
function refreshActiveStudioPreview(messagePrefix) {
  const input = document.getElementById("studio-file-converter-input");
  const result = document.getElementById("studio-converter-result");
  const panel = document.getElementById("studio-insight-panel");
  if (!activeStudioUploadedAnalysis || !input?.files?.[0]) {
    return;
  }
  readStudioFileAsAnalysis(input.files[0]).then((analysis) => {
    activeStudioUploadedAnalysis = analysis;
    renderStudioDashboardPreview(analysis);
    renderInsightPanel(panel, analysis);
    updateStudioDownloadButton();
    if (result) {
      result.textContent = `${messagePrefix || (analysis.locked ? "Preview only - upgrade to export." : "Preview refreshed.")} Showing first ${analysis.preview_limit} rows.`;
    }
  }).catch((error) => {
    if (result) result.textContent = error.message;
  });
}

function setupStudioBrandingControls() {
  const panel = document.getElementById("studio-branding-panel");
  const packageSelect = document.getElementById("studio-package-select");
  const accessSelect = document.getElementById("studio-access-select");
  if (!panel) return;

  const controls = [
    "studio-brand-org",
    "studio-brand-subtitle",
    "studio-brand-primary",
    "studio-brand-accent",
    "studio-brand-style",
    "studio-brand-prepared-for",
    "studio-brand-prepared-by",
    "studio-brand-footer",
    "studio-brand-contact",
    "studio-brand-program",
    "studio-brand-title",
    "studio-brand-date",
    "studio-brand-secondary",
    "studio-brand-font",
    "studio-brand-website",
    "studio-brand-confidential",
    "studio-brand-mission",
    "studio-brand-executive-notes",
  ].map((id) => document.getElementById(id)).filter(Boolean);
  const logoInput = document.getElementById("studio-brand-logo");

  const syncBrandingPanel = () => {
    const preview = getStudioAccess();
    const unlocked = getUnlockedStudioAccess();
    const show = accessValue(preview) >= studioFeatureRequirements.branded;
    panel.hidden = !show;
    panel.classList.toggle("is-locked", show && !canUseBranding(unlocked));
    panel.classList.toggle("is-unlocked", show && canUseBranding(unlocked));
  };

  const refresh = () => {
    syncBrandingPanel();
    if (activeStudioUploadedAnalysis) {
      renderStudioDashboardPreview(activeStudioUploadedAnalysis);
      refreshActiveStudioPreview("Branding preview updated.");
    }
  };

  controls.forEach((control) => {
    control.addEventListener("input", refresh);
    control.addEventListener("change", refresh);
  });

  logoInput?.addEventListener("change", () => {
    const file = logoInput.files && logoInput.files[0];
    if (!file) {
      activeBrandLogoDataUrl = "";
      refresh();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      activeBrandLogoDataUrl = String(reader.result || "");
      refresh();
    };
    reader.readAsDataURL(file);
  });

  packageSelect?.addEventListener("change", refresh);
  accessSelect?.addEventListener("change", refresh);
  syncBrandingPanel();
}
function setupStudioPreviewRefresh() {
  const packageSelect = document.getElementById("studio-package-select");
  const templateSelect = document.getElementById("studio-template-type");
  const input = document.getElementById("studio-file-converter-input");
  const result = document.getElementById("studio-converter-result");
  const panel = document.getElementById("studio-insight-panel");

  const refreshUploadedPreview = () => {
    if (!activeStudioUploadedAnalysis || !input?.files?.[0]) return;
    readStudioFileAsAnalysis(input.files[0]).then((analysis) => {
      activeStudioUploadedAnalysis = analysis;
      renderStudioDashboardPreview(analysis);
      renderInsightPanel(panel, analysis);
      updateStudioDownloadButton();
      if (result) {
        result.textContent = `${analysis.locked ? "Preview only - upgrade to export. " : "Preview refreshed. "}Showing first ${analysis.preview_limit} rows.`;
      }
    }).catch((error) => {
      if (result) result.textContent = error.message;
    });
  };

  [packageSelect, templateSelect].forEach((select) => {
    select?.addEventListener("change", refreshUploadedPreview);
  });
}
setupStudioPackageAccess();
setupStudioFeatureCards();
setupStudioBrandingControls();
setupInteractivePreviewButton();
setupStudioPreviewRefresh();
const studioPricingPlans = {
  t1l1: {
    tier: "Tier 1 Level 1",
    title: "Starter conversion and preview",
    price: "$49",
    summary: "Best for a customer who has a simple file and needs a clean output without a custom report build.",
    includes: ["Upload a standard business file", "Convert to a standard output", "Browser preview", "Download standard files"],
    best: ["Small business files", "One-time conversion needs", "Customers comparing ProgramMetrics against basic converters", "Simple file cleanup before sharing"],
    upgrade: "Upgrade to Tier 1 Level 2 when the customer needs duplicate detection, missing-value review, or messy-data notes."
  },
  t1l2: {
    tier: "Tier 1 Level 2",
    title: "Data quality checkup",
    price: "$99",
    summary: "Best for customers who need the file reviewed before they trust it for reporting.",
    includes: ["Everything in Level 1", "Duplicate detection", "Missing-value handling notes", "Messy-data cleanup recommendations"],
    best: ["Survey exports", "Customer lists", "Training rosters", "Files with blanks, repeats, or inconsistent entries"],
    upgrade: "Upgrade to Tier 1 Level 3 when the customer wants a cleaned export and a plain-language dashboard insight summary."
  },
  t1l3: {
    tier: "Tier 1 Level 3",
    title: "Dashboard-ready starter report",
    price: "$199",
    summary: "Best for customers who want a cleaned file plus a basic explanation of what the dashboard is showing.",
    includes: ["Everything in Level 2", "Cleaned-data export", "Basic dashboard insight summary", "PDF or HTML report-style output"],
    best: ["Managers who need a quick readout", "Program files with outcomes or activity", "Monthly review packets", "Customers who are not ready for branded recurring reports"],
    upgrade: "Upgrade to Tier 2 when the report needs branding, reusable structure, translation setup, or stronger quality rules."
  },
  t2l1: {
    tier: "Tier 2 Level 1",
    title: "Branded report structure",
    price: "$299",
    summary: "Best for customers who need ProgramMetrics output to look like a more formal report package.",
    includes: ["Everything in Tier 1", "Branded report structure", "Reusable report sections", "Cleaner presentation for client or leadership review"],
    best: ["Consultants", "Small agencies", "Teams sending reports outside their organization", "Customers who need repeatable formatting"],
    upgrade: "Upgrade to Tier 2 Level 2 when reports need multilingual setup or translated labels and summaries."
  },
  t2l2: {
    tier: "Tier 2 Level 2",
    title: "Translated report setup",
    price: "$499",
    summary: "Best for customers who serve multilingual audiences or need reports prepared in another language.",
    includes: ["Everything in Tier 2 Level 1", "Translated report setup", "Multilingual labels and summaries", "Reusable export workflow"],
    best: ["Bilingual service teams", "Community programs", "Customer-facing reports", "Organizations that need Spanish, French, Arabic, Chinese, Vietnamese, or another language"],
    upgrade: "Upgrade to Tier 2 Level 3 when the customer needs richer quality checks or recurring report setup."
  },
  t2l3: {
    tier: "Tier 2 Level 3",
    title: "Recurring report setup",
    price: "$799",
    summary: "Best for customers who repeat the same reporting process monthly or quarterly.",
    includes: ["Everything in Tier 2 Level 2", "Richer data-quality rules", "Recurring report layout", "Reusable reporting process"],
    best: ["Grant reporting", "Monthly leadership dashboards", "Quarterly compliance packets", "Teams that repeat the same upload-to-report process"],
    upgrade: "Upgrade to Tier 3 when the customer needs custom fields, workflow rules, dashboard logic, or integrations."
  },
  t3: {
    tier: "Tier 3",
    title: "Workflow System",
    price: "$1,500",
    summary: "Best for customers who need a structured reporting workflow, not just a file output.",
    includes: ["Custom fields", "Workflow rules", "Dashboard logic", "Reporting rules", "Integration planning"],
    best: ["Teams with forms and approval steps", "Programs managing intake or services", "Operations teams with recurring workflows", "Organizations replacing spreadsheet-heavy processes"],
    upgrade: "Upgrade to Tier 4 when the customer needs multi-file analytics, automation, predictive logic, or specialized decision support."
  },
  t4: {
    tier: "Tier 4",
    title: "Advanced Analytics",
    price: "$3,500",
    summary: "Best for customers who need deeper analytics, automation, and specialized reporting logic.",
    includes: ["Advanced analytics", "Automation logic", "Multi-file workflows", "Predictive or decision-ready reporting", "Specialized dashboard systems"],
    best: ["Organizations with multiple data sources", "Teams needing forecasting or risk signals", "Executives needing decision-ready views", "Customers building a larger reporting system"],
    upgrade: "This is the top listed Studio package. Future upgrades would be specialized enterprise configuration."
  }
};

function setupStudioPricingGuide() {
  const buttons = document.querySelectorAll(".studio-level-button[data-plan]");
  const popup = document.getElementById("pricing-detail-popover");
  const close = document.getElementById("pricing-popover-close");
  const tier = document.getElementById("plan-detail-tier");
  const title = document.getElementById("plan-detail-title");
  const price = document.getElementById("plan-detail-price");
  const summary = document.getElementById("plan-detail-summary");
  const includes = document.getElementById("plan-detail-includes");
  const best = document.getElementById("plan-detail-best");
  const upgrade = document.getElementById("plan-detail-upgrade");
  const checkout = document.getElementById("plan-detail-checkout");

  if (!buttons.length || !popup || !tier || !title || !price || !summary || !includes || !best || !upgrade) {
    return;
  }

  const fillList = (element, items) => {
    element.replaceChildren(...items.map((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      return li;
    }));
  };

  const render = (key, shouldOpen = false) => {
    const plan = studioPricingPlans[key] || studioPricingPlans.t1l1;
    buttons.forEach((button) => button.classList.toggle("active", button.dataset.plan === key));
    tier.textContent = plan.tier;
    title.textContent = plan.title;
    price.textContent = plan.price;
    summary.textContent = plan.summary;
    fillList(includes, plan.includes);
    fillList(best, plan.best);
    upgrade.textContent = plan.upgrade;
    if (checkout) {
      checkout.href = `checkout.html?plan=${encodeURIComponent(key)}`;
    }
    if (shouldOpen) {
      popup.hidden = false;
    }
  };

  const openPlan = (button) => render(button.dataset.plan, true);
  const closePopover = () => {
    popup.hidden = true;
  };

  buttons.forEach((button) => {
    button.addEventListener("click", () => openPlan(button));
    button.addEventListener("mouseenter", () => openPlan(button));
    button.addEventListener("focus", () => openPlan(button));
  });

  if (close) {
    close.addEventListener("click", closePopover);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePopover();
    }
  });

  document.addEventListener("click", (event) => {
    if (popup.hidden) {
      return;
    }
    const clickedButton = event.target.closest(".studio-level-button[data-plan]");
    const clickedPopover = event.target.closest("#pricing-detail-popover");
    if (!clickedButton && !clickedPopover) {
      closePopover();
    }
  });

  render("t1l1", false);
}

setupStudioPricingGuide();





const checkoutPlans = {
  none: { label: "No current package", price: 0, access: 0, priceLabel: "$0" },
  ...Object.fromEntries(Object.values(studioPackageSummaries).map((plan) => [plan.key, {
    label: `${plan.packageShortName} - ${plan.name}`,
    price: plan.price,
    access: plan.access,
    priceLabel: plan.priceLabel,
    packageName: plan.packageName,
    levelName: plan.name,
    insightPromise: plan.insightPromise,
  }]))
};
function setupCheckoutFlow() {
  const current = document.getElementById("checkout-current-plan");
  const desired = document.getElementById("checkout-desired-plan");
  const planLabel = document.getElementById("checkout-plan-label");
  const amountDue = document.getElementById("checkout-amount-due");
  const note = document.getElementById("checkout-upgrade-note");
  const previewUnlock = document.getElementById("checkout-preview-unlock");
  const stripePlaceholder = document.getElementById("checkout-stripe-placeholder");
  const stripeStatus = document.getElementById("checkout-stripe-status");

  if (!current || !desired || !planLabel || !amountDue || !note || !previewUnlock) {
    return;
  }

  populateStudioPlanSelect(current, true);
  populateStudioPlanSelect(desired, false);

  const params = new URLSearchParams(window.location.search);
  const requestedPlan = params.get("plan");
  const storedPlan = sessionStorage.getItem("programmetrics_unlocked_plan");
  const normalizedStoredPlan = storedPlan === "none" ? "none" : normalizeStudioPlanKey(storedPlan);
  if (normalizedStoredPlan && checkoutPlans[normalizedStoredPlan]) {
    current.value = normalizedStoredPlan;
  }
  const normalizedRequestedPlan = requestedPlan ? normalizeStudioPlanKey(requestedPlan) : "";
  if (normalizedRequestedPlan && checkoutPlans[normalizedRequestedPlan] && normalizedRequestedPlan !== "none") {
    desired.value = normalizedRequestedPlan;
  }

  const money = (value) => `$${Number(value).toLocaleString()}`;
  const stripeConfig = window.ProgramMetricsStripeLinks || { mode: "not configured", full: {}, upgrades: {} };

  const getStripeLink = (currentKey, desiredKey, isUpgrade) => {
    if (isUpgrade) {
      return stripeConfig.upgrades?.[`${currentKey}__${desiredKey}`] || "";
    }
    return stripeConfig.full?.[desiredKey] || "";
  };

  const render = () => {
    const currentPlan = checkoutPlans[current.value === "none" ? "none" : normalizeStudioPlanKey(current.value)] || checkoutPlans.none;
    const desiredPlan = checkoutPlans[normalizeStudioPlanKey(desired.value)] || checkoutPlans["data-clean-essential"];
    const upgradeAmount = Math.max(0, desiredPlan.price - currentPlan.price);
    const isUpgrade = currentPlan.access > 0 && desiredPlan.access > currentPlan.access;
    const alreadyHasAccess = currentPlan.access >= desiredPlan.access;
    const stripeLink = getStripeLink(current.value, desired.value, isUpgrade);

    planLabel.textContent = desiredPlan.label;
    amountDue.textContent = alreadyHasAccess ? "$0" : money(upgradeAmount || desiredPlan.price);

    if (alreadyHasAccess) {
      note.textContent = `The current paid level already includes ${desiredPlan.label}. No additional checkout is needed.`;
    } else if (isUpgrade) {
      note.textContent = `Upgrade from ${currentPlan.label} to ${desiredPlan.label}. Customer pays only the difference: ${money(upgradeAmount)}.`;
    } else {
      note.textContent = `New customer purchase. The full selected level is due: ${money(desiredPlan.price)}.`;
    }

    previewUnlock.href = `studio.html?access=${encodeURIComponent(desired.value)}&checkout=preview`;
    previewUnlock.textContent = alreadyHasAccess ? "Open Studio Access" : "Preview Studio Access";

    if (stripePlaceholder) {
      if (alreadyHasAccess) {
        stripePlaceholder.href = previewUnlock.href;
        stripePlaceholder.textContent = "No Checkout Needed";
        stripePlaceholder.removeAttribute("target");
        stripePlaceholder.removeAttribute("rel");
      } else if (stripeLink) {
        stripePlaceholder.href = stripeLink;
        stripePlaceholder.textContent = isUpgrade ? "Pay Upgrade in Stripe" : "Pay in Stripe";
        stripePlaceholder.target = "_blank";
        stripePlaceholder.rel = "noopener";
      } else {
        stripePlaceholder.href = "#stripe-links-needed";
        stripePlaceholder.textContent = isUpgrade ? "Add Upgrade Link" : "Add Stripe Link";
        stripePlaceholder.removeAttribute("target");
        stripePlaceholder.removeAttribute("rel");
      }
    }

    if (stripeStatus) {
      if (alreadyHasAccess) {
        stripeStatus.textContent = "This browser session already has this level selected. In production, Stripe payment verification should issue signed Studio access.";
      } else if (stripeLink) {
        stripeStatus.textContent = `${stripeConfig.mode || "Stripe"} checkout link is connected for this selection. After payment, return customers to Studio with the matching paid access.`;
      } else {
        const key = isUpgrade ? `${current.value}__${desired.value}` : desired.value;
        stripeStatus.textContent = `No Stripe Payment Link has been added for ${key}. Paste the sandbox URL into stripe-links.js to activate this checkout path.`;
      }
    }
  };

  previewUnlock.addEventListener("click", () => {
    sessionStorage.setItem("programmetrics_unlocked_plan", desired.value);
  });
  current.addEventListener("change", render);
  desired.addEventListener("change", render);
  render();
}

setupCheckoutFlow();











