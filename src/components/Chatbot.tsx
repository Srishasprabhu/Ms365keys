import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { MessageCircle, X, Send, Image as ImageIcon, Loader2 } from 'lucide-react';

let aiClient: GoogleGenAI | null = null;
function getAIClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY is missing');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string, imageUrl?: string}[]>([
    { role: 'model', text: 'Hi! I am the Original Access assistant. How can I help you today? You can ask me about our products or upload an image for me to analyze.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageMimeType, setSelectedImageMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSelectedImageMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMsg = { role: 'user' as const, text: input, imageUrl: selectedImage || undefined };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const parts: any[] = [];
      if (selectedImage && selectedImageMimeType) {
        const base64Data = selectedImage.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: selectedImageMimeType
          }
        });
      }
      if (input.trim()) {
        parts.push({ text: input });
      }

      const response = await getAIClient().models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
          systemInstruction: "You are a helpful customer support assistant for 'Original Access', a store selling premium Microsoft Office keys and accounts. Be polite, concise, and helpful. If the user uploads an image, analyze it and provide relevant information."
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Sorry, I could not generate a response.' }]);
    } catch (error: any) {
      console.error("Chatbot error:", error);
      const errorMessage = error.message?.includes('GEMINI_API_KEY') 
        ? 'The Gemini API key is missing. Please add it to your Vercel Environment Variables.'
        : 'Sorry, I encountered an error while processing your request.';
      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setIsTyping(false);
      setSelectedImage(null);
      setSelectedImageMimeType(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-transform z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageCircle size={24} />
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '600px', maxHeight: 'calc(100vh - 6rem)' }}>
        {/* Header */}
        <div className="bg-zinc-950 p-4 border-b border-zinc-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <MessageCircle size={16} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 text-sm">AI Assistant</h3>
              <p className="text-xs text-zinc-500">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-sm' : 'bg-zinc-800 text-zinc-200 rounded-bl-sm'}`}>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Uploaded" className="max-w-full rounded-lg mb-2" />
                )}
                <div className="whitespace-pre-wrap">{msg.text}</div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 text-zinc-400 rounded-2xl rounded-bl-sm p-3 text-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950">
          {selectedImage && (
            <div className="mb-2 relative inline-block">
              <img src={selectedImage} alt="Preview" className="h-16 rounded border border-zinc-700" />
              <button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-zinc-800 text-white rounded-full p-1 hover:bg-red-600">
                <X size={12} />
              </button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors shrink-0"
              title="Upload Image"
            >
              <ImageIcon size={20} />
            </button>
            <textarea 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask me anything..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
              rows={1}
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
            <button 
              onClick={sendMessage}
              disabled={(!input.trim() && !selectedImage) || isTyping}
              className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
