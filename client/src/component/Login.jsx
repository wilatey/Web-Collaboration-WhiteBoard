import { useState } from "react";

export function Login({ onSubmit }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleDirect = (e) => {
    e.preventDefault();
    if (username.trim() === "" || username.length > 15) {
      setError("Please enter a valid username");
      return;
    }
    if (!onSubmit) {
      console.error("onSubmit is undefined in Login");
      return;
    }
    console.log("Login handleDirect called with username:", username);
    setError("");
    onSubmit(username);
  };

  return (
    <form onSubmit={handleDirect}>
      <div className="w-full px-2 py-4">
        <div>
          <input
            type="text"
            value={username}
            placeholder="Type name"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            className="w-full py-2 px-4 text-center text-lg md:text-2xl rounded-md border border-input bg-amber-50 focus:outline-none focus:ring-2 focus:ring-sky-600"
          />
        </div>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        <button type="submit" className="cosmic-button border w-full my-5">
          Sign Up
        </button>
      </div>
    </form>
  );
}
