import type {
  AddOn,
  Category,
  MenuItem,
  Order,
  TableReservation,
} from "@/types";

const IMG = {
  grill:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/grill-platter-c89b92c6-1793541206796.webp",
  bento:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/office-bento-7c1cd53f-1793541207548.webp",
  bowl:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/quick-bowl-e77cb839-1793541206109.webp",
  bread:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/artisan-bread-f76a7bac-1793541206668.webp",
  mocktail:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/mocktails-6ef2712d-1793541206942.webp",
  curry:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/terracotta-curry-e79f387c-1793541210232.webp",
  rice:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/saffron-rice-4d72a669-1793541209977.webp",
  dessert:
    "https://dala-prod-public-storage.s3.eu-west-1.amazonaws.com/generated-images/9a001a8a-2957-4d7b-ad5e-44bc6c5f9281/dessert-baklava-72d113cb-1793541210482.webp",
};

export const RESTAURANT = {
  name: "Khalishamsia",
  tagline: "Grill, Bento & Brew Kitchen",
  location: "Supie Boro",
  phone: "+251 911 240 118",
  hours: "Mon-Sun 11:00 - 23:00",
  currency: "Br",
};

export const OFFICE_ZONES = [
  "Tech Park Boro",
  "Civic Tower",
  "Plaza 4",
  "Boro Gateway",
  "Summit Offices",
];

export const CATEGORIES: Category[] = [
  {
    id: "grills",
    name: "Supie Boro Grills & Platters",
    blurb: "Charcoal-fired meats and sharing boards",
  },
  {
    id: "bento",
    name: "Office Lunch Bento Combos",
    blurb: "Balanced boxed lunches built for desks",
  },
  {
    id: "bowls",
    name: "Quick Bowls",
    blurb: "Grain and protein bowls ready in minutes",
  },
  {
    id: "breads",
    name: "Artisan Breads & Sides",
    blurb: "Baked in-house through the day",
  },
  {
    id: "drinks",
    name: "Fresh Mocktails & Brews",
    blurb: "Zero-proof coolers and hot brews",
  },
];

const grillAddOns: AddOn[] = [
  { id: "extra-meat", name: "Extra meat skewer", price: 95 },
  { id: "avocado", name: "Side avocado", price: 45 },
  { id: "hot-sauce", name: "House berbere sauce", price: 25 },
];

const bentoAddOns: AddOn[] = [
  { id: "soup", name: "Add starter soup", price: 40 },
  { id: "juice", name: "Fresh juice box", price: 35 },
  { id: "dessert-s", name: "Mini dessert", price: 50 },
];

const bowlAddOns: AddOn[] = [
  { id: "protein", name: "Double protein", price: 70 },
  { id: "tahini", name: "Extra tahini drizzle", price: 20 },
];

const breadAddOns: AddOn[] = [
  { id: "butter", name: "Whipped herb butter", price: 30 },
  { id: "dip", name: "Hummus dip", price: 35 },
];

const drinkAddOns: AddOn[] = [
  { id: "double", name: "Make it a large", price: 30 },
  { id: "mint", name: "Extra mint & lime", price: 15 },
];

const SPICY3 = ["Mild", "Medium", "Fiery"] as const;
const MILD2 = ["Mild", "Medium"] as const;

