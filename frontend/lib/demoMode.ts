// Demo mode for testing without deployed contracts
const DEMO_STORAGE_KEY = 'nationchain_demo_owned_countries';

export function getDemoOwnedCountries(wallet: string): number[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  if (!stored) return [];
  const data = JSON.parse(stored);
  return data[wallet.toLowerCase()] || [];
}

export function addDemoOwnedCountry(wallet: string, countryId: number) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  const walletKey = wallet.toLowerCase();
  if (!data[walletKey]) data[walletKey] = [];
  if (!data[walletKey].includes(countryId)) {
    data[walletKey].push(countryId);
  }
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
}

export function removeDemoOwnedCountry(wallet: string, countryId: number) {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(DEMO_STORAGE_KEY);
  if (!stored) return;
  const data = JSON.parse(stored);
  const walletKey = wallet.toLowerCase();
  if (data[walletKey]) {
    data[walletKey] = data[walletKey].filter((id: number) => id !== countryId);
  }
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data));
}
