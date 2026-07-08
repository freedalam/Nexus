export type DocumentStatus = "Draft" | "In Review" | "Signed";

export interface DealDocument {
  id: string;
  name: string;
  fileType: string; // e.g. "application/pdf", "image/png"
  fileUrl: string; // object URL for preview
  status: DocumentStatus;
  signatureDataUrl: string | null; // base64 PNG of the drawn signature
  uploadedAt: string; // ISO timestamp
}
