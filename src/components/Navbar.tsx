import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Storefront,
  Sun,
  Moon,
  ShoppingCart,
  User as UserIcon,
  Users,
  List,
  CalendarBlank,
  ClipboardText,
  IdentificationBadge,
  CaretDown,
  Phone,
  X,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RESTAURANT } from "@/data/mockData";
import type { TabKey, UserProfile, ViewMode } from "@/types";

interface NavbarProps {
  viewMode: ViewMode;
  setViewMode: (v: ViewMode) => void;
  activeTab: TabKey;
  setActiveTab: (t: TabKey) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  cartCount: number;
  onOpenCart: () => void;
  user: UserProfile | null;
  onSignIn: (u: UserProfile) => void;
  onSignOut: () => void;
}

const TABS: { key: TabKey; label: string; icon: typeof List }[] = [
  { key: "menu", label: "Menu", icon: List },
  { key: "booking", label: "Table Booking", icon: CalendarBlank },
  { key: "orders", label: "Live Orders", icon: ClipboardText },
];

export default function Navbar(props: NavbarProps) {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    cartCount,
    onOpenCart,
    user,
    onSignIn,
    onSignOut,
  } = props;

  const [authOpen, setAuthOpen] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"customer" | "staff">("customer");
  const [otp, setOtp] = useState("");

  const reset = () => {
    setStep("form");
    setOtp("");
  };

  const sendOtp = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;
    setStep("otp");
  };

  const verify = () => {
    if (otp.trim().length < 4) return;
    const profile: UserProfile = {
      id: "u-" + Date.now(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
    };
    onSignIn(profile);
    if (role === "staff") setViewMode("staff");
    setAuthOpen(false);
    reset();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/10 bg-[#FDFBF7]/90 backdrop-blur-md dark:border-white/10 dark:bg-[#1F1F24]/90">
      <div className="mx-auto flex h-[68px] max-w-6xl items-center justify-between gap-3 px-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#E5A93C] text-[#1F1F24] shadow-sm">
            <Storefront size={22} weight="fill" />
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-extrabold tracking-tight text-[#1F1F24] dark:text-[#FDFBF7]">
              {RESTAURANT.name}
            </p>
            <p className="hidden text-[11px] font-medium text-[#C85A32] sm:block">
              {RESTAURANT.location}
            </p>
          </div>
        </div>

        {/* View switch */}
        <div className="hidden items-center rounded-full border border-black/10 bg-white/70 p-0.5 dark:border-white/10 dark:bg-white/5 md:flex">
          {(["customer", "staff"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={`relative rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === v
                  ? "text-[#1F1F24]"
                  : "text-[#1F1F24]/55 dark:text-[#FDFBF7]/55"
              }`}
            >
              {viewMode === v && (
                <motion.span
                  layoutId="viewpill"
                  className="absolute inset-0 rounded-full bg-[#E5A93C]"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                {v === "customer" ? (
                  <UserIcon size={14} weight="bold" />
                ) : (
                  <IdentificationBadge size={14} weight="bold" />
                )}
                {v === "customer" ? "Customer" : "Staff KDS"}
              </span>
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {user ? (
            <div className="flex items-center gap-1">
              <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/70 px-2.5 py-1 dark:border-white/10 dark:bg-white/5 sm:flex">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#C85A32] text-[11px] font-bold text-white">
                  {user.fullName.slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-[92px] truncate text-xs font-semibold text-[#1F1F24] dark:text-[#FDFBF7]">
                  {user.fullName.split(" ")[0]}
                </span>
              </div>
              <button
                onClick={onSignOut}
                className="rounded-full p-2 text-[#1F1F24]/60 hover:bg-black/5 dark:text-[#FDFBF7]/60 dark:hover:bg-white/10"
                title="Sign out"
              >
                <X size={18} />
              </button>
            </div>
          ) : (
            <Button
              onClick={() => setAuthOpen(true)}
              className="h-9 rounded-full bg-[#1F1F24] px-3.5 text-xs font-semibold text-[#FDFBF7] hover:bg-[#1F1F24]/90 dark:bg-[#FDFBF7] dark:text-[#1F1F24]"
            >
              <UserIcon size={15} className="mr-1.5" weight="bold" />
              Sign in
            </Button>
          )}

          <button
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/70 text-[#1F1F24] transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-[#FDFBF7] dark:hover:bg-white/10"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun size={17} weight="fill" />
            ) : (
              <Moon size={17} weight="fill" />
            )}
          </button>

          {viewMode === "customer" && (
            <button
              onClick={onOpenCart}
              className="relative grid h-9 w-9 place-items-center rounded-full bg-[#E5A93C] text-[#1F1F24] shadow-sm transition active:scale-95"
              title="Cart"
            >
              <ShoppingCart size={18} weight="fill" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#C85A32] px-1 text-[10px] font-bold text-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>

      {/* Tabs (customer only) */}
      {viewMode === "customer" && (
        <nav className="mx-auto max-w-6xl px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors ${
                    active
                      ? "text-[#C85A32]"
                      : "text-[#1F1F24]/55 dark:text-[#FDFBF7]/55"
                  }`}
                >
                  <Icon size={15} weight={active ? "fill" : "regular"} />
                  {t.label}
                  {active && (
                    <motion.span
                      layoutId="tabline"
                      className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[#C85A32]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* Staff quick switch on mobile */}
      <div className="mx-auto flex max-w-6xl gap-1 px-4 pb-2 md:hidden">
        {(["customer", "staff"] as ViewMode[]).map((v) => (
          <button
            key={v}
            onClick={() => setViewMode(v)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold ${
              viewMode === v
                ? "bg-[#E5A93C] text-[#1F1F24]"
                : "bg-black/5 text-[#1F1F24]/60 dark:bg-white/5 dark:text-[#FDFBF7]/60"
            }`}
          >
            {v === "customer" ? (
              <UserIcon size={14} />
            ) : (
              <IdentificationBadge size={14} />
            )}
            {v === "customer" ? "Customer" : "Staff"}
          </button>
        ))}
      </div>

      {/* Auth dialog */}
      <Dialog open={authOpen} onOpenChange={(o) => !o && reset()}>
        <DialogContent className="max-w-sm rounded-2xl border-black/10 bg-[#FDFBF7] dark:border-white/10 dark:bg-[#232329]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#1F1F24] dark:text-[#FDFBF7]">
              <ShieldCheck size={20} className="text-[#C85A32]" />
              {step === "form" ? "Sign in to Khalishamsia" : "Verify your phone"}
            </DialogTitle>
          </DialogHeader>

          {step === "form" ? (
            <div className="space-y-3.5 py-1">
              <div className="grid grid-cols-2 gap-2">
                {(["customer", "staff"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-sm font-semibold transition ${
                      role === r
                        ? "border-[#E5A93C] bg-[#E5A93C]/15 text-[#1F1F24] dark:text-[#FDFBF7]"
                        : "border-black/10 text-[#1F1F24]/60 dark:border-white/10 dark:text-[#FDFBF7]/60"
                    }`}
                  >
                    {r === "customer" ? (
                      <Users size={16} />
                    ) : (
                      <IdentificationBadge size={16} />
                    )}
                    {r === "customer" ? "Customer" : "Staff"}
                  </button>
                ))}
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Full name</Label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Hanna Girma"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <div className="flex items-center gap-2">
                  <span className="flex h-10 items-center gap-1 rounded-xl border border-black/10 px-3 text-sm text-[#1F1F24]/70 dark:border-white/10 dark:text-[#FDFBF7]/70">
                    <Phone size={14} /> +251
                  </span>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="911 000 000"
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={sendOtp}
                className="w-full rounded-xl bg-[#E5A93C] font-semibold text-[#1F1F24] hover:bg-[#E5A93C]/90"
              >
                Send OTP code
                <CaretDown size={14} className="ml-1 rotate-[-90deg]" />
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-1">
              <p className="text-sm text-[#1F1F24]/70 dark:text-[#FDFBF7]/70">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-[#C85A32]">
                  +251 {phone}
                </span>
                . Enter any 4+ digits to continue (demo).
              </p>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className="rounded-xl text-center text-2xl tracking-[0.5em]"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep("form")}
                  className="flex-1 rounded-xl"
                >
                  Back
                </Button>
                <Button
                  onClick={verify}
                  className="flex-1 rounded-xl bg-[#C85A32] font-semibold text-white hover:bg-[#C85A32]/90"
                >
                  Verify
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
}
