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
    if (inputId === "studio-file-converter-input" && downloadGeneratedExampleReport()) {
      result.textContent = "Watermarked generated example report downloaded.";
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
    if (inputId === "studio-file-converter-input" && activeStudioExampleAnalysis) {
      loadGeneratedStudioExample();
      result.textContent = "Generated example preview refreshed for the selected template and upgrade preview level.";
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
    accessSelect.disabled = true;
    accessSelect.setAttribute("aria-disabled", "true");
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
      packageCard.innerHTML = `<strong>Unlocked for real uploads:</strong> ${escapeHtml(unlocked.label)}<br><strong>Upgrade example preview:</strong> ${escapeHtml(preview.label)}<br><small>Locked upgrades can be previewed with generated example data only. Real uploads stay limited to the unlocked checkout level.</small>`;
    }

    if (packageLabel) {
      packageLabel.textContent = `Unlocked: ${unlocked.label}`;
    }

    gatedItems.forEach((item) => {
      const required = Number(item.dataset.requiredAccess || "1");
      const unlockedItem = access >= required;
      item.classList.toggle("is-locked", !unlockedItem);
      item.classList.toggle("is-unlocked", unlockedItem);

      if (item.tagName === "OPTION") {
        item.disabled = !unlockedItem;
      } else if (item.matches("button, input, select, textarea")) {
        item.disabled = !unlockedItem;
        item.setAttribute("aria-disabled", String(!unlockedItem));
      }
    });

    document.querySelectorAll("#studio-output-language, #studio-output-format").forEach(resetLockedSelect);
  };

  accessSelect?.addEventListener("change", applyAccess);
  packageSelect?.addEventListener("change", applyAccess);

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

setupStudioPackageAccess();
let activeStudioExampleAnalysis = null;

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

function setupGeneratedStudioExamples() {
  const exampleButton = document.getElementById("studio-example-button");
  const packageSelect = document.getElementById("studio-package-select");
  const templateSelect = document.getElementById("studio-template-type");
  if (exampleButton) {
    exampleButton.addEventListener("click", loadGeneratedStudioExample);
  }
  [packageSelect, templateSelect].forEach((select) => {
    if (select) {
      select.addEventListener("change", () => {
        if (activeStudioExampleAnalysis) {
          loadGeneratedStudioExample();
        }
      });
    }
  });
}

setupGeneratedStudioExamples();
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



