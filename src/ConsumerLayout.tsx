import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import styles from "./ConsumerLayout.module.css";

const ConsumerLayout = () => {
  return (
    <div className={styles.mainArea}>
      <Header />
      <main className={styles.content}>
        {/* Global container applies max-width + centering */}
        <div className="container">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default ConsumerLayout;