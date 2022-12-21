import styles from "./navbar.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { magic } from "../../lib/magic-client";

const Navbar = () => {

  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [didToken, setDidToken] = useState("");

  useEffect(() => {
    async function getUsername() {
      try {
        const { email, issuer } = await magic.user.getMetadata();
        const didToken = await magic.user.getIdToken();
        if (email) {
          setUsername(email);
        }
      } catch (error) {
        console.log("Error retrieving email:", error);
      }
    }
    getUsername();
  }, []);

  const handleOnClickHome = (e) => {
    e.preventDefault();
    router.push("/");
  };

  const handleOnClickMyList = (e) => {
    e.preventDefault();
    router.push("/browse/my-list");
  };

  const handleShowDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  //Lida com o sign out por meio de um recurso do Magic para que o didToken (chave para o log in) também seja apagado do local storage quando o usuário quiser deslogar;//O evento onClickprecisa estar na tag <a> ao invés de estar no Link Component;
  const handleSignOut = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${didToken}`,
          "Content-Type": "application/json",
        },
      });

      const res = await response.json();
    } catch (error) {
      console.log("Error logging out", error);
      router.push("/login");
    }

  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Link className={styles.logoLink} href="/" legacyBehavior>
          <a>
            <div className={styles.logoWrapper}>
              <Image 
                src="/static/netflix.svg"
                alt="Netflix logo"
                width={128}
                height={34}
              />
            </div>
          </a>
        </Link>

        <ul className={styles.navItems}>
          <li className={styles.navItem} onClick={handleOnClickHome}>
            Home
          </li>
          <li className={styles.navItem2} onClick={handleOnClickMyList}>
            My List
          </li>
        </ul>
        
        <nav className={styles.navContainer}>
          <div>
            <button className={styles.userNameBtn} onClick={handleShowDropdown}>
              <p className={styles.username}>{username}</p>
              {/** expand more icons **/}
              <Image 
                src={"/static/expand_more.svg"} 
                alt="Expand dropdown"
                width={24}
                height={24}
              />
            </button>
            
            {showDropdown && (
              <div className={styles.navDropdown}>
                <div>
                  <Link href="/login" legacyBehavior>
                    <a className={styles.linkName}  onClick={handleSignOut}>Sign out</a>
                  </Link>
                  <div className={styles.lineWrapper}></div>
                </div>
              </div>
            )}
          </div>
        </nav>
        
        
      </div>  
    </div>
  );

}

export default Navbar;