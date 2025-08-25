import Background from "../component/Background"
import { Login } from "../component/Login"

export const LoginPage = () => {
    return (
        <div className="title overflow-x-hidden ">
            <Background />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <div className="container relative px-15 py-10 bg-primary border border-border rounded-full">
                    <h1 className="text-5xl m-2 font-serif">Welcome to Collaborative WhiteBoard!</h1>
                    <p className="text-2xl m-4 font-light font-sans">Please signup with your username</p>
                    <Login />
                </div>
            </div>
        </div>
    )
}