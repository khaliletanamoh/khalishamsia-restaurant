import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  CircleNotch,
  Timer,
  Bell,
  BellRinging,
  ArrowRight,
  Trash,
  CookingPot,
  Package,
  ForkKnife,
  Bag,
  Truck,
  Phone,
  Users,
  Clock,
  ShoppingBag,
  Flame,
} from "@phosphor-icons/react";
import { Switch } from "@/components/ui/switch";
import { RESTAURANT } from "@/data/mockData";
import type { Order, OrderStatus, OrderType } from "@/types";

const money = (n: number) => `${RESTAURANT.currency} ${n.toFixed(2)}`;

const FLOW: OrderStatus[] = ["received", "preparing", "ready", "completed"];

const STATUS_META: Record<OrderStatus, { label: string; color: string; icon: typeof Clock }> = {
  received: { label: "Received", color: "text-sky-600 bg-sky-500/15", icon: CheckCircle },
  preparing: { label: "In Kitchen", color: "text-[#C85A32] bg-[#C85A32]/15", icon: CookingPot },
  ready: { label: "Ready", color: "text-[#8a5a12] bg-[#E5A93C]/20", icon: Bell },
  completed: { label: "Completed", color: "text-emerald-700 bg-emerald-500/15", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "text-red-600 bg-red-500/15", icon: Trash },
};

const TYPE_META: Record<OrderType, { label: string; icon: typeof ForkKnife }> = {
  dine_in: { label: "Dine-In", icon: ForkKnife },
  takeaway: { label: "Takeaway", icon: Bag },
  office_lunch: { label: "Office Lunch", icon: Truck },
};

function etaMs(o: Order) {
  return o.createdAt + o.prepMinutes * 60000;
}

interface Props {
  mode: "customer" | "staff";
  orders: Order[];
  onAdvance: (id: string, status: OrderStatus) => void;
  onReorder: (order: Order) => void;
  onCancel: (id: string) => void;
}

