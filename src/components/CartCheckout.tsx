import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash,
  Plus,
  Minus,
  ForkKnife,
  Bag,
  Truck,
  Phone,
  CreditCard,
  Money,
  ShieldCheck,
  Check,
  MapPin,
  Users,
  ShoppingBag,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  OFFICE_ZONES,
  RESTAURANT,
  TAX_RATE,
  OFFICE_DELIVERY_FEE,
} from "@/data/mockData";
import type {
  CartItem,
  Order,
  OrderType,
  PaymentMethod,
  UserProfile,
} from "@/types";

const money = (n: number) => `${RESTAURANT.currency} ${n.toFixed(2)}`;

const TYPES: { key: OrderType; label: string; icon: typeof ForkKnife; hint: string }[] = [
  { key: "dine_in", label: "Dine-In", icon: ForkKnife, hint: "Eat at a table" },
  { key: "takeaway", label: "Takeaway", icon: Bag, hint: "Pickup at counter" },
  { key: "office_lunch", label: "Office Lunch", icon: Truck, hint: "Delivered to you" },
];

const PAYMENTS: { key: PaymentMethod; label: string; icon: typeof Money }[] = [
  { key: "cash", label: "Cash at Counter", icon: Money },
  { key: "corporate_card", label: "Corporate Card", icon: CreditCard },
  { key: "mobile_pay", label: "Quick Mobile Pay", icon: Phone },
];

interface CartCheckoutProps {
  open: boolean;
  onClose: () => void;
  cart: CartItem[];
  user: UserProfile | null;
  onRemoveLine: (lineId: string) => void;
  onUpdateQty: (lineId: string, qty: number) => void;
  onPlaceOrder: (order: Order) => void;
}

