import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarBlank,
  Clock,
  Users,
  MapPin,
  Check,
  Trash,
  Sparkle,
  Plus,
  Minus,
  X,
  NotePencil,
  Phone,
  Storefront,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MENU_ITEMS, RESTAURANT } from "@/data/mockData";
import type {
  DiningSlot,
  DiningZone,
  Occasion,
  TableReservation,
  UserProfile,
} from "@/types";

const SLOTS: { key: DiningSlot; times: string[] }[] = [
  { key: "Lunch Rush", times: ["11:30", "12:00", "12:30", "13:00", "13:30"] },
  { key: "Sunset Dining", times: ["16:30", "17:00", "17:30", "18:00"] },
  { key: "Dinner", times: ["18:30", "19:00", "19:30", "20:00", "20:30"] },
];

const OCCASIONS: Occasion[] = ["Casual", "Office Lunch Meeting", "Birthday/Event"];

const ZONES: { key: DiningZone; blurb: string }[] = [
  { key: "Main Dining Hall", blurb: "Lively, central tables" },
  { key: "Terrace Garden", blurb: "Open-air greenery" },
  { key: "Private Executive Booth", blurb: "Quiet, meeting-ready" },
];

interface TableBookingProps {
  reservations: TableReservation[];
  user: UserProfile | null;
  onAddReservation: (r: TableReservation) => void;
  onCancelReservation: (code: string) => void;
}

