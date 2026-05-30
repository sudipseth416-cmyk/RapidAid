"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Siren,
  MapPin,
  Bot,
  Building2,
  IdCard,
  ShieldCheck,
} from "lucide-react";

const bullets = [
  { icon: Siren, text: "One-tap SOS with instant GPS dispatch" },
  { icon: MapPin, text: "Live ambulance tracking in real time" },
  { icon: Bot, text: "24/7 AI first-aid guidance in Hindi & English" },
  { icon: Building2, text: "Hospital coordination before arrival" },
  { icon: IdCard, text: "Digital Medical ID always accessible" },
  { icon: ShieldCheck, text: "Verified ambulance & hospital network" },
];

export function AuthSidebar() {
  return (
    <div className="relative hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between bg-dark p-10 text-white">
      <div>
        <Link href="/" className="font-heading text-2xl font-bold">
          Rapid<span className="text-primary">Aid</span>
        </Link>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-300"
        >
          Join India&apos;s AI-powered emergency coordination network.
        </motion.p>
      </div>

      <ul className="space-y-5">
        {bullets.map((bullet, i) => (
          <motion.li
            key={bullet.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-start gap-3"
          >
            <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <bullet.icon className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm leading-relaxed text-gray-300">{bullet.text}</span>
          </motion.li>
        ))}
      </ul>

      <p className="text-sm text-gray-500">
        Every second saves a life.
      </p>

      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
    </div>
  );
}
