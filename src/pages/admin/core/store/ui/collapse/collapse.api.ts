// src/core/store/ui/collapse/collapse.api.ts
export const collapseApi = {
  loadCollapseState: async (userId: number) => {
    // Simula API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    const saved = localStorage.getItem(`collapse-state-${userId}`);
    return saved ? JSON.parse(saved) : {};
  },

  saveCollapseState: async (
    userId: number,
    collapseStates: Record<string, boolean>
  ) => {
    // Simula API call
    await new Promise((resolve) => setTimeout(resolve, 200));
    localStorage.setItem(
      `collapse-state-${userId}`,
      JSON.stringify(collapseStates)
    );
    return { success: true, userId, collapseStates };
  },
};
