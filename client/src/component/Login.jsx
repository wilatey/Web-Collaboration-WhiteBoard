import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function Login({ onSubmit }) {
    const [username, setUsername] = useState("")
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(username);
        setUsername( e.target.value );
        navigate("/dashboard");
    }

    return (
        <>
            {/* create a form and input for username, then submit it and call onSubmit with the username 
            After that, it will redirect to the dashboard
            */}
            <form onSubmit={handleSubmit}>
                    <div className="w-full px-2 py-1 ">
                        <div>
                        <input
                            type="text"
                            value={username}
                            placeholder="Type name"
                            id="username"
                            name="username"
                            onChange={{handleSubmit}}
                            className="py-1 p-20 justify-center text-center text-2xl *:rounded-md border border-input bg-background focus:outline-none focus:ring-1"
                            />
                        </div>
                    <button type="submit" className="cosmic-button border w-200 my-5"> Submit form </button>
                </div>
            </form>
        </>
    )
}