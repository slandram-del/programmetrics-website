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

function renderStudioDashboardPreview(analysis) {
  const shell = document.getElementById("studio-preview-shell");
  const empty = document.getElementById("studio-preview-empty");
  if (!shell || !analysis) {
    return;
  }

  if (empty) {
    empty.style.display = "none";
  }

  const missingEntries = Object.entries(analysis.missing_values || {}).filter(([, count]) => Number(count) > 0);
  const categoryEntries = Object.entries(analysis.category_summary || {});
  const previewRows = analysis.preview_rows || [];
  const previewColumns = previewRows.length ? Object.keys(previewRows[0]).slice(0, 6) : [];

  shell.replaceChildren();
  shell.classList.add("visible");

  const header = document.createElement("div");
  header.className = "dashboard-preview-header";
  header.innerHTML = `<span>Dashboard-ready preview</span><strong>${escapeHtml(analysis.source_file || "Uploaded file")}</strong>`;
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
  answerPanel.innerHTML = `<h4>What this dashboard tells me</h4><p>${escapeHtml(analysis.answer || "ProgramMetrics analyzed the file and prepared a dashboard-ready summary.")}</p>`;
  shell.appendChild(answerPanel);

  const visualGrid = document.createElement("div");
  visualGrid.className = "dashboard-visual-grid";

  const categoryPanel = document.createElement("section");
  categoryPanel.className = "dashboard-preview-panel";
  categoryPanel.innerHTML = "<h4>Top category chart</h4>";
  if (categoryEntries.length) {
    const [column, counts] = categoryEntries[0];
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
  visualGrid.appendChild(categoryPanel);

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
  visualGrid.appendChild(missingPanel);
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

  input.addEventListener("change", updateResult);

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
let activeBrandLogoDataUrl = "";

setupFileConverter("file-converter-input", "converter-result", "file-output-language", "file-output-format", "file-convert-button", "file-analyze-button", "file-insight-panel");
setupFileConverter("studio-file-converter-input", "studio-converter-result", "studio-output-language", "studio-output-format", "studio-convert-button", "studio-analyze-button", "studio-insight-panel");
const studioPackageSummaries = {
  t1l1: { access: 1, label: "Tier 1 Level 1 - $49", summary: "Unlocks upload, basic conversion, browser preview, and standard downloads." },
  t1l2: { access: 2, label: "Tier 1 Level 2 - $99", summary: "Adds duplicate detection, missing-value checks, and cleanup notes." },
  t1l3: { access: 3, label: "Tier 1 Level 3 - $199", summary: "Adds cleaned-data export, PDF/HTML reports, and basic dashboard insights." },
  t2l1: { access: 4, label: "Tier 2 Level 1 - $299", summary: "Adds branded report structure and JSON package exports." },
  t2l2: { access: 5, label: "Tier 2 Level 2 - $499", summary: "Adds translated report setup and multilingual report outputs." },
  t2l3: { access: 6, label: "Tier 2 Level 3 - $799", summary: "Adds richer quality checks and recurring report setup." },
  t3: { access: 7, label: "Tier 3 Workflow System - $1,500", summary: "Unlocks workflow rules, dashboard logic, custom fields, and integrations." },
  t4: { access: 8, label: "Tier 4 Advanced Analytics - $3,500", summary: "Unlocks advanced analytics, automation, multi-file workflows, and predictive reporting logic." },
};

function setupStudioPackageAccess() {
  const accessSelect = document.getElementById("studio-access-select");
  const packageSelect = document.getElementById("studio-package-select");
  if (!packageSelect && !accessSelect) {
    return;
  }

  const packageCard = document.getElementById("active-package-card");
  const packageLabel = document.getElementById("studio-package-label");
  const gatedItems = document.querySelectorAll("[data-required-access]");
  const packageButtons = document.querySelectorAll("[data-select-package]");
  const storageKey = "programmetrics_unlocked_plan";

  const params = new URLSearchParams(window.location.search);
  const checkoutAccess = params.get("access") || params.get("plan");
  if (checkoutAccess && studioPackageSummaries[checkoutAccess]) {
    sessionStorage.setItem(storageKey, checkoutAccess);
  }

  if (accessSelect) {
    const storedAccess = sessionStorage.getItem(storageKey);
    if (storedAccess && studioPackageSummaries[storedAccess]) {
      accessSelect.value = storedAccess;
    }
    accessSelect.disabled = false;
    accessSelect.removeAttribute("aria-disabled");
  }

  const currentUnlocked = () => {
    const selected = studioPackageSummaries[accessSelect?.value] || studioPackageSummaries.t1l1;
    return selected;
  };

  const currentPreview = () => {
    const selected = studioPackageSummaries[packageSelect?.value] || currentUnlocked();
    return selected;
  };

  const resetLockedSelect = (select) => {
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption || !selectedOption.disabled) {
      return;
    }

    const fallback = Array.from(select.options).find((option) => !option.disabled);
    if (fallback) {
      select.value = fallback.value;
      select.dispatchEvent(new Event("change"));
    }
  };

  const applyAccess = () => {
    const unlocked = currentUnlocked();
    const preview = currentPreview();
    const access = unlocked.access;

    if (packageCard) {
      const lockedPreview = shouldWatermark(preview, unlocked);
      packageCard.innerHTML = `<div><span>Unlocked</span><strong>${escapeHtml(unlocked.label)}</strong></div><div><span>Previewing</span><strong>${escapeHtml(preview.label)}</strong></div><div><span>Private session processing</span><strong>${lockedPreview ? "Preview only - upgrade to export locked outputs" : "Included outputs ready for download"}</strong></div><small>Use your unlocked access for real uploads. Preview higher-tier outputs with protected previews. Full downloads and exports require the matching Studio level.</small>`;
    }

    if (packageLabel) {
      packageLabel.textContent = `Unlocked: ${unlocked.label}`;
    }

    gatedItems.forEach((item) => {
      const required = Number(item.dataset.requiredAccess || "1");
      const unlockedItem = access >= required;
      item.classList.toggle("is-locked", !unlockedItem);
      item.classList.toggle("is-unlocked", unlockedItem);
      if (item.tagName !== "OPTION") {
        item.dataset.lockMessage = unlockedItem ? "Unlocked" : `Full export requires ${getLevelLabelByAccess(required)}`;
      }
    });
    updateStudioDownloadButton();
  };

  accessSelect?.addEventListener("change", () => {
    if (accessSelect.value && studioPackageSummaries[accessSelect.value]) {
      sessionStorage.setItem(storageKey, accessSelect.value);
    }
    applyAccess();
  });
  packageSelect?.addEventListener("change", applyAccess);
  document.getElementById("studio-output-format")?.addEventListener("change", updateStudioDownloadButton);

  packageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const packageValue = button.dataset.selectPackage;
      if (packageValue && studioPackageSummaries[packageValue] && packageSelect) {
        packageSelect.value = packageValue;
        packageSelect.dispatchEvent(new Event("change"));
      }
    });
  });

  applyAccess();
}

