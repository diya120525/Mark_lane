import { formatINR } from "../utils/format";

export default function ProductList({ products, cartItems, onAdd }) {
  return (
    <ul className="product-grid">
      {products.map((p) => {
        const inCart = cartItems.find((i) => i.id === p.id)?.qty ?? 0;
        const outOfStock = p.stock === 0;
        const maxed = !outOfStock && inCart >= p.stock;
        const label = outOfStock ? "Out of stock" : maxed ? "Maximum in cart" : "Add to cart";

        return (
          <li key={p.id} className="product-card">
            <div className="product-art" aria-hidden="true">{p.emoji}</div>
            <div className="product-body">
              <p className="product-category">{p.category}</p>
              <h3>{p.name}</h3>
              <p className="muted">{p.description}</p>
              <div className="product-meta">
                <strong>{formatINR(p.price)}</strong>
                {p.stock > 0 && p.stock <= 5 && (
                  <span className="low-stock">Only {p.stock} left</span>
                )}
                {outOfStock && <span className="low-stock">Sold out</span>}
              </div>
              <button className="btn-primary" onClick={() => onAdd(p)} disabled={outOfStock || maxed}>
                {label}
              </button>
              {inCart > 0 && <p className="in-cart-note">{inCart} in your cart</p>}
            </div>
          </li>
        );
      })}
    </ul>
  );
            }
