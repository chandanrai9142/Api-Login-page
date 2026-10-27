
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

export default function Login({ onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loginMethod, setLoginMethod] = useState("email");
  const [loginOtp, setLoginOtp] = useState("");
  const [loginOtpCode, setLoginOtpCode] = useState("");
  const [loginOtpSent, setLoginOtpSent] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetMethod, setResetMethod] = useState("email");
  const [resetContact, setResetContact] = useState("");
  const [resetStep, setResetStep] = useState("contact");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (loginMethod === "otp") {
      if (loginOtp !== loginOtpCode) {
        alert("Invalid OTP. Please try again.");
        return;
      }

      alert(`Login form submitted for: ${phoneNumber}`);
      return;
    }

    const payload = loginMethod === "email"
      ? { email, password }
      : { phoneNumber, password };

    try {
      const response = await fetch(`${AUTH_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await parseApiResponse(response);

      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }

      alert(data.message || "Login successful");
      onLogin?.();
    } catch (error) {
      alert(error.message || "Unable to connect to the backend");
    }
  }

  function handleLoginMethodChange(method) {
    setLoginMethod(method);
    setLoginOtp("");
    setLoginOtpCode("");
    setLoginOtpSent(false);
  }

  function handleSendLoginOtp() {
    if (!phoneNumber.trim()) {
      alert("Please enter your phone number first.");
      return;
    }

    const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
    setLoginOtpCode(demoOtp);
    setLoginOtpSent(true);
    setLoginOtp("");

    alert(`Demo OTP sent to your phone: ${demoOtp}`);
  }

  function openForgotPassword() {
    setShowForgotPassword(true);
    setResetStep("contact");
    setResetContact("");
    setOtp("");
    setGeneratedOtp("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function backToLogin() {
    setShowForgotPassword(false);
    setResetStep("contact");
  }

  function handleSendOtp(e) {
    e.preventDefault();

    const demoOtp = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedOtp(demoOtp);
    setResetStep("otp");
    setOtp("");

    alert(`Demo OTP sent to your ${resetMethod}: ${demoOtp}`);
  }

  function handleVerifyOtp(e) {
    e.preventDefault();

    if (otp !== generatedOtp) {
      alert("Invalid OTP. Please try again.");
      return;
    }

    setResetStep("password");
  }

  function handleResetPassword(e) {
    e.preventDefault();

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    alert("Password reset successfully. Please login with your new password.");
    backToLogin();
  }

  if (showForgotPassword) {
    return (
      <div className="auth-shell min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={
            resetStep === "contact"
              ? handleSendOtp
              : resetStep === "otp"
                ? handleVerifyOtp
                : handleResetPassword
          }
          className="auth-card w-full max-w-md rounded-3xl p-8"
        >
          <h1 className="text-3xl font-bold text-center text-purple-700">
            Forgot Password?
          </h1>

          {resetStep === "contact" && (
            <>
              <p className="mt-2 mb-8 text-center text-gray-500">
                Choose email or phone number to receive an OTP
              </p>

              <div className="mb-5 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setResetMethod("email")}
                  className={`auth-tab rounded-xl border p-3 font-semibold ${
                    resetMethod === "email" ? "auth-tab-active" : ""
                  }`}
                >
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setResetMethod("phone")}
                  className={`auth-tab rounded-xl border p-3 font-semibold ${
                    resetMethod === "phone" ? "auth-tab-active" : ""
                  }`}
                >
                  Phone Number
                </button>
              </div>

              <label className="mb-2 block font-medium">
                {resetMethod === "email" ? "Email" : "Phone Number"}
              </label>
              <input
                type={resetMethod === "email" ? "email" : "tel"}
                required
                value={resetContact}
                onChange={(e) => setResetContact(e.target.value)}
                placeholder={
                  resetMethod === "email"
                    ? "Enter your email"
                    : "+91 98765 43210"
                }
                className="auth-input mb-6 w-full rounded-xl border p-3 outline-none"
              />

              <button
                type="submit"
                className="auth-primary w-full rounded-xl p-3 font-bold transition"
              >
                Send OTP
              </button>
            </>
          )}

          {resetStep === "otp" && (
            <>
              <p className="mt-2 mb-8 text-center text-gray-500">
                Enter the 6-digit OTP sent to your {resetMethod}
              </p>

              <label className="mb-2 block font-medium">OTP</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter 6-digit OTP"
                className="auth-input mb-6 w-full rounded-xl border p-3 text-center tracking-[0.5em] outline-none"
              />

              <button
                type="submit"
                className="auth-primary w-full rounded-xl p-3 font-bold transition"
              >
                Verify OTP
              </button>
            </>
          )}

          {resetStep === "password" && (
            <>
              <p className="mt-2 mb-8 text-center text-gray-500">
                Create a new password for your account
              </p>

              <label className="mb-2 block font-medium">New Password</label>
              <input
                type="password"
                minLength={8}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
              />

              <label className="mb-2 block font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                minLength={8}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="auth-input mb-6 w-full rounded-xl border p-3 outline-none"
              />

              <button
                type="submit"
                className="auth-primary w-full rounded-xl p-3 font-bold transition"
              >
                Reset Password
              </button>
            </>
          )}

          <button
            type="button"
            onClick={backToLogin}
            className="auth-secondary mt-6 w-full text-center font-bold hover:underline"
          >
            Back to Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="auth-shell min-h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="auth-card w-full max-w-md rounded-3xl p-8"
      >
        <h1 className="text-3xl font-bold text-center text-purple-700">
          Welcome Back!
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-500">
          Login to your account
        </p>

        <div className="mb-6 grid grid-cols-3 gap-2 text-sm">
          <button
            type="button"
            onClick={() => handleLoginMethodChange("email")}
            className={`auth-tab rounded-xl border p-3 font-semibold ${
              loginMethod === "email" ? "auth-tab-active" : ""
            }`}
          >
            Email
          </button>
          <button
            type="button"
            onClick={() => handleLoginMethodChange("phone")}
            className={`auth-tab rounded-xl border p-3 font-semibold ${
              loginMethod === "phone" ? "auth-tab-active" : ""
            }`}
          >
            Phone Number
          </button>
          <button
            type="button"
            onClick={() => handleLoginMethodChange("otp")}
            className={`auth-tab rounded-xl border p-3 font-semibold ${
              loginMethod === "otp" ? "auth-tab-active" : ""
            }`}
          >
            OTP
          </button>
        </div>

        {loginMethod === "email" && (
          <>
            <label className="mb-2 block font-medium">Email</label>
            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
            />
          </>
        )}

        {(loginMethod === "phone" || loginMethod === "otp") && (
          <>
            <label className="mb-2 block font-medium">Phone Number</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="auth-input mb-5 w-full rounded-xl border p-3 outline-none"
            />
          </>
        )}

        {loginMethod !== "otp" && (
          <>
            <label className="mb-2 block font-medium">Password</label>
            <input
              type="password"
              required
              minLength={8}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input mb-6 w-full rounded-xl border p-3 outline-none"
            />

            <button
              type="submit"
              className="auth-primary w-full rounded-xl p-3 font-bold transition"
            >
              Login
            </button>
          </>
        )}

        {loginMethod === "otp" && !loginOtpSent && (
          <button
            type="button"
            onClick={handleSendLoginOtp}
            className="auth-primary w-full rounded-xl p-3 font-bold transition"
          >
            Send OTP
          </button>
        )}

        {loginMethod === "otp" && loginOtpSent && (
          <>
            <label className="mb-2 block font-medium">OTP</label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              value={loginOtp}
              onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit OTP"
              className="auth-input mb-6 w-full rounded-xl border p-3 text-center tracking-[0.5em] outline-none"
            />

            <button
              type="submit"
              className="auth-primary w-full rounded-xl p-3 font-bold transition"
            >
              Verify OTP & Login
            </button>
          </>
        )}

        <button
          type="button"
          onClick={openForgotPassword}
          className="auth-secondary mt-4 w-full text-center text-sm font-semibold hover:underline"
        >
          Forgot Password?
        </button>

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitch}
            className="auth-secondary font-bold hover:underline"
          >
            Register
          </button>
        </p>
      </form>
    </div>
  );
}
