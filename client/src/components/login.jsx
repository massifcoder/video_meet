import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if(email=='vishal@g.com'){
        if(password=='vishal'){
            localStorage.setItem('authToken',email);
            history('/meet');
        }
    }
    else if(email=='rahul@g.com'){
        if(password=='rahul'){
            localStorage.setItem('authToken',email);
            history('/meet');
        }
    }
  };

  useEffect(()=>{
    const token = localStorage.getItem('authToken');
    if(token){
        history('/meet');
    }
  },[])

  return (
    <section className="h-full text-white bg-transparent">
      <div className="h-full">
        <div className="w-96 mx-auto mt-10 p-6  rounded shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Login</h2>

          {/* Email input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-transparent my-2 border border-gray-300 px-3 py-2 rounded"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password input */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="w-full border bg-transparent border-gray-300 px-3 py-2 rounded"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Login button */}
          <button
            className="w-full bg-[#6619d0] text-white py-2 px-4 rounded hover:bg-blue-600"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>
    </section>
  );
}
