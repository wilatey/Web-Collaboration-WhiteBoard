import Background from "../component/Background";
import { Login } from "../component/Login";

export const LoginPage = ({ onLogin }) => {
  const handleSubmit = (username) => {
    console.log("LoginPage handleSubmit called with username:", username);
    onLogin(username);
  };

  return (
    <div className="title overflow-x-hidden min-h-screen flex items-center justify-center">
      <Background />
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <div className="container relative px-8 py-10  rounded-full w-full bg-primary border border-border text-gray-700 ">
          <h1 className="text-5xl m-2 font-serif">
            Welcome to Collaborative WhiteBoard!
          </h1>
          <p className="text-2xl m-4 font-light font-sans">
            Please signup with your username
          </p>
          <Login onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};
