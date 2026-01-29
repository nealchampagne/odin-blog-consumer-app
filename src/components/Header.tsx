import { useAuth } from "../store/auth";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";

const Header = () => {
  const { logout, user } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.title}>Super Cool Blog</div>

      <div className={styles.right}>
        {user ? (
          <button onClick={logout}>Log out</button>
        ) : (
          <Link to="/login"
          className={styles.button}>Log in</Link>
        )}
      </div>
    </header>
  );
};

export default Header;