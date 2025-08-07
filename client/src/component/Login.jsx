import { useState } from "react"



export function Login({ onSubmit }) {
    const [username, setUsername] = useState("")
    return (
        <>
            <h1>Welcome</h1>
            <p>Please enter your username</p>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    onSubmit(username)
                }}
            >

                <input
                    type="text"
                    value={username}
                    placeholder="username"
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                <input type="submit" />
            </form>
        </>
    )
}