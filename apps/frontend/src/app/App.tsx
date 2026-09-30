import { useAppSelector } from "./hooks.ts";

import { PanelHost } from "../common/PanelHost.tsx";
import { ScenePanel } from "../features/scene/ScenePanel.tsx";
import { SidebarLeftPanel } from "../features/sidebar-left/SidebarLeftPanel.tsx";
import { SidebarRightPanel } from "../features/sidebar-right/SidebarRightPanel.tsx";
import { StatusbarPanel } from "../features/statusbar/StatusbarPanel.tsx";
import { TopBarPanel } from "../features/topbar/TopBarPanel.tsx";
import { selectPanels } from "../features/ui/uiSlice.ts";

/**
 * App shell: the whole UI is panels — top bar, left and right sidebars,
 * bottom status bar — around the 3D viewport in the center. Every panel
 * hosts its own visibility (Redux); collapsed panels show a slim edge
 * tab, so the shell always renders all four hosts.
 */
export function App() {
  const panels = useAppSelector(selectPanels);

  return (
    <div
      className="app-shell"
      data-panels={
        `${panels.top.visible ? "T" : "t"}` +
        `${panels.left.visible ? "L" : "l"}` +
        `${panels.right.visible ? "R" : "r"}` +
        `${panels.bottom.visible ? "B" : "b"}`
      }
    >
      <PanelHost side="top" title="Barre supérieure">
        <TopBarPanel />
      </PanelHost>

      <div className="app-middle">
        <PanelHost side="left" title="Bibliothèque">
          <SidebarLeftPanel />
        </PanelHost>

        <main className="app-center">
          <ScenePanel />
        </main>

        <PanelHost side="right" title="Propriétés">
          <SidebarRightPanel />
        </PanelHost>
      </div>

      <PanelHost side="bottom" title="Statut">
        <StatusbarPanel />
      </PanelHost>
    </div>
  );
}
