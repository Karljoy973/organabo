import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { panelToggled, type PanelSide } from "../ui/uiSlice.ts";

/**
 * Top bar: application menu and per-panel visibility controls.
 */
export function TopBarPanel() {
  const dispatch = useAppDispatch();
  const panels = useAppSelector((state) => state.ui.panels);

  return (
    <div className="topbar">
      <span className="topbar-brand">Organabo</span>
      <nav className="topbar-menu">
        <button type="button" className="topbar-item">
          Fichier
        </button>
        <button type="button" className="topbar-item">
          Édition
        </button>
        <button type="button" className="topbar-item">
          Affichage
        </button>
      </nav>
      <div className="topbar-panels">
        {(["top", "bottom", "left", "right"] as PanelSide[]).map((side) => (
          <button
            key={side}
            type="button"
            className="topbar-panel-toggle"
            aria-pressed={panels[side].visible}
            onClick={() => dispatch(panelToggled({ side }))}
          >
            {side}
          </button>
        ))}
      </div>
    </div>
  );
}
