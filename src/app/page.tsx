"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  Sparkles, 
  Send, 
  X, 
  MessageCircle, 
  Hourglass, 
  Target, 
  Zap, 
  Lightbulb,
  SlidersHorizontal,
  AlertCircle,
  Bot,
  Wand2,
  Globe
} from "lucide-react";

export default function Home() {
  const [platform, setPlatform] = useState("LinkedIn");
  const [voice, setVoice] = useState("Professional");
  const [audience, setAudience] = useState("B2B Professionals");
  const [pillar, setPillar] = useState("Educational");
  const [duration, setDuration] = useState("1 Week");
  const [topic, setTopic] = useState("");

  const [contentResult, setContentResult] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  // FAQ Widget State
  const [faqPrompt, setFaqPrompt] = useState("");
  const [faqMessages, setFaqMessages] = useState<{role: 'user'|'assistant', content: string}[]>([
    { role: 'assistant', content: "Hi there! I'm your BrandSphere Strategy Consultant. Need help with the algorithm or campaign ideas?" }
  ]);
  const [faqLoading, setFaqLoading] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);

  // Toast Error State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleGenerateContent = async () => {
    if (!topic.trim()) return;
    setContentLoading(true);
    setContentResult("");
    setToastMessage(null);
    
    const prompt = `Create a ${duration} content calendar for ${platform} about "${topic}".
    Target Audience: ${audience}
    Brand Voice: ${voice}
    Content Pillar: ${pillar}
    
    Provide day-by-day post ideas, including captions and suggested visual elements. Format as a clean markdown table.`;

    const systemInstruction = `You are a world-class Digital Marketing Manager and Social Media Strategist. Output highly engaging, platform-optimized content calendars.
CRITICAL: You MUST adopt the specified brand voice and tailor all content strictly to the target audience. Do NOT produce generic responses. Never use vague AI language. Always format the output as a Markdown table.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, systemInstruction })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setContentResult(data.result);
    } catch (err: any) {
      setToastMessage(err.message || "Failed to generate strategy. Please try again.");
    } finally {
      setContentLoading(false);
    }
  };

  const handleAskFaq = async (overridePrompt?: string) => {
    const promptText = overridePrompt || faqPrompt;
    if (!promptText.trim()) return;
    
    // Add user message
    setFaqMessages(prev => [...prev, { role: 'user', content: promptText }]);
    setFaqPrompt("");
    setFaqLoading(true);
    setToastMessage(null);

    const systemInstruction = "You are an expert Social Media Consultant. Give concise, highly actionable advice on digital marketing, content strategy, and platform algorithms. Keep answers under 150 words.";

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, systemInstruction })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      
      // Add assistant message
      setFaqMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
    } catch (err: any) {
      setToastMessage(err.message || "Failed to get advice.");
    } finally {
      setFaqLoading(false);
    }
  };

  return (
    <div className="w-full flex min-h-screen">
      
      {/* Global Error Toast */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-in">
          <div className="bg-red-500/90 backdrop-blur-md text-white px-6 py-3 rounded-full shadow-2xl border border-red-400 flex items-center gap-3">
            <AlertCircle size={18} />
            <span className="text-sm font-medium">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="ml-2 hover:text-red-200">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 max-w-5xl mx-auto py-12 px-6">
        <div className="mb-12 text-center md:text-left flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
            <Sparkles className="text-indigo-400" size={32} />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-slate-100 mb-2 tracking-tight">BrandSphere Studio</h1>
            <p className="text-slate-400 text-lg">
              Define your parameters to instantly generate a tailored social media strategy.
            </p>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 mb-8">
          <div className="flex items-center gap-2 mb-6 text-slate-300 font-semibold border-b border-slate-700/50 pb-4">
            <SlidersHorizontal size={20} className="text-indigo-400" />
            <span>Strategy Parameters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Globe size={14} /> Platform
              </label>
              <select className="w-full p-3 glass-input rounded-xl" value={platform} onChange={e => setPlatform(e.target.value)}>
                <option value="LinkedIn" className="bg-slate-900">LinkedIn</option>
                <option value="Instagram" className="bg-slate-900">Instagram</option>
                <option value="TikTok" className="bg-slate-900">TikTok</option>
                <option value="X (Twitter)" className="bg-slate-900">X (Twitter)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Zap size={14} /> Brand Voice
              </label>
              <select className="w-full p-3 glass-input rounded-xl" value={voice} onChange={e => setVoice(e.target.value)}>
                <option value="Professional" className="bg-slate-900">Professional & Authoritative</option>
                <option value="Playful" className="bg-slate-900">Playful & Witty</option>
                <option value="Inspirational" className="bg-slate-900">Inspirational & Empathetic</option>
                <option value="Bold" className="bg-slate-900">Bold & Edgy</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Target size={14} /> Target Audience
              </label>
              <select className="w-full p-3 glass-input rounded-xl" value={audience} onChange={e => setAudience(e.target.value)}>
                <option value="B2B Professionals" className="bg-slate-900">B2B Professionals</option>
                <option value="Gen Z Consumers" className="bg-slate-900">Gen Z Consumers</option>
                <option value="Tech Enthusiasts" className="bg-slate-900">Tech Enthusiasts</option>
                <option value="Local Community" className="bg-slate-900">Local Community</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Sparkles size={14} /> Content Pillar
              </label>
              <select className="w-full p-3 glass-input rounded-xl" value={pillar} onChange={e => setPillar(e.target.value)}>
                <option value="Educational" className="bg-slate-900">Educational / How-To</option>
                <option value="Promotional" className="bg-slate-900">Promotional / Sales</option>
                <option value="Behind-the-Scenes" className="bg-slate-900">Behind-the-Scenes / Culture</option>
                <option value="User Generated" className="bg-slate-900">User Generated Content</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Hourglass size={14} /> Duration
              </label>
              <select className="w-full p-3 glass-input rounded-xl" value={duration} onChange={e => setDuration(e.target.value)}>
                <option value="1 Week" className="bg-slate-900">1 Week</option>
                <option value="2 Weeks" className="bg-slate-900">2 Weeks</option>
                <option value="1 Month" className="bg-slate-900">1 Month</option>
              </select>
            </div>
            
            <div className="space-y-2 md:col-span-2 lg:col-span-1">
              <label className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                <Lightbulb size={14} /> Core Topic / Campaign
              </label>
              <input 
                type="text" 
                placeholder="e.g. Launch of our new AI SaaS tool"
                className="w-full p-3 glass-input rounded-xl"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-700/50">
            <button 
              onClick={handleGenerateContent}
              disabled={contentLoading || !topic.trim()}
              className="bg-indigo-600/90 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-indigo-900/50 border border-indigo-500/50"
            >
              {contentLoading ? (
                <>
                  <Wand2 className="animate-pulse" size={18} />
                  Generating Strategy...
                </>
              ) : (
                <>
                  <Wand2 size={18} />
                  Generate Calendar
                </>
              )}
            </button>
          </div>
        </div>

        {contentResult && (
          <div className="mt-8 glass-panel rounded-3xl p-8 mb-20">
            <div className="prose prose-dark max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {contentResult}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>

      {/* Floating FAQ Widget */}
      <div className="fixed bottom-8 right-8 z-40 flex flex-col items-end drop-shadow-2xl">
        {isFaqOpen && (
          <div className="glass-panel rounded-3xl w-80 md:w-96 mb-4 overflow-hidden flex flex-col h-[550px] animate-slide-in border border-indigo-500/30 shadow-[0_0_40px_rgba(99,102,241,0.15)] backdrop-blur-xl bg-slate-900/80">
            <div className="bg-slate-800/90 p-4 border-b border-slate-700/50 flex justify-between items-center shrink-0 shadow-sm">
              <div className="flex items-center gap-3 text-slate-100 font-bold">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Bot size={18} className="text-indigo-400" />
                </div>
                <span>Strategy Consultant</span>
              </div>
              <button onClick={() => setIsFaqOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scroll-smooth">
              {faqMessages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20 rounded-tr-sm' : 'bg-slate-800/80 border border-slate-700/50 text-slate-300 prose prose-dark rounded-tl-sm'}`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              
              {faqLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 flex items-center space-x-1 h-10">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              )}
              
              {faqMessages.length === 1 && !faqLoading && (
                <div className="mt-2 flex flex-col gap-2 w-full animate-fade-in">
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1 ml-1">Suggested Questions</p>
                  <button onClick={() => handleAskFaq("What are the best times to post on LinkedIn?")} className="text-xs text-left text-slate-300 bg-slate-800/40 hover:bg-slate-700/80 p-2.5 rounded-xl border border-slate-700/50 transition-all hover:border-indigo-500/50 flex items-center gap-2">
                    <Sparkles size={12} className="text-indigo-400" /> "Best times to post on LinkedIn?"
                  </button>
                  <button onClick={() => handleAskFaq("How to increase organic reach on Instagram?")} className="text-xs text-left text-slate-300 bg-slate-800/40 hover:bg-slate-700/80 p-2.5 rounded-xl border border-slate-700/50 transition-all hover:border-indigo-500/50 flex items-center gap-2">
                    <Sparkles size={12} className="text-indigo-400" /> "Increase organic reach on IG?"
                  </button>
                  <button onClick={() => handleAskFaq("What's the ideal length for a TikTok video?")} className="text-xs text-left text-slate-300 bg-slate-800/40 hover:bg-slate-700/80 p-2.5 rounded-xl border border-slate-700/50 transition-all hover:border-indigo-500/50 flex items-center gap-2">
                    <Sparkles size={12} className="text-indigo-400" /> "Ideal length for a TikTok?"
                  </button>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-900/90 border-t border-slate-700/50 shrink-0">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Ask a question..."
                  className="w-full p-3.5 pr-12 glass-input rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  value={faqPrompt}
                  onChange={e => setFaqPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAskFaq()}
                />
                <button 
                  onClick={() => handleAskFaq()}
                  disabled={faqLoading || !faqPrompt.trim()}
                  className="absolute right-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg p-2 transition-all disabled:opacity-50 flex items-center justify-center"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={() => setIsFaqOpen(!isFaqOpen)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white w-16 h-16 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/50 transition-all hover:scale-110 flex items-center justify-center relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full blur-md"></div>
          {isFaqOpen ? <X size={28} className="relative z-10" /> : <MessageCircle size={28} className="relative z-10" />}
        </button>
      </div>
    </div>
  );
}
