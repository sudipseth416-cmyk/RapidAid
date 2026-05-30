"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Clock, Brain } from "lucide-react";

const stats = [
  { icon: Zap, value: "3.2×", label: "Faster response" },
  { icon: Clock, value: "40%", label: "Fewer delays" },
  { icon: Brain, value: "24/7", label: "AI guidance" },
];

export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:gap-16 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex-1 text-center lg:text-left"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            AI-Powered Emergency Coordination for India
          </motion.div>

          <h1 className="font-heading text-4xl font-bold leading-tight tracking-tight text-dark sm:text-5xl lg:text-6xl">
            Every Second{" "}
            <span className="text-primary">Saves a Life</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-muted-foreground lg:mx-0 mx-auto">
            Connect citizens, ambulances, and hospitals in real time. One tap
            triggers AI-guided emergency response across India.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
            <Button size="lg" asChild>
              <Link href="/auth/signup">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="#features">See How It Works</Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-center lg:text-left"
              >
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary lg:mx-0" />
                <div className="font-heading text-2xl font-bold text-dark">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative flex-shrink-0"
        >
          <PhoneMockup />
        </motion.div>
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      <div className="rounded-[3rem] border-[6px] border-dark bg-dark p-2 shadow-2xl shadow-primary/20">
        <div className="relative overflow-hidden rounded-[2.25rem] bg-gradient-to-b from-gray-900 to-gray-950 aspect-[9/19]">
          <div className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          <div className="flex h-full flex-col items-center justify-center px-6 pt-10">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-6 text-center"
            >
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                Emergency
              </p>
              <p className="mt-1 font-heading text-lg font-bold text-white">
                Tap to Send SOS
              </p>
            </motion.div>

            <motion.button
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  "0 0 0 0 rgba(226, 75, 74, 0.7)",
                  "0 0 0 25px rgba(226, 75, 74, 0)",
                  "0 0 0 0 rgba(226, 75, 74, 0)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex h-32 w-32 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white shadow-lg"
              aria-label="SOS button mockup"
            >
              SOS
            </motion.button>

            <div className="mt-8 w-full space-y-2">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-gray-300">Locating nearest ambulance...</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2">
                <span className="text-xs text-gray-400">ETA: 4 min · AI guide active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-4 top-1/4 rounded-xl border border-border bg-white px-4 py-3 shadow-lg"
      >
        <p className="text-xs text-muted-foreground">Ambulance en route</p>
        <p className="font-heading text-sm font-bold text-primary">2.4 km away</p>
      </motion.div>
    </div>
  );
}
