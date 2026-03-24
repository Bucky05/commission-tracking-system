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
  status: string;
  creator_email: string;
  product_name: string;
};
export default function Brand() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [commission, setCommission] = useState<string>("");
  const fetchApplications = async () => {
      const data = await api("/referral/brand");

      setApplications(Array.isArray(data) ? data : data?.data || []);
    };
    
  const [applications, setApplications] = useState<Application[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const data = await api("/product/my-products");
      setProducts(data || []);
    };
    
    fetchData();
    fetchApplications();
  }, []);
  const updateStatus = async (id: number, status: string) => {
  await api(`/referral/${id}`, "PATCH", { status });
  fetchApplications(); // refresh
};
  const addProduct = async () => {
    await api("/product", "POST", {
      name,
      price,
      commissionPercentage: commission,
    });

    const data = await api("/product/my-products");
    setProducts(data);
    setName("");
    setPrice("");
    setCommission("");
  };

  return (
    <div className="container">
      <h2>Brand Dashboard</h2>

      <h3>Add Product</h3>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        placeholder="Commission %"
        value={commission}
        onChange={(e) => setCommission(e.target.value)}
      />
      <button onClick={addProduct}>Add</button>

      <h3>My Products</h3>
      {products.map((p) => (
        <div key={p.id}>
          {p.name} - ₹{p.price}
        </div>
      ))}

      <h3>Creator Applications</h3>

{applications.length === 0 && <p>No applications</p>}

{applications.map((app) => (
  <div key={app.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
    <div><b>Product:</b> {app.product_name}</div>
    <div><b>Creator:</b> {app.creator_email}</div>
    <div><b>Status:</b> {app.status}</div>

    {app.status === "pending" && (
      <>
        <button onClick={() => updateStatus(app.id, "approved")}>
          Approve
        </button>
        <button onClick={() => updateStatus(app.id, "rejected")}>
          Reject
        </button>
      </>
    )}
  </div>
))}
    </div>
  );
}
