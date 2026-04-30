import { KeyboardEventHandler } from "react";

/**
 * Needed for <a> without href used as action controls.
 * Adds keyboard activation (Enter/Space) and prevents Space scroll.
 */
export const createClickHandlers = (onClick: () => void) => {
  // Keep keyboard and pointer behavior aligned on the same action callback.
  const handleKeyUp: KeyboardEventHandler<HTMLAnchorElement> = (e) => {
    const correct = e.key === "Enter" || e.key === " ";
    if (correct) {
      onClick();
      // Space can scroll the page; prevent that after handling activation.
      e.preventDefault();
    }
  };
  return {
    onClick: onClick,
    onKeyUp: handleKeyUp,
  };
};
