'use client';

import { motion } from 'framer-motion';
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Crop, Target } from 'lucide-react';

interface ImageCropperProps {
  file: File;
  onCropSubmit: (base64Payload: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ file, onCropSubmit, onCancel }: ImageCropperProps) {
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Selection Box State
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selection, setSelection] = useState<{ x: number, y: number, w: number, h: number } | null>(null);

  useEffect(() => {
    // Generate object URL for fast local display
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Unified Event Coordinate Parsing
  const getClientPos = (e: any) => {
    if (e.touches && e.touches.length > 0) {
      return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
    }
    return { clientX: e.clientX, clientY: e.clientY };
  };

  const handlePointerDown = (e: any) => {
    if (!imgRef.current) return;
    const pos = getClientPos(e);
    const rect = imgRef.current.getBoundingClientRect();
    const x = pos.clientX - rect.left;
    const y = pos.clientY - rect.top;
    
    // Ensure we are clicking inside the image
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      setIsDrawing(true);
      setStartPos({ x, y });
      setSelection({ x, y, w: 0, h: 0 });
    }
  };

  useEffect(() => {
    const handleGlobalPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !imgRef.current) return;
      const pos = getClientPos(e);
      const rect = imgRef.current.getBoundingClientRect();
      
      // Safely clamp coordinates to image boundaries even if mouse overshoots viewport
      const currentX = Math.max(0, Math.min(pos.clientX - rect.left, rect.width));
      const currentY = Math.max(0, Math.min(pos.clientY - rect.top, rect.height));

      setSelection({
        x: Math.min(startPos.x, currentX),
        y: Math.min(startPos.y, currentY),
        w: Math.abs(currentX - startPos.x),
        h: Math.abs(currentY - startPos.y)
      });
    };

    const handleGlobalPointerUp = () => {
      if (isDrawing) setIsDrawing(false);
    };

    if (isDrawing) {
      window.addEventListener('mousemove', handleGlobalPointerMove);
      window.addEventListener('mouseup', handleGlobalPointerUp);
      // Native touch injections
      window.addEventListener('touchmove', handleGlobalPointerMove, { passive: false });
      window.addEventListener('touchend', handleGlobalPointerUp);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalPointerMove);
      window.removeEventListener('mouseup', handleGlobalPointerUp);
      window.removeEventListener('touchmove', handleGlobalPointerMove);
      window.removeEventListener('touchend', handleGlobalPointerUp);
    };
  }, [isDrawing, startPos]);

  const handleTargetScan = () => {
    if (!imgRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // If user drew a box, crop the image. If not, return the full compressed image.
    if (selection && selection.w > 20 && selection.h > 20 && ctx) {
       const img = imgRef.current;
       
       // Calculate scaling ratio between displayed image and actual intrinsic pixels
       const scaleX = img.naturalWidth / img.width;
       const scaleY = img.naturalHeight / img.height;

       const sourceX = selection.x * scaleX;
       const sourceY = selection.y * scaleY;
       const sourceW = selection.w * scaleX;
       const sourceH = selection.h * scaleY;

       canvas.width = sourceW;
       canvas.height = sourceH;
       
       ctx.drawImage(img, sourceX, sourceY, sourceW, sourceH, 0, 0, sourceW, sourceH);
       const croppedBase64 = canvas.toDataURL('image/jpeg', 0.9);
       onCropSubmit(croppedBase64);
    } else {
       // Submit Full Image
       const img = imgRef.current;
       canvas.width = img.naturalWidth;
       canvas.height = img.naturalHeight;
       ctx?.drawImage(img, 0, 0);
       onCropSubmit(canvas.toDataURL('image/jpeg', 0.9));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-5xl flex flex-col items-center bg-[#050508]/80 backdrop-blur-3xl border border-[#00f0ff]/20 p-8 rounded-[2rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]"
    >
       <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full mb-6 gap-6 md:gap-4">
          <div className="flex flex-col w-full md:w-auto">
            <h3 className="text-2xl font-bold flex items-center gap-2 text-white">
              <Crop size={24} className="text-[#00f0ff]" /> The Magic Eraser
            </h3>
            <p className="text-zinc-400 font-mono text-sm max-w-md mt-1">
              Drag a bounding box over the specific element you want the AI to fix. Or, scan the entire image.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
             <button onClick={onCancel} className="w-full sm:w-auto px-6 py-3 md:py-2 rounded-xl border md:border-transparent border-white/5 text-zinc-400 font-mono text-sm hover:text-white hover:bg-white/5 transition-colors">
               Cancel
             </button>
             <button 
               onClick={handleTargetScan} 
               className="w-full sm:w-auto justify-center flex items-center gap-2 bg-gradient-to-r from-[#00f0ff] to-blue-600 text-black px-6 py-3 md:py-2 rounded-xl font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:scale-105 transition-transform"
             >
               <Target size={18} /> Execute Scan
             </button>
          </div>
       </div>

       <div className="w-full h-[60vh] flex items-center justify-center bg-[#050508] border border-[#00f0ff]/10 rounded-2xl overflow-hidden select-none touch-none shadow-inner">
         
         {imageSrc ? (
           <div 
             className={`relative shadow-2xl touch-none ${isDrawing ? 'cursor-crosshair' : 'cursor-crosshair'}`}
             onMouseDown={handlePointerDown}
             onTouchStart={handlePointerDown}
           >
             <img 
               ref={imgRef}
               src={imageSrc} 
               alt="Uploaded UI" 
               className="max-w-full max-h-[60vh] block pointer-events-none"
               draggable={false}
             />
             
             {/* The Bounding Box Drawer */}
             {selection && (
               <div 
                 className="absolute border-2 border-[#00f0ff] bg-[#00f0ff]/10 shadow-[0_0_20px_rgba(0,240,255,0.2)] pointer-events-none"
                 style={{
                   left: selection.x,
                   top: selection.y,
                   width: selection.w,
                   height: selection.h
                 }}
               >
                  <div className="absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#00f0ff] shadow-lg animate-ping" />
               </div>
             )}
           </div>
         ) : (
           <div className="w-full h-full flex items-center justify-center animate-pulse">
             <span className="text-[#00f0ff] font-mono tracking-widest uppercase text-sm">Locking Coordinates...</span>
           </div>
         )}
         
       </div>
    </motion.div>
  );
}
