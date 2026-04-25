"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, BookOpen, GraduationCap, ExternalLink, Download, Calendar, Clock, FileSpreadsheet } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Message } from "@/types/chat";
import { Button } from "@/components/ui/Button";

// ── Resource types & parsing ──

interface ParsedResource {
  type: "course" | "article";
  title: string;
  url: string;
  description: string;
}

interface LearningPlanRow {
  week: string;
  days: string;
  topic: string;
  activity: string;
  duration: string;
  resources: string;
  status: string;
}

interface LearningPlan {
  title: string;
  duration: string;
  rows: LearningPlanRow[];
}

function parseResources(content: string): { text: string; resources: ParsedResource[] } {
  const resourceMatch = content.match(/\[RESOURCES\]([\s\S]*?)\[\/RESOURCES\]/);
  if (!resourceMatch) return { text: content, resources: [] };

  const cleanText = content.replace(/\[RESOURCES\][\s\S]*?\[\/RESOURCES\]/, "").trim();
  const resourceBlock = resourceMatch[1].trim();
  const resources: ParsedResource[] = [];

  for (const line of resourceBlock.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("COURSE:")) {
      const parts = trimmed.replace("COURSE:", "").trim().split("|").map(s => s.trim());
      if (parts.length >= 3) {
        resources.push({ type: "course", title: parts[0], url: parts[1], description: parts[2] });
      }
    } else if (trimmed.startsWith("ARTICLE:")) {
      const parts = trimmed.replace("ARTICLE:", "").trim().split("|").map(s => s.trim());
      if (parts.length >= 3) {
        resources.push({ type: "article", title: parts[0], url: parts[1], description: parts[2] });
      }
    }
  }

  return { text: cleanText, resources };
}

function parseLearningPlan(content: string): { text: string; plan: LearningPlan | null } {
  const planMatch = content.match(/\[LEARNING_PLAN\]([\s\S]*?)\[\/LEARNING_PLAN\]/);
  if (!planMatch) return { text: content, plan: null };

  const cleanText = content.replace(/\[LEARNING_PLAN\][\s\S]*?\[\/LEARNING_PLAN\]/, "").trim();
  const planBlock = planMatch[1].trim();

  let title = "Learning Plan";
  let duration = "";
  const rows: LearningPlanRow[] = [];

  for (const line of planBlock.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("TITLE:")) {
      title = trimmed.replace("TITLE:", "").trim();
    } else if (trimmed.startsWith("DURATION:")) {
      duration = trimmed.replace("DURATION:", "").trim();
    } else if (trimmed.startsWith("ROW:")) {
      const parts = trimmed.replace("ROW:", "").trim().split("|").map(s => s.trim());
      if (parts.length >= 7) {
        rows.push({
          week: parts[0],
          days: parts[1],
          topic: parts[2],
          activity: parts[3],
          duration: parts[4],
          resources: parts[5],
          status: parts[6],
        });
      }
    }
  }

  if (rows.length === 0) return { text: content, plan: null };
  return { text: cleanText, plan: { title, duration, rows } };
}

// ── Excel CSV generation ──

function generateExcelCSV(plan: LearningPlan): string {
  const BOM = "\uFEFF"; // UTF-8 BOM for Excel compatibility
  const headers = ["Week", "Days", "Topic / Module", "Learning Activity", "Duration", "Resources", "Status", "Notes", "Date Started", "Date Completed"];
  
  const escapeCSV = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };

  const lines: string[] = [];
  
  // Title rows
  lines.push(escapeCSV(plan.title));
  if (plan.duration) lines.push(`Total Duration: ${escapeCSV(plan.duration)}`);
  lines.push(`Generated: ${new Date().toLocaleDateString()}`);
  lines.push(""); // blank row
  
  // Headers
  lines.push(headers.map(escapeCSV).join(","));
  
  // Data rows
  for (const row of plan.rows) {
    lines.push([
      row.week,
      row.days,
      row.topic,
      row.activity,
      row.duration,
      row.resources,
      row.status,
      "", // Notes (empty for user to fill)
      "", // Date Started
      "", // Date Completed
    ].map(escapeCSV).join(","));
  }

  return BOM + lines.join("\n");
}

