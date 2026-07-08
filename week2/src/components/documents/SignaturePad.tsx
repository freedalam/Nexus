import { useRef, useState, MouseEvent, TouchEvent } from "react";

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear?: () => void;
  existingSignature?: string | null;
}

export default function SignaturePad({ onSave, onClear, existingSignature }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  const getPos = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const start = (e: MouseEvent | TouchEvent) => {
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: MouseEvent | TouchEvent) => {
    if (!isDrawing) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const { x, y } = getPos(e);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#312e81";
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stop = () => setIsDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onClear?.();
  };

  const save = () => {
    if (!hasDrawn) return;
    const dataUrl = canvasRef.current!.toDataURL("image/png");
    onSave(dataUrl);
  };

  if (existingSignature) {
    return (
      <div className="border rounded-lg p-3 bg-surface-muted">
        <img src={existingSignature} alt="Signature" className="h-16" />
        <button
          onClick={onClear}
          className="mt-2 text-xs text-red-500 font-medium hover:underline"
        >
          Clear signature
        </button>
      </div>
    );
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={320}
        height={120}
        className="border rounded-lg bg-white cursor-crosshair touch-none w-full"
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={save}
          className="bg-primary-600 hover:bg-primary-700 text-white text-xs px-3 py-1.5 rounded-lg"
        >
          Save Signature
        </button>
        <button
          onClick={clearCanvas}
          className="text-slate-500 text-xs px-3 py-1.5 rounded-lg hover:bg-slate-100"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
