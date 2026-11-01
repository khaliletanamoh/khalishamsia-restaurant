import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import Navbar from "@/components/Navbar";
import MenuSection from "@/components/MenuSection";
import CartCheckout from "@/components/CartCheckout";
import TableBooking from "@/components/TableBooking";
import OrderTrackerAndStaff from "@/components/OrderTrackerAndStaff";
import { SEED_ORDERS, SEED_RESERVATIONS } from "@/data/mockData";
import type {
  CartItem,
  Order,
  OrderStatus,
  TableReservation,
  TabKey,
  UserProfile,
  ViewMode,
} from "@/types";

const LS = {
  theme: "khs_theme",
  cart: "khs_cart",
  orders: "khs_orders",
  reservations: "khs_reservations",
  user: "khs_user",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    load<"light" | "dark">(LS.theme, "light")
  );
  const [viewMode, setViewMode] = useState<ViewMode>("customer");
  const [activeTab, setActiveTab] = useState<TabKey>("menu");
  const [cart, setCart] = useState<CartItem[]>(() => load<CartItem[]>(LS.cart, []));
  const [orders, setOrders] = useState<Order[]>(() =>
    load<Order[]>(LS.orders, SEED_ORDERS)
  );
  const [reservations, setReservations] = useState<TableReservation[]>(() =>
    load<TableReservation[]>(LS.reservations, SEED_RESERVATIONS)
  );
  const [user, setUser] = useState<UserProfile | null>(() =>
    load<UserProfile | null>(LS.user, null)
  );
  const [cartOpen, setCartOpen] = useState(false);

  // Theme -> <html> class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(LS.theme, JSON.stringify(theme));
  }, [theme]);

  // Persistence
  useEffect(() => localStorage.setItem(LS.cart, JSON.stringify(cart)), [cart]);
  useEffect(
    () => localStorage.setItem(LS.orders, JSON.stringify(orders)),
    [orders]
  );
  useEffect(
    () => localStorage.setItem(LS.reservations, JSON.stringify(reservations)),
    [reservations]
  );
  useEffect(
    () => localStorage.setItem(LS.user, JSON.stringify(user)),
    [user]
  );

  const cartCount = useMemo(
    () => cart.reduce((s, l) => s + l.qty, 0),
    [cart]
  );

  const addToCart = useCallback((line: CartItem) => {
    setCart((prev) => {
      const existing = prev.find(
        (p) =>
          p.itemId === line.itemId &&
          p.spice === line.spice &&
          p.notes === line.notes &&
          p.addOns.map((a) => a.id).join(",") ===
            line.addOns.map((a) => a.id).join(",")
      );
      if (existing) {
        return prev.map((p) =>
          p.lineId === existing.lineId ? { ...p, qty: p.qty + line.qty } : p
        );
      }
      return [...prev, line];
    });
    toast.success(`${line.name} added to cart`);
  }, []);

  const removeLine = useCallback((lineId: string) => {
    setCart((prev) => prev.filter((p) => p.lineId !== lineId));
  }, []);

  const updateQty = useCallback((lineId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((p) => p.lineId !== lineId));
      return;
    }
    setCart((prev) =>
      prev.map((p) => (p.lineId === lineId ? { ...p, qty } : p))
    );
  }, []);

  const placeOrder = useCallback((order: Order) => {
    setOrders((prev) => [order, ...prev]);
    setCart([]);
    toast.success(`Order ${order.code} placed! Track it live.`);
    setActiveTab("orders");
    setViewMode("customer");
  }, []);

  const advanceOrder = useCallback((id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }, []);

  const cancelOrder = useCallback((id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o))
    );
    toast("Order cancelled");
  }, []);

  const reorder = useCallback((order: Order) => {
    setCart((prev) => [...prev, ...order.items.map((l) => ({ ...l, lineId: `${l.itemId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}` }))]);
    setCartOpen(true);
    setViewMode("customer");
    toast.success("Items added back to cart");
  }, []);

  const addReservation = useCallback((r: TableReservation) => {
    setReservations((prev) => [r, ...prev]);
  }, []);

  const cancelReservation = useCallback((code: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.code === code ? { ...r, status: "cancelled" } : r))
    );
    toast("Reservation cancelled");
  }, []);

  const signIn = useCallback((u: UserProfile) => {
    setUser(u);
    toast.success(`Welcome, ${u.fullName.split(" ")[0]}!`);
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setViewMode("customer");
    toast("Signed out");
  }, []);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    []
  );

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#1F1F24] transition-colors dark:bg-[#1F1F24] dark:text-[#FDFBF7]">
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        theme={theme}
        toggleTheme={toggleTheme}
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        user={user}
        onSignIn={signIn}
        onSignOut={signOut}
      />

      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode === "staff" ? "staff" : activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {viewMode === "staff" ? (
              <OrderTrackerAndStaff
                mode="staff"
                orders={orders}
                onAdvance={advanceOrder}
                onReorder={reorder}
                onCancel={cancelOrder}
              />
            ) : activeTab === "menu" ? (
              <MenuSection onAddToCart={addToCart} />
            ) : activeTab === "booking" ? (
              <TableBooking
                reservations={reservations}
                user={user}
                onAddReservation={addReservation}
                onCancelReservation={cancelReservation}
              />
            ) : (
              <OrderTrackerAndStaff
                mode="customer"
                orders={orders}
                onAdvance={advanceOrder}
                onReorder={reorder}
                onCancel={cancelOrder}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating cart bar (mobile, customer only) */}
      {viewMode === "customer" && cartCount > 0 && !cartOpen && (
        <motion.button
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-[#1F1F24] px-5 py-3 text-sm font-bold text-[#FDFBF7] shadow-xl dark:bg-[#E5A93C] dark:text-[#1F1F24]"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[#E5A93C] text-xs text-[#1F1F24] dark:bg-[#1F1F24] dark:text-[#E5A93C]">
            {cartCount}
          </span>
          View cart & checkout
        </motion.button>
      )}

      <CartCheckout
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        user={user}
        onRemoveLine={removeLine}
        onUpdateQty={updateQty}
        onPlaceOrder={placeOrder}
      />

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
