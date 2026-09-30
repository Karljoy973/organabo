import { useAppSelector } from "../../app/hooks.ts";
import { selectVisiblePanelCount } from "../ui/uiSlice.ts";

/**
 * Bottom status bar: panel count and build info.
 */
export function StatusbarPanel() {
  const count = useAppSelector(selectVisiblePanelCount);

  return (
    <div className="statusbar">
      <span>Panneaux actifs : {count}/4</span>
      <span className="statusbar-right">Organabo — dév</span>
    </div>
  );
}
