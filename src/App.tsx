import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UploadCloud, Music, Film, Scissors, CheckCircle, Smartphone, MonitorPlay, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done'>('idle');
  const [prompts, setPrompts] = useState<{ time: string, prompt: string }[]>([]);
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

    try {
      // Small simulated delay for upload UI
      await new Promise(r => setTimeout(r, 1000));
      setStatus('processing');

      const res = await fetch('/api/process-audio', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      
      // Simulate the long processing time step-by-step
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
      <div className="bg-atmosphere" />
      
      <div className="min-h-screen p-6 md:p-12 flex flex-col max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[color:var(--color-primary-pill)] flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight glow-text">LuminaVM</h1>
          </div>
          <nav className="hidden md:flex gap-4">
            <button className="pill pill-secondary">Dashboard</button>
            <button className="pill pill-secondary">Gallery</button>
          </nav>
        </header>

        <main className="flex-1 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Hero Text & Explainers */}
          <div className="z-10 flex flex-col gap-8">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 pill pill-secondary py-1 mb-6"
              >
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary-pill)] animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-[var(--color-primary-pill)] font-medium">V1.0 Engine Live</span>
              </motion.div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6"
              >
                Music to Video <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary-pill)] to-[var(--color-text-dim)]">
                  in Seconds.
                </span>
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-400 text-lg md:text-xl max-w-lg font-light leading-relaxed"
              >
                Upload your track. Our AI analyzes the beat, generates cinematic scenes, and stitches them into a perfect 4K music video.
              </motion.p>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 max-w-md"
            >
              <div className="flex flex-col gap-2">
                <Music className="w-5 h-5 text-[var(--color-primary-pill)]" />
                <span className="text-sm text-gray-300">Audio Analysis</span>
                <p className="text-xs text-gray-500">Detects drops, tempo, and vibe to sync visuals.</p>
              </div>
              <div className="flex flex-col gap-2">
                <Film className="w-5 h-5 text-[var(--color-text-dim)]" />
                <span className="text-sm text-gray-300">Generative AI</span>
                <p className="text-xs text-gray-500">Creates breathtaking clips via Runway/Luma.</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column - The App UI */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="z-10"
          >
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-[var(--color-primary-pill)] opacity-50" />
              
              <h3 className="font-display text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">1</span>
                Drop Audio Track
              </h3>

              <div 
                className={`border-2 border-dashed rounded-[24px] p-8 mb-8 flex flex-col items-center justify-center text-center transition-all ${
                  file ? 'border-[var(--color-primary-pill)] bg-[var(--color-primary-pill)]/10' : 'border-[var(--color-glass-border)] hover:border-white/20 bg-white/5'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
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
                    <motion.div 
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                        <UploadCloud className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-200">Click or drag MP3/WAV here</p>
                        <p className="text-xs text-gray-500 mt-1">Max duration: 3 minutes</p>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="filled"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center gap-4 cursor-pointer"
                    >
                      <div className="w-16 h-16 rounded-full bg-[color:var(--color-primary-pill)]/20 flex items-center justify-center">
                        <Music className="w-8 h-8 text-[color:var(--color-primary-pill)]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{file.name}</p>
                        <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-xs">2</span>
                Format
              </h3>
              
              <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => setAspectRatio('16:9')}
                  className={`flex-1 pill flex flex-col items-center gap-2 ${aspectRatio === '16:9' ? 'pill-primary' : 'pill-secondary'}`}
                >
                  <MonitorPlay className={`w-6 h-6 ${aspectRatio === '16:9' ? 'text-white' : 'text-[var(--color-text-dim)]'}`} />
                  <span className="text-sm font-medium">16:9 Landscape</span>
                </button>
                <button 
                  onClick={() => setAspectRatio('9:16')}
                  className={`flex-1 pill flex flex-col items-center gap-2 ${aspectRatio === '9:16' ? 'pill-primary' : 'pill-secondary'}`}
                >
                  <Smartphone className={`w-6 h-6 ${aspectRatio === '9:16' ? 'text-white' : 'text-[var(--color-text-dim)]'}`} />
                  <span className="text-sm font-medium">9:16 Vertical</span>
                </button>
              </div>

              <button 
                onClick={startGeneration}
                disabled={!file || status !== 'idle'}
                className={`w-full py-4 text-lg flex flex-row items-center justify-center gap-2 transition-all ${
                  !file ? 'pill pill-secondary opacity-50 cursor-not-allowed' : 
                  'pill pill-primary hover:scale-[1.02]'
                }`}
              >
                {status === 'idle' && (
                  <>Generate Video <Sparkles className="w-5 h-5" /></>
                )}
                {status === 'uploading' && (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                )}
                {status === 'processing' && (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Stitching AI Scenes...</>
                )}
                {status === 'done' && (
                  <><CheckCircle className="w-5 h-5 text-green-500" /> Complete!</>
                )}
              </button>

              <AnimatePresence>
                {status === 'done' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <h4 className="text-sm font-medium mb-3 text-gray-300">Generation Log:</h4>
                    <ul className="space-y-3">
                      {prompts.map((p, i) => (
                        <li key={i} className="text-xs text-gray-400 flex gap-3">
                          <span className="text-[var(--color-primary-pill)] min-w-[70px] font-mono">{p.time}</span>
                          <span>{p.prompt}</span>
                        </li>
                      ))}
                    </ul>
                    <button className="mt-4 w-full pill pill-primary py-2 text-sm text-white flex items-center justify-center gap-2">
                       Download {aspectRatio} Render
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </main>
      </div>
    </>
  );
}