export default function OrderTrackerAndStaff({ mode, orders, onAdvance, onReorder, onCancel }: Props) {
  const [now, setNow] = useState(Date.now());
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Alert sound when an order flips to ready (staff)
  const prevReady = useMemo(() => new Set(orders.filter((o) => o.status === "ready").map((o) => o.id)), [orders]);
  useEffect(() => {
    if (!sound) return;
    if (typeof window === "undefined") return;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.42);
    } catch {
      /* noop */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prevReady]);

  const active = orders.filter((o) => o.status !== "completed" && o.status !== "cancelled");
  const history = orders.filter((o) => o.status === "completed" || o.status === "cancelled");

  if (mode === "staff") {
    return <StaffKDS orders={orders} now={now} onAdvance={onAdvance} sound={sound} setSound={setSound} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-28 pt-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#E5A93C]/20 text-[#8a5a12]">
          <Timer size={18} weight="fill" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">Live Order Tracker</h1>
          <p className="text-xs text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
            No phone calls — watch your food move in real time
          </p>
        </div>
      </div>

      {active.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {active.map((o) => (
            <CustomerTicket key={o.id} o={o} now={now} onReorder={onReorder} onCancel={onCancel} />
          ))}
        </div>
      )}

      {history.length > 0 && (
        <>
          <p className="mb-2 mt-6 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
            Order history
          </p>
          <div className="space-y-2">
            {history.map((o) => (
              <div
                key={o.id}
                className="flex items-center justify-between rounded-2xl border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-extrabold text-[#C85A32]">{o.code}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_META[o.status].color}`}>
                    {STATUS_META[o.status].label}
                  </span>
                  <span className="text-xs text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">{money(o.total)}</span>
                </div>
                {o.status === "completed" && (
                  <button
                    onClick={() => onReorder(o)}
                    className="flex items-center gap-1 rounded-full bg-[#E5A93C] px-3 py-1.5 text-xs font-bold text-[#1F1F24]"
                  >
                    <ArrowRight size={13} weight="bold" /> Reorder
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="mt-10 flex flex-col items-center gap-2 rounded-3xl border border-dashed border-black/15 py-12 text-center dark:border-white/15">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
        <ShoppingBag size={26} className="text-[#1F1F24]/40" />
      </div>
      <p className="text-sm font-semibold text-[#1F1F24]/70 dark:text-[#FDFBF7]/70">No active orders</p>
      <p className="text-xs text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">Place an order from the menu to track it here.</p>
    </div>
  );
}

function CustomerTicket({
  o,
  now,
  onReorder,
  onCancel,
}: {
  o: Order;
  now: number;
  onReorder: (o: Order) => void;
  onCancel: (id: string) => void;
}) {
  const idx = FLOW.indexOf(o.status);
  const pct = Math.min(100, Math.max(0, ((now - o.createdAt) / (o.prepMinutes * 60000)) * 100));
  const remaining = Math.max(0, Math.ceil((etaMs(o) - now) / 60000));
  const TypeIcon = TYPE_META[o.type].icon;
  const StatusIcon = STATUS_META[o.status].icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-3 dark:border-white/5">
        <div className="flex items-center gap-2">
          <TypeIcon size={16} className="text-[#C85A32]" weight="fill" />
          <span className="text-sm font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">{o.code}</span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] font-bold text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60">
            {TYPE_META[o.type].label}
          </span>
        </div>
        <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${STATUS_META[o.status].color}`}>
          <StatusIcon size={12} weight="fill" /> {STATUS_META[o.status].label}
        </span>
      </div>

      <div className="px-4 py-3.5">
        {/* Stepper */}
        <div className="mb-4 flex items-center">
          {FLOW.map((s, i) => {
            const done = i <= idx;
            const Icon = STATUS_META[s].icon;
            return (
              <div key={s} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full transition ${
                      done ? "bg-[#E5A93C] text-[#1F1F24]" : "bg-black/5 text-[#1F1F24]/30 dark:bg-white/10 dark:text-[#FDFBF7]/30"
                    }`}
                  >
                    {s === "preparing" && o.status === "preparing" ? (
                      <CircleNotch size={16} className="animate-spin" />
                    ) : (
                      <Icon size={15} weight={done ? "fill" : "regular"} />
                    )}
                  </div>
                  <span className="mt-1 text-[10px] font-bold text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
                    {STATUS_META[s].label}
                  </span>
                </div>
                {i < FLOW.length - 1 && (
                  <div className={`mx-1 mb-4 h-0.5 flex-1 rounded ${i < idx ? "bg-[#E5A93C]" : "bg-black/10 dark:bg-white/10"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ETA */}
        {o.status !== "ready" && o.status !== "completed" ? (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-[#E5A93C]/10 px-3 py-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#8a5a12]">
              <Timer size={14} weight="fill" />
              {remaining > 0 ? `Ready in ~${remaining} min` : "Almost ready"}
            </span>
            <span className="text-xs font-bold text-[#8a5a12]">{Math.round(pct)}%</span>
          </div>
        ) : o.status === "ready" ? (
          <div className="mb-3 flex items-center gap-1.5 rounded-xl bg-[#E5A93C]/20 px-3 py-2 text-xs font-bold text-[#8a5a12]">
            <BellRinging size={15} weight="fill" /> Your order is ready!
            {o.type === "dine_in" && ` Table ${o.dineIn?.tableNumber ?? ""}`}
            {o.type === "takeaway" && " at the counter"}
            {o.type === "office_lunch" && ` — ${o.office?.floor ?? ""}`}
          </div>
        ) : null}

        {/* Progress bar */}
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-black/5 dark:bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#C85A32]"
            initial={false}
            animate={{ width: `${o.status === "ready" || o.status === "completed" ? 100 : pct}%` }}
            transition={{ ease: "easeOut", duration: 0.6 }}
          />
        </div>

        {/* Items */}
        <div className="space-y-1.5">
          {o.items.map((l) => (
            <div key={l.lineId} className="flex items-center justify-between text-sm">
              <span className="text-[#1F1F24] dark:text-[#FDFBF7]">
                <span className="font-semibold">{l.qty}×</span> {l.name}
                {l.spice !== "Mild" && (
                  <span className="ml-1 inline-flex items-center text-[11px] font-bold text-red-500">
                    <Flame size={11} /> {l.spice}
                  </span>
                )}
              </span>
              <span className="text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">{money(l.unitPrice * l.qty)}</span>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 dark:border-white/5">
          <span className="text-sm font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">{money(o.total)}</span>
          <div className="flex gap-2">
            {o.status === "received" && (
              <button onClick={() => onCancel(o.id)} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-500/10">
                <Trash size={13} /> Cancel
              </button>
            )}
            <button onClick={() => onReorder(o)} className="flex items-center gap-1 rounded-full bg-black/5 px-3 py-1.5 text-xs font-bold text-[#1F1F24] dark:bg-white/10 dark:text-[#FDFBF7]">
              <ArrowRight size={13} /> Reorder
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StaffKDS({
  orders,
  now,
  onAdvance,
  sound,
  setSound,
}: {
  orders: Order[];
  now: number;
  onAdvance: (id: string, status: OrderStatus) => void;
  sound: boolean;
  setSound: (b: boolean) => void;
}) {
  const [filter, setFilter] = useState<OrderType | "all">("all");

  const columns: OrderStatus[] = ["received", "preparing", "ready", "completed"];
  const filtered = orders.filter((o) => filter === "all" || o.type === filter);

  const counts = {
    received: orders.filter((o) => o.status === "received").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#1F1F24] text-[#E5A93C] dark:bg-[#FDFBF7] dark:text-[#1F1F24]">
            <CookingPot size={18} weight="fill" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">Kitchen Display</h1>
            <p className="text-xs text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
              {counts.received} new · {counts.preparing} cooking · {counts.ready} ready
            </p>
          </div>
        </div>
        <label className="flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs font-semibold dark:border-white/10 dark:bg-white/5">
          {sound ? <BellRinging size={15} className="text-[#C85A32]" /> : <Bell size={15} className="text-[#1F1F24]/50" />}
          Alert sound
          <Switch checked={sound} onCheckedChange={setSound} />
        </label>
      </div>

      {/* Type filter */}
      <div className="mb-4 flex gap-1.5 overflow-x-auto">
        {(["all", "dine_in", "takeaway", "office_lunch"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              filter === f ? "bg-[#C85A32] text-white" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
            }`}
          >
            {f === "all" ? "All" : TYPE_META[f].label}
          </button>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const colOrders = filtered.filter((o) => o.status === col);
          const Meta = STATUS_META[col];
          const ColIcon = Meta.icon;
          return (
            <div key={col} className="rounded-2xl bg-black/[0.03] p-2.5 dark:bg-white/5">
              <div className="mb-2 flex items-center gap-1.5 px-1">
                <ColIcon size={14} className="text-[#C85A32]" weight="fill" />
                <span className="text-xs font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">{Meta.label}</span>
                <span className="ml-auto rounded-full bg-white px-1.5 text-[11px] font-bold text-[#1F1F24]/60 dark:bg-[#1F1F24] dark:text-[#FDFBF7]/60">
                  {colOrders.length}
                </span>
              </div>
              <div className="space-y-2">
                {colOrders.length === 0 && (
                  <p className="py-6 text-center text-[11px] text-[#1F1F24]/40 dark:text-[#FDFBF7]/40">Empty</p>
                )}
                <AnimatePresence>
                  {colOrders.map((o) => (
                    <KdsTicket key={o.id} o={o} now={now} onAdvance={onAdvance} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function KdsTicket({
  o,
  now,
  onAdvance,
}: {
  o: Order;
  now: number;
  onAdvance: (id: string, status: OrderStatus) => void;
}) {
  const minsAgo = Math.floor((now - o.createdAt) / 60000);
  const late = minsAgo > o.prepMinutes && o.status !== "completed";
  const TypeIcon = TYPE_META[o.type].icon;
  const next = FLOW[FLOW.indexOf(o.status) + 1];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`rounded-xl border bg-white p-2.5 shadow-sm dark:bg-[#232329] ${
        late ? "border-red-400" : "border-black/10 dark:border-white/10"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
          <TypeIcon size={13} className="text-[#C85A32]" weight="fill" /> {o.code}
        </span>
        <span className={`flex items-center gap-0.5 text-[10px] font-bold ${late ? "text-red-500" : "text-[#1F1F24]/50 dark:text-[#FDFBF7]/50"}`}>
          <Clock size={10} /> {minsAgo}m
        </span>
      </div>

      {/* Location chip */}
      <div className="mt-1 flex flex-wrap gap-1">
        {o.type === "dine_in" && (
          <Chip icon={Users} text={`Table ${o.dineIn?.tableNumber ?? "?"}`} />
        )}
        {o.type === "office_lunch" && (
          <Chip icon={Package} text={`${o.office?.building ?? ""} ${o.office?.floor ?? ""}`} />
        )}
        {o.type === "takeaway" && <Chip icon={Bag} text={o.takeaway?.pickupTime ?? "Pickup"} />}
        {o.dineIn?.rush && <Chip icon={Flame} text="RUSH" tone="hot" />}
      </div>

      <div className="mt-1.5 space-y-0.5">
        {o.items.map((l) => (
          <p key={l.lineId} className="text-[11px] leading-snug text-[#1F1F24]/75 dark:text-[#FDFBF7]/75">
            <span className="font-bold">{l.qty}×</span> {l.name}
            {l.notes && <span className="block text-[10px] italic text-[#C85A32]">↳ {l.notes}</span>}
          </p>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
          <Phone size={11} /> {o.customerName.split(" ")[0]}
        </span>
        {next && (
          <button
            onClick={() => onAdvance(o.id, next)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold text-white transition ${
              next === "completed" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#C85A32] hover:bg-[#C85A32]/90"
            }`}
          >
            {next === "preparing" ? "Start" : next === "ready" ? "Ready" : "Complete"}
            <ArrowRight size={12} weight="bold" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Chip({
  icon: Icon,
  text,
  tone,
}: {
  icon: typeof Users;
  text: string;
  tone?: "hot";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
        tone === "hot" ? "bg-red-500/15 text-red-600" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
      }`}
    >
      <Icon size={10} weight="fill" /> {text}
    </span>
  );
}