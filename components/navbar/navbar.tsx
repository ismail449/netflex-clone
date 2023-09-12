import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import { getUserEmail, signOutUser } from "@/lib/magic-client";
import styles from "./navbar.module.css";

const Navbar = () => {
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getEmail = async () => {
      const email = await getUserEmail();
      if (email) {
        setUserEmail(email);
      }
    };
    getEmail();
  }, []);

  const handleHomeNavigation = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push("/");
  };

  const handleMyListNavigation = (
    e: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const toggleDropdown = () => {
    setShowDropdown((showDropdown) => !showDropdown);
  };

  const handleUserSignOut = async () => {
    const isSignedOut = await signOutUser();
    if (isSignedOut) {
      router.push("/login");
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
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

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleHomeNavigation}>
            Home
          </li>
          <li className={styles.navItem} onClick={handleMyListNavigation}>
            My List
          </li>
        </ul>
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.usernameBtn} onClick={toggleDropdown}>
              <p className={styles.username}>{userEmail}</p>
              <Image
                src="/static/expand_more.svg"
                alt="Expand more"
                width={24}
                height={24}
              />
            </button>
            {showDropdown ? (
              <div className={styles.navDropdown}>
                <div>
                  <a onClick={handleUserSignOut} className={styles.linkName}>
                    Sign out
                  </a>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
