# AI Analyst

## Purpose
The AI Analyst helps users understand uploaded datasets, quality issues, trends, missing values, and recommended next steps in plain language.

## Ask ProgramMetrics Feature
Planned user flow:
1. User uploads data and generates a preview.
2. ProgramMetrics builds an analytics plan.
3. User asks a dataset-specific question.
4. AI Analyst answers using grounded profile, field, visual, and quality outputs.

## Supported Questions
- What does this dataset contain?
- What fields have the most missing values?
- Why is the quality score low or high?
- What charts should I use?
- What are the top categories?
- What trends are visible?
- What should I clean before export?
- What should go into an executive summary?

## Grounded Answers
The AI Analyst must answer only from:
- datasetProfile
- fieldProfiles
- missingProfile
- duplicateProfile
- qualityProfile
- descriptiveStats
- recommendedVisuals
- recommendedInsights
- user-selected setup and package settings

## No Invented Conclusions
The AI Analyst must not invent causal explanations, outcomes, statistical significance, or unsupported findings. It should say when the dataset cannot support a conclusion.

## Explanation Features
- Quality score explanation
- Missing value explanation
- Trend explanation
- Executive summary generation
- Recommended fixes
- Field dictionary explanations

## Related Documents
- [Analytics Engine](ANALYTICS_ENGINE.md)
- [Report Generator section in Master Plan](PROGRAMMETRICS_MASTER_PLAN.md#major-product-areas)
