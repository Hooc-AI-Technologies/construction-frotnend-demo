import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  PROFESSIONALS_SEED,
  MATERIALS_SEED,
  DEMO_BOOKINGS_SEED,
  DEMO_QUOTATIONS_SEED,
  DEMO_PROJECTS_SEED,
  type Booking,
  type Quotation,
  type Project,
  type Professional,
  type Material,
} from '../data/seed';
import { generateId, getRelativeDateISO } from '../config/brand';

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  materialId: string;
  quantity: number;
  pricePerUnit: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  items: { name: string; quantity: number; unit: string; pricePerUnit: number; total: number }[];
  subtotal: number;
  delivery: number;
  total: number;
  address: string;
  paymentMethod: string;
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
}

// ─── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  avatar: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  type: 'booking' | 'order' | 'quotation' | 'project' | 'system';
}

// ─── Store State ──────────────────────────────────────────────────────────────

interface AppState {
  // Data
  professionals: Professional[];
  materials: Material[];
  bookings: Booking[];
  quotations: Quotation[];
  projects: Project[];
  orders: Order[];
  notifications: Notification[];

  // Cart
  cart: CartItem[];

  // Wishlist
  wishlist: string[]; // material or professional ids

  // User
  profile: UserProfile;
  deliveryAddress: string;
  deliveryCity: string;

  // UI
  toast: string | null;

  // Actions — Professionals
  getFilteredProfessionals: (filters: {
    query?: string;
    category?: string;
    city?: string;
    minRating?: number;
    available?: boolean;
    verified?: boolean;
    sortBy?: string;
  }) => Professional[];

  // Actions — Materials
  getFilteredMaterials: (filters: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    grade?: string;
    inStock?: boolean;
    sortBy?: string;
  }) => Material[];

  // Actions — Cart
  addToCart: (materialId: string, qty: number, pricePerUnit: number) => void;
  updateCartQty: (materialId: string, qty: number) => void;
  removeFromCart: (materialId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Actions — Wishlist
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;

  // Actions — Bookings
  addBooking: (b: Omit<Booking, 'id' | 'createdAt'>) => string;
  updateBookingStatus: (id: string, status: Booking['status']) => void;

  // Actions — Quotations
  updateQuotationStatus: (id: string, status: Quotation['status']) => void;
  addQuotation: (q: Omit<Quotation, 'id' | 'createdAt'>) => void;

  // Actions — Projects
  addProject: (p: Omit<Project, 'id'>) => void;
  approveInspection: (projectId: string) => void;

  // Actions — Orders
  placeOrder: (address: string, paymentMethod: string) => string;

  // Actions — Notifications
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;
  getUnreadCount: () => number;

  // Actions — Profile
  updateProfile: (p: Partial<UserProfile>) => void;
  updateDeliveryAddress: (address: string, city: string) => void;

  // Actions — Toast
  showToast: (msg: string) => void;
  clearToast: () => void;

  // Actions — Reset
  resetDemoData: () => void;
}

// ─── Default Profile ───────────────────────────────────────────────────────────

const DEFAULT_PROFILE: UserProfile = {
  name: 'Samarth Gupta',
  email: 'samarth.gupta@example.in',
  phone: '+91 98765 43210',
  city: 'Gurugram',
  address: 'Plot 14B, DLF Phase 2, Gurugram 122002',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80',
};

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: 'n-001',
    title: 'Booking Confirmed',
    body: 'Your booking with Rajesh Sharma on ' + getRelativeDateISO(3) + ' is confirmed.',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    type: 'booking',
  },
  {
    id: 'n-002',
    title: 'New Quotation Received',
    body: 'Mohan Civil Contractors sent a ₹72,000 quote for Terrace Waterproofing.',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    type: 'quotation',
  },
  {
    id: 'n-003',
    title: 'Inspection Approval Required',
    body: 'Structural Inspection Report needs your sign-off for Gurugram Villa Renovation.',
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    type: 'project',
  },
  {
    id: 'n-004',
    title: 'Electrical Work Completed',
    body: 'Vikram Singh has marked the Office Electrical Rewiring as complete. Review & pay.',
    read: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    type: 'project',
  },
];

// ─── Initial State factory ────────────────────────────────────────────────────

const getInitialState = () => ({
  professionals: PROFESSIONALS_SEED,
  materials: MATERIALS_SEED,
  bookings: DEMO_BOOKINGS_SEED,
  quotations: DEMO_QUOTATIONS_SEED,
  projects: DEMO_PROJECTS_SEED,
  orders: [] as Order[],
  notifications: DEFAULT_NOTIFICATIONS,
  cart: [] as CartItem[],
  wishlist: [] as string[],
  profile: DEFAULT_PROFILE,
  deliveryAddress: 'Plot 14B, DLF Phase 2, Gurugram',
  deliveryCity: 'Gurugram',
  toast: null as string | null,
});

