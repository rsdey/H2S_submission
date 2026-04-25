import { genAI, DEFAULT_MODEL } from "../lib/gemini";
import { SYSTEM_PROMPT } from "../constants/prompts";
import { Message } from "../types/chat";
import { db } from "../lib/firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";

export async function getStratResponseStream(messages: Message[], userId: string) {
  const model = genAI.getGenerativeModel({
    model: DEFAULT_MODEL,
    systemInstruction: SYSTEM_PROMPT,
  });

  const lastMessage = messages[messages.length - 1].content;
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(lastMessage);

  return result.stream;
}

export async function handleMasteryDetection(fullResponse: string, userId: string) {
  const masteryMatch = fullResponse.match(/\[MASTERY: (.*?)\]/);
  if (masteryMatch && userId) {
    const concept = masteryMatch[1];
    const progressRef = doc(db, "users", userId, "progress", "mastery");
    
    const docSnap = await getDoc(progressRef);
    if (!docSnap.exists()) {
      await setDoc(progressRef, { 
        mastered: [concept], 
        lastUpdated: serverTimestamp() 
      });
    } else {
      await updateDoc(progressRef, {
        mastered: arrayUnion(concept),
        lastUpdated: serverTimestamp()
      });
    }
    return concept;
  }
  return null;
}
