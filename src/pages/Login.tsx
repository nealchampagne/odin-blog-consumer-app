import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import styles from "./Login.module.css";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(email, password);

    if (!error) {
      navigate("/");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Log In</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label className={styles.label}>Email</label>
        <input
          className={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className={styles.label}>Password</label>
        <input
          className={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Login"}
        </button>
        <div className={styles.signupPrompt}>
          <span>Don’t have an account? </span>
          <a
            className={styles.signupLink}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
