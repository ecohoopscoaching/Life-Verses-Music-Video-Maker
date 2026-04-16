import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Music, Film, CheckCircle, Smartphone, MonitorPlay, Loader2, Sparkles, Activity } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [prompts, setPrompts] = useState<{ time: string, prompt: string }[]>([]);
  const [aiModel, setAiModel] = useState('veo3');
  const [videoTitle, setVideoTitle] = useState('');
  const [captionFont, setCaptionFont] = useState('cinematic');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const startGeneration = async () => {
    if (!file) return;

    setStatus('uploading');

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('aspectRatio', aspectRatio);
    formData.append('aiModel', aiModel);
    formData.append('videoTitle', videoTitle);
    formData.append('captionFont', captionFont);

    try {
      await new Promise(r => setTimeout(r, 1000));
      setStatus('processing');

      const res = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      setTimeout(() => {
        setPrompts(data.prompts || []);
        setStatus('done');
      }, 3000);

    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert('Failed to process video.');
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        
        {/* Navigation - Matches Theme */}
        <nav className="h-[80px] px-10 flex items-center justify-between">
          <div className="text-[20px] font-bold tracking-[-0.5px] flex items-center gap-[10px]">
             <div className="w-8 h-8 bg-[var(--color-primary-pill)] rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-4 h-4" />
            </div>
            LuminaVM
          </div>
          <div className="flex gap-3">
            <button className="pill pill-secondary">Dashboard</button>
            <button className="pill pill-primary">Gallery</button>
          </div>
        </nav>

        {/* Main Content Layout - Grid 280px 1fr */}
        <main className="flex-1 grid md:grid-cols-[280px_1fr] gap-6 px-10 pb-10 items-start">
          
          {/* Sidebar Area */}
          <aside className="flex flex-col gap-5">
            
            <div className="glass-panel p-5">
              <div className="text-[12px] uppercase tracking-[1px] text-[var(--color-text-dim)] mb-4 font-bold">Output Format</div>
              <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                <div 
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-2 text-center rounded-lg text-[13px] cursor-pointer transition-colors ${
                    aspectRatio === '16:9' ? 'bg-[var(--color-secondary-pill)] text-white' : 'text-[var(--color-text-dim)] hover:text-white'
                  }`}
                >
                  16:9
                </div>
                <div 
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-2 text-center rounded-lg text-[13px] cursor-pointer transition-colors ${
                    aspectRatio === '9:16' ? 'bg-[var(--color-secondary-pill)] text-white' : 'text-[var(--color-text-dim)] hover:text-white'
                  }`}
                >
                  9:16
                </div>
              </div>

              <div className="mt-5">
                <div className="text-[12px] uppercase tracking-[1px] text-[var(--color-text-dim)] mb-4 font-bold">AI Engine</div>
                <div className="grid grid-cols-2 gap-2 bg-black/20 p-1 rounded-xl">
                  {/* Selectable Models */}
                  {[
                    { id: 'veo3', label: 'Veo 3' },
                    { id: 'kling', label: 'Kling AI' },
                    { id: 'luma', label: 'Luma V1.5' },
                    { id: 'runway', label: 'Runway Gen-3' }
                  ].map(model => (
                    <div 
                      key={model.id}
                      onClick={() => setAiModel(model.id)}
                      className={`p-2 text-center rounded-lg text-[12px] font-medium cursor-pointer transition-colors ${
                        aiModel === model.id ? 'bg-[var(--color-secondary-pill)] text-white' : 'text-[var(--color-text-dim)] hover:text-white'
                      }`}
                    >
                      {model.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="glass-panel p-5">
               <div className="text-[12px] uppercase tracking-[1px] text-[var(--color-text-dim)] mb-4 font-bold">Typography & Captions</div>
               
               <div className="mb-4">
                 <label className="text-[11px] text-[var(--color-text-dim)] block mb-2">Intro Title</label>
                 <input 
                   type="text" 
                   placeholder="e.g. Midnight Drive..." 
                   value={videoTitle} 
                   onChange={e => setVideoTitle(e.target.value)} 
                   className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white text-[13px] outline-none focus:border-[var(--color-primary-pill)] transition-colors placeholder:text-white/30" 
                 />
               </div>

               <div>
                 <label className="text-[11px] text-[var(--color-text-dim)] block mb-2">Caption Style</label>
                 <div className="grid grid-cols-2 gap-2">
                   <div onClick={() => setCaptionFont('cinematic')} className={`p-2 border rounded-lg text-[13px] cursor-pointer text-center font-['Playfair_Display'] ${captionFont === 'cinematic' ? 'border-[var(--color-primary-pill)] bg-[var(--color-primary-pill)]/20 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Cinematic</div>
                   <div onClick={() => setCaptionFont('bold')} className={`p-2 border rounded-lg text-[13px] uppercase tracking-tighter cursor-pointer text-center font-['Anton'] ${captionFont === 'bold' ? 'border-[var(--color-primary-pill)] bg-[var(--color-primary-pill)]/20 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Loud</div>
                   <div onClick={() => setCaptionFont('neon')} className={`p-2 border rounded-lg text-[13px] cursor-pointer text-center font-['Space_Grotesk'] ${captionFont === 'neon' ? 'border-[var(--color-primary-pill)] bg-[var(--color-primary-pill)]/20 text-white drop-shadow-[0_0_5px_var(--color-primary-pill)]' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Neon Glow</div>
                   <div onClick={() => setCaptionFont('minimal')} className={`p-2 border rounded-lg text-[13px] cursor-pointer text-center font-['JetBrains_Mono'] ${captionFont === 'minimal' ? 'border-[var(--color-primary-pill)] bg-[var(--color-primary-pill)]/20 text-white' : 'border-white/10 text-gray-400 hover:border-white/30'}`}>Minimal</div>
                 </div>
               </div>
            </div>
          </aside>

          {/* Workspace Area */}
          <div className="flex flex-col gap-6 h-full">
            
            {/* Upload Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`flex-1 min-h-[200px] border-2 border-dashed rounded-[24px] flex flex-col items-center justify-center p-8 text-center cursor-pointer transition-all duration-300 ${
                file ? 'border-[var(--color-primary-pill)]/50 bg-[var(--color-primary-pill)]/10' : 'border-[var(--color-glass-border)] bg-white/[0.02] hover:bg-white/[0.04]'
              }`}
            >
              <input 
                type="file" 
                accept="audio/mp3, audio/wav" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <AnimatePresence mode="wait">
                {!file ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <UploadCloud className="w-12 h-12 mb-4 opacity-50" />
                    <h2 className="text-[18px] font-semibold mb-2">Drop your track here</h2>
                    <p className="text-[13px] text-[var(--color-text-dim)]">MP3 or WAV up to 3 minutes</p>
                  </motion.div>
                ) : (
                  <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                    <Activity className="w-12 h-12 mb-4 text-[var(--color-primary-pill)] animate-pulse" />
                    <h2 className="text-[18px] font-semibold mb-2">{file.name}</h2>
                    <p className="text-[13px] text-[var(--color-text-dim)]">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready for processing</p>
                    <button className="pill pill-secondary mt-6 border border-white/10" onClick={(e) => { e.stopPropagation(); setFile(null); }}>Change Audio</button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Generation Status Panel */}
            <div className="glass-panel p-6">
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="text-[16px] font-semibold mb-1">
                    {status === 'idle' ? 'Ready to Generate' : status === 'uploading' ? 'Uploading Track...' : status === 'processing' ? 'Generating Visuals' : 'Generation Complete'}
                  </h3>
                  <p className="text-[12px] text-[var(--color-text-dim)]">
                    {status === 'idle' ? 'Press generate to begin AI pipeline' : status === 'done' ? 'Your video is ready' : 'Processing scene sequences...'}
                  </p>
                </div>
                {status !== 'idle' && status !== 'done' && (
                  <div className="text-right">
                    <span className="text-[16px] font-semibold block">{status === 'uploading' ? '15%' : '65%'}</span>
                    <p className="text-[12px] text-[var(--color-text-dim)] animate-pulse">Running</p>
                  </div>
                )}
              </div>

              {/* Progress Bar Container */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6 relative">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: status === 'idle' ? '0%' : status === 'uploading' ? '15%' : status === 'processing' ? '65%' : '100%',
                  }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-[var(--color-primary-pill)] shadow-[0_0_15px_var(--color-primary-pill)]"
                />
              </div>

              {/* Timeline Grid (Mocks rendering of scenes) */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                 {Array.from({length: 6}).map((_, i) => {
                    const isDone = status === 'done' || (status === 'processing' && i < 3);
                    const isProcessing = status === 'processing' && i === 3;
                    
                    return (
                        <div key={i} className={`aspect-video rounded-lg border text-[11px] flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                            isDone ? 'bg-[#1a1a1a] border-[var(--color-primary-pill)] text-white' : 
                            isProcessing ? 'border-[var(--color-primary-pill)] border-dashed text-[var(--color-text-dim)]' : 
                            'bg-white/5 border-[var(--color-glass-border)] text-[var(--color-text-dim)]'
                        }`}>
                            Scene {String(i + 1).padStart(2, '0')}
                            {isDone && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-primary-pill)]" />}
                        </div>
                    )
                 })}
              </div>

               {/* Log out actual results beneath the timeline if done */}
               <AnimatePresence>
                {status === 'done' && prompts.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 rounded-xl bg-black/20"
                  >
                    <ul className="space-y-2">
                      {prompts.map((p, i) => (
                        <li key={i} className="text-[12px] flex gap-3 text-white">
                          <span className="text-[var(--color-primary-pill)] min-w-[70px] font-mono">{p.time}</span>
                          <span className="opacity-80">{p.prompt}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-auto">
                {status === 'idle' ? (
                  <button 
                    onClick={startGeneration}
                    disabled={!file}
                    className={`pill ${!file ? 'pill-secondary opacity-50' : 'pill-primary'}`}
                  >
                    Generate Video
                  </button>
                ) : status === 'done' ? (
                   <>
                    <button className="pill pill-secondary font-semibold" onClick={() => setStatus('idle')}>Reset</button>
                    <button className="pill pill-primary font-semibold">Export MP4</button>
                   </>
                ) : (
                  <button className="pill pill-primary opacity-50 flex items-center gap-2 cursor-wait">
                    <Loader2 className="w-4 h-4 animate-spin" /> Processing
                  </button>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </>
  );
}
