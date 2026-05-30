import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Droplets,
  AlertTriangle,
  Pill,
  Heart,
  Plus,
  X,
  UserPlus,
  Trash2,
  Save,
} from "lucide-react";
import {
  fetchMedicalIdProfile,
  updateMedicalIdProfile,
} from "../../lib/api";
import type { EmergencyContact, MedicalIdProfile } from "../../types";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export function MedicalIdScreen() {
  const queryClient = useQueryClient();
  const { data: initial, isLoading } = useQuery({
    queryKey: ["medical-id-profile"],
    queryFn: fetchMedicalIdProfile,
  });

  const [profile, setProfile] = useState<MedicalIdProfile | null>(null);
  const [newAllergy, setNewAllergy] = useState("");
  const [newMed, setNewMed] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", relation: "" });
  const [saved, setSaved] = useState(false);

  const current: MedicalIdProfile = profile ?? initial!;

  const saveMutation = useMutation({
    mutationFn: updateMedicalIdProfile,
    onSuccess: (data) => {
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ["medical-id-summary"] });
      queryClient.invalidateQueries({ queryKey: ["medical-id-profile"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (isLoading || !current) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-white/40">Loading Medical ID…</p>
      </div>
    );
  }

  function update(field: Partial<MedicalIdProfile>) {
    setProfile({ ...current, ...field } as MedicalIdProfile);
  }

  function addChip(field: "allergies" | "medications" | "conditions", value: string) {
    const trimmed = value.trim();
    if (!trimmed || current[field].includes(trimmed)) return;
    update({ [field]: [...current[field], trimmed] });
  }

  function removeChip(field: "allergies" | "medications" | "conditions", value: string) {
    update({ [field]: current[field].filter((v) => v !== value) });
  }

  function addContact() {
    if (!contactForm.name || !contactForm.phone) return;
    const contact: EmergencyContact = {
      id: Date.now().toString(),
      ...contactForm,
    };
    update({ contacts: [...current.contacts, contact] });
    setContactForm({ name: "", phone: "", relation: "" });
    setShowAddContact(false);
  }

  function removeContact(id: string) {
    update({ contacts: current.contacts.filter((c) => c.id !== id) });
  }

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-10 bg-dark/95 px-4 pb-3 pt-3 backdrop-blur-lg safe-top">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-xl font-bold">Medical ID</h1>
          <button
            type="button"
            onClick={() => saveMutation.mutate(current)}
            disabled={saveMutation.isPending}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </header>

      <div className="space-y-6 px-4 pb-6">
        {/* Blood Group */}
        <section>
          <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
            <Droplets className="h-3.5 w-3.5 text-red-400" />
            Blood Group
          </label>
          <select
            value={current.bloodGroup}
            onChange={(e) => update({ bloodGroup: e.target.value })}
            className="w-full rounded-xl border border-white/10 bg-surface px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
          >
            {BLOOD_GROUPS.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </section>

        {/* Allergies */}
        <ChipSection
          icon={AlertTriangle}
          iconColor="text-amber-400"
          label="Allergies"
          chips={current.allergies}
          inputValue={newAllergy}
          onInputChange={setNewAllergy}
          onAdd={() => { addChip("allergies", newAllergy); setNewAllergy(""); }}
          onRemove={(v) => removeChip("allergies", v)}
          placeholder="Add allergy"
        />

        {/* Medications */}
        <ChipSection
          icon={Pill}
          iconColor="text-blue-400"
          label="Medications"
          chips={current.medications}
          inputValue={newMed}
          onInputChange={setNewMed}
          onAdd={() => { addChip("medications", newMed); setNewMed(""); }}
          onRemove={(v) => removeChip("medications", v)}
          placeholder="Add medication"
        />

        {/* Conditions */}
        <ChipSection
          icon={Heart}
          iconColor="text-pink-400"
          label="Conditions"
          chips={current.conditions}
          inputValue={newCondition}
          onInputChange={setNewCondition}
          onAdd={() => { addChip("conditions", newCondition); setNewCondition(""); }}
          onRemove={(v) => removeChip("conditions", v)}
          placeholder="Add condition"
        />

        {/* Emergency Contacts */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              <UserPlus className="h-3.5 w-3.5 text-green-400" />
              Emergency Contacts
            </label>
            <button
              type="button"
              onClick={() => setShowAddContact(true)}
              className="flex items-center gap-1 text-xs font-semibold text-primary"
            >
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>
          </div>

          <div className="space-y-2">
            {current.contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-3 rounded-xl bg-surface p-3"
              >
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                  {contact.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{contact.name}</p>
                  <p className="text-xs text-white/50">
                    {contact.relation} · {contact.phone}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeContact(contact.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/30 active:text-red-400"
                  aria-label={`Remove ${contact.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {showAddContact && (
            <div className="mt-3 space-y-2 rounded-xl border border-white/10 bg-surface-light p-4">
              <input
                type="text"
                placeholder="Name"
                value={contactForm.name}
                onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="tel"
                placeholder="Phone"
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Relation (e.g. Spouse)"
                value={contactForm.relation}
                onChange={(e) => setContactForm({ ...contactForm, relation: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-dark px-3 py-2.5 text-sm outline-none focus:border-primary"
              />
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={addContact}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold"
                >
                  Add Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="rounded-lg px-4 py-2.5 text-sm text-white/50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function ChipSection({
  icon: Icon,
  iconColor,
  label,
  chips,
  inputValue,
  onInputChange,
  onAdd,
  onRemove,
  placeholder,
}: {
  icon: typeof Droplets;
  iconColor: string;
  label: string;
  chips: string[];
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  onRemove: (v: string) => void;
  placeholder: string;
}) {
  return (
    <section>
      <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
        <Icon className={`h-3.5 w-3.5 ${iconColor}`} />
        {label}
      </label>
      <div className="flex flex-wrap gap-2 mb-2">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-sm"
          >
            {chip}
            <button type="button" onClick={() => onRemove(chip)} aria-label={`Remove ${chip}`}>
              <X className="h-3.5 w-3.5 text-white/40" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          className="flex-1 rounded-xl border border-white/10 bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={onAdd}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-light"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
