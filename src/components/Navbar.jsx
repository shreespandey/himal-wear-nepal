import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar(){
 const {count}=useCart();
 return <>
  <div className="announcement">FREE DELIVERY INSIDE KATHMANDU ON ORDERS OVER RS. 3,000</div>
  <nav>
   <Link className="brand" to="/">HIMAL<span>WEAR</span></Link>
   <div className="navlinks"><Link to="/">New Arrivals</Link><Link to="/#shop">Shop</Link><Link to="/cart" className="cartIcon"><ShoppingBag size={20}/><b>{count}</b></Link></div>
  </nav>
 </>;
}