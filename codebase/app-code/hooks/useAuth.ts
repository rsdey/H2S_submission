import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";

export function useAuth(requireAuth = true) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else if (requireAuth) {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, requireAuth]);

  return { user, loading };
}
