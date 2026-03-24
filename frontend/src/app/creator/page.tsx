"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  price: number;
};

type Application = {
  id: number;
  product_id: number;
  status: string;
  product_name: string;
};
type Wallet = {
  total_earnings: number;
  pending_balance: number;
  available_balance: number;
};

type Payout = {
  id: number;
  amount: number;
  status: string;
};

export default function Creator() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchApplications = async () => {
    const data = await api("/referral/creator");
    setApplications(Array.isArray(data) ? data : data?.data || []);
  };
  const requestPayout = async () => {
    await api("/payout", "POST", {
      amount: Number(amount),
    });

    alert("Payout requested");

    setAmount("");
    fetchWallet();
    fetchPayouts();
  };
  const fetchWallet = async () => {
    const data = await api("/wallet");
    setWallet(data);
  };

  const fetchPayouts = async () => {
    const data = await api("/payout/my");
    setPayouts(Array.isArray(data) ? data : []);
  };
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await api("/product");
      console.log("PRODUCTS:", data);
      setProducts(Array.isArray(data) ? data : []);
    };
    fetchData();
    fetchWallet()
    fetchApplications();
  }, []);

  const getReferral = async (productId: number) => {
    const res = await api(`/referral/referral-link/${productId}`);

    if (res.error) {
      alert(res.error);
      return;
    }

    navigator.clipboard.writeText(res.referral_link);
    alert("Referral link copied!");
  };
  const apply = async (id: number) => {
    await api("/referral", "POST", { product_id: id }); // adjust if needed
    await fetchApplications();
  };

  return (
    <div className="container">
      <h2>Creator Dashboard</h2>

      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
          <button onClick={() => apply(p.id)}>Apply</button>
        </div>
      ))}

      <h3>My Applications</h3>

      {applications.length === 0 && <p>No applications</p>}

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <div>
            <b>Product:</b> {app.product_name}
          </div>
          <div>
            <b>Status:</b> {app.status}
          </div>

          {app.status === "approved" && (
            <button onClick={() => getReferral(app.product_id)}>
              Get Referral Link
            </button>
          )}
        </div>
      ))}
      <h3>Wallet</h3>

{wallet && (
  <div style={{ border: "1px solid #ccc", padding: "15px", marginBottom: "20px" }}>
    
    <div style={{ marginBottom: "10px" }}>
      <b>Total Earnings:</b> ₹{wallet.total_earnings}
    </div>

    <div style={{ marginBottom: "10px", color: "orange" }}>
      <b>Pending Amount:</b> ₹{wallet.pending_balance}
    </div>

    <div style={{ marginBottom: "10px", color: "green" }}>
      <b>Available Amount:</b> ₹{wallet.available_balance}
    </div>

  </div>
)}

      <h3>Request Payout</h3>

      <input
        value={amount}
        placeholder="Enter amount"
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={requestPayout}>Request</button>

      <h3>Payout History</h3>

      {payouts.map((p) => (
        <div key={p.id}>
          ₹{p.amount} - {p.status}
        </div>
      ))}
    </div>
  );
}
