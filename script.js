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
