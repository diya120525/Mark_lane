// Stores placed orders in localStorage. Replace with a POST to your backend when one exists.
const KEY = "market-lane-orders-v1";

export function saveOrder(order) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY)) ?? [];
    localStorage.setItem(KEY, JSON.stringify([...existing, order]));
    return true;
  } catch {
    return false;
  }
}
