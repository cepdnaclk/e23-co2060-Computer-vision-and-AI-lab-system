import { createElement } from "react";

export function renderIcon(Icon, props = {}) {
  if (!Icon) return null;
  if (typeof Icon === "function") {
    return createElement(Icon, props);
  }
  return Icon;
}
