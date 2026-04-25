"use client";

import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Target, Zap, ArrowRight, Github } from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: <Sparkles className="w-6 h-6 text-secondary" />,
      title: "The Strat Method",
      description: "Experience a refined Socratic approach. We don't just give answers; we ask the questions that help you discover them."
    },
    {
      icon: <Zap className="w-6 h-6 text-tertiary" />,
      title: "Adaptive Scaffolding",
      description: "Our AI scales complexity in real-time, building a custom learning path based on your current level of understanding."
    },
    {
      icon: <Target className="w-6 h-6 text-secondary" />,
      title: "Mastery Tracking",
      description: "Visualize your progress as you conquer new concepts. Our AI detects when you've truly mastered a topic."
    }
  ];

  return (
    <div className="min-h-screen bg-primary text-on-primary overflow-x-hidden">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-on-secondary" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight">Strat</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push("/login")} className="font-bold">
            Log In
          </Button>
          <Button onClick={() => router.push("/login")} className="font-bold px-6">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 space-y-8 text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-sm font-bold">
              <Sparkles className="w-4 h-4" />
              Next-Gen Socratic Learning
            </div>
            <h1 className="text-6xl lg:text-7xl font-display font-extrabold leading-[1.1] tracking-tight">
              Master anything <br />
              <span className="text-secondary">through inquiry.</span>
            </h1>
            <p className="text-xl text-on-primary/60 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Strat is an intelligent, adaptive learning assistant that guides you through complex topics by asking strategic questions. Deepen your understanding, one question at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button onClick={() => router.push("/login")} className="h-16 px-10 text-lg group font-bold">
                Start Learning Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="h-16 px-10 text-lg font-bold border-2">
                Learn the Method
              </Button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="absolute inset-0 bg-secondary/20 blur-[100px] rounded-full -z-10" />
            <div className="glass rounded-[40px] p-4 border border-white/20 shadow-2xl overflow-hidden">
              <Image 
                src="/images/hero.png" 
                alt="Strat AI Learning Tutor" 
                width={600} 
                height={600} 
                className="rounded-[32px] w-full h-auto object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-8 bg-surface-container-low relative">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-primary">Designed for Deep Learning</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
              We've combined pedagogical science with cutting-edge AI to create a truly personalized tutor.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[32px] border border-outline-variant shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-primary/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-display font-bold text-primary mb-4">{feature.title}</h3>
                <p className="text-on-surface-variant leading-relaxed font-medium opacity-80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Ready to unlock your <br />
            <span className="text-secondary">full potential?</span>
          </h2>
          <Button onClick={() => router.push("/login")} className="h-16 px-12 text-xl font-bold">
            Create Your Free Account
          </Button>
          <div className="flex items-center justify-center gap-8 pt-8 grayscale opacity-50">
            <Github className="w-8 h-8" />
            <span className="font-display font-bold text-xl uppercase tracking-widest">Built for Hackathons</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center text-on-primary/40 text-sm font-medium">
        © 2026 Strat AI. Empowering minds through inquiry.
      </footer>
    </div>
  );
}
