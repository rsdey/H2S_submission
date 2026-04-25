"use client";

import { useState, useEffect } from "react";
import { auth } from "../../lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, Chrome, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) router.push("/");
    });
    return () => unsub();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tertiary/10 rounded-full blur-[120px] -ml-64 -mb-64" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass rounded-[32px] p-10 relative z-10 shadow-2xl border border-white/20"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-secondary rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-secondary/40 border-4 border-white/20">
            <GraduationCap className="w-12 h-12 text-on-secondary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-primary tracking-tight">Strat</h1>
          <p className="text-on-surface-variant text-center mt-3 font-medium opacity-70">
            {isLogin ? "Your journey continues here." : "Start your path to mastery today."}
          </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl font-medium"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="relative group">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant transition-colors group-focus-within:text-secondary" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full h-16 pl-14 pr-6 bg-white/50 border-2 border-outline-variant rounded-2xl focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40 font-medium"
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant transition-colors group-focus-within:text-secondary" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full h-16 pl-14 pr-6 bg-white/50 border-2 border-outline-variant rounded-2xl focus:border-secondary outline-none transition-all placeholder:text-on-surface-variant/40 font-medium"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-16 text-lg group"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                {isLogin ? "Sign In" : "Create Account"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </form>

        <div className="my-10 flex items-center gap-4 text-on-surface-variant/40 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex-1 h-px bg-outline-variant/30" />
          <span>Social Login</span>
          <div className="flex-1 h-px bg-outline-variant/30" />
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-16 gap-3 border-2 hover:bg-white shadow-none"
        >
          <Chrome className="w-6 h-6" />
          Continue with Google
        </Button>

        <p className="mt-10 text-center text-sm font-medium text-on-surface-variant/60">
          {isLogin ? "New to the platform?" : "Already a student?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-secondary font-bold hover:underline ml-1"
          >
            {isLogin ? "Create an account" : "Sign in instead"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