function downloadCSV(plan: LearningPlan) {
  const csv = generateExcelCSV(plan);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = plan.title.toLowerCase().replace(/[^a-z0-9]+/g, "_") + "_plan.csv";
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// ── UI Components ──

function ResourceCard({ resource, index }: { resource: ParsedResource; index: number }) {
  const isCourse = resource.type === "course";

  return (
    <motion.a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group flex items-start gap-3 p-4 rounded-xl border border-outline-variant/50 bg-surface-container-low hover:bg-white hover:shadow-md hover:border-secondary/30 transition-all cursor-pointer"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${
        isCourse ? "bg-tertiary/10 text-tertiary" : "bg-secondary/10 text-secondary"
      }`}>
        {isCourse ? <GraduationCap className="w-5 h-5" /> : <BookOpen className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-bold text-primary truncate group-hover:text-secondary transition-colors">
            {resource.title}
          </span>
          <ExternalLink className="w-3 h-3 text-on-surface-variant/40 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="text-xs text-on-surface-variant/70 mt-0.5 line-clamp-1">{resource.description}</p>
        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider mt-1.5 ${
          isCourse ? "text-tertiary" : "text-secondary"
        }`}>
          {isCourse ? "Udemy Course" : "Article"}
        </span>
      </div>
    </motion.a>
  );
}

