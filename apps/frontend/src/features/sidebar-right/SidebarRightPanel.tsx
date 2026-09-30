import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import { selectViewportPinned, viewportPinned } from "../ui/uiSlice.ts";

/**
 * Right sidebar: selected object properties (name, transform), plus a
 * pin control for the property options.
 * The panel title lives in the panel header (see PanelHost).
 */
export function SidebarRightPanel() {
  const dispatch = useAppDispatch();
  const pinned = useAppSelector(selectViewportPinned);

  return (
    <div className="sidebar-right">
      <div className="props">
        <label className="prop">
          Nom
          <input type="text" defaultValue="orb" readOnly />
        </label>
        <label className="prop">
          Échelle
          <input type="range" min={0.5} max={2} step={0.1} defaultValue={1} />
        </label>
      </div>
      <button
        type="button"
        className="sidebar-pin"
        aria-pressed={pinned}
        onClick={() => dispatch(viewportPinned({ pinned: !pinned }))}
      >
        {pinned ? "Détacher" : "Épingler"}
      </button>
    </div>
  );
}