const studioExampleTemplates = {
  general: {
    title: "General business report example",
    columns: ["record", "team", "category", "status", "month", "amount"],
    rows: [
      { record: "REQ-1001", team: "Operations", category: "Supplies", status: "Complete", month: "January", amount: 1240 },
      { record: "REQ-1002", team: "Finance", category: "Invoice", status: "Review", month: "January", amount: 3180 },
      { record: "REQ-1003", team: "Operations", category: "Supplies", status: "Complete", month: "February", amount: 980 },
      { record: "REQ-1004", team: "Programs", category: "Service", status: "Delayed", month: "February", amount: 2150 },
      { record: "REQ-1005", team: "Finance", category: "Invoice", status: "Complete", month: "March", amount: 4400 },
      { record: "REQ-1006", team: "Programs", category: "Service", status: "Review", month: "March", amount: 1690 },
    ],
  },
  operations: {
    title: "Operations template example",
    columns: ["job", "site", "owner", "priority", "status", "days_open"],
    rows: [
      { job: "JOB-214", site: "North", owner: "Field A", priority: "High", status: "Open", days_open: 8 },
      { job: "JOB-215", site: "South", owner: "Field B", priority: "Medium", status: "Complete", days_open: 3 },
      { job: "JOB-216", site: "North", owner: "Field A", priority: "Low", status: "Complete", days_open: 2 },
      { job: "JOB-217", site: "West", owner: "Field C", priority: "High", status: "Delayed", days_open: 14 },
      { job: "JOB-218", site: "South", owner: "Field B", priority: "Medium", status: "Open", days_open: 6 },
      { job: "JOB-219", site: "West", owner: "Field C", priority: "High", status: "Open", days_open: 10 },
    ],
  },
  program: {
    title: "Program and service template example",
    columns: ["participant", "program", "referral_source", "service_status", "outcome", "sessions"],
    rows: [
      { participant: "P-100", program: "Youth", referral_source: "School", service_status: "Active", outcome: "Improving", sessions: 6 },
      { participant: "P-101", program: "Family", referral_source: "Agency", service_status: "Closed", outcome: "Completed", sessions: 12 },
      { participant: "P-102", program: "Youth", referral_source: "Agency", service_status: "Active", outcome: "Pending", sessions: 3 },
      { participant: "P-103", program: "Adult", referral_source: "Self", service_status: "Waitlist", outcome: "Pending", sessions: 0 },
      { participant: "P-104", program: "Family", referral_source: "School", service_status: "Active", outcome: "Improving", sessions: 8 },
      { participant: "P-105", program: "Adult", referral_source: "Self", service_status: "Closed", outcome: "Completed", sessions: 10 },
    ],
  },
  monthly: {
    title: "Grant and monthly report example",
    columns: ["month", "funding_area", "deliverable", "status", "submitted", "units"],
    rows: [
      { month: "January", funding_area: "Training", deliverable: "Roster", status: "Submitted", submitted: "Yes", units: 42 },
      { month: "January", funding_area: "Outreach", deliverable: "Contacts", status: "Submitted", submitted: "Yes", units: 88 },
      { month: "February", funding_area: "Training", deliverable: "Roster", status: "Draft", submitted: "No", units: 37 },
      { month: "February", funding_area: "Reporting", deliverable: "Narrative", status: "Review", submitted: "No", units: 1 },
      { month: "March", funding_area: "Outreach", deliverable: "Contacts", status: "Submitted", submitted: "Yes", units: 104 },
      { month: "March", funding_area: "Reporting", deliverable: "Narrative", status: "Submitted", submitted: "Yes", units: 1 },
    ],
  },
  survey: {
    title: "Survey and feedback example",
    columns: ["response", "location", "role", "rating", "satisfaction", "follow_up"],
    rows: [
      { response: "R-001", location: "North", role: "Client", rating: 5, satisfaction: "Very satisfied", follow_up: "No" },
      { response: "R-002", location: "South", role: "Partner", rating: 4, satisfaction: "Satisfied", follow_up: "No" },
      { response: "R-003", location: "North", role: "Client", rating: 3, satisfaction: "Neutral", follow_up: "Yes" },
      { response: "R-004", location: "West", role: "Staff", rating: 4, satisfaction: "Satisfied", follow_up: "No" },
      { response: "R-005", location: "South", role: "Client", rating: 2, satisfaction: "Needs support", follow_up: "Yes" },
      { response: "R-006", location: "West", role: "Partner", rating: 5, satisfaction: "Very satisfied", follow_up: "No" },
    ],
  },
};