export const MENU_ITEMS: MenuItem[] = [
  {
    id: "g1",
    name: "Khalis Mixed Grill Platter",
    description:
      "Lamb chops, beef kebabs and marinated chicken over charcoal with warm flatbread.",
    price: 620,
    categoryId: "grills",
    image: IMG.grill,
    tags: ["halal", "chef"],
    prepMinutes: 22,
    calories: 940,
    spiceLevels: [...SPICY3],
    addOns: grillAddOns,
  },
  {
    id: "g2",
    name: "Terracotta Beef Stew",
    description:
      "Slow-braised beef in a deep terracotta spice base with saffron rice.",
    price: 410,
    categoryId: "grills",
    image: IMG.curry,
    tags: ["halal", "spicy"],
    prepMinutes: 18,
    calories: 720,
    spiceLevels: [...SPICY3],
    addOns: grillAddOns,
  },
  {
    id: "g3",
    name: "Saffron Chicken Royale",
    description:
      "Golden saffron rice crowned with grilled chicken and toasted nuts.",
    price: 380,
    categoryId: "grills",
    image: IMG.rice,
    tags: ["halal"],
    prepMinutes: 16,
    calories: 660,
    spiceLevels: [...MILD2],
    addOns: grillAddOns,
  },
  {
    id: "b1",
    name: "Executive Bento Box",
    description:
      "Grilled chicken, saffron rice, steamed greens and a garden salad.",
    price: 295,
    categoryId: "bento",
    image: IMG.bento,
    tags: ["office", "halal"],
    prepMinutes: 12,
    calories: 540,
    spiceLevels: [...MILD2],
    addOns: bentoAddOns,
  },
  {
    id: "b2",
    name: "Desk Fuel Veg Bento",
    description:
      "Chickpea and roast vegetable bento with tahini and warm grains.",
    price: 245,
    categoryId: "bento",
    image: IMG.bowl,
    tags: ["office", "vegetarian"],
    prepMinutes: 10,
    calories: 430,
    spiceLevels: [...MILD2],
    addOns: bentoAddOns,
  },
  {
    id: "b3",
    name: "Team Lunch Bento (Serves 4)",
    description:
      "Four assorted bento boxes bundled for meeting-room catering.",
    price: 1080,
    categoryId: "bento",
    image: IMG.bento,
    tags: ["office", "chef"],
    prepMinutes: 20,
    calories: 2100,
    spiceLevels: [...SPICY3],
    addOns: bentoAddOns,
  },
  {
    id: "w1",
    name: "Harvest Power Bowl",
    description:
      "Quinoa, avocado, roast vegetables and chickpeas with a lemon drizzle.",
    price: 265,
    categoryId: "bowls",
    image: IMG.bowl,
    tags: ["vegetarian", "halal"],
    prepMinutes: 9,
    calories: 480,
    spiceLevels: [...MILD2],
    addOns: bowlAddOns,
  },
  {
    id: "w2",
    name: "Charcoal Chicken Bowl",
    description:
      "Grilled chicken over saffron rice with crisp greens and berbere oil.",
    price: 285,
    categoryId: "bowls",
    image: IMG.grill,
    tags: ["halal", "spicy"],
    prepMinutes: 11,
    calories: 560,
    spiceLevels: [...SPICY3],
    addOns: bowlAddOns,
  },
  {
    id: "w3",
    name: "Chef's Tasting Bowl",
    description:
      "A rotating chef build of seasonal grains, proteins and pickles.",
    price: 320,
    categoryId: "bowls",
    image: IMG.rice,
    tags: ["chef", "vegetarian"],
    prepMinutes: 13,
    calories: 520,
    spiceLevels: [...SPICY3],
    addOns: bowlAddOns,
  },
  {
    id: "r1",
    name: "Warm Flatbread Basket",
    description:
      "House-baked flatbreads served soft with whipped herb butter.",
    price: 120,
    categoryId: "breads",
    image: IMG.bread,
    tags: ["vegetarian"],
    prepMinutes: 6,
    calories: 300,
    spiceLevels: [...MILD2],
    addOns: breadAddOns,
  },
  {
    id: "r2",
    name: "Garlic Knots & Hummus",
    description: "Golden garlic knots with a creamy hummus dip.",
    price: 145,
    categoryId: "breads",
    image: IMG.bread,
    tags: ["vegetarian", "chef"],
    prepMinutes: 7,
    calories: 360,
    spiceLevels: [...MILD2],
    addOns: breadAddOns,
  },
  {
    id: "r3",
    name: "Honey Pistachio Baklava",
    description: "Layered sweet pastry with honey and crushed pistachio.",
    price: 165,
    categoryId: "breads",
    image: IMG.dessert,
    tags: ["vegetarian"],
    prepMinutes: 5,
    calories: 410,
    spiceLevels: [...MILD2],
    addOns: breadAddOns,
  },
  {
    id: "d1",
    name: "Berry Mint Cooler",
    description: "Muddled berries, lime and mint over crushed ice.",
    price: 110,
    categoryId: "drinks",
    image: IMG.mocktail,
    tags: ["vegetarian"],
    prepMinutes: 4,
    calories: 130,
    spiceLevels: [...MILD2],
    addOns: drinkAddOns,
  },
  {
    id: "d2",
    name: "Saffron Citrus Spritz",
    description: "Sparkling citrus with a hint of saffron and fresh mint.",
    price: 125,
    categoryId: "drinks",
    image: IMG.mocktail,
    tags: ["chef", "vegetarian"],
    prepMinutes: 4,
    calories: 110,
    spiceLevels: [...MILD2],
    addOns: drinkAddOns,
  },
  {
    id: "d3",
    name: "Spiced Macchiato Brew",
    description: "Double-shot espresso with cardamom and steamed milk.",
    price: 95,
    categoryId: "drinks",
    image: IMG.dessert,
    tags: ["vegetarian", "halal"],
    prepMinutes: 5,
    calories: 90,
    spiceLevels: [...MILD2],
    addOns: drinkAddOns,
  },
];

