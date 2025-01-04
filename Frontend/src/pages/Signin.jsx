import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <Toaster />
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />

          <InputBox
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            placeholder="email@gmail.com"
            label={"Email"}
          />

          <InputBox
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder="123456"
            label={"Password"}
          />

          <div className="pt-4">
            <Button
              onClick={async () => {
                try {
                  const response = await axios.post(
                    "https://transactify-uwh0.onrender.com/api/v1/user/signin",
                    {
                      username,
                      password,
                    }
                  );
                  localStorage.setItem("token", response.data.token);
                  toast.success("Welcome");
                  setTimeout(() => {
                    navigate("/dashboard");
                  }, 4000);
                } catch (error) {
                  toast.error("Incorrect Credentials!");
                }
              }}
              label={"Sign in"}
            />
          </div>
          <BottomWarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};