studioExampleTemplates.branded = {
  title: "Branded report layout example",
  columns: ["report", "client_group", "section", "brand_status", "approval", "score"],
  rows: [
    { report: "Q1 Board Pack", client_group: "Leadership", section: "KPI", brand_status: "Applied", approval: "Ready", score: 94 },
    { report: "Q1 Board Pack", client_group: "Finance", section: "Budget", brand_status: "Applied", approval: "Review", score: 88 },
    { report: "Monthly Summary", client_group: "Programs", section: "Outcomes", brand_status: "Applied", approval: "Ready", score: 91 },
    { report: "Monthly Summary", client_group: "Operations", section: "Activity", brand_status: "Draft", approval: "Review", score: 82 },
    { report: "Grant Report", client_group: "Programs", section: "Compliance", brand_status: "Applied", approval: "Ready", score: 96 },
    { report: "Grant Report", client_group: "Leadership", section: "Narrative", brand_status: "Draft", approval: "Review", score: 85 },
  ],
};

studioExampleTemplates.workflow = {
  title: "Workflow system setup example",
  columns: ["workflow", "step", "owner", "trigger", "status", "automation_count"],
  rows: [
    { workflow: "Intake", step: "New submission", owner: "Coordinator", trigger: "Form received", status: "Automated", automation_count: 12 },
    { workflow: "Intake", step: "Eligibility review", owner: "Supervisor", trigger: "Checklist complete", status: "Manual review", automation_count: 4 },
    { workflow: "Reporting", step: "Monthly export", owner: "Analyst", trigger: "Month close", status: "Automated", automation_count: 9 },
    { workflow: "Reporting", step: "Director approval", owner: "Director", trigger: "Report ready", status: "Manual review", automation_count: 2 },
    { workflow: "Follow-up", step: "Reminder", owner: "Coordinator", trigger: "7 days open", status: "Automated", automation_count: 15 },
    { workflow: "Follow-up", step: "Closure", owner: "Supervisor", trigger: "Outcome entered", status: "Automated", automation_count: 8 },
  ],
};

studioExampleTemplates.advanced = {
  title: "Advanced analytics package example",
  columns: ["segment", "risk_level", "prediction", "action", "confidence", "records"],
  rows: [
    { segment: "North", risk_level: "Low", prediction: "On track", action: "Monitor", confidence: 91, records: 42 },
    { segment: "South", risk_level: "Medium", prediction: "Watch", action: "Review", confidence: 84, records: 37 },
    { segment: "West", risk_level: "High", prediction: "Intervention", action: "Escalate", confidence: 89, records: 18 },
    { segment: "East", risk_level: "Medium", prediction: "Watch", action: "Review", confidence: 82, records: 29 },
    { segment: "Central", risk_level: "Low", prediction: "On track", action: "Monitor", confidence: 93, records: 51 },
    { segment: "Remote", risk_level: "High", prediction: "Intervention", action: "Escalate", confidence: 87, records: 14 },
  ],
};
function getUnlockedStudioAccess() {
  const accessSelect = document.getElementById("studio-access-select");
  const selected = studioPackageSummaries[accessSelect?.value] || studioPackageSummaries.t1l1;
  return selected;
}

function getStudioAccess() {
  const packageSelect = document.getElementById("studio-package-select");
  const selected = studioPackageSummaries[packageSelect?.value] || getUnlockedStudioAccess();
  return selected;
}
const studioFeatureRequirements = {
  upload: 1,
  conversion: 1,
  duplicateChecks: 2,
  missingReview: 2,
  cleanupNotes: 2,
  cleanedExport: 3,
  report: 3,
  dashboard: 3,
  branded: 4,
  jsonPackage: 4,
  translatedReport: 5,
  reusableWorkflow: 5,
  recurringReport: 6,
  workflowActivation: 7,
  advancedAnalytics: 8,
};

