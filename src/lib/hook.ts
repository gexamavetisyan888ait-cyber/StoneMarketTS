import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "./firebase.ts";

export const useRealtimeCollection = <T = any>(path: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(db, path));

        if (snapshot.exists()) {
          const val = snapshot.val();
          
          // Տվյալները ձևափոխում ենք զանգվածի, որտեղ ամեն օբյեկտ ունի իր id-ն
          const result = Object.keys(val).map((key) => ({
            id: key,
            ...val[key],
          })) as T[];

          setData(result);
        } else {
          setData([]);
        }
      } catch (err: any) {
        setError(err.message || "Ինչ-որ սխալ տեղի ունեցավ");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [path]);

  return { data, loading, error };
};