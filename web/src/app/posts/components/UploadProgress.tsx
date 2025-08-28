"use client";
import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // icon X

interface UploadToastProps {
     filename: string;
     progress: number; // 0 -> 100
     onClose?: () => void;
}

const UploadToast: React.FC<UploadToastProps> = ({ filename, progress, onClose }) => {
     const [visible, setVisible] = useState(true);

     useEffect(() => {
          if (progress >= 100) {
               const timer = setTimeout(() => {
                    setVisible(false);
                    onClose?.();
               }, 1500);
               return () => clearTimeout(timer);
          }
     }, [progress, onClose]);

     if (!visible) return null;

     return (
          <div className="fixed bottom-2 right-2 w-64 bg-white shadow-md rounded-md px-3 py-2 border border-gray-200 z-[9999]">
               <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-gray-800 truncate max-w-[70%]">
                         {filename}
                    </span>
                    <div className="flex justify-between items-start gap-2">
                         <span className="text-[10px] text-gray-500">{progress}%</span>
                         <button
                              onClick={() => {
                                   setVisible(false);
                                   onClose?.();
                              }}
                              className="text-gray-400 hover:text-gray-600 transition"
                         >
                              <X size={14} />
                         </button>
                    </div>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-0.5 overflow-hidden">
                    <div
                         className="h-0.5 bg-blue-500 transition-all duration-300"
                         style={{ width: `${progress}%` }}
                    />
               </div>
          </div>
     );
};

export default UploadToast;