export const TAX_RATE = 0.15;
export const OFFICE_DELIVERY_FEE = 60;
export const DINE_SERVICE_FEE = 0;

// Seed demo orders so the tracker and KDS show live data on first load
export const SEED_ORDERS: Order[] = [
  {
    id: "seed-1",
    code: "KHS-4821",
    type: "office_lunch",
    items: [
      {
        lineId: "l-seed-1",
        itemId: "b1",
        name: "Executive Bento Box",
        image: IMG.bento,
        unitPrice: 295,
        qty: 3,
        spice: "Medium",
        addOns: [{ id: "juice", name: "Fresh juice box", price: 35 }],
        notes: "Two without onions please",
      },
    ],
    subtotal: 990,
    tax: 148.5,
    fee: 60,
    total: 1198.5,
    status: "preparing",
    createdAt: Date.now() - 6 * 60 * 1000,
    prepMinutes: 16,
    payment: "corporate_card",
    office: {
      building: "Tech Park Boro",
      floor: "4th Floor, Suite 412",
      company: "Boro Analytics",
      extension: "x221",
      cutlery: true,
      contact: "Hanna G.",
    },
    customerName: "Hanna G.",
    customerPhone: "+251 911 000 221",
  },
  {
    id: "seed-2",
    code: "KHS-4820",
    type: "dine_in",
    items: [
      {
        lineId: "l-seed-2",
        itemId: "g1",
        name: "Khalis Mixed Grill Platter",
        image: IMG.grill,
        unitPrice: 620,
        qty: 1,
        spice: "Fiery",
        addOns: [{ id: "extra-meat", name: "Extra meat skewer", price: 95 }],
        notes: "",
      },
      {
        lineId: "l-seed-2b",
        itemId: "d2",
        name: "Saffron Citrus Spritz",
        image: IMG.mocktail,
        unitPrice: 125,
        qty: 2,
        spice: "Mild",
        addOns: [],
        notes: "",
      },
    ],
    subtotal: 870,
    tax: 130.5,
    fee: 0,
    total: 1000.5,
    status: "received",
    createdAt: Date.now() - 2 * 60 * 1000,
    prepMinutes: 24,
    payment: "cash",
    dineIn: { tableNumber: "12", guests: 3, rush: false },
    customerName: "Dawit M.",
    customerPhone: "+251 911 555 018",
  },
  {
    id: "seed-3",
    code: "KHS-4819",
    type: "takeaway",
    items: [
      {
        lineId: "l-seed-3",
        itemId: "w1",
        name: "Harvest Power Bowl",
        image: IMG.bowl,
        unitPrice: 265,
        qty: 1,
        spice: "Mild",
        addOns: [{ id: "protein", name: "Double protein", price: 70 }],
        notes: "",
      },
    ],
    subtotal: 335,
    tax: 50.25,
    fee: 0,
    total: 385.25,
    status: "ready",
    createdAt: Date.now() - 14 * 60 * 1000,
    prepMinutes: 11,
    payment: "mobile_pay",
    takeaway: {
      pickup: "asap",
      pickupTime: "ASAP",
      name: "Selam T.",
      phone: "+251 911 777 442",
    },
    customerName: "Selam T.",
    customerPhone: "+251 911 777 442",
  },
];

export const SEED_RESERVATIONS: TableReservation[] = [
  {
    code: "RSV-2075",
    partySize: 6,
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    time: "13:00",
    slot: "Lunch Rush",
    occasion: "Office Lunch Meeting",
    zone: "Private Executive Booth",
    chefRequests: "Quiet corner, one high chair",
    preAttach: [{ name: "Team Lunch Bento (Serves 4)", qty: 2 }],
    contactName: "Marta B.",
    contactPhone: "+251 911 300 909",
    status: "confirmed",
    createdAt: Date.now() - 3600000,
  },
];