export default function CartCheckout({
  open,
  onClose,
  cart,
  user,
  onRemoveLine,
  onUpdateQty,
  onPlaceOrder,
}: CartCheckoutProps) {
  const [type, setType] = useState<OrderType>("dine_in");
  const [payment, setPayment] = useState<PaymentMethod>("cash");

  // Dine-in
  const [table, setTable] = useState("");
  const [guests, setGuests] = useState(2);
  const [rush, setRush] = useState(false);
  // Takeaway
  const [pickup, setPickup] = useState<"asap" | "15m" | "30m" | "scheduled">("asap");
  const [pickupTime, setPickupTime] = useState("");
  // Office
  const [building, setBuilding] = useState(OFFICE_ZONES[0]);
  const [floor, setFloor] = useState("");
  const [company, setCompany] = useState("");
  const [extension, setExtension] = useState("");
  const [cutlery, setCutlery] = useState(true);
  // Shared
  const [name, setName] = useState(user?.fullName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");

  const [otpStage, setOtpStage] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const demoOtp = useMemo(() => "4" + Math.floor(100 + Math.random() * 900), [otpStage]);

  const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
  const tax = subtotal * TAX_RATE;
  const fee = type === "office_lunch" ? OFFICE_DELIVERY_FEE : 0;
  const total = subtotal + tax + fee;
  const prepMinutes = cart.length
    ? Math.max(...cart.map((l) => 8)) + (rush ? 0 : 4)
    : 10;

  const canPlace =
    cart.length > 0 &&
    name.trim().length > 1 &&
    phone.trim().length > 5 &&
    (type !== "dine_in" || table.trim().length > 0) &&
    (type !== "office_lunch" || floor.trim().length > 0);

  const buildOrder = (): Order => {
    const base = {
      id: "o-" + Date.now(),
      code: "KHS-" + Math.floor(4900 + Math.random() * 900),
      type,
      items: cart,
      subtotal,
      tax,
      fee,
      total,
      status: "received" as const,
      createdAt: Date.now(),
      prepMinutes,
      payment,
      customerName: name.trim(),
      customerPhone: phone.trim(),
    };
    if (type === "dine_in")
      return { ...base, dineIn: { tableNumber: table, guests, rush } };
    if (type === "takeaway")
      return {
        ...base,
        takeaway: {
          pickup,
          pickupTime: pickup === "scheduled" ? pickupTime || "Scheduled" : pickup.toUpperCase(),
          name: name.trim(),
          phone: phone.trim(),
        },
      };
    return {
      ...base,
      office: {
        building,
        floor: floor.trim(),
        company: company.trim(),
        extension: extension.trim(),
        cutlery,
        contact: name.trim(),
      },
    };
  };

  const submitOtp = () => {
    if (otpInput.trim() !== demoOtp) return;
    onPlaceOrder(buildOrder());
    setOtpStage(false);
    setOtpInput("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 360, damping: 38 }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FDFBF7] shadow-2xl dark:bg-[#1F1F24]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 dark:border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} weight="fill" className="text-[#C85A32]" />
                <h2 className="text-base font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
                  Your Order
                </h2>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60">
                  {cart.reduce((s, l) => s + l.qty, 0)}
                </span>
              </div>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10">
                <X size={18} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 text-center">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-black/5 dark:bg-white/10">
                  <Bag size={26} className="text-[#1F1F24]/40" />
                </div>
                <p className="text-sm font-semibold text-[#1F1F24]/70 dark:text-[#FDFBF7]/70">
                  Your cart is empty
                </p>
                <p className="text-xs text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">
                  Add dishes from the menu to get started.
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
                  {/* Line items */}
                  <div className="space-y-2.5">
                    {cart.map((l) => (
                      <div
                        key={l.lineId}
                        className="flex gap-3 rounded-2xl border border-black/10 bg-white p-2.5 dark:border-white/10 dark:bg-white/5"
                      >
                        <img src={l.image} alt={l.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-1 text-sm font-bold text-[#1F1F24] dark:text-[#FDFBF7]">
                            {l.name}
                          </p>
                          <p className="text-[11px] text-[#1F1F24]/50 dark:text-[#FDFBF7]/50">
                            {l.spice}
                            {l.addOns.length > 0 && ` · ${l.addOns.map((a) => a.name).join(", ")}`}
                          </p>
                          <div className="mt-1.5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onUpdateQty(l.lineId, l.qty - 1)}
                                className="grid h-6 w-6 place-items-center rounded-full border border-black/10 dark:border-white/10"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-5 text-center text-sm font-bold">{l.qty}</span>
                              <button
                                onClick={() => onUpdateQty(l.lineId, l.qty + 1)}
                                className="grid h-6 w-6 place-items-center rounded-full bg-[#E5A93C] text-[#1F1F24]"
                              >
                                <Plus size={12} weight="bold" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-[#C85A32]">
                                {money(l.unitPrice * l.qty)}
                              </span>
                              <button
                                onClick={() => onRemoveLine(l.lineId)}
                                className="text-[#1F1F24]/40 hover:text-red-500"
                              >
                                <Trash size={15} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order type */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
                      Order type
                    </p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {TYPES.map((t) => {
                        const Icon = t.icon;
                        const on = type === t.key;
                        return (
                          <button
                            key={t.key}
                            onClick={() => setType(t.key)}
                            className={`flex flex-col items-center gap-1 rounded-xl border py-2.5 text-center transition ${
                              on
                                ? "border-[#E5A93C] bg-[#E5A93C]/15"
                                : "border-black/10 dark:border-white/10"
                            }`}
                          >
                            <Icon size={18} className={on ? "text-[#C85A32]" : "text-[#1F1F24]/50 dark:text-[#FDFBF7]/50"} weight={on ? "fill" : "regular"} />
                            <span className="text-[11px] font-bold text-[#1F1F24] dark:text-[#FDFBF7]">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={type}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3 overflow-hidden rounded-2xl bg-black/[0.03] p-3.5 dark:bg-white/5"
                    >
                      {type === "dine_in" && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Table / QR no.</Label>
                              <Input value={table} onChange={(e) => setTable(e.target.value)} placeholder="e.g. 12" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Guests</Label>
                              <div className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-2 py-1.5 dark:border-white/10 dark:bg-[#1F1F24]">
                                <Users size={15} className="text-[#1F1F24]/40" />
                                <button onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-6 w-6 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Minus size={12} /></button>
                                <span className="w-5 text-center text-sm font-bold">{guests}</span>
                                <button onClick={() => setGuests((g) => g + 1)} className="grid h-6 w-6 place-items-center rounded-full hover:bg-black/5 dark:hover:bg-white/10"><Plus size={12} /></button>
                              </div>
                            </div>
                          </div>
                          <label className="flex items-center justify-between text-sm font-medium text-[#1F1F24] dark:text-[#FDFBF7]">
                            Rush dining (skip-the-line prep)
                            <Switch checked={rush} onCheckedChange={setRush} />
                          </label>
                        </>
                      )}

                      {type === "takeaway" && (
                        <>
                          <p className="text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">Pickup time</p>
                          <div className="grid grid-cols-4 gap-1.5">
                            {(["asap", "15m", "30m", "scheduled"] as const).map((p) => (
                              <button
                                key={p}
                                onClick={() => setPickup(p)}
                                className={`rounded-lg py-1.5 text-[11px] font-bold uppercase transition ${
                                  pickup === p ? "bg-[#1F1F24] text-[#FDFBF7] dark:bg-[#FDFBF7] dark:text-[#1F1F24]" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                          {pickup === "scheduled" && (
                            <Input type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                          )}
                        </>
                      )}

                      {type === "office_lunch" && (
                        <>
                          <div className="space-y-1.5">
                            <Label className="text-xs">Building</Label>
                            <div className="flex flex-wrap gap-1.5">
                              {OFFICE_ZONES.map((z) => (
                                <button
                                  key={z}
                                  onClick={() => setBuilding(z)}
                                  className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
                                    building === z ? "bg-[#C85A32] text-white" : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/10 dark:text-[#FDFBF7]/60"
                                  }`}
                                >
                                  <MapPin size={12} /> {z}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Floor / Suite</Label>
                              <Input value={floor} onChange={(e) => setFloor(e.target.value)} placeholder="4th, Suite 412" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Company</Label>
                              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Boro Analytics" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 items-end gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Contact extension</Label>
                              <Input value={extension} onChange={(e) => setExtension(e.target.value)} placeholder="x221" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                            </div>
                            <label className="flex items-center justify-between pb-1 text-sm font-medium text-[#1F1F24] dark:text-[#FDFBF7]">
                              Cutlery needed
                              <Switch checked={cutlery} onCheckedChange={setCutlery} />
                            </label>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Contact */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Your name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Phone</Label>
                      <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+251 9..." className="rounded-xl bg-white dark:bg-[#1F1F24]" />
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">Payment method</p>
                    <div className="space-y-1.5">
                      {PAYMENTS.map((p) => {
                        const Icon = p.icon;
                        const on = payment === p.key;
                        return (
                          <button
                            key={p.key}
                            onClick={() => setPayment(p.key)}
                            className={`flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                              on ? "border-[#E5A93C] bg-[#E5A93C]/10" : "border-black/10 dark:border-white/10"
                            }`}
                          >
                            <Icon size={17} className={on ? "text-[#C85A32]" : "text-[#1F1F24]/50 dark:text-[#FDFBF7]/50"} />
                            <span className="flex-1 text-left text-[#1F1F24] dark:text-[#FDFBF7]">{p.label}</span>
                            {on && <Check size={16} className="text-[#C85A32]" weight="bold" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer summary */}
                <div className="border-t border-black/10 bg-white/60 px-5 py-4 dark:border-white/10 dark:bg-white/5">
                  <div className="mb-3 space-y-1 text-sm">
                    <Row label="Subtotal" value={money(subtotal)} />
                    <Row label={`Tax (15%)`} value={money(tax)} />
                    {fee > 0 && <Row label="Delivery fee" value={money(fee)} />}
                    <div className="flex items-center justify-between pt-1 text-base font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
                      <span>Total</span>
                      <span>{money(total)}</span>
                    </div>
                  </div>
                  <Button
                    disabled={!canPlace}
                    onClick={() => setOtpStage(true)}
                    className="w-full rounded-xl bg-[#E5A93C] py-3 text-sm font-bold text-[#1F1F24] hover:bg-[#E5A93C]/90 disabled:opacity-40"
                  >
                    <ShieldCheck size={16} className="mr-1.5" /> Confirm with OTP
                  </Button>
                  {!canPlace && (
                    <p className="mt-2 text-center text-[11px] text-[#C85A32]">
                      Add name, phone and required fields to place the order.
                    </p>
                  )}
                </div>
              </>
            )}
          </motion.aside>

          {/* OTP modal */}
          <AnimatePresence>
            {otpStage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] grid place-items-center bg-black/50 px-6 backdrop-blur-sm"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="w-full max-w-xs rounded-3xl bg-[#FDFBF7] p-6 text-center shadow-2xl dark:bg-[#232329]"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#E5A93C]/20 text-[#C85A32]">
                    <Phone size={22} weight="fill" />
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-[#1F1F24] dark:text-[#FDFBF7]">
                    Phone OTP
                  </h3>
                  <p className="mt-1 text-xs text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
                    Demo code sent to {phone}. Enter it to place your order.
                  </p>
                  <p className="mt-2 rounded-lg bg-black/5 py-1.5 text-sm font-bold tracking-widest text-[#C85A32] dark:bg-white/10">
                    {demoOtp}
                  </p>
                  <Input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                    maxLength={4}
                    inputMode="numeric"
                    placeholder="0000"
                    className="mt-3 rounded-xl text-center text-xl tracking-[0.4em]"
                  />
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" onClick={() => setOtpStage(false)} className="flex-1 rounded-xl">
                      Cancel
                    </Button>
                    <Button
                      onClick={submitOtp}
                      disabled={otpInput !== demoOtp}
                      className="flex-1 rounded-xl bg-[#C85A32] font-bold text-white hover:bg-[#C85A32]/90 disabled:opacity-40"
                    >
                      Place order
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[#1F1F24]/60 dark:text-[#FDFBF7]/60">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
