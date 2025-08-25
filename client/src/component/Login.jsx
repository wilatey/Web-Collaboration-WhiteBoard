import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Login() {
    const [username, setUsername] = useState("")
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleDirect = (e) => { 
        e.preventDefault();
        if (username.trim() === "") {
            setError("Please enter a valid username");
            return;
        }
        setError("");
        navigate("/dashboard", { state: { username } });
    }

    return (
        <>
            <form onSubmit={handleDirect}>
                    <div className="w-full px-2 py-1 ">
                        <div>
                        <input
                            type="text"
                            value={username}
                            placeholder="Type name"
                            id="username"
                            name="username"
                            onChange={(e) => setUsername(e.target.value)}
                            className="py-1 p-20 justify-center text-center text-2xl *:rounded-md border border-input bg-background focus:outline-none focus:ring-1"
                            />
                    </div>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    <button type="submit" className="cosmic-button border w-200 my-5"> Submit form </button>
                </div>
            </form>
        </>
    )
}