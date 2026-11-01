import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass,
  Flame,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  X,
  NotePencil,
  Check,
  Clock,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RESTAURANT, CATEGORIES, MENU_ITEMS } from "@/data/mockData";
import type { CartItem, DietaryTag, MenuItem, SpiceLevel } from "@/types";

const FILTERS: { key: DietaryTag | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "chef", label: "Chef Special" },
  { key: "office", label: "Office Lunch" },
  { key: "spicy", label: "Spicy" },
  { key: "vegetarian", label: "Vegetarian" },
];

const TAG_META: Record<DietaryTag, { label: string; cls: string }> = {
  chef: { label: "Chef Special", cls: "bg-[#E5A93C]/20 text-[#8a5a12]" },
  office: { label: "Office Lunch", cls: "bg-[#C85A32]/15 text-[#C85A32]" },
  spicy: { label: "Spicy", cls: "bg-red-500/15 text-red-600" },
  vegetarian: { label: "Veg", cls: "bg-emerald-500/15 text-emerald-700" },
  halal: { label: "Halal", cls: "bg-sky-500/15 text-sky-700" },
};

const money = (n: number) => `${RESTAURANT.currency} ${n.toFixed(2)}`;

interface MenuSectionProps {
  onAddToCart: (line: CartItem) => void;
}

export default function MenuSection({ onAddToCart }: MenuSectionProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<DietaryTag | "all">("all");
  const [openCat, setOpenCat] = useState<string>(CATEGORIES[0].id);
  const [active, setActive] = useState<MenuItem | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_ITEMS.filter((m) => {
      const matchQ =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q);
      const matchF = filter === "all" || m.tags.includes(filter);
      return matchQ && matchF;
    });
  }, [query, filter]);

  const visibleCats = CATEGORIES.filter((c) =>
    filtered.some((m) => m.categoryId === c.id)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 pb-28 pt-4">
      {/* Search */}
      <div className="sticky top-[68px] z-30 -mx-4 bg-[#FDFBF7]/95 px-4 pb-3 pt-1 backdrop-blur dark:bg-[#1F1F24]/95 md:top-[92px]">
        <div className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-3.5 py-2.5 shadow-sm dark:border-white/10 dark:bg-white/5">
          <MagnifyingGlass size={18} className="text-[#1F1F24]/40" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, e.g. bento, grill, mocktail"
            className="border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0 dark:text-[#FDFBF7]"
          />
          {query && (
            <button onClick={() => setQuery("")} className="text-[#1F1F24]/40">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dietary filters */}
        <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                filter === f.key
                  ? "bg-[#1F1F24] text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1F1F24]"
                  : "bg-black/5 text-[#1F1F24]/65 dark:bg-white/5 dark:text-[#FDFBF7]/65"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Category pills */}
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-0.5">
          {visibleCats.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setOpenCat(c.id);
                document
                  .getElementById(`cat-${c.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                openCat === c.id
                  ? "border-[#E5A93C] bg-[#E5A93C]/15 text-[#8a5a12]"
                  : "border-black/10 text-[#1F1F24]/60 dark:border-white/10 dark:text-[#FDFBF7]/60"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu grid */}
      {visibleCats.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-sm font-semibold text-[#1F1F24]/70 dark:text-[#FDFBF7]/70">
            No dishes match your search.
          </p>
        </div>
      )}

      {visibleCats.map((cat) => (
        <section key={cat.id} id={`cat-${cat.id}`} className="mt-6 scroll-mt-44">
          <div className="mb-2 flex items-end justify-between">
            <div>
              <h2 className="text-base font-extrabold tracking-tight text-[#1F1F24] dark:text-[#FDFBF7]">
                {cat.name}
              </h2>
              <p className="text-xs text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
                {cat.blurb}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered
              .filter((m) => m.categoryId === cat.id)
              .map((m, i) => (
                <motion.button
                  key={m.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3), ease: "easeOut" }}
                  onClick={() => setActive(m)}
                  className="group flex gap-3 rounded-2xl border border-black/10 bg-white p-2.5 text-left shadow-sm transition hover:border-[#E5A93C] hover:shadow-md dark:border-white/10 dark:bg-white/5"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={m.image}
                      alt={m.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {m.tags.includes("chef") && (
                      <span className="absolute left-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-[#E5A93C] text-[#1F1F24] shadow">
                        <Star size={13} weight="fill" />
                      </span>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-1 text-sm font-bold text-[#1F1F24] dark:text-[#FDFBF7]">
                      {m.name}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-[#1F1F24]/55 dark:text-[#FDFBF7]/55">
                      {m.description}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {m.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${TAG_META[t].cls}`}
                        >
                          {TAG_META[t].label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">
                        <Clock size={12} /> {m.prepMinutes}m
                      </span>
                      <span className="text-sm font-extrabold text-[#C85A32]">
                        {money(m.price)}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
          </div>
        </section>
      ))}

      <DishModal
        item={active}
        onClose={() => setActive(null)}
        onAdd={(line) => {
          onAddToCart(line);
          setActive(null);
        }}
      />
    </div>
  );
}

