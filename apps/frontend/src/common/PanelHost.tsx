import type { ReactNode } from "react";

import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import { panelToggled, type PanelSide } from "../features/ui/uiSlice.ts";

type PanelHostProps = {
  side: PanelSide;
  title: string;
  children: ReactNode;
};

/**
 * Hosts the panel for one side: the full panel when visible, a slim edge
 * tab to reopen it when collapsed. Visibility lives in Redux; toggling
 * dispatches the panelToggled event.
 */
export function PanelHost({ side, title, children }: PanelHostProps) {
  const dispatch = useAppDispatch();
  const visible = useAppSelector((state) => state.ui.panels[side].visible);

  if (!visible) {
    return (
      <div className={`panel-host panel-host-${side} is-collapsed`}>
        <button
          type="button"
          className={`panel-tab panel-tab-${side}`}
          onClick={() => dispatch(panelToggled({ side }))}
          title={`Afficher le panneau ${title}`}
          aria-label={`Afficher le panneau ${title}`}
        >
          <span className="panel-tab-label">{title}</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`panel-host panel-host-${side}`}>
      <section className="panel" data-side={side} aria-label={title}>
        <header className="panel-header">
          <span className="panel-title">{title}</span>
          <button
            type="button"
            className="panel-close"
            onClick={() => dispatch(panelToggled({ side }))}
            title={`Masquer le panneau ${title}`}
            aria-label={`Masquer le panneau ${title}`}
          >
            ×
          </button>
        </header>
        <div className="panel-content">{children}</div>
      </section>
    </div>
  );
}
