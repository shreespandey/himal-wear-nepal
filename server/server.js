import express from "express";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const app=express();
app.use(cors({origin:process.env.CLIENT_URL||"http://localhost:5173"}));
app.use(express.json());

const PORT=process.env.PORT||5000;
const CLIENT=process.env.CLIENT_URL||"http://localhost:5173";
const PRODUCT_CODE=process.env.ESEWA_PRODUCT_CODE||"EPAYTEST";
const SECRET=process.env.ESEWA_SECRET_KEY||"8gBm/:&EnhH.1/q";
const FORM_URL=process.env.ESEWA_FORM_URL||"https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const STATUS_URL=process.env.ESEWA_STATUS_URL||"https://uat.esewa.com.np/api/epay/transaction/status/";

const catalog={
  1:1299, 2:2999, 3:2199, 4:2499, 5:1199, 6:1899
};
const money=n=>Number(n).toFixed(2).replace(/\.00$/,"");
const hmac=msg=>crypto.createHmac("sha256",SECRET).update(msg).digest("base64");
const safeUUID=()=>`HW-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

function calculate(cart=[]){
 let subtotal=0;
 for(const item of cart){
   const price=catalog[item.id];
   if(!price || !Number.isInteger(item.qty) || item.qty<1 || item.qty>20) throw new Error("Invalid cart");
   subtotal+=price*item.qty;
 }
 const delivery=subtotal>=3000?0:150;
 return {subtotal,delivery,total:subtotal+delivery};
}

app.get("/api/health",(req,res)=>res.json({ok:true}));

app.post("/api/orders/cod",(req,res)=>{
 try{
   const totals=calculate(req.body.cart);
   res.json({ok:true,orderId:safeUUID(),totals});
 }catch(e){res.status(400).json({error:e.message})}
});

app.post("/api/esewa/initiate",(req,res)=>{
 try{
  const {subtotal,delivery,total}=calculate(req.body.cart);
  const transaction_uuid=safeUUID();
  const total_amount=money(total);
  const signed_field_names="total_amount,transaction_uuid,product_code";
  const message=`total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${PRODUCT_CODE}`;
  const fields={
    amount:money(subtotal),
    tax_amount:"0",
    total_amount,
    transaction_uuid,
    product_code:PRODUCT_CODE,
    product_service_charge:"0",
    product_delivery_charge:money(delivery),
    success_url:`${CLIENT}/payment/success`,
    failure_url:`${CLIENT}/payment/failure`,
    signed_field_names,
    signature:hmac(message)
  };
  res.json({formUrl:FORM_URL,fields});
 }catch(e){res.status(400).json({error:e.message})}
});

app.get("/api/esewa/verify",async(req,res)=>{
 try{
  if(!req.query.data) return res.status(400).json({verified:false,error:"Missing eSewa response data"});
  const decoded=JSON.parse(Buffer.from(req.query.data,"base64").toString("utf8"));
  const names=String(decoded.signed_field_names||"").split(",").filter(Boolean);
  const message=names.map(k=>`${k}=${decoded[k]}`).join(",");
  const expected=hmac(message);
  const sigOK=expected.length===String(decoded.signature||"").length &&
    crypto.timingSafeEqual(Buffer.from(expected),Buffer.from(String(decoded.signature||"")));
  if(!sigOK) return res.status(400).json({verified:false,error:"Invalid eSewa response signature"});

  const url=new URL(STATUS_URL);
  url.searchParams.set("product_code",decoded.product_code);
  url.searchParams.set("total_amount",String(decoded.total_amount).replace(/,/g,""));
  url.searchParams.set("transaction_uuid",decoded.transaction_uuid);
  const r=await fetch(url);
  const status=await r.json();
  const verified=r.ok && status.status==="COMPLETE" &&
    status.product_code===decoded.product_code &&
    status.transaction_uuid===decoded.transaction_uuid &&
    Number(status.total_amount)===Number(String(decoded.total_amount).replace(/,/g,""));

  res.status(verified?200:400).json({verified,status:status.status,refId:status.ref_id||decoded.transaction_code||null});
 }catch(e){res.status(400).json({verified:false,error:e.message})}
});

app.listen(PORT,()=>console.log(`API running at http://localhost:${PORT}`));