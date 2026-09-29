import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function Product(){
 const p=products.find(x=>x.id===Number(useParams().id)); const {add}=useCart();
 const [size,setSize]=useState(p?.sizes?.[1]||p?.sizes?.[0]);
 if(!p) return <main className="container"><h2>Product not found</h2></main>;
 return <main className="container productPage">
  <img className="detailImg" src={p.image}/>
  <div className="detail"><Link to="/">← Back to shop</Link><small>{p.category}</small><h1>{p.name}</h1><h2>Rs. {p.price.toLocaleString()}</h2><p>{p.description}</p>
   <label>SIZE</label><div className="sizes">{p.sizes.map(s=><button className={s===size?"active":""} onClick={()=>setSize(s)} key={s}>{s}</button>)}</div>
   <button className="btn dark wide" onClick={()=>add(p,size)}>ADD TO BAG</button>
   <p className="muted">Cash on Delivery and eSewa demo available at checkout.</p>
  </div>
 </main>;
}