// ─── Store ────────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...getInitialState(),

      // ── Filtering ───────────────────────────────────────────────────────────

      getFilteredProfessionals: (filters) => {
        let list = [...get().professionals];
        if (filters.query) {
          const q = filters.query.toLowerCase();
          list = list.filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.specialty.toLowerCase().includes(q) ||
              p.category.toLowerCase().includes(q) ||
              p.skills.some((s) => s.toLowerCase().includes(q))
          );
        }
        if (filters.category && filters.category !== 'All') {
          list = list.filter((p) => p.category === filters.category);
        }
        if (filters.city && filters.city !== 'All') {
          list = list.filter((p) => p.city === filters.city);
        }
        if (filters.minRating) {
          list = list.filter((p) => p.rating >= filters.minRating!);
        }
        if (filters.available) {
          list = list.filter((p) => p.available);
        }
        if (filters.verified) {
          list = list.filter((p) => p.verified);
        }
        switch (filters.sortBy) {
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'experience':
            list.sort((a, b) => b.experienceYears - a.experienceYears);
            break;
          case 'rate_asc':
            list.sort((a, b) => a.rate - b.rate);
            break;
          case 'rate_desc':
            list.sort((a, b) => b.rate - a.rate);
            break;
          case 'reviews':
            list.sort((a, b) => b.reviewCount - a.reviewCount);
            break;
          default:
            break;
        }
        return list;
      },

      getFilteredMaterials: (filters) => {
        let list = [...get().materials];
        if (filters.query) {
          const q = filters.query.toLowerCase();
          list = list.filter(
            (m) =>
              m.name.toLowerCase().includes(q) ||
              m.supplier.toLowerCase().includes(q) ||
              m.category.toLowerCase().includes(q)
          );
        }
        if (filters.category && filters.category !== 'All') {
          list = list.filter((m) => m.category === filters.category);
        }
        if (filters.grade && filters.grade !== 'All') {
          list = list.filter((m) => m.grade.toLowerCase().includes(filters.grade!.toLowerCase()));
        }
        if (filters.inStock) {
          list = list.filter((m) => m.inStock);
        }
        if (filters.minPrice !== undefined) {
          list = list.filter((m) => m.price >= filters.minPrice!);
        }
        if (filters.maxPrice !== undefined) {
          list = list.filter((m) => m.price <= filters.maxPrice!);
        }
        switch (filters.sortBy) {
          case 'price_asc':
            list.sort((a, b) => a.price - b.price);
            break;
          case 'price_desc':
            list.sort((a, b) => b.price - a.price);
            break;
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          case 'delivery':
            list.sort((a, b) => a.deliveryDays - b.deliveryDays);
            break;
          default:
            break;
        }
        return list;
      },

      // ── Cart ────────────────────────────────────────────────────────────────

      addToCart: (materialId, qty, pricePerUnit) => {
        set((s) => {
          const existing = s.cart.find((c) => c.materialId === materialId);
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.materialId === materialId ? { ...c, quantity: c.quantity + qty } : c
              ),
            };
          }
          return { cart: [...s.cart, { materialId, quantity: qty, pricePerUnit }] };
        });
        get().showToast('Added to cart');
      },

      updateCartQty: (materialId, qty) => {
        if (qty <= 0) {
          get().removeFromCart(materialId);
          return;
        }
        set((s) => ({
          cart: s.cart.map((c) =>
            c.materialId === materialId ? { ...c, quantity: qty } : c
          ),
        }));
      },

      removeFromCart: (materialId) => {
        set((s) => ({ cart: s.cart.filter((c) => c.materialId !== materialId) }));
        get().showToast('Removed from cart');
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart, materials } = get();
        return cart.reduce((sum, item) => {
          const mat = materials.find((m) => m.id === item.materialId);
          if (!mat) return sum;
          // Apply bulk pricing
          const applicableTier = [...mat.bulkTiers]
            .reverse()
            .find((t) => item.quantity >= t.minQty);
          const price = applicableTier?.pricePerUnit ?? mat.price;
          return sum + price * item.quantity;
        }, 0);
      },

      getCartCount: () => get().cart.reduce((s, i) => s + i.quantity, 0),

      // ── Wishlist ────────────────────────────────────────────────────────────

      toggleWishlist: (id) => {
        set((s) => ({
          wishlist: s.wishlist.includes(id)
            ? s.wishlist.filter((x) => x !== id)
            : [...s.wishlist, id],
        }));
      },

      isWishlisted: (id) => get().wishlist.includes(id),

      // ── Bookings ────────────────────────────────────────────────────────────

      addBooking: (b) => {
        const id = generateId();
        const booking: Booking = { ...b, id: `BK-${id}`, createdAt: new Date().toISOString() };
        set((s) => ({ bookings: [...s.bookings, booking] }));
        // Add notification
        set((s) => ({
          notifications: [
            {
              id: generateId(),
              title: 'Booking Confirmed',
              body: `Your booking with ${b.professionalName} for ${b.service} is confirmed.`,
              read: false,
              createdAt: new Date().toISOString(),
              type: 'booking' as const,
            },
            ...s.notifications,
          ],
        }));
        return booking.id;
      },

      updateBookingStatus: (id, status) => {
        set((s) => ({
          bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
        }));
      },

      // ── Quotations ──────────────────────────────────────────────────────────

      updateQuotationStatus: (id, status) => {
        set((s) => ({
          quotations: s.quotations.map((q) => (q.id === id ? { ...q, status } : q)),
        }));
        get().showToast(status === 'accepted' ? 'Quotation accepted!' : 'Quotation declined');
      },

      addQuotation: (q) => {
        const newQ: Quotation = {
          ...q,
          id: `QT-${generateId()}`,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ quotations: [...s.quotations, newQ] }));
        get().showToast('Quotation request submitted!');
      },

      // ── Projects ────────────────────────────────────────────────────────────

      addProject: (p) => {
        const newP: Project = { ...p, id: `PRJ-${generateId()}` };
        set((s) => ({ projects: [...s.projects, newP] }));
        get().showToast('Project created!');
      },

      approveInspection: (projectId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? { ...p, requiresApproval: false, status: 'active' as const, lastUpdateNote: '✅ Inspection approved. Work resumed.' }
              : p
          ),
        }));
        get().showToast('Inspection approved!');
      },

      // ── Orders ──────────────────────────────────────────────────────────────

      placeOrder: (address, paymentMethod) => {
        const { cart, materials } = get();
        const items = cart.map((item) => {
          const mat = materials.find((m) => m.id === item.materialId)!;
          const tier = [...mat.bulkTiers].reverse().find((t) => item.quantity >= t.minQty);
          const price = tier?.pricePerUnit ?? mat.price;
          return {
            name: mat.name,
            quantity: item.quantity,
            unit: mat.unit,
            pricePerUnit: price,
            total: price * item.quantity,
          };
        });
        const subtotal = items.reduce((s, i) => s + i.total, 0);
        const delivery = subtotal > 50000 ? 0 : 999;
        const order: Order = {
          id: `ORD-${generateId()}`,
          items,
          subtotal,
          delivery,
          total: subtotal + delivery,
          address,
          paymentMethod,
          status: 'confirmed',
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ orders: [order, ...s.orders] }));
        get().clearCart();
        set((s) => ({
          notifications: [
            {
              id: generateId(),
              title: 'Order Confirmed',
              body: `Order ${order.id} placed for ₹${order.total.toLocaleString('en-IN')}. Delivery in ${Math.max(...items.map((_, i) => materials.find((m) => cart[i]?.materialId === m.id)?.deliveryDays ?? 3))} days.`,
              read: false,
              createdAt: new Date().toISOString(),
              type: 'order' as const,
            },
            ...s.notifications,
          ],
        }));
        return order.id;
      },

      // ── Notifications ───────────────────────────────────────────────────────

      markNotifRead: (id) => {
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },

      markAllNotifsRead: () => {
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
      },

      getUnreadCount: () => get().notifications.filter((n) => !n.read).length,

      // ── Profile ─────────────────────────────────────────────────────────────

      updateProfile: (p) => {
        set((s) => ({ profile: { ...s.profile, ...p } }));
        get().showToast('Profile updated!');
      },

      updateDeliveryAddress: (address, city) => {
        set({ deliveryAddress: address, deliveryCity: city });
        get().showToast('Delivery location updated!');
      },

      // ── Toast ───────────────────────────────────────────────────────────────

      showToast: (msg) => {
        set({ toast: msg });
        setTimeout(() => set({ toast: null }), 3000);
      },

      clearToast: () => set({ toast: null }),

      // ── Reset ───────────────────────────────────────────────────────────────

      resetDemoData: () => {
        set(getInitialState());
      },
    }),
    {
      name: 'buildnexus-demo-store',
      // Only persist state, not computed functions
      partialize: (s) => ({
        bookings: s.bookings,
        quotations: s.quotations,
        projects: s.projects,
        orders: s.orders,
        notifications: s.notifications,
        cart: s.cart,
        wishlist: s.wishlist,
        profile: s.profile,
        deliveryAddress: s.deliveryAddress,
        deliveryCity: s.deliveryCity,
      }),
    }
  )
);
