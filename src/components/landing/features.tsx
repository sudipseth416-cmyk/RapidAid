"use client";

import { motion } from "framer-motion";
import {
  Siren,
  MapPin,
  Bot,
  Building2,
  IdCard,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Siren,
    title: "One-tap SOS",
    description:
      "Instant emergency alert with GPS location sent to the nearest verified ambulance and hospital.",
  },
  {
    icon: MapPin,
    title: "Live ambulance tracking",
    description:
      "Real-time map tracking so citizens and hospitals know exactly when help will arrive.",
  },
  {
    icon: Bot,
    title: "AI first-aid assistant",
    description:
      "Step-by-step AI guidance while you wait — CPR, bleeding control, and more in Hindi & English.",
  },
  {
    icon: Building2,
    title: "Hospital coordination dashboard",
    description:
      "Hospitals receive patient vitals, ETA, and bed availability before the ambulance arrives.",
  },
  {
    icon: IdCard,
    title: "Digital Medical ID",
    description:
      "Blood group, allergies, and emergency contacts accessible instantly during a crisis.",
  },
  {
    icon: ShieldCheck,
    title: "Verified responder network",
    description:
      "Every ambulance driver and hospital is verified with license and registration checks.",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-dark sm:text-4xl">
            Built for India&apos;s Emergency Ecosystem
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From the moment you tap SOS to hospital arrival — every stakeholder
            connected, every second optimized.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={item}>
              <Card className="h-full border-border/60 transition-shadow hover:shadow-md hover:shadow-primary/5">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