function ResourceBlock({ resources }: { resources: ParsedResource[] }) {
  const courses = resources.filter(r => r.type === "course");
  const articles = resources.filter(r => r.type === "article");

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 space-y-3"
    >
      {courses.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-tertiary" />
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest">Recommended Courses</span>
          </div>
          <div className="grid gap-2">
            {courses.map((course, i) => (
              <ResourceCard key={`course-${i}`} resource={course} index={i} />
            ))}
          </div>
        </div>
      )}
      {articles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Recommended Reading</span>
          </div>
          <div className="grid gap-2">
            {articles.map((article, i) => (
              <ResourceCard key={`article-${i}`} resource={article} index={i + courses.length} />
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function LearningPlanBlock({ plan }: { plan: LearningPlan }) {
  // Group rows by week for visual grouping
  const weekGroups = plan.rows.reduce((acc, row) => {
    const key = row.week;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {} as Record<string, LearningPlanRow[]>);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 rounded-xl border-2 border-tertiary/20 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-tertiary/10 to-secondary/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-tertiary/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-tertiary" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-primary">{plan.title}</h4>
            {plan.duration && (
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" /> {plan.duration}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => downloadCSV(plan)}
          className="flex items-center gap-2 px-4 py-2 bg-tertiary text-white text-xs font-bold rounded-lg hover:bg-tertiary/90 transition-colors shadow-md hover:shadow-lg"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Download Excel
        </button>
      </div>

      {/* Roadmap table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Week</th>
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Days</th>
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Topic</th>
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Activity</th>
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Duration</th>
              <th className="px-3 py-2.5 text-left font-bold text-tertiary uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(weekGroups).map(([week, rows], groupIdx) => (
              rows.map((row, rowIdx) => (
                <tr
                  key={`${groupIdx}-${rowIdx}`}
                  className={`border-b border-outline-variant/10 ${
                    groupIdx % 2 === 0 ? "bg-white" : "bg-surface-container-low/50"
                  } hover:bg-secondary/5 transition-colors`}
                >
                  {rowIdx === 0 && (
                    <td className="px-3 py-2.5 font-bold text-primary whitespace-nowrap align-top" rowSpan={rows.length}>
                      {row.week}
                    </td>
                  )}
                  <td className="px-3 py-2.5 text-on-surface-variant whitespace-nowrap">{row.days}</td>
                  <td className="px-3 py-2.5 font-semibold text-primary">{row.topic}</td>
                  <td className="px-3 py-2.5 text-on-surface-variant max-w-xs">{row.activity}</td>
                  <td className="px-3 py-2.5 text-on-surface-variant whitespace-nowrap">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {row.duration}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-outline-variant/20 text-on-surface-variant">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with download reminder */}
      <div className="bg-surface-container-low/50 px-4 py-2.5 flex items-center justify-between border-t border-outline-variant/20">
        <span className="text-[10px] text-on-surface-variant/60">
          Download includes Notes, Date Started, and Date Completed columns for tracking.
        </span>
        <button
          onClick={() => downloadCSV(plan)}
          className="text-[10px] font-bold text-tertiary hover:underline flex items-center gap-1"
        >
          <Download className="w-3 h-3" /> Export CSV
        </button>
      </div>
    </motion.div>
  );
}

// ── Main ChatContainer ──

export default function ChatContainer({ userId }: { userId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: "Unknown error" }));
        throw new Error(errorData.details || "Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let assistantContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        assistantContent += text;
        
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantContent;
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderMessageContent = (content: string) => {
    // Parse all structured blocks
    const { text: afterResources, resources } = parseResources(content);
    const { text: cleanText, plan } = parseLearningPlan(afterResources);

    return (
      <div className="prose prose-sm max-w-none dark:prose-invert">
        {cleanText.split('\n').map((line, idx) => (
          <p key={idx} className={line.includes('[MASTERY:') ? 'hidden' : 'mb-2 last:mb-0'}>
            {line}
          </p>
        ))}
        {content.includes('[MASTERY:') && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-4 p-4 bg-secondary/5 border-2 border-secondary/20 rounded-xl flex items-center gap-3"
          >
            <div className="p-2 bg-secondary rounded-lg">
              <Bot className="w-4 h-4 text-on-secondary" />
            </div>
            <div>
              <span className="block text-[10px] font-bold text-secondary uppercase tracking-widest">Achievement Unlocked</span>
              <span className="text-sm font-bold text-primary">Concept Mastered</span>
            </div>
          </motion.div>
        )}
        {resources.length > 0 && <ResourceBlock resources={resources} />}
        {plan && <LearningPlanBlock plan={plan} />}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-background h-screen relative">
      <header className="h-20 border-b flex items-center px-8 bg-white/50 backdrop-blur-xl sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
            <Bot className="w-7 h-7 text-secondary" />
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-primary">Strat</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Online</span>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 pb-40">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-secondary/10 rounded-3xl flex items-center justify-center border-2 border-secondary/20 shadow-xl">
              <Bot className="w-10 h-10 text-secondary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-display font-bold text-primary">Ready to learn?</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Enter any topic to begin. I will guide you using the Strat method, 
                helping you discover answers through inquiry.
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
                  msg.role === "user" ? "bg-primary text-on-primary" : "bg-secondary text-on-secondary"
                }`}>
                  {msg.role === "user" ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                </div>
                <div className={`p-5 rounded-2xl shadow-sm ${
                  msg.role === "user" 
                    ? "bg-primary text-on-primary rounded-tr-none" 
                    : "bg-white border border-outline-variant rounded-tl-none"
                }`}>
                  {msg.role === "assistant" ? renderMessageContent(msg.content) : (
                    <div className="prose prose-sm max-w-none">
                      <p>{msg.content}</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex justify-start">
            <div className="bg-white border border-outline-variant p-5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-secondary" />
              <span className="text-xs text-on-surface-variant font-medium">Tutor is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-background via-background to-transparent pt-12">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to learn..."
            className="w-full h-16 pl-6 pr-20 rounded-2xl bg-white border-2 border-outline-variant focus:border-secondary outline-none transition-all shadow-xl text-lg placeholder:text-on-surface-variant/40"
          />
          <Button 
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-3 top-3 h-10 w-10"
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
