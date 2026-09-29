import { Link } from "react-router-dom";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Home(){
 const {add}=useCart();
 return <>
  <section className="hero">
    <div><div className="eyebrow">MADE FOR EVERYDAY NEPAL</div><h1>Wear your<br/>own story.</h1><p>Modern essentials, streetwear and everyday fits. Prices in NPR. Delivery across Nepal.</p><a className="btn light" href="#shop">SHOP COLLECTION</a></div>
  </section>
  <main id="shop" className="container">
    <div className="sectionHead"><div><small>CURATED FOR YOU</small><h2>New arrivals</h2></div><span>Simple fits. Easy styling.</span></div>
    <div className="grid">{products.map(p=><article className="card" key={p.id}>
      <Link to={`/product/${p.id}`}><div className="imageWrap"><img src={p.image}/><em>{p.badge}</em></div></Link>
      <div className="productInfo"><small>{p.category}</small><Link to={`/product/${p.id}`}><h3>{p.name}</h3></Link><strong>Rs. {p.price.toLocaleString()}</strong>
      <button className="quick" onClick={()=>add(p,p.sizes[1]||p.sizes[0])}>+ Quick add</button></div>
    </article>)}</div>
    <section className="features"><div><b>🚚 Delivery across Nepal</b><span>Fast, trackable shipping</span></div><div><b>💵 Cash on Delivery</b><span>Pay when your order arrives</span></div><div><b>📱 eSewa demo checkout</b><span>UAT payment flow included</span></div></section>
  </main>
 </>;
}