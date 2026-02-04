import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("users")) || {};
    } catch (e) {
      return {};
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem("users", JSON.stringify(users));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    const users = getUsers();

    // If no users are registered, keep demo behavior (accept any non-empty credentials)
    if (Object.keys(users).length === 0) {
      onLogin(username);
      return;
    }

    const storedPassword = users[username];
    if (!storedPassword) {
      alert("No account found with that username. Please sign up.");
      return;
    }

    if (storedPassword !== password) {
      alert("Incorrect password");
      return;
    }

    onLogin(username);
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      alert("Please fill out all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    const users = getUsers();
    if (users[username]) {
      alert("Username already taken. Choose another one or log in.");
      return;
    }

    users[username] = password; // In a real app, hash the password before storing
    saveUsers(users);

    alert("Sign up successful! You are now logged in.");
    onLogin(username);
  };

  return (
    <div className="auth-page">
      <div className="auth-card container">
        <div className="info-panel" aria-hidden="true">
          <h1>PlantInfo 🌿</h1>
          <p className="lead">Store photos, species details, care notes, and schedules for all your plants — accessible on any device.</p>

          <ul className="benefits">
            <li><strong>Complete profiles</strong> — photos & care history</li>
            <li><strong>Care reminders</strong> — watering & fertilizing alerts</li>
            <li><strong>Search & organize</strong> — tags, filters & quick search</li>
            <li><strong>Secure backups</strong> — encrypted sync & automatic backups</li>
          </ul>

          <p className="trust">Privacy-first design, industry-standard encryption, and helpful support when you need it.</p>
        </div>

        <div className="login-panel">
          <div className="container login-container">
            <h1>{isSigningUp ? "📝 Sign Up" : "🔐 Log In"}</h1>

            <form className="form" onSubmit={isSigningUp ? handleSignUp : handleLogin}>
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {isSigningUp && (
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              )}

              <button type="submit">{isSigningUp ? "Sign Up" : "Log In"}</button>
            </form>

            <div style={{ marginTop: "12px" }}>
              {isSigningUp ? (
                <>
                  <span>Already have an account? </span>
                  <button className="link-btn" onClick={() => setIsSigningUp(false)}>
                    Log In
                  </button>
                </>
              ) : (
                <>
                  <span>Don't have an account? </span>
                  <button className="link-btn" onClick={() => setIsSigningUp(true)}>
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <style>{`
              .link-btn {
                background: none;
                border: none;
                color: #1a73e8;
                cursor: pointer;
                padding: 0;
                margin-left: 6px;
                text-decoration: underline;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