function DishModal({
  item,
  onClose,
  onAdd,
}: {
  item: MenuItem | null;
  onClose: () => void;
  onAdd: (line: CartItem) => void;
}) {
  const [qty, setQty] = useState(1);
  const [spice, setSpice] = useState<SpiceLevel>("Medium");
  const [addOns, setAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  if (!item) return null;

  const addOnTotal = item.addOns
    .filter((a) => addOns.includes(a.id))
    .reduce((s, a) => s + a.price, 0);
  const unit = item.price + addOnTotal;

  const toggleAddOn = (id: string) =>
    setAddOns((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const confirm = () => {
    const line: CartItem = {
      lineId: `${item.id}-${Date.now()}`,
      itemId: item.id,
      name: item.name,
      image: item.image,
      unitPrice: unit,
      qty,
      spice,
      addOns: item.addOns.filter((a) => addOns.includes(a.id)),
      notes: notes.trim(),
    };
    onAdd(line);
    setQty(1);
    setAddOns([]);
    setNotes("");
  };

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md gap-0 overflow-hidden rounded-3xl border-black/10 bg-[#FDFBF7] p-0 dark:border-white/10 dark:bg-[#232329]">
        <div className="relative h-44 w-full">
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
          <button
            onClick={onClose}
            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur"
          >
            <X size={16} />
          </button>
        </div>
        <DialogHeader className="px-5 pt-4 text-left">
          <DialogTitle className="text-lg font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
            {item.name}
          </DialogTitle>
          <p className="text-sm text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
            {item.description}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <span
                key={t}
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${TAG_META[t].cls}`}
              >
                {TAG_META[t].label}
              </span>
            ))}
            <span className="rounded-full bg-black/5 px-2 py-0.5 text-[11px] font-semibold text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60">
              {item.calories} kcal
            </span>
          </div>
        </DialogHeader>

        <div className="max-h-[40vh] space-y-4 overflow-y-auto px-5 py-4">
          {/* Spice */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
              <Flame size={14} className="text-[#C85A32]" /> Spice level
            </p>
            <div className="flex gap-1.5">
              {item.spiceLevels.map((s) => (
                <button
                  key={s}
                  onClick={() => setSpice(s)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition ${
                    spice === s
                      ? "border-[#C85A32] bg-[#C85A32]/10 text-[#C85A32]"
                      : "border-black/10 text-[#1F1F24]/60 dark:border-white/10 dark:text-[#FDFBF7]/60"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {item.addOns.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
                Add-ons
              </p>
              <div className="space-y-1.5">
                {item.addOns.map((a) => {
                  const on = addOns.includes(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() => toggleAddOn(a.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
                        on
                          ? "border-[#E5A93C] bg-[#E5A93C]/10"
                          : "border-black/10 dark:border-white/10"
                      }`}
                    >
                      <span className="flex items-center gap-2 font-medium text-[#1F1F24] dark:text-[#FDFBF7]">
                        <span
                          className={`grid h-4 w-4 place-items-center rounded ${
                            on ? "bg-[#E5A93C] text-[#1F1F24]" : "border border-black/20 dark:border-white/20"
                          }`}
                        >
                          {on && <Check size={11} weight="bold" />}
                        </span>
                        {a.name}
                      </span>
                      <span className="text-xs font-semibold text-[#C85A32]">
                        +{money(a.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
              <NotePencil size={14} /> Kitchen notes
            </p>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. no onions, extra lemon"
              className="rounded-xl"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-black/10 bg-white/60 px-5 py-3 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="grid h-9 w-9 place-items-center rounded-full border border-black/10 dark:border-white/10"
            >
              <Minus size={16} />
            </button>
            <span className="w-6 text-center text-base font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => q + 1)}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#E5A93C] text-[#1F1F24]"
            >
              <Plus size={16} weight="bold" />
            </button>
          </div>
          <AnimatePresence mode="popLayout">
            <motion.button
              key={unit + "-" + qty}
              onClick={confirm}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 rounded-xl bg-[#1F1F24] px-4 py-2.5 text-sm font-bold text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1F1F24]"
            >
              <ShoppingBag size={16} weight="fill" />
              Add {money(unit * qty)}
            </motion.button>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
