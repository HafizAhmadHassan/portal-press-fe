// src/core/store/ui/collapse/collapse.thunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collapseApi } from "./collapse.api";

// Thunk per caricare stato collapse dal server
export const loadCollapseState = createAsyncThunk(
  "collapse/loadState",
  async (userId: number, { rejectWithValue }) => {
    try {
      const collapseState = await collapseApi.loadCollapseState(userId);
      return collapseState;
    } catch (error) {
      return rejectWithValue("Failed to load collapse state");
    }
  }
);

// Thunk per salvare stato collapse
export const saveCollapseState = createAsyncThunk(
  "collapse/saveState",
  async (
    params: { userId: number; collapseStates: Record<string, boolean> },
    { rejectWithValue }
  ) => {
    try {
      const result = await collapseApi.saveCollapseState(
        params.userId,
        params.collapseStates
      );
      return result;
    } catch (error) {
      return rejectWithValue("Failed to save collapse state");
    }
  }
);

// Thunk per toggle con animazione
export const animatedToggle = createAsyncThunk(
  "collapse/animatedToggle",
  async (id: number, { dispatch, getState, rejectWithValue }) => {
    try {
      // Pre-animazione logic
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Qui potresti fare altre operazioni
      return { id, success: true };
    } catch (error) {
      return rejectWithValue("Animation failed");
    }
  }
);
