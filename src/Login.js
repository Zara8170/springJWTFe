import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, saveJwtToken } from "./store";
import apiClient from "./api/axiosinstance";

export default function Login() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/join", {
        username,
        password,
      });
      setMessage(response.data);
    } catch (error) {
      console.log(error);
      setMessage(error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post(
        "/login",
        new URLSearchParams({ username, password }),
        {
          withCredentials: true,
        }
      );

      const token = response.headers["authorization"]; // authorization "a"소문자여야됨
      // const token = response.data;
      console.log("토큰: " + token);
      await dispatch(login());
      console.log("jwt토큰:", token);
      await dispatch(saveJwtToken(token));
    } catch (error) {
      console.log(error);
      setMessage(error.response.data.message);
    }
  };

  return (
    <>
      <form>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="button" name="login" onClick={handleLogin}>
          로그인
        </button>
        <button type="button" name="join" onClick={handleJoin}>
          가입
        </button>
      </form>
      <h2>{message}</h2>
    </>
  );
}
