"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Smartphone, Truck, Monitor, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles = [
  {
    icon: Smartphone,
    title: "Citizen",
    platform: "Mobile App",
    description:
      "One-tap SOS, live tracking, AI first-aid guidance, and your Digital Medical ID — always in your pocket.",
    features: ["One-tap SOS", "Live tracking", "AI first-aid", "Medical ID"],
    href: "/auth/signup?role=citizen",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Truck,
    title: "Ambulance",
    platform: "Mobile App",
    description:
      "Receive dispatch alerts, optimized routes, and patient info before you even reach the scene.",
    features: ["Smart dispatch", "Route optimization", "Patient pre-info", "Status updates"],
    href: "/auth/signup?role=ambulance",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Monitor,
    title: "Hospital",
    platform: "Desktop Dashboard",
    description:
      "Coordinate incoming emergencies, manage ICU beds, and prepare teams before patients arrive.",
    features: ["Bed management", "Incoming alerts", "Patient vitals", "Team coordination"],
    href: "/dashboard",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export function Roles() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-dark sm:text-4xl">
            One Platform, Three Roles
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you need help, provide help, or coordinate care — RapidAid has you covered.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {roles.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className="flex h-full flex-col border-border/60 transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${role.color}`}>
                    <role.icon className="h-6 w-6" />
                  </div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{role.title}</CardTitle>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {role.platform}
                    </span>
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <ul className="mb-6 space-y-2">
                    {role.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={role.href}>
                      Join as {role.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