export default function TableBooking({
  reservations,
  user,
  onAddReservation,
  onCancelReservation,
}: TableBookingProps) {
  const [partySize, setPartySize] = useState(2);
  const [slot, setSlot] = useState<DiningSlot>("Lunch Rush");
  const [time, setTime] = useState(SLOTS[0].times[1]);
  const [date, setDate] = useState(
    new Date(Date.now() + 86400000).toISOString().slice(0, 10)
  );
  const [occasion, setOccasion] = useState<Occasion>("Casual");
  const [zone, setZone] = useState<DiningZone>("Main Dining Hall");
  const [chefRequests, setChefRequests] = useState("");
  const [contactName, setContactName] = useState(user?.fullName ?? "");
  const [contactPhone, setContactPhone] = useState(user?.phone ?? "");
  const [preAttach, setPreAttach] = useState<{ id: string; name: string; qty: number }[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [confirmed, setConfirmed] = useState<TableReservation | null>(null);

  const times = SLOTS.find((s) => s.key === slot)?.times ?? [];

  const canBook =
    partySize >= 1 &&
    date.length > 0 &&
    contactName.trim().length > 1 &&
    contactPhone.trim().length > 5;

  const toggleDish = (id: string, name: string) => {
    setPreAttach((p) => {
      const found = p.find((x) => x.id === id);
      if (found) {
        if (found.qty >= 5) return p.filter((x) => x.id !== id);
        return p.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [...p, { id, name, qty: 1 }];
    });
  };

  const book = () => {
    if (!canBook) return;
    const res: TableReservation = {
      code: "RSV-" + Math.floor(2100 + Math.random() * 800),
      partySize,
      date,
      time,
      slot,
      occasion,
      zone,
      chefRequests: chefRequests.trim(),
      preAttach: preAttach.map((p) => ({ name: p.name, qty: p.qty })),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      status: "confirmed",
      createdAt: Date.now(),
    };
    onAddReservation(res);
    setConfirmed(res);
    setPreAttach([]);
    setChefRequests("");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#C85A32]/15 text-[#C85A32]">
          <CalendarBlank size={18} weight="fill" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
            Reserve a Table
          </h1>
          <p className="text-xs text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
            Book dine-in slots at {RESTAURANT.name}, {RESTAURANT.location}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
        {/* Booking form */}
        <div className="space-y-5 rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
          {/* Party size */}
          <div>
            <Label className="mb-1.5 text-xs">Party size</Label>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-[#1F1F24]">
                <button onClick={() => setPartySize((p) => Math.max(1, p - 1))} className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                  <Minus size={14} />
                </button>
                <span className="flex w-10 items-center justify-center gap-1 text-sm font-bold">
                  <Users size={14} className="text-[#C85A32]" />
                  {partySize}
                </span>
                <button onClick={() => setPartySize((p) => Math.min(12, p + 1))} className="grid h-7 w-7 place-items-center rounded-full bg-[#E5A93C] text-[#1F1F24]">
                  <Plus size={14} weight="bold" />
                </button>
              </div>
              <span className="text-xs text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">Max 12 per booking</span>
            </div>
          </div>

          {/* Slot */}
          <div>
            <Label className="mb-1.5 text-xs">Dining slot</Label>
            <div className="grid grid-cols-3 gap-1.5">
              {SLOTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => {
                    setSlot(s.key);
                    setTime(s.times[1]);
                  }}
                  className={`rounded-xl border py-2 text-xs font-bold transition ${
                    slot === s.key
                      ? "border-[#E5A93C] bg-[#E5A93C]/15 text-[#8a5a12]"
                      : "border-black/10 text-[#1F1F24]/60 dark:border-white/10 dark:text-[#FDFBF7]/60"
                  }`}
                >
                  {s.key}
                </button>
              ))}
            </div>
          </div>

          {/* Date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 text-xs">Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-xl bg-white dark:bg-[#1F1F24]" />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Time</Label>
              <div className="flex flex-wrap gap-1">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTime(t)}
                    className={`rounded-lg px-2 py-1 text-[11px] font-bold transition ${
                      time === t ? "bg-[#1F1F24] text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1F1F24]" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Occasion */}
          <div>
            <Label className="mb-1.5 text-xs">Occasion</Label>
            <div className="flex flex-wrap gap-1.5">
              {OCCASIONS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOccasion(o)}
                  className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    occasion === o ? "bg-[#C85A32] text-white" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
                  }`}
                >
                  {o === "Birthday/Event" && <Sparkle size={13} weight="fill" />}
                  {o}
                </button>
              ))}
            </div>
          </div>

          {/* Zone */}
          <div>
            <Label className="mb-1.5 text-xs">Dining zone</Label>
            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3">
              {ZONES.map((z) => (
                <button
                  key={z.key}
                  onClick={() => setZone(z.key)}
                  className={`rounded-xl border p-2.5 text-left transition ${
                    zone === z.key ? "border-[#E5A93C] bg-[#E5A93C]/10" : "border-black/10 dark:border-white/10"
                  }`}
                >
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#1F1F24] dark:text-[#FDFBF7]">
                    <MapPin size={13} className="text-[#C85A32]" /> {z.key}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">{z.blurb}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pre-attach dishes */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label className="text-xs">Pre-attach dishes (optional)</Label>
              <button onClick={() => setPickerOpen(true)} className="flex items-center gap-1 text-xs font-bold text-[#C85A32]">
                <Plus size={13} /> Add
              </button>
            </div>
            {preAttach.length === 0 ? (
              <p className="rounded-xl bg-black/5 px-3 py-2 text-xs text-[#1F1F24]/50 dark:bg-white/5 dark:text-[#FDFBF7]/50">
                No dishes attached. Kitchen will have them ready when you arrive.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {preAttach.map((p) => (
                  <span key={p.id} className="flex items-center gap-1 rounded-full bg-[#E5A93C]/15 px-2.5 py-1 text-xs font-semibold text-[#8a5a12]">
                    {p.name} ×{p.qty}
                    <button onClick={() => setPreAttach((prev) => prev.filter((x) => x.id !== p.id))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Chef requests */}
          <div>
            <Label className="mb-1.5 flex items-center gap-1.5 text-xs">
              <NotePencil size={13} /> Special chef requests
            </Label>
            <Input value={chefRequests} onChange={(e) => setChefRequests(e.target.value)} placeholder="e.g. one high chair, quiet corner, allergy notes" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="mb-1.5 text-xs">Contact name</Label>
              <Input value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Full name" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
            </div>
            <div>
              <Label className="mb-1.5 text-xs">Phone</Label>
              <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+251 9..." className="rounded-xl bg-white dark:bg-[#1F1F24]" />
            </div>
          </div>

          <Button
            onClick={book}
            disabled={!canBook}
            className="w-full rounded-xl bg-[#E5A93C] py-3 text-sm font-bold text-[#1F1F24] hover:bg-[#E5A93C]/90 disabled:opacity-40"
          >
            <Check size={16} className="mr-1.5" weight="bold" /> Confirm reservation
          </Button>
        </div>

        {/* Upcoming reservations */}
        <div className="space-y-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
            Your reservations
          </p>
          {reservations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 p-5 text-center text-xs text-[#1F1F24]/50 dark:border-white/15 dark:text-[#FDFBF7]/50">
              No reservations yet.
            </div>
          ) : (
            reservations.map((r) => (
              <motion.div
                key={r.code}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-black/10 bg-white p-3.5 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold tracking-wide text-[#C85A32]">{r.code}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${r.status === "confirmed" ? "bg-emerald-500/15 text-emerald-700" : "bg-red-500/15 text-red-600"}`}>
                    {r.status}
                  </span>
                </div>
                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-bold text-[#1F1F24] dark:text-[#FDFBF7]">
                  <CalendarBlank size={14} /> {r.date} · {r.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
                  <Users size={13} /> {r.partySize} guests · {r.zone}
                </p>
                {r.preAttach.length > 0 && (
                  <p className="mt-1 text-[11px] text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">
                    Pre-ordered: {r.preAttach.map((p) => `${p.name} ×${p.qty}`).join(", ")}
                  </p>
                )}
                {r.status === "confirmed" && (
                  <button
                    onClick={() => onCancelReservation(r.code)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
                  >
                    <Trash size={13} /> Cancel
                  </button>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Dish picker */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPickerOpen(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 px-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-[#FDFBF7] p-4 shadow-2xl dark:bg-[#232329]"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-sm font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
                  <Storefront size={16} className="text-[#C85A32]" /> Attach dishes
                </h3>
                <button onClick={() => setPickerOpen(false)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[50vh] space-y-1.5 overflow-y-auto">
                {MENU_ITEMS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => toggleDish(m.id, m.name)}
                    className="flex w-full items-center gap-2.5 rounded-xl border border-black/10 p-2 text-left transition hover:border-[#E5A93C] dark:border-white/10"
                  >
                    <img src={m.image} alt={m.name} className="h-10 w-10 rounded-lg object-cover" />
                    <span className="flex-1 text-sm font-semibold text-[#1F1F24] dark:text-[#FDFBF7]">{m.name}</span>
                    {preAttach.find((p) => p.id === m.id) && (
                      <span className="rounded-full bg-[#E5A93C] px-2 py-0.5 text-[11px] font-bold text-[#1F1F24]">
                        ×{preAttach.find((p) => p.id === m.id)!.qty}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <Button onClick={() => setPickerOpen(false)} className="mt-3 w-full rounded-xl bg-[#1F1F24] text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1F1F24]">
                Done
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation toast-style card */}
      <AnimatePresence>
        {confirmed && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-sm -translate-x-1/2 rounded-2xl border border-[#E5A93C] bg-[#FDFBF7] p-4 shadow-2xl dark:bg-[#232329]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-sm font-extrabold text-[#C85A32]">
                  <Check size={16} weight="fill" /> Table reserved!
                </p>
                <p className="mt-1 text-xs text-[#1F1F24]/70 dark:text-[#FDFBF7]/70">
                  Code <span className="font-bold">{confirmed.code}</span> · {confirmed.partySize} guests on {confirmed.date} at {confirmed.time}.
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">
                  <Phone size={11} /> {confirmed.contactPhone}
                </p>
              </div>
              <button onClick={() => setConfirmed(null)} className="text-[#1F1F24]/40">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
