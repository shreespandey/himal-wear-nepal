import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart(){
 const {cart,change,remove,subtotal}=useCart();
 return <main className="container cartPage"><h1>Your bag</h1>
  {!cart.length ? <div className="empty"><p>Your bag is empty.</p><Link className="btn dark" to="/">START SHOPPING</Link></div> :
  <div className="cartLayout"><div>{cart.map(x=><div className="cartRow" key={x.key}><img src={x.image}/><div className="grow"><h3>{x.name}</h3><small>Size: {x.size}</small><strong>Rs. {x.price.toLocaleString()}</strong><div className="qty"><button onClick={()=>change(x.key,-1)}>−</button><span>{x.qty}</span><button onClick={()=>change(x.key,1)}>+</button></div></div><button className="remove" onClick={()=>remove(x.key)}>Remove</button></div>)}</div>
  <aside className="summary"><h3>Order summary</h3><div><span>Subtotal</span><b>Rs. {subtotal.toLocaleString()}</b></div><p>Delivery is calculated at checkout.</p><Link className="btn dark wide" to="/checkout">CHECKOUT</Link></aside></div>}
 </main>;
}