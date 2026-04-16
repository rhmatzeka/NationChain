"use client";

import { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info";

export function Toast({ 
  message, 
  type = "info", 
  onClose 
}: { 
  message: string; 
  type?: ToastType; 
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />
  };

  const colors = {
    success: "border-green-500/40 bg-green-500/10",
    error: "border-red-500/40 bg-red-500/10",
    info: "border-blue-500/40 bg-blue-500/10"
  };

  return (
    <div className={`fixed top-20 right-4 z-[1400] min-w-80 rounded-lg border ${colors[type]} backdrop-blur-md p-4 shadow-2xl animate-slide-in`}>
      <div className="flex items-start gap-3">
        {icons[type]}
        <div className="flex-1">
          <p className="text-sm text-white font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="rounded hover:bg-white/10 p-1 transition">
          <X className="h-4 w-4 text-white" />
        </button>
      </div>
    </div>
  );
}
