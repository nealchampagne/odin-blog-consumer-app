import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import { signupRequest } from "../api/auth";

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const res = await signupRequest(name, email, password);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      navigate("/login");
    } catch {
      setError("Failed to create account.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create an account</h1>

      {error && <p className={styles.error}>{error}</p>}

      <label className={styles.label}>
        Name
      </label>
      <input
        className={styles.input}
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label className={styles.label}>
        Email <span className={styles.required}>*</span>
      </label>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label className={styles.label}>
        Password <span className={styles.required}>*</span>
      </label>
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <label className={styles.label}>
        Confirm password <span className={styles.required}>*</span>
      </label>
      <input
        className={styles.input}
        type="password"
        placeholder="Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <p className={styles.requiredNote}>* Required fields</p>

      <button
        className={styles.submitButton}
        onClick={handleSignup}
        disabled={!password || !confirmPassword || password !== confirmPassword}
      >
        Sign up
      </button>


      <div className={styles.loginPrompt}>
        <span>Already have an account?</span>
        <a className={styles.loginLink} onClick={() => navigate("/login")}>
          Log in
        </a>
      </div>
    </div>
  );
};

export default Signup;
