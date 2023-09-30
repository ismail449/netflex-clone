import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { validateEmail } from "@/utils";
import { loginInWithEmail, signOutUser } from "@/lib/magic-client";
import styles from "@/styles/Login.module.css";

const Login = () => {
  const [emailError, setEmailError] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeComplete);
    };
  }, [router]);

  const handleOnChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmailError("");
    setEmail(email);
  };

  const handleLoginWithEmail = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("logged in");
    if (!validateEmail(email)) {
      setEmailError("Enter a valid email address");
      setIsLoading(false);
      return;
    }
    const didToken = await loginInWithEmail(email);
    if (didToken) {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-type": "application/json",
        },
      });
      const loggedInResponse = await response.json();
      if (!loggedInResponse.isLogged) {
        setIsLoading(false);
        setEmailError("Something went wrong logging in");
        signOutUser();
        return;
      }
      router.push("/");
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                alt="netflix logo"
                src="/static/netflix.svg"
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="email"
            placeholder="Email Address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{emailError}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
