import React, { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useMeeting } from '../../context/MeetingContext';
import { Edit3, X, Trash2, Download, Undo } from 'lucide-react';

export default function WhiteboardPanel() {
  const { t } = useLanguage();
  const { 
    whiteboardPaths, 
    drawWhiteboard, 
    clearWhiteboard, 
    setActiveSidePanel 
  } = useMeeting();

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#23949A'); // Mirqam Teal default
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const lastPosRef = useRef({ x: 0, y: 0 });

  const colors = ['#23949A', '#172740', '#F43F5E', '#10B981', '#F59E0B', '#6366F1'];

  // Redraw canvas whenever whiteboardPaths change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear and redraw
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    whiteboardPaths.forEach(stroke => {
      ctx.beginPath();
      ctx.moveTo(stroke.x0, stroke.y0);
      ctx.lineTo(stroke.x1, stroke.y1);
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [whiteboardPaths]);

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    const pos = getCoordinates(e);
    lastPosRef.current = pos;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newPos = getCoordinates(e);

    const stroke = {
      x0: lastPosRef.current.x,
      y0: lastPosRef.current.y,
      x1: newPos.x,
      y1: newPos.y,
      color: isEraser ? '#FFFFFF' : color,
      width: isEraser ? lineWidth * 3 : lineWidth
    };

    ctx.beginPath();
    ctx.moveTo(stroke.x0, stroke.y0);
    ctx.lineTo(stroke.x1, stroke.y1);
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    drawWhiteboard(stroke);
    lastPosRef.current = newPos;
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `mirqam-whiteboard-${Date.now()}.png`;
    link.href = image;
    link.click();
  };

  return (
    <div className="flex flex-col h-full text-slate-800 dark:text-slate-100">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Edit3 className="w-5 h-5 text-mirqam-teal" />
          <h3 className="font-bold text-sm">{t('whiteboard')}</h3>
        </div>
        <button
          onClick={() => setActiveSidePanel(null)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap bg-slate-50 dark:bg-slate-800/40">
        
        {/* Colors */}
        <div className="flex items-center gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-transform ${
                !isEraser && color === c ? 'scale-125 border-slate-900 dark:border-white shadow' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        {/* Eraser & Actions */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEraser(!isEraser)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              isEraser 
                ? 'bg-rose-500 text-white' 
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300'
            }`}
          >
            الممحاة
          </button>

          <button
            onClick={clearWhiteboard}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="مسح اللوحة"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg text-slate-400 hover:text-mirqam-teal hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="تحميل كصورة"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Canvas Area */}
      <div className="flex-1 p-3 bg-slate-200 dark:bg-slate-900 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          width={800}
          height={1000}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full bg-white rounded-xl shadow-md border border-slate-300 dark:border-slate-800 cursor-crosshair touch-none"
        />
      </div>

    </div>
  );
}
