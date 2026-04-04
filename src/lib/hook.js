import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";

export const useRealtimeCollection = (path) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, path));

        if (snapshot.exists()) {
          const val = snapshot.val();

          const result = Object.keys(val).map((key) => ({
            id: key,
            ...val[key],
          }));

          setData(result);
        } else {
          setData([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);
    
  return { data, loading, error };
};