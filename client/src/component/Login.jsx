import { useState } from "react"

export function Login({ onSubmit }) {
    const [username, setUsername] = useState("")
    return (
        <>
        <div className=" container relative px-15 py-10 bg-primary border border-border rounded-full">
            <h1 className="text-5xl">Welcome</h1>
            <p className="text-3xl m-2">Please enter your username</p>


            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(username)
                }}
                >

                <div className="w-full px-2 py-1 ">
                    <input
                        type="text"
                        value={username}
                        placeholder="Type name"
                        id="username"
                        name="username"
                        onChange={(e) => { setUsername(e.target.value) }}
                        className="py-1 justify-center text-center text-2xl *:rounded-md border border-input bg-background focus:outline-hidden focus:ring-1 m-2"
                        />
                    <button type="submit" className="cosmic-button border w-200 my-5 gap-2"> Submit form </button>
                </div>
            </form>
        </div>
        </>
    )
}