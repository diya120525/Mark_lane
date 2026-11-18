export const COUPONS = {
  SAVE10: { type: "percent", value: 10, minSubtotal: 0, label: "10% off your order" },
  FLAT200: { type: "flat", value: 200, minSubtotal: 1500, label: "₹200 off orders of ₹1,500 or more" },
};

// Returns { code, ...coupon } on success or { error } on failure.
export function applyCoupon(input, subtotal) {
  const code = input.trim().toUpperCase();
  const coupon = COUPONS[code];
  if (!coupon) return { error: "This coupon code is not valid." };
  if (subtotal < coupon.minSubtotal) {
    const short = coupon.minSubtotal - subtotal;
    return { error: `Add ₹${short.toLocaleString("en-IN")} more to use ${code}.` };
  }
  return { code, ...coupon };
}

// Discount is zero if the coupon no longer meets its minimum (e.g. after removing items).
export function discountAmount(coupon, subtotal) {
  if (!coupon || subtotal < coupon.minSubtotal) return 0;
  const raw = coupon.type === "percent" ? Math.round((subtotal * coupon.value) / 100) : coupon.value;
  return Math.min(raw, subtotal);
}
