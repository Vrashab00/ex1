import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Trash2, ArrowUp, Copy, Check } from 'lucide-react';
import { api } from '../../api/client.js';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  isError?: boolean;
}

const INITIAL_GREETING: Message = {
  id: 'msg-welcome',
  role: 'model',
  text: `System online. Ask any question regarding fleet instances, idle waste remediation, or safety policies.`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

const SUGGESTIONS = [
  'Fleet waste scan',
  'Safety freeze policy',
  'Plan options'
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth');
    }
  }, [messages, isLoading]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleClear = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'model',
        text: `History cleared. Ready for input.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSend = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const history = nextMessages
        .filter(m => !m.isError && m.id !== 'msg-welcome' && !m.id.startsWith('msg-'))
        .slice(-8)
        .map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));

      const res = await api.sendChatMessage(textToSend, history.slice(0, -1));

      if (res && res.reply) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            role: 'model',
            text: res.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        throw new Error(res.error || 'Empty response');
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'model',
          text: `Service temporarily unavailable. Please retry.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  // Monochrome monospace formatting
  const formatText = (content: string) => {
    return content.split('\n').map((line, idx) => {
      if (line.startsWith('* ') || line.startsWith('- ')) {
        return (
          <li key={idx} className="ml-3 list-disc text-[12px] text-[#D4D4D4] my-0.5 leading-relaxed font-mono">
            {formatInline(line.substring(2))}
          </li>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-[12px] text-[#D4D4D4] leading-relaxed font-mono my-0.5">
          {formatInline(line)}
        </p>
      );
    });
  };

  const formatInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={i} className="px-1 py-0.2 mx-0.5 text-[11px] font-mono bg-[#242424] text-[#FFFFFF] rounded border border-[#333333]">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Monochrome Minimal Launcher */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-8 right-6 z-40">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#121212] hover:bg-[#1A1A1A] text-[#EDEDED] border border-[#2B2B2B] hover:border-[#555555] shadow-lg transition-all duration-150 cursor-pointer font-mono group"
            aria-label="Open AI Terminal"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            <span className="text-[11px] tracking-wider uppercase text-[#E0E0E0] group-hover:text-white font-mono">
              AI COPILOT
            </span>
            <MessageSquare className="w-3.5 h-3.5 text-[#888888] group-hover:text-white transition-colors ml-0.5" />
          </button>
        </div>
      )}

      {/* Monochrome Minimal Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 md:bottom-8 right-4 sm:right-6 z-50 w-[92vw] sm:w-[380px] max-w-[380px] h-[540px] max-h-[82vh] flex flex-col rounded-xl bg-[#0E0E0E] border border-[#262626] shadow-2xl overflow-hidden font-mono animate-in fade-in duration-150">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#141414] border-b border-[#222222]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <h3 className="text-[11px] font-medium tracking-widest uppercase text-white font-mono">
                FINOPS_AI
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClear}
                className="p-1.5 text-[#888888] hover:text-white rounded transition-colors cursor-pointer"
                title="Clear"
                aria-label="Clear chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#888888] hover:text-white rounded transition-colors cursor-pointer"
                title="Close"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}
                >
                  <div
                    className={`max-w-[88%] px-3 py-2 rounded-lg text-xs font-mono ${
                      isUser
                        ? 'bg-[#1C1C1C] text-white border border-[#333333]'
                        : msg.isError
                        ? 'bg-[#1C1414] text-neutral-300 border border-[#382020]'
                        : 'bg-[#141414] text-[#D4D4D4] border border-[#242424]'
                    }`}
                  >
                    <div>{formatText(msg.text)}</div>

                    <div className="flex items-center justify-between gap-2 mt-1 text-[9px] text-[#666666] font-mono">
                      <span>{msg.timestamp}</span>
                      {!isUser && !msg.isError && (
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="opacity-0 group-hover:opacity-100 hover:text-white transition-opacity cursor-pointer"
                          title="Copy"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-2.5 h-2.5 text-white" />
                          ) : (
                            <Copy className="w-2.5 h-2.5" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Monochrome Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#141414] border border-[#242424] w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse [animation-delay:300ms]" />
              </div>
            )}

            {/* Monochrome Suggestions */}
            {messages.length <= 2 && !isLoading && (
              <div className="pt-2 flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(item)}
                    className="text-[11px] px-2.5 py-1 rounded bg-[#141414] hover:bg-[#202020] text-[#A0A0A0] hover:text-white border border-[#262626] hover:border-[#444444] transition-colors cursor-pointer font-mono"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Monochrome Input Bar */}
          <div className="p-3 bg-[#121212] border-t border-[#222222]">
            <div className="flex items-center bg-[#0A0A0A] border border-[#262626] focus-within:border-[#555555] rounded-lg px-2.5 py-1.5 transition-colors">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="type command or inquiry..."
                disabled={isLoading}
                className="flex-1 bg-transparent text-xs text-white placeholder-[#555555] focus:outline-none font-mono"
              />

              <button
                onClick={() => handleSend()}
                disabled={!inputMessage.trim() || isLoading}
                className={`p-1 rounded transition-colors cursor-pointer ${
                  inputMessage.trim() && !isLoading
                    ? 'text-white hover:text-neutral-300'
                    : 'text-[#444444] cursor-not-allowed'
                }`}
                title="Send"
                aria-label="Send"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
