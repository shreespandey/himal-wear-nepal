import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const API="const API="https://himal-wear-api.onrender.com";

export default function Checkout(){
 const {cart,subtotal,clear}=useCart(); const nav=useNavigate();
 const [method,setMethod]=useState("cod");
 const [form,setForm]=useState({name:"",phone:"",province:"Lumbini",city:"",address:""});
 const delivery=subtotal>=3000?0:150; const total=subtotal+delivery;
 const update=e=>setForm({...form,[e.target.name]:e.target.value});

 async function place(e){
  e.preventDefault();
  if(!cart.length) return alert("Your cart is empty.");
  if(method==="cod"){
    const r=await fetch(`${API}/api/orders/cod`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:form,cart})});
    const data=await r.json(); clear(); alert(`Order placed! Demo order: ${data.orderId}`); nav("/"); return;
  }
  const r=await fetch(`${API}/api/esewa/initiate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer:form,cart})});
  const data=await r.json();
  if(!r.ok) return alert(data.error||"Could not start payment");
  const f=document.createElement("form"); f.method="POST"; f.action=data.formUrl;
  Object.entries(data.fields).forEach(([k,v])=>{const i=document.createElement("input");i.type="hidden";i.name=k;i.value=v;f.appendChild(i)});
  document.body.appendChild(f); f.submit();
 }
 return <main className="container checkout"><div><small>SECURE CHECKOUT</small><h1>Complete your order</h1><form onSubmit={place}>
  <h3>Contact & delivery</h3><div className="formGrid">
   <input required name="name" placeholder="Full name" value={form.name} onChange={update}/>
   <input required name="phone" placeholder="Phone number" value={form.phone} onChange={update}/>
   <select name="province" value={form.province} onChange={update}>{["Koshi","Madhesh","Bagmati","Gandaki","Lumbini","Karnali","Sudurpashchim"].map(x=><option key={x}>{x}</option>)}</select>
   <input required name="city" placeholder="City / District" value={form.city} onChange={update}/>
   <input className="full" required name="address" placeholder="Tole, ward, landmark" value={form.address} onChange={update}/>
  </div>
  <h3>Payment</h3>
  <label className={"pay "+(method==="cod"?"chosen":"")}><input type="radio" checked={method==="cod"} onChange={()=>setMethod("cod")}/> <span><b>Cash on Delivery</b><small>Pay when the parcel arrives.</small></span></label>
  <label className={"pay "+(method==="esewa"?"chosen":"")}><input type="radio" checked={method==="esewa"} onChange={()=>setMethod("esewa")}/> <span><b>eSewa — DEMO / UAT</b><small>You will be redirected to eSewa's test checkout.</small></span></label>
  <button className="btn dark wide">{method==="esewa"?"PAY WITH ESEWA (DEMO)":"PLACE COD ORDER"}</button>
 </form></div>
 <aside className="summary"><h3>Your order</h3>{cart.map(x=><div className="mini" key={x.key}><span>{x.name} × {x.qty}<small>Size {x.size}</small></span><b>Rs. {(x.price*x.qty).toLocaleString()}</b></div>)}<hr/><div><span>Subtotal</span><b>Rs. {subtotal.toLocaleString()}</b></div><div><span>Delivery</span><b>{delivery?`Rs. ${delivery}`:"FREE"}</b></div><div className="total"><span>Total</span><b>Rs. {total.toLocaleString()}</b></div></aside>
 </main>;
}