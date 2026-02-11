export type ViewMode = "admin" | "responsable" | "coordinateur" | "formateur" | "eleve";

export const VIEW_MODE_COOKIE = "humia-view-mode";

export const VIEW_LABELS: Record<ViewMode, string> = {
  admin: "Admin",
  responsable: "Responsable pédagogique",
  coordinateur: "Coordinateur pédagogique",
  formateur: "Formateur",
  eleve: "Élève",
};