const studioOutputRequirements = {
  txt: 1,
  csv: 3,
  cleaned_csv: 3,
  pdf: 3,
  html: 3,
  json: 4,
  branded_report: 4,
  translated_report: 5,
  reusable_workflow: 5,
  recurring_report: 6,
  workflow_activation: 7,
  workflow_package: 7,
  advanced_analytics: 8,
};

function accessValue(level) {
  if (typeof level === "number") return level;
  if (typeof level === "string") return studioPackageSummaries[level]?.access || 0;
  return Number(level?.access || 0);
}

function getLevelLabelByAccess(requiredAccess) {
  const entry = Object.values(studioPackageSummaries).find((plan) => plan.access === Number(requiredAccess));
  return entry ? entry.label : `Tier access ${requiredAccess}`;
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

function updateStudioDownloadButton() {
  const button = document.getElementById("studio-convert-button");
  const format = document.getElementById("studio-output-format");
  if (!button || !format) return;
  const unlocked = getUnlockedStudioAccess();
  const outputType = format.value || "txt";
  const unlockedOutput = canDownloadOutput(outputType, unlocked);
  button.textContent = unlockedOutput ? "Download" : "Unlock download";
  button.classList.toggle("is-output-locked", !unlockedOutput);
}
function canUploadRealFile(unlockedLevel) {
  return accessValue(unlockedLevel) >= studioFeatureRequirements.upload;
}

function canPreviewFeature(feature, selectedPreviewLevel) {
  return accessValue(selectedPreviewLevel) >= (studioFeatureRequirements[feature] || 1);
}

function canDownloadOutput(outputType, unlockedLevel) {
  return accessValue(unlockedLevel) >= getRequiredLevelForOutput(outputType);
}

function canUseFullRows(unlockedLevel) {
  return accessValue(unlockedLevel) >= studioFeatureRequirements.cleanedExport;
}

function shouldWatermark(selectedPreviewLevel, unlockedLevel) {
  return accessValue(selectedPreviewLevel) > accessValue(unlockedLevel);
}

function getRequiredLevelForOutput(outputType) {
  return studioOutputRequirements[outputType] || 1;
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
    reportName: getBrandingFieldValue("studio-brand-org"),
    subtitle: getBrandingFieldValue("studio-brand-subtitle"),
    logoDataUrl: activeBrandLogoDataUrl,
    primaryColor: getBrandingFieldValue("studio-brand-primary") || "#2563eb",
    accentColor: getBrandingFieldValue("studio-brand-accent") || "#14b8a6",
    style: getBrandingFieldValue("studio-brand-style") || "Clean and professional",
    preparedFor: getBrandingFieldValue("studio-brand-prepared-for"),
    preparedBy: getBrandingFieldValue("studio-brand-prepared-by"),
    footerNote: getBrandingFieldValue("studio-brand-footer"),
    contact: getBrandingFieldValue("studio-brand-contact"),
    canExport: canExportBrandedReport(unlocked),
    visibleInPreview: accessValue(preview) >= studioFeatureRequirements.branded,
  };
  settings.hasBranding = Boolean(settings.reportName || settings.subtitle || settings.logoDataUrl || settings.preparedFor || settings.preparedBy || settings.footerNote || settings.contact);
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
    lockLabel: "Branding preview \u2014 export requires Tier 2 Level 1+",
  };
}

