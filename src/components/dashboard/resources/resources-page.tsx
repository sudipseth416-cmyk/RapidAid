"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchResources,
  updateResource,
  fetchBloodInventory,
  fetchStaff,
  getResourceColor,
} from "@/lib/dashboard/api";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Pencil, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ResourcesPage() {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const { data: resources } = useQuery({
    queryKey: ["dashboard", "resources"],
    queryFn: fetchResources,
  });

  const { data: blood } = useQuery({
    queryKey: ["dashboard", "blood"],
    queryFn: fetchBloodInventory,
  });

  const { data: staff } = useQuery({
    queryKey: ["dashboard", "staff"],
    queryFn: fetchStaff,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, current }: { id: string; current: number }) =>
      updateResource(id, current),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      setEditingId(null);
    },
  });

  function startEdit(id: string, current: number) {
    setEditingId(id);
    setEditValue(current);
  }

  return (
    <div className="px-6 py-5">
      <header className="mb-5 border-b border-border pb-4">
        <h1 className="font-heading text-xl font-bold">Resource Management</h1>
        <p className="text-sm text-muted-foreground">
          Capacity, blood bank, and staff roster
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="border border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider">
              Facility Resources
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
            {resources?.map((r) => {
              const color = getResourceColor(r.current, r.total);
              const isEditing = editingId === r.id;
              return (
                <div key={r.id} className="border border-border p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-semibold">{r.label}</p>
                    {!isEditing ? (
                      <button
                        type="button"
                        onClick={() => startEdit(r.id, r.current)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Edit ${r.label}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                  {isEditing ? (
                    <div className="mt-3 flex items-center gap-2">
                      <Input
                        type="number"
                        min={0}
                        max={r.total}
                        value={editValue}
                        onChange={(e) => setEditValue(Number(e.target.value))}
                        className="h-8 font-mono text-sm"
                      />
                      <Button
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateMutation.mutate({ id: r.id, current: editValue })
                        }
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-8 w-8"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="mt-2 font-heading text-2xl font-bold tabular-nums">
                        {r.current}
                        <span className="text-lg font-normal text-muted-foreground">
                          /{r.total}
                        </span>
                      </p>
                      <Progress
                        className="mt-3"
                        value={r.current}
                        max={r.total}
                        color={color}
                      />
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Blood Bank Inventory
              </h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left text-[11px] font-semibold uppercase text-muted-foreground">
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Units</th>
                  <th className="px-4 py-2">Min</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {blood?.map((b) => {
                  const low = b.units < b.minThreshold;
                  return (
                    <tr key={b.type} className={low ? "bg-amber-50" : ""}>
                      <td className="px-4 py-2 font-mono font-semibold">{b.type}</td>
                      <td className="px-4 py-2 font-mono tabular-nums">{b.units}</td>
                      <td className="px-4 py-2 text-muted-foreground">{b.minThreshold}</td>
                      <td className="px-4 py-2">
                        {low ? (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            LOW STOCK
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-700">OK</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border border-border bg-card">
            <div className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Staff Roster
              </h2>
            </div>
            <ul className="divide-y divide-border">
              {staff?.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.role} · Shift {s.shift}
                    </p>
                  </div>
                  <Badge variant={s.onDuty ? "stable" : "muted"}>
                    {s.onDuty ? "On Duty" : "Off"}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
