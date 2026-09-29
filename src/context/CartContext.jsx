import { createContext, useContext, useEffect, useState } from "react";
const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const add = (product, size="M") => setCart(c => {
    const key = `${product.id}-${size}`;
    const found = c.find(x => x.key === key);
    return found ? c.map(x => x.key === key ? {...x, qty:x.qty+1}:x)
      : [...c, {...product, key, size, qty:1}];
  });
  const change = (key, delta) => setCart(c => c.map(x => x.key===key ? {...x, qty:Math.max(1,x.qty+delta)}:x));
  const remove = key => setCart(c => c.filter(x => x.key !== key));
  const clear = () => setCart([]);
  const subtotal = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const count = cart.reduce((s,x)=>s+x.qty,0);

  return <CartContext.Provider value={{cart,add,change,remove,clear,subtotal,count}}>{children}</CartContext.Provider>;
}