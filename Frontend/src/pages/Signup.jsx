import { useState } from "react";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <Toaster/>
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          <InputBox
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="John"
            label={"First Name"}
          />

          <InputBox
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Doe"
            label={"Last Name"}
          />

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
                console.log("First Name:", firstName);
                console.log("Last Name:", lastName);
                console.log("Username:", username);
                console.log("Password:", password);
                try {
                  await axios.post("https://transactify-uwh0.onrender.com/api/v1/user/signup", {
                    username,
                    firstName,
                    lastName,
                    password,
                  });
                  toast.success("Signup successful!"); // Display success message
                  setTimeout(() => {
                    navigate("/signin");
                  }, 2000);
                } catch (error) {
                  toast.error("Signup failed. Please try again."); // Display error message if signup fails
                }
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};