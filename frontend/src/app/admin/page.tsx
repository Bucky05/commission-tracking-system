"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Payout = {
  id: number;
  email: string;
  amount: number;
  status: string;
};
type Conversion = {
  id: number;
  product_id: number;
  creator_id: number;
  amount: number;
  commission: number;
};

export default function Admin() {

  const fetchConversions = async () => {
    const data = await api("/conversion");

    setConversions(Array.isArray(data) ? data : data?.data || []);
  };
  const [conversions, setConversions] = useState<Conversion[]>([]);
  useEffect(() => {
    fetchConversions();
  }, []);

  const approveConversion = async (id: number) => {
    await api(`/conversion/${id}/approve`, "PATCH");
    fetchConversions();
  };
  return (
    <div className="container">
      <h2>Admin Dashboard</h2>

      

      <h3>Conversions</h3>

{conversions.length === 0 && <p>No conversions</p>}

{conversions.map((c) => (
  <div key={c.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
    <div><b>Product ID:</b> {c.product_id}</div>
    <div><b>Creator ID:</b> {c.creator_id}</div>
    <div><b>Amount:</b> ₹{c.amount}</div>
    <div><b>Commission:</b> ₹{c.commission}</div>

    <button onClick={() => approveConversion(c.id)}>
      Approve
    </button>
  </div>
))}
    </div>
  );
  
}
