"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { CheckCircle2, GraduationCap, LayoutDashboard, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function Sidebar({ userId }: { userId: string }) {
  const [mastered, setMastered] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;
    
    const unsub = onSnapshot(doc(db, "users", userId, "progress", "mastery"), (doc) => {
      if (doc.exists()) {
        setMastered(doc.data().mastered || []);
      }
    });

    return () => unsub();
  }, [userId]);

  const handleSignOut = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <aside className="w-80 h-screen bg-primary text-on-primary flex flex-col p-6 border-r border-on-primary/10">
      <div className="flex items-center gap-3 mb-12">
        <div className="p-2 bg-secondary rounded-xl shadow-lg shadow-secondary/20">
          <GraduationCap className="w-8 h-8 text-on-secondary" />
        </div>
        <div>
          <h1 className="text-xl font-display leading-tight font-bold">Strat</h1>
          <p className="text-[10px] text-on-primary/40 font-bold tracking-widest uppercase">Tutor MVP</p>
        </div>
      </div>

      <nav className="flex-1 space-y-8">
        <div>
          <h2 className="text-[10px] uppercase tracking-widest text-on-primary/30 font-bold mb-4 px-2">Mastery Progress</h2>
          <div className="space-y-2">
            {mastered.length === 0 ? (
              <p className="text-xs text-on-primary/30 italic px-2">Master concepts to see progress...</p>
            ) : (
              mastered.map((concept, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-on-primary/5 rounded-xl border border-on-primary/5 animate-in fade-in slide-in-from-left-4 duration-500">
                  <div className="p-1 bg-secondary/20 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-secondary" />
                  </div>
                  <span className="text-sm font-medium truncate">{concept}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-[10px] uppercase tracking-widest text-on-primary/30 font-bold mb-4 px-2">Navigation</h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start gap-3 text-secondary bg-secondary/10 hover:bg-secondary/20 h-11">
              <LayoutDashboard className="w-5 h-5" />
              Learning Path
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 h-11 text-on-primary/60">
              <Settings className="w-5 h-5" />
              Preferences
            </Button>
          </div>
        </div>
      </nav>

      <div className="pt-6 border-t border-on-primary/10">
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full justify-start gap-3 h-11 text-on-primary/60 hover:text-red-400 hover:bg-red-400/10 group"
        >
          <LogOut className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
