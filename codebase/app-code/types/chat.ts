export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface MasteryProgress {
  mastered: string[];
  lastUpdated: any; // serverTimestamp
}

export interface ChatSession {
  id: string;
  topic: string;
  userId: string;
  createdAt: any;
}
