
import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);

  return isLogin ? (
    <Login onSwitch={() => setIsLogin(false)} />
  ) : (
    <Register onSwitch={() => setIsLogin(true)} />
  );
}
