
import { useState } from "react";

const AUTH_API_URL = "http://localhost:8080/api/auth";

async function parseApiResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.error || Object.values(data).join(", ");
    throw new Error(message || "Request failed");
  }

  return data;
}

export default function Register({ onSwitch }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setREpassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (password !== repassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`${AUTH_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phoneNumber,
          password,
          confirmPassword: repassword,
        }),
      });
      const data = await parseApiResponse(response);

      alert(data.message || "Registration successful");
      onSwitch();
    } catch (error) {
      alert(error.message || "Unable to connect to the backend");
    }
  }

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="auth-card w-full max-w-md rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-pink-600">
          Create Account
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-500">
          Welcome New Member💓💓
        </p>

        <label className="mb-2 block font-medium">Full Name</label>
        <input
          type="text"
          required
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
        />

        <label className="mb-2 block font-medium">Email</label>
        <input
          type="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
        />
        <label className="mb-2 block font-medium">Phone Number</label>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          pattern="^\+?[0-9\s-]{10,15}$"
          title="Enter a valid phone number"
          placeholder="+91 98765 43210"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
        />

        <label className="mb-2 block font-medium">Password</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
        />

        <label className="mb-2 block font-medium">Confirm Password</label>
        <input
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="Confirm your password"
          value={repassword}
          onChange={(e) => setREpassword(e.target.value)}
          className="auth-input mb-6 w-full rounded-xl border p-3 outline-none"
        />

        <button
          type="submit"
          className="auth-primary w-full rounded-xl p-3 font-bold transition"
        >
          Create Account
        </button>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="auth-secondary font-bold hover:underline"
          >
            Login
          </button>
        </p>
      </form>
    </div>
  );
}
