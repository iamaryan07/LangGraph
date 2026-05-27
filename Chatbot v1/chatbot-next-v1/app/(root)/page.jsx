"use client";

import { useEffect, useState } from "react";

import LoginButton from "@/components/auth/LoginButton";
import AuthLoading from "@/components/auth/AuthLoading";

import { supabase } from "@/lib/supabase";

export default function Home() {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  
  async function getUser() {

    const { data } = await supabase.auth.getUser();

    setUser(data.user);

    setLoading(false);
  }

  useEffect(() => {

    getUser();

    if (window.location.hash) {

      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }

    const authListener =
      supabase.auth.onAuthStateChange(
        (event, session) => {

          const user =
            session?.user || null;

          setUser(user);

          setLoading(false);
        }
      );

    const subscription =
      authListener.data.subscription;

    return () => {
      subscription.unsubscribe();
    };

  }, []);

  // LOADING
  if (loading) {
    return <AuthLoading />;
  }

  // NOT LOGGED IN
  if (!user) {
    return <LoginButton />;
  }

  // LOGGED IN
  window.location.href = "/chat";

  return null;
}