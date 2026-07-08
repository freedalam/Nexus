import { createContext, useContext, ReactNode } from "react";
import { useDocumentChamber } from "../components/documents/useDocumentChamber";

type DocumentContextValue = ReturnType<typeof useDocumentChamber>;

const DocumentContext = createContext<DocumentContextValue | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const chamber = useDocumentChamber();
  return (
    <DocumentContext.Provider value={chamber}>{children}</DocumentContext.Provider>
  );
}

export function useDocuments() {
  const ctx = useContext(DocumentContext);
  if (!ctx) {
    throw new Error("useDocuments must be used inside a <DocumentProvider>");
  }
  return ctx;
}
