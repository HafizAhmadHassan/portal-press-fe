export const resolver = (t: any) => {
  const text = `${t.open_Description || ""} ${
    t.close_Description || ""
  }`.toLowerCase();
  if (text.includes("error") || text.includes("errore")) return "error";
  if (text.includes("warning") || text.includes("attenzione")) return "warning";
  return null;
};
