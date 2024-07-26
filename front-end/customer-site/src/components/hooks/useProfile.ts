import UserProfile from "@/types/UserProfile";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export const useProfile = () => {
  const [data, setData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && typeof token === 'string') { 
      const decode = jwtDecode(token);

      fetch(`/api/users?method=get-by-email&email=${decode.sub}`)
        .then((response) => response.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    };
  }, []);

  return { data, loading };
};
