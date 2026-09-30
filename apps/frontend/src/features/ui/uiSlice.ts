import { createSlice, createSelector, type PayloadAction } from "@reduxjs/toolkit";

/**
 * Side of the screen a panel is docked to.
 */
export type PanelSide = "top" | "bottom" | "left" | "right";

export type PanelState = {
  /** Whether the panel is docked on screen. */
  visible: boolean;
};

type UiState = {
  panels: Record<PanelSide, PanelState>;
  /** Whether the 3D viewport options stay expanded. */
  viewportPinned: boolean;
};

const initialState: UiState = {
  panels: {
    top: { visible: true },
    bottom: { visible: true },
    right: { visible: true },
    left: { visible: true },
  },
  viewportPinned: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    /**
     * The user toggled a panel on/off. Modeled as an event, not a setter.
     */
    panelToggled(state, action: PayloadAction<{ side: PanelSide }>) {
      const panel = state.panels[action.payload.side];
      panel.visible = !panel.visible;
    },
    /**
     * The user pinned/unpinned the 3D viewport options.
     */
    viewportPinned(state, action: PayloadAction<{ pinned: boolean }>) {
      state.viewportPinned = action.payload.pinned;
    },
  },
});

export const { panelToggled, viewportPinned } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;

// --- Selectors (style guide: name selector functions as selectThing) ---

export const selectUi = (state: { ui: UiState }) => state.ui;

export const selectPanels = (state: { ui: UiState }) => state.ui.panels;

export const selectPanelVisible =
  (side: PanelSide) =>
  (state: { ui: UiState }): boolean =>
    state.ui.panels[side].visible;

export const selectViewportPinned = (state: { ui: UiState }): boolean => state.ui.viewportPinned;

export const selectVisiblePanelCount = createSelector(selectPanels, (panels) => {
  const sides = Object.keys(panels) as PanelSide[];
  return sides.reduce((count, side) => count + (panels[side].visible ? 1 : 0), 0);
});

export type { UiState };
