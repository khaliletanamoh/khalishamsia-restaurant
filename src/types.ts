// Core domain types for Khalishamsia Restaurant app

export type OrderType = "dine_in" | "takeaway" | "office_lunch";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type DietaryTag = "halal" | "spicy" | "vegetarian" | "chef" | "office";

export type SpiceLevel = "Mild" | "Medium" | "Fiery";

export interface Category {
  id: string;
  name: string;
  blurb: string;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  image: string;
  tags: DietaryTag[];
  prepMinutes: number;
  calories: number;
  spiceLevels: SpiceLevel[];
  addOns: AddOn[];
}

// A configured dish placed into the cart
export interface CartItem {
  lineId: string;
  itemId: string;
  name: string;
  image: string;
  unitPrice: number;
  qty: number;
  spice: SpiceLevel;
  addOns: AddOn[];
  notes: string;
}

export interface DineInDetails {
  tableNumber: string;
  guests: number;
  rush: boolean;
}

export interface TakeawayDetails {
  pickup: "asap" | "15m" | "30m" | "scheduled";
  pickupTime: string;
  name: string;
  phone: string;
}

export interface OfficeLunchDetails {
  building: string;
  floor: string;
  company: string;
  extension: string;
  cutlery: boolean;
  contact: string;
}

export type PaymentMethod = "cash" | "corporate_card" | "mobile_pay";

export interface Order {
  id: string;
  code: string;
  type: OrderType;
  items: CartItem[];
  subtotal: number;
  tax: number;
  fee: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  prepMinutes: number;
  payment: PaymentMethod;
  dineIn?: DineInDetails;
  takeaway?: TakeawayDetails;
  office?: OfficeLunchDetails;
  customerName: string;
  customerPhone: string;
}

export type DiningSlot = "Lunch Rush" | "Sunset Dining" | "Dinner";
export type Occasion = "Casual" | "Office Lunch Meeting" | "Birthday/Event";
export type DiningZone =
  | "Main Dining Hall"
  | "Terrace Garden"
  | "Private Executive Booth";

export interface TableReservation {
  code: string;
  partySize: number;
  date: string;
  time: string;
  slot: DiningSlot;
  occasion: Occasion;
  zone: DiningZone;
  chefRequests: string;
  preAttach: { name: string; qty: number }[];
  contactName: string;
  contactPhone: string;
  status: "confirmed" | "cancelled";
  createdAt: number;
}

export type StaffRole = "customer" | "staff";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: StaffRole;
}

export type ViewMode = "customer" | "staff";
export type TabKey = "menu" | "booking" | "orders";
