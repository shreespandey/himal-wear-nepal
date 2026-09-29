import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
export default function PaymentSuccess(){
 const [q]=useSearchParams(); const {clear}=useCart(); const [state,setState]=useState({loading:true});
 useEffect(()=>{(async()=>{try{const data=q.get("data"); const r=await fetch("http://localhost:5000/api/esewa/verify?data="+encodeURIComponent(data||"")); const j=await r.json(); setState({...j,loading:false}); if(j.verified) clear();}catch(e){setState({loading:false,error:"Verification failed."})}})()},[]);
 return <main className="container result"><div className="resultCard">{state.loading?<h2>Verifying payment…</h2>:state.verified?<><div className="successMark">✓</div><h1>Payment verified</h1><p>Your eSewa demo transaction is COMPLETE.</p><p><b>Reference:</b> {state.refId||"—"}</p></>:<><h1>Payment not verified</h1><p>{state.error||`Status: ${state.status||"unknown"}`}</p></>}<Link className="btn dark" to="/">BACK TO STORE</Link></div></main>;
}