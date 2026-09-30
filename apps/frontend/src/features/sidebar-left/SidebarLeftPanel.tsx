import { useAppSelector } from "../../app/hooks.ts";
import { selectViewportPinned } from "../ui/uiSlice.ts";

/**
 * Left sidebar: model library (tree of available glTF assets).
 * The panel title lives in the panel header (see PanelHost).
 */
export function SidebarLeftPanel() {
  const pinned = useAppSelector(selectViewportPinned);

  return (
    <div className="sidebar-left">
      <ul className="tree">
        <li>Modèles</li>
        <li>
          <details>
            <summary>Scène de démo</summary>
            <ul>
              <li>plinth.glb</li>
              <li>orb.glb</li>
              <li>ring.glb</li>
            </ul>
          </details>
        </li>
      </ul>
      {pinned ? <p className="sidebar-note">Options épinglées</p> : null}
    </div>
  );
}
