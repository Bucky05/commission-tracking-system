"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

type Product = {
  id: number;
  name: string;
  price: number;
};

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const productId = params.id;
  const creatorId = searchParams.get("ref");

  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await api(`/product/${productId}`);
      setProduct(data);
    };

    fetchProduct();
  }, [productId]);

  const handleBuy = async () => {
    await api("/conversion", "POST", {
      productId: Number(productId),
      creatorId: Number(creatorId),
      referenceId: Number(Date.now())
    });

    alert("Purchase successful!");
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className="container">
      <h2>{product.name}</h2>
      <p>Price: ₹{product.price}</p>

      <button onClick={handleBuy}>Buy Now</button>
    </div>
  );
}