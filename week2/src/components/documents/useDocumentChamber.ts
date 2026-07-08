import { useCallback, useState } from "react";
import type { DealDocument, DocumentStatus } from "../../types/documents";

const uid = () => Math.random().toString(36).slice(2, 10);

export function useDocumentChamber() {
  const [documents, setDocuments] = useState<DealDocument[]>([]);

  const addDocument = useCallback((file: File) => {
    const fileUrl = URL.createObjectURL(file);
    const doc: DealDocument = {
      id: uid(),
      name: file.name,
      fileType: file.type,
      fileUrl,
      status: "Draft",
      signatureDataUrl: null,
      uploadedAt: new Date().toISOString(),
    };
    setDocuments((prev) => [doc, ...prev]);
    return doc.id;
  }, []);

  const removeDocument = useCallback((id: string) => {
    setDocuments((prev) => {
      const target = prev.find((d) => d.id === id);
      if (target) URL.revokeObjectURL(target.fileUrl);
      return prev.filter((d) => d.id !== id);
    });
  }, []);

  const setStatus = useCallback((id: string, status: DocumentStatus) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
  }, []);

  const setSignature = useCallback((id: string, signatureDataUrl: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, signatureDataUrl, status: "Signed" as DocumentStatus } : d
      )
    );
  }, []);

  const clearSignature = useCallback((id: string) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, signatureDataUrl: null, status: "Draft" as DocumentStatus } : d
      )
    );
  }, []);

  return { documents, addDocument, removeDocument, setStatus, setSignature, clearSignature };
}
