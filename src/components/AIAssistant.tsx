import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

interface AssistantProps {
  regionScore: number;
}

const KEYWORD_RESPONSES: { keywords: string[]; response: string }[] = [
  {
    keywords: ["current risk", "what is the risk", "risk score", "regional risk"],
    response: "The current simulated regional risk score is shown in the dashboard header. This is a prototype estimate based on simulated environmental data — not a real-time assessment.",
  },
  {
    keywords: ["what causes landslide", "causes of landslide", "landslide causes"],
    response: "Landslides can be triggered by heavy rainfall, saturated soil, steep slopes, ground movement, earthquakes, and human activity like construction on unstable terrain. In NER India, monsoon rainfall is a major contributing factor.",
  },
  {
    keywords: ["critical risk", "what does critical", "critical mean"],
    response: "Critical risk (76-100) indicates that simulated conditions suggest a very high likelihood of landslide activity. In a real system, this would trigger evacuation preparations and alerts to authorities. This is a prototype — always follow official instructions in real emergencies.",
  },
  {
    keywords: ["high risk", "what does high"],
    response: "High risk (51-75) indicates elevated landslide danger based on simulated conditions. Increased monitoring and precautionary measures would be recommended.",
  },
  {
    keywords: ["moderate risk", "what does moderate"],
    response: "Moderate risk (26-50) suggests that some risk factors are elevated but conditions are not yet critical. Continued monitoring is recommended.",
  },
  {
    keywords: ["low risk", "what does low"],
    response: "Low risk (0-25) indicates that current conditions do not suggest significant landslide danger. Routine monitoring continues.",
  },
  {
    keywords: ["heavy rainfall", "during rain", "what should i do", "rainfall advice"],
    response: "During heavy rainfall: avoid steep slopes and landslide-prone areas, stay informed through official channels, avoid traveling in hilly terrain during storms, and follow evacuation orders from local disaster management authorities if issued.",
  },
  {
    keywords: ["how does", "how does this work", "how does the system work"],
    response: "LANDGUARD AI uses a transparent weighted scoring engine that combines rainfall (30%), soil moisture (25%), slope (20%), ground movement (15%), and historical risk (10%) to produce a 0-100 risk score. The prototype engine can later be replaced with a trained ML model.",
  },
  {
    keywords: ["ner", "north east", "northeast", "which states"],
    response: "LANDGUARD AI monitors 8 North Eastern Region states: Arunachal Pradesh, Assam, Meghalaya, Manipur, Mizoram, Nagaland, Tripura, and Sikkim.",
  },
  {
    keywords: ["is this real", "real data", "live data", "government"],
    response: "No — this is a prototype using simulated demo data. It is NOT connected to live government data or real sensors. All information shown is for demonstration purposes only.",
  },
  {
    keywords: ["evacuation", "evacuate"],
    response: "Evacuation decisions are made by official disaster management authorities. LANDGUARD AI is a prototype tool and should NOT be used for evacuation decisions. Follow instructions from local authorities during actual emergencies.",
  },
];

const DEFAULT_RESPONSE = "I can help with questions about landslide risk levels, causes, what to do during heavy rainfall, and how this system works. Try asking 'What causes landslides?' or 'What does critical risk mean?'";

function findResponse(query: string): string {
  const lower = query.toLowerCase();
  for (const item of KEYWORD_RESPONSES) {
    if (item.keywords.some((k) => lower.includes(k))) {
      return item.response;
    }
  }
  return DEFAULT_RESPONSE;
}

export function AIAssistant({ regionScore }: AssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hello! I'm the LANDGUARD AI demo assistant. I can answer questions about landslide risk, causes, and safety. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    const response = findResponse(input);
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "assistant", text: response }]);
    }, 400);
  };

  const quickQuestions = [
    "What is the current risk?",
    "What causes landslides?",
    "What does critical risk mean?",
    "What should I do during heavy rainfall?",
  ];

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
        aria-label="AI Assistant"
      >
        {open ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="flex items-center gap-2 p-4 border-b border-slate-800">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20">
              <Bot size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-200">AI Assistant</div>
              <div className="text-[10px] text-slate-500">Demo assistant — not connected to a live AI service</div>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-500/20 text-slate-100"
                      : "bg-slate-800 text-slate-300"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick questions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {quickQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); }}
                  className="text-xs px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-slate-200 outline-none focus:border-cyan-500"
            />
            <button
              onClick={send}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-white transition-colors shrink-0"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
