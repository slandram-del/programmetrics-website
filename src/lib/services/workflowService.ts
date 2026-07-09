import type { AnalyticsPlan } from "../analytics-engine";
import { timeDiagnostic } from "../shared";
import { buildAutomationPlan, runWorkflow, saveWorkflow } from "../workflow-engine";

export function prepareWorkflowPreview(input: Record<string, unknown>) {
  return timeDiagnostic("service", "workflowService.prepareWorkflowPreview", () => {
    const savedWorkflow = saveWorkflow(input);
    const automation = buildAutomationPlan(input);
    return { savedWorkflow, automation };
  });
}

export function executeWorkflowPreview(plan: AnalyticsPlan) {
  return timeDiagnostic("service", "workflowService.executeWorkflowPreview", () => runWorkflow(plan));
}
