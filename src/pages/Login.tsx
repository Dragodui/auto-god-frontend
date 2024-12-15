import React, { FormEvent, useState } from "react";
import Wrapper from "../components/Wrapper";
import Input from "../components/UI/Input";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button";
import Form from "../components/UI/Form";
import { useNavigate } from "react-router-dom";
import { LoginData } from "../types";
import { login } from "../api/auth";

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const response = await login(formData);
      if (!response) {
        setError("Invalid login data!");
        return;
      }
      if (response.status === 200) {
        console.log("Success");
        console.log(response.data);

        setFormData({
          email: "",
          password: "",
        });
        await navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Wrapper>
      <Form action="submit" onSubmit={handleSubmit}>
        <h2 className="text-5xl font-bold mb-[30px]">Log in</h2>
        <Input
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email or nickname"
          type="text"
        />
        <Input
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          placeholder="Password"
          type="password"
        />
        <p>
          Don`t have an account? <Link to="/register">Register</Link>
        </p>
        <p className="text-red-500">{error}</p>
        <Button type="submit">Log in</Button>
      </Form>
    </Wrapper>
  );
};

export default Login;
