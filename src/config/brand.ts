// Brand configuration — change these to rebrand the app
export const BRAND = {
  name: 'BuildNexus',
  tagline: 'India\'s Construction Marketplace',
  logo: '🏗️',
  primaryColor: '#1a6bff',
  navyColor: '#0f172a',
  locale: 'en-IN',
  currency: 'INR',
};

export const formatINR = (amount: number): string =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatNumber = (n: number): string =>
  new Intl.NumberFormat('en-IN').format(n);

export const generateId = (): string =>
  `BN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

export const getRelativeDate = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getRelativeDateISO = (daysFromNow: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
};
