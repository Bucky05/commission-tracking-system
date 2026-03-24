const BASE_URL = "http://localhost:3500/api/v1";

export const api = async (
  url: string,
  method: string = "GET",
  body?: any
) => {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return res.json();
};