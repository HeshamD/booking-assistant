import { UserResponses } from "../types/conversation";

export const sendResponses = async (data: UserResponses) => {
  try {
    const res = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    console.log("✅ Data submitted successfully:", result);
  } catch (err) {
    console.error("❌ Error sending data:", err);
  }
};

