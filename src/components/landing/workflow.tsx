"use client";

import { motion } from "framer-motion";
import {
  Siren,
  Radio,
  MapPin,
  Building2,
  Bot,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    icon: Siren,
    title: "SOS",
    description: "Citizen taps SOS — location & medical ID sent instantly",
  },
  {
    icon: Radio,
    title: "Dispatch",
    description: "Nearest verified ambulance auto-dispatched with route",
  },
  {
    icon: MapPin,
    title: "Track",
    description: "Live GPS tracking shared with citizen and hospital",
  },
  {
    icon: Building2,
    title: "Hospital prep",
    description: "ICU beds reserved, staff alerted with patient data",
  },
  {
    icon: Bot,
    title: "AI guide",
    description: "AI first-aid assistant guides citizen until help arrives",
  },
  {
    icon: CheckCircle2,
    title: "Arrival",
    description: "Seamless handoff — hospital ready, zero delay",
  },
];

export function Workflow() {
  return (
    <section className="bg-dark py-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            From SOS to Arrival in 6 Steps
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            A coordinated workflow that eliminates the chaos of emergency response.
          </p>
        </motion.div>

        <div className="mt-16 overflow-x-auto pb-4">
          <div className="flex min-w-max items-start gap-2 px-2 lg:min-w-0 lg:justify-between">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start"
              >
                <div className="flex w-[160px] flex-col items-center text-center sm:w-[180px]">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                    <step.icon className="h-6 w-6 text-primary" />
                    <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <ChevronRight className="mx-1 mt-4 hidden h-6 w-6 flex-shrink-0 text-primary/50 lg:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
