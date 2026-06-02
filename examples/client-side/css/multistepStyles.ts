import type { CSSProperties } from "react";

const component: CSSProperties = {
  marginTop: "var(--multistep-spacing-lg, 5rem)",
  marginBottom: "var(--multistep-spacing-lg, 5rem)",
  backgroundColor: "var(--multistep-bg, #f1f1f141)",
  maxWidth: "960px",
  width: "100%",
};
const section: CSSProperties = {
  display: "block",
  margin: "var(--multistep-spacing-md, 4rem)",
};
const topNav: CSSProperties = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  margin: "0",
  paddingBottom: "var(--multistep-spacing-sm, 2rem)",
  listStyleType: "none",
  overflowX: "auto",
  scrollbarWidth: "thin",
  gap: 0,
};
const topNavStep: CSSProperties = {
  color: "var(--multistep-inactive, silver)",
  cursor: "pointer",
  flex: "1 1 25%",
  minWidth: "80px",
  paddingTop: "var(--multistep-spacing-md, 4rem)",
  paddingRight: "var(--multistep-spacing-md, 4rem)",
  borderBottom: "2px solid var(--multistep-border, silver)",
};
const todo: CSSProperties = {
  color: "var(--multistep-inactive-light, gray)",
};
const doing: CSSProperties = {
  color: "var(--multistep-primary, #1EAEDB)",
};
const button: CSSProperties = {
  color: "var(--multistep-primary, #1EAEDB)",
  backgroundColor: "var(--multistep-button-bg, #f7f7f7)",
  border: "0",
  fontSize: "var(--multistep-button-size, 4rem)",
  fontWeight: "500",
  padding: "0",
  width: "var(--multistep-tap-target, 44px)",
  height: "var(--multistep-tap-target, 44px)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "4px",
};

export const multiStepStyles = {
  component,
  section,
  topNav,
  topNavStep,
  prevButton: button,
  nextButton: button,
  todo,
  doing,
};
