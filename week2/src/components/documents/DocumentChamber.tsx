import { useRef, useState } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useDocuments } from "../../context/DocumentContext";
import SignaturePad from "./SignaturePad";
import type { DocumentStatus } from "../../types/documents";

const statusStyles: Record<DocumentStatus, string> = {
  Draft: "bg-slate-100 text-slate-600",
  "In Review": "bg-amber-100 text-amber-700",
  Signed: "bg-accent-100 text-accent-700",
};

export default function DocumentChamber() {
  const { documents, addDocument, removeDocument, setStatus, setSignature, clearSignature } =
    useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    let lastId = "";
    Array.from(files).forEach((file) => {
      lastId = addDocument(file);
    });
    if (lastId) setActiveDocId(lastId);
    e.target.value = "";
  };

  const activeDoc = documents.find((d) => d.id === activeDocId) ?? documents[0] ?? null;

  return (
    <div className="container-responsive py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-heading text-xl font-semibold text-primary-700">
          Document Chamber
        </h1>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm px-4 py-2 rounded-lg"
        >
          <Upload size={16} />
          Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid-dashboard">
        {/* Document list */}
        <div className="bg-white rounded-2xl shadow-md p-5 lg:order-2">
          <h2 className="font-heading font-semibold text-primary-700 mb-3">
            Deal Documents
          </h2>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                onClick={() => setActiveDocId(doc.id)}
                className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm cursor-pointer border ${
                  activeDoc?.id === doc.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-transparent bg-surface-muted hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText size={16} className="text-primary-500 shrink-0" />
                  <span className="truncate">{doc.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[doc.status]}`}
                  >
                    {doc.status}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeDocument(doc.id);
                      if (activeDocId === doc.id) setActiveDocId(null);
                    }}
                    className="text-slate-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
            {documents.length === 0 && (
              <li className="text-xs text-slate-400">
                No documents uploaded yet. Click "Upload Document" to add a contract or deal file.
              </li>
            )}
          </ul>
        </div>

        {/* Preview + signature */}
        <div className="bg-white rounded-2xl shadow-md p-5 lg:order-1">
          {!activeDoc ? (
            <p className="text-sm text-slate-400">
              Select a document to preview, set its status, or sign it.
            </p>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium truncate">{activeDoc.name}</h3>
                <select
                  value={activeDoc.status}
                  onChange={(e) =>
                    setStatus(activeDoc.id, e.target.value as DocumentStatus)
                  }
                  className="text-xs border rounded-lg px-2 py-1"
                >
                  <option value="Draft">Draft</option>
                  <option value="In Review">In Review</option>
                  <option value="Signed">Signed</option>
                </select>
              </div>

              {/* Preview */}
              <div className="border rounded-lg overflow-hidden bg-surface-muted mb-4" style={{ height: 320 }}>
                {activeDoc.fileType === "application/pdf" ? (
                  <embed src={activeDoc.fileUrl} type="application/pdf" width="100%" height="100%" />
                ) : activeDoc.fileType.startsWith("image/") ? (
                  <img
                    src={activeDoc.fileUrl}
                    alt={activeDoc.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-sm text-slate-400 px-4 text-center">
                    Preview not available for this file type. ({activeDoc.fileType || "unknown"})
                  </div>
                )}
              </div>

              {/* Signature */}
              <h4 className="text-sm font-medium text-slate-600 mb-2">E-Signature</h4>
              <SignaturePad
                existingSignature={activeDoc.signatureDataUrl}
                onSave={(dataUrl) => setSignature(activeDoc.id, dataUrl)}
                onClear={() => clearSignature(activeDoc.id)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
