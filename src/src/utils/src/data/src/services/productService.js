// Loads the product catalogue. Swap the URL for a real API endpoint later.
export async function fetchProducts() {
  let res;
  try {
    res = await fetch("/products.json");
  } catch {
    throw new Error("Could not reach the product service. Check your connection and try again.");
  }
  if (!res.ok) {
    throw new Error(`Products could not be loaded (HTTP ${res.status}).`);
  }
  const data = await res.json();
  if (!Array.isArray(data)) {
    throw new Error("Product data is in an unexpected format.");
  }
  return data;
}
