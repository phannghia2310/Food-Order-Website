import UserProfile from "@/types/UserProfile";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      setData(JSON.parse(customerData));
      setLoading(false);
    }
  }, [])

  return { data, loading }
}