function brandingReportHeaderHtml(branding) {
  if (!branding) return "";
  const logo = branding.logoDataUrl ? `<img src="${escapeHtml(branding.logoDataUrl)}" alt="Report logo">` : "";
  const meta = [branding.preparedFor ? `Prepared for ${branding.preparedFor}` : "", branding.preparedBy ? `Prepared by ${branding.preparedBy}` : "", branding.style || ""].filter(Boolean).map(escapeHtml).join(" | ");
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

function numericColumnSummary(rows, columns) {
  return columns.reduce((summary, column) => {
    const values = rows.map((row) => Number(row[column])).filter((value) => Number.isFinite(value));
    if (values.length >= Math.max(2, Math.round(rows.length * 0.35))) {
      const sorted = values.slice().sort((a, b) => a - b);
      summary[column] = {
        min: sorted[0],
        max: sorted[sorted.length - 1],
        mean: values.reduce((total, value) => total + value, 0) / values.length,
        median: sorted[Math.floor(sorted.length / 2)],
      };
    }
    return summary;
  }, {});
}

function buildStudioAnalysisFromRows(rows, file, sourceKind) {
  const unlocked = getUnlockedStudioAccess();
  const preview = getStudioAccess();
  const normalizedRows = normalizeRows(rows).slice(0, 2000);
  const columns = normalizedRows.length ? Object.keys(normalizedRows[0]) : [];
  const missingValues = columns.reduce((counts, column) => {
    counts[column] = normalizedRows.filter((row) => String(row[column] ?? "").trim() === "").length;
    return counts;
  }, {});
  const numericSummary = numericColumnSummary(normalizedRows, columns);
  const numericColumns = Object.keys(numericSummary);
  const categorySummary = {};
  columns.filter((column) => !numericColumns.includes(column)).slice(0, 4).forEach((column) => {
    categorySummary[column] = countValues(normalizedRows.slice(0, 250), column);
  });
  const missingTotal = Object.values(missingValues).reduce((total, count) => total + Number(count || 0), 0);
  const duplicates = duplicateRowCount(normalizedRows);
  const qualityPenalty = Math.min(65, Math.round((missingTotal / Math.max(1, normalizedRows.length * Math.max(1, columns.length))) * 45) + Math.min(20, duplicates * 2));
  const qualityScore = Math.max(35, 100 - qualityPenalty);
  const previewLimit = getPreviewLimitRows(unlocked, preview);
  const locked = shouldWatermark(preview, unlocked);
  const cleaningSteps = [
    "Detected fields and table shape from the uploaded file",
    canPreviewFeature("duplicateChecks", preview) ? "Reviewed duplicate records" : "Duplicate checks are preview-locked until Tier 1 Level 2",
    canPreviewFeature("missingReview", preview) ? "Counted missing values by field" : "Missing-value review is preview-locked until Tier 1 Level 2",
    canPreviewFeature("cleanedExport", preview) ? "Prepared cleaned-export preview" : "Cleaned export requires Tier 1 Level 3",
    canPreviewFeature("branded", preview) ? "Mapped branded report sections" : "Branded report structure requires Tier 2 Level 1",
    canPreviewFeature("translatedReport", preview) ? "Prepared translated report setup preview" : "Translated report setup requires Tier 2 Level 2",
    canPreviewFeature("recurringReport", preview) ? "Outlined recurring report setup" : "Recurring report setup requires Tier 2 Level 3",
    canPreviewFeature("workflowActivation", preview) ? "Mapped workflow activation steps" : "Workflow activation requires Tier 3",
    canPreviewFeature("advancedAnalytics", preview) ? "Previewed advanced analytics signals" : "Advanced analytics export requires Tier 4",
  ];

  return {
    is_example: false,
    source_kind: sourceKind,
    source_file: file?.name || "Uploaded file",
    file_size: file ? formatFileSize(file.size) : "Browser session",
    rows: normalizedRows.length,
    columns: columns.length,
    column_names: columns,
    detected_fields: columns,
    duplicate_rows: canPreviewFeature("duplicateChecks", preview) ? duplicates : "Preview locked",
    missing_values: canPreviewFeature("missingReview", preview) ? missingValues : {},
    missing_value_count: missingTotal,
    numeric_summary: canPreviewFeature("advancedAnalytics", preview) ? numericSummary : {},
    category_summary: categorySummary,
    preview_rows: normalizedRows.slice(0, previewLimit),
    preview_limit: previewLimit,
    quality_score: canPreviewFeature("missingReview", preview) ? qualityScore : "Preview locked",
    cleaning_steps: cleaningSteps,
    package_label: preview.label,
    unlocked_label: unlocked.label,
    preview_label: preview.label,
    watermark: locked,
    locked,
    answer: locked
      ? `Previewing ${preview.label} with uploaded data. Preview only - upgrade to export full outputs, reusable reports, workflow activation, or advanced analytics.`
      : `Unlocked ${unlocked.label} is active. Outputs included in this level can be downloaded from this browser session.`,
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
        } else if (["csv", "tsv"].includes(extension)) {
          rows = rowsFromDelimitedText(extension === "tsv" ? text.replace(/\t/g, ",") : text);
          sourceKind = extension.toUpperCase();
        } else {
          rows = rowsFromPlainText(text);
          sourceKind = "Text";
        }
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
    result.textContent = "Upload requires Tier 1 Level 1 access.";
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
    await runStudioStatusSteps(["Reading file", "Detecting columns", "Checking missing values", "Checking duplicates", "Building preview"]);
    activeStudioUploadedAnalysis = await readStudioFileAsAnalysis(file);
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
  return `<!doctype html><html><head><meta charset="utf-8"><title>ProgramMetrics Studio ${escapeHtml(formatLabel)}</title><style>body{font-family:Arial,sans-serif;margin:36px;color:#071525;background:#f8fafc;line-height:1.5;position:relative}${watermark}.card,section{background:#fff;border:1px solid #dbe4ef;border-radius:8px;padding:18px;margin:14px 0}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kpis strong{display:block;color:#2563eb;font-size:28px}.brand-report-header{background:#fff;border:1px solid #dbe4ef;border-top:8px solid #2563eb;border-radius:8px;padding:24px;margin-bottom:18px}.brand-report-header>div{display:flex;gap:16px;align-items:center}.brand-report-header img{width:72px;height:72px;object-fit:contain;border:1px solid #dbe4ef;border-radius:8px}.brand-report-header p{margin:0;color:#0f766e;font-weight:700;text-transform:uppercase;font-size:12px}.brand-report-header h1{margin:4px 0;color:#071525}.brand-report-header h2{margin:0;color:#475569;font-size:18px;font-weight:600}.brand-report-header small,footer{color:#64748b}table{width:100%;border-collapse:collapse;background:#fff}th,td{border:1px solid #dbe4ef;padding:8px;text-align:left;font-size:13px}th{background:#eef6ff}@media(max-width:800px){.kpis{grid-template-columns:1fr}.brand-report-header>div{display:block}}</style></head><body>${brandedHeader}<p><strong>Unlocked:</strong> ${escapeHtml(analysis.unlocked_label)} | <strong>Previewing:</strong> ${escapeHtml(analysis.preview_label)}</p><p>${escapeHtml(analysis.answer)}</p><div class="kpis"><div class="card"><strong>${escapeHtml(analysis.rows)}</strong>Rows</div><div class="card"><strong>${escapeHtml(analysis.columns)}</strong>Columns</div><div class="card"><strong>${escapeHtml(analysis.duplicate_rows)}</strong>Duplicates</div><div class="card"><strong>${escapeHtml(analysis.quality_score)}</strong>Quality score</div></div><section><h2>Session preview rows</h2><p>Showing first ${escapeHtml(analysis.preview_limit)} rows.</p><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></section>${brandedFooter}</body></html>`;
}

async function studioDownloadCurrentOutput(input, result, format, language, button, convertLabel) {
  const outputType = format ? format.value : "txt";
  const unlocked = getUnlockedStudioAccess();
  const required = getRequiredLevelForOutput(outputType);
  if (!canDownloadOutput(outputType, unlocked)) {
    const targetPlan = Object.keys(studioPackageSummaries).find((key) => studioPackageSummaries[key].access === required) || "t1l3";
    result.innerHTML = `Preview only - upgrade to export. <strong>${escapeHtml(format?.options[format.selectedIndex]?.text || outputType)}</strong> requires ${escapeHtml(getLevelLabelByAccess(required))}. <a href="checkout.html?plan=${encodeURIComponent(targetPlan)}">Unlock download</a>`;
    updateStudioDownloadButton();
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
    let blob;
    let filename;
    if (outputType === "csv") {
      blob = new Blob([csvFromRows(analysis.preview_rows || [])], { type: "text/csv;charset=utf-8" });
      filename = "programmetrics-cleaned-preview.csv";
    } else if (outputType === "json" || outputType === "workflow_package" || outputType === "advanced_analytics") {
      blob = new Blob([JSON.stringify({ analysis, language: language?.value || "English" }, null, 2)], { type: "application/json;charset=utf-8" });
      filename = outputType === "workflow_package" ? "programmetrics-workflow-package.json" : outputType === "advanced_analytics" ? "programmetrics-advanced-analytics-export.json" : "programmetrics-studio-package.json";
    } else if (outputType === "branded_report") {
      blob = new Blob([reportHtmlFromAnalysis(analysis, "Branded report")], { type: "text/html;charset=utf-8" });
      filename = "programmetrics-branded-report.html";
    } else if (["html", "pdf"].includes(outputType)) {
      blob = new Blob([reportHtmlFromAnalysis(analysis, outputType === "pdf" ? "PDF-ready report" : "HTML report")], { type: "text/html;charset=utf-8" });
      filename = outputType === "pdf" ? "programmetrics-pdf-ready-report.html" : "programmetrics-report.html";
    } else {
      const text = `${analysis.source_file}\nUnlocked: ${analysis.unlocked_label}\nPreviewing: ${analysis.preview_label}\nRows: ${analysis.rows}\nColumns: ${analysis.columns}\nQuality score: ${analysis.quality_score}\n\n${analysis.cleaning_steps.join("\n")}`;
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

function renderStudioDashboardPreview(analysis) {
  const shell = document.getElementById("studio-preview-shell");
  const empty = document.getElementById("studio-preview-empty");
  if (!shell || !analysis) return;
  if (empty) empty.style.display = "none";

  const unlocked = getUnlockedStudioAccess();
  const preview = getStudioAccess();
  const locked = shouldWatermark(preview, unlocked) || Boolean(analysis.watermark);
  const missingEntries = Object.entries(analysis.missing_values || {}).filter(([, count]) => Number(count) > 0);
  const categoryEntries = Object.entries(analysis.category_summary || {});
  const previewRows = analysis.preview_rows || [];
  const previewColumns = previewRows.length ? Object.keys(previewRows[0]).slice(0, 6) : [];

  shell.replaceChildren();
  shell.classList.add("visible");
  shell.classList.toggle("is-watermarked", locked);

  const status = document.createElement("div");
  status.className = "studio-preview-status";
  status.innerHTML = `<span>Unlocked: ${escapeHtml(unlocked.label)}</span><span>Previewing: ${escapeHtml(preview.label)}</span><strong>${locked ? "Preview only - upgrade to export" : "Downloads unlocked for included outputs"}</strong>`;
  shell.appendChild(status);

  const branding = applyBrandingToPreview(getBrandingSettings());
  if (branding) {
    const brandPanel = document.createElement("section");
    brandPanel.className = `studio-brand-preview${branding.previewOnly ? " is-locked" : " is-unlocked"}`;
    brandPanel.style.setProperty("--brand-primary", branding.primaryColor);
    brandPanel.style.setProperty("--brand-accent", branding.accentColor);
    const logo = branding.logoDataUrl ? `<img src="${escapeHtml(branding.logoDataUrl)}" alt="Report logo preview">` : `<div class="studio-brand-textmark">${escapeHtml((branding.title || "P").slice(0, 1).toUpperCase())}</div>`;
    const meta = [branding.preparedFor ? `Prepared for ${branding.preparedFor}` : "", branding.preparedBy ? `Prepared by ${branding.preparedBy}` : "", branding.contact].filter(Boolean).map(escapeHtml).join(" | ");
    brandPanel.innerHTML = `<div class="studio-brand-preview-top"><div class="studio-brand-logo">${logo}</div><div><span>${escapeHtml(branding.style)}</span><h4>${escapeHtml(branding.title)}</h4><p>${escapeHtml(branding.subtitle)}</p></div></div><small>${escapeHtml(branding.lockLabel)}</small>${meta ? `<p class="studio-brand-preview-meta">${meta}</p>` : ""}`;
    shell.appendChild(brandPanel);
  }

  const header = document.createElement("div");
  header.className = "dashboard-preview-header";
  header.innerHTML = `<span>Dashboard-ready preview</span><strong>${escapeHtml(analysis.source_file || "Uploaded file")}</strong><small>${escapeHtml(analysis.file_size || "Current browser session")} | Showing first ${escapeHtml(analysis.preview_limit || previewRows.length || 0)} rows</small>`;
  shell.appendChild(header);

  const stats = document.createElement("div");
  stats.className = "dashboard-kpi-grid";
  [
    ["Rows", analysis.rows ?? 0],
    ["Columns", analysis.columns ?? 0],
    ["Missing Values", canPreviewFeature("missingReview", preview) ? analysis.missing_value_count ?? 0 : "Locked"],
    ["Quality Score", canPreviewFeature("missingReview", preview) ? analysis.quality_score ?? "-" : "Locked"],
  ].forEach(([label, value]) => {
    const card = document.createElement("div");
    card.className = "dashboard-kpi-card";
    card.innerHTML = `<strong>${escapeHtml(value)}</strong><span>${escapeHtml(label)}</span>`;
    stats.appendChild(card);
  });
  shell.appendChild(stats);

  const fieldsPanel = document.createElement("section");
  fieldsPanel.className = "dashboard-preview-panel";
  fieldsPanel.innerHTML = `<h4>Detected fields</h4><p>${(analysis.detected_fields || analysis.column_names || []).slice(0, 12).map(escapeHtml).join(", ") || "No fields detected yet."}</p>`;
  shell.appendChild(fieldsPanel);

  const answerPanel = document.createElement("section");
  answerPanel.className = "dashboard-preview-panel";
  answerPanel.innerHTML = `<h4>What this dashboard tells me</h4><p>${escapeHtml(analysis.answer || "ProgramMetrics analyzed the file and prepared a dashboard-ready summary.")}</p>`;
  shell.appendChild(answerPanel);

  const visualGrid = document.createElement("div");
  visualGrid.className = "dashboard-visual-grid";
  const categoryPanel = document.createElement("section");
  categoryPanel.className = "dashboard-preview-panel";
  categoryPanel.innerHTML = "<h4>Basic chart preview</h4>";
  if (categoryEntries.length) {
    const [column, counts] = categoryEntries[0];
    const maxCount = Math.max(...Object.values(counts).map(Number), 1);
    categoryPanel.innerHTML += `<p class="dashboard-chart-label">${escapeHtml(column)}</p>`;
    Object.entries(counts).slice(0, 6).forEach(([name, count]) => {
      categoryPanel.innerHTML += `<div class="dashboard-bar-row"><span>${escapeHtml(name)}</span><div><i style="width:${Math.max(8, Math.round((Number(count) / maxCount) * 100))}%"></i></div><b>${escapeHtml(count)}</b></div>`;
    });
  } else {
    categoryPanel.innerHTML += "<p>No categorical chart fields were detected yet.</p>";
  }
  visualGrid.appendChild(categoryPanel);

  const missingPanel = document.createElement("section");
  missingPanel.className = `dashboard-preview-panel${canPreviewFeature("missingReview", preview) ? "" : " locked-preview-panel"}`;
  missingPanel.innerHTML = `<h4>Missing-value review</h4>${canPreviewFeature("missingReview", preview) ? "" : `<p>Full missing-value review requires ${escapeHtml(getLevelLabelByAccess(2))}.</p><a class="button mini secondary-mini" href="checkout.html?plan=t1l2">Unlock download</a>`}`;
  if (canPreviewFeature("missingReview", preview) && missingEntries.length) {
    const maxMissing = Math.max(...missingEntries.map(([, count]) => Number(count)), 1);
    missingEntries.slice(0, 6).forEach(([column, count]) => {
      missingPanel.innerHTML += `<div class="dashboard-bar-row missing-bar"><span>${escapeHtml(column)}</span><div><i style="width:${Math.max(8, Math.round((Number(count) / maxMissing) * 100))}%"></i></div><b>${escapeHtml(count)}</b></div>`;
    });
  } else if (canPreviewFeature("missingReview", preview)) {
    missingPanel.innerHTML += "<p>No missing values were detected in table-ready fields.</p>";
  }
  visualGrid.appendChild(missingPanel);
  shell.appendChild(visualGrid);

  const premiumPanels = [
    ["branded", "Branded report structure", 4, "Reusable report framing, cover sections, and client-ready layout."],
    ["translatedReport", "Translated report setup", 5, "Language-ready labels, summary sections, and reusable export workflow."],
    ["recurringReport", "Recurring report setup", 6, "Recurring quality rules, cadence notes, and repeatable report sections."],
    ["workflowActivation", "Workflow system preview", 7, "Workflow triggers, ownership steps, and activation/export map."],
    ["advancedAnalytics", "Advanced analytics preview", 8, "Signals, segments, and advanced export planning."],
  ];
  premiumPanels.forEach(([feature, title, required, text]) => {
    if (!canPreviewFeature(feature, preview) && accessValue(preview) < required - 1) return;
    const panel = document.createElement("section");
    panel.className = `dashboard-preview-panel${canPreviewFeature(feature, preview) ? "" : " locked-preview-panel"}`;
    panel.innerHTML = `<h4>${escapeHtml(title)}</h4><p>${escapeHtml(text)}</p>${canPreviewFeature(feature, preview) ? `<small>${locked ? "ProgramMetrics Preview watermark applies until this level is unlocked." : "Unlocked for this level."}</small>` : `<a class="button mini secondary-mini" href="checkout.html?plan=${Object.keys(studioPackageSummaries).find((key) => studioPackageSummaries[key].access === required) || "t2l1"}">Unlock download</a>`}`;
    shell.appendChild(panel);
  });

  const cleaningPanel = document.createElement("section");
  cleaningPanel.className = "dashboard-preview-panel";
  cleaningPanel.innerHTML = `<h4>Automatic cleaning checks</h4><ul>${(analysis.cleaning_steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ul>`;
  shell.appendChild(cleaningPanel);

  if (previewRows.length && previewColumns.length) {
    const tablePanel = document.createElement("section");
    tablePanel.className = `dashboard-preview-panel dashboard-table-panel${locked ? " locked-preview-panel" : ""}`;
    const head = previewColumns.map((column) => `<th>${escapeHtml(column)}</th>`).join("");
    const rows = previewRows.map((row) => `<tr>${previewColumns.map((column) => `<td>${escapeHtml(row[column] ?? "")}</td>`).join("")}</tr>`).join("");
    tablePanel.innerHTML = `<h4>Data preview</h4><p>Showing first ${escapeHtml(analysis.preview_limit || previewRows.length)} rows.</p><div class="dashboard-table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>${locked ? `<a class="button mini secondary-mini" href="checkout.html?plan=${Object.keys(studioPackageSummaries).find((key) => studioPackageSummaries[key].access === preview.access) || "t1l3"}">Unlock download</a>` : ""}`;
    shell.appendChild(tablePanel);
  }

  if (branding && (branding.footerNote || branding.contact)) {
    const footerPanel = document.createElement("section");
    footerPanel.className = "studio-brand-footer-preview";
    footerPanel.innerHTML = `${branding.footerNote ? `<p>${escapeHtml(branding.footerNote)}</p>` : ""}${branding.contact ? `<small>${escapeHtml(branding.contact)}</small>` : ""}`;
    shell.appendChild(footerPanel);
  }
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
setupStudioBrandingControls();
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
  none: { label: "No current paid level", price: 0, access: 0 },
  t1l1: { label: "Tier 1 Level 1", price: 49, access: 1 },
  t1l2: { label: "Tier 1 Level 2", price: 99, access: 2 },
  t1l3: { label: "Tier 1 Level 3", price: 199, access: 3 },
  t2l1: { label: "Tier 2 Level 1", price: 299, access: 4 },
  t2l2: { label: "Tier 2 Level 2", price: 499, access: 5 },
  t2l3: { label: "Tier 2 Level 3", price: 799, access: 6 },
  t3: { label: "Tier 3 Workflow System", price: 1500, access: 7 },
  t4: { label: "Tier 4 Advanced Analytics", price: 3500, access: 8 }
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

  const params = new URLSearchParams(window.location.search);
  const requestedPlan = params.get("plan");
  const storedPlan = sessionStorage.getItem("programmetrics_unlocked_plan");
  if (storedPlan && checkoutPlans[storedPlan]) {
    current.value = storedPlan;
  }
  if (requestedPlan && checkoutPlans[requestedPlan] && requestedPlan !== "none") {
    desired.value = requestedPlan;
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
    const currentPlan = checkoutPlans[current.value] || checkoutPlans.none;
    const desiredPlan = checkoutPlans[desired.value] || checkoutPlans.t1l1;
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



