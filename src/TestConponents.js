import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "./store";
import apiClient from "./api/axiosinstance";

export default function TestConponents() {
  const [message, setMessage] = useState("");
  const jwtToken = useSelector((state) => state.userInfo.jwtToken);
  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    await dispatch(logout());
    console.log(jwtToken);
    setMessage("로그아웃되었습니다.");
  };
  const handleAdminClick = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.get("/admin", {
        headers: {
          Authorization: jwtToken,
        },
        withCredentials: true,
      });
      setMessage(response.data);
    } catch (error) {
      if (error.response.status === 401) {
        setMessage(error.response.data.message);
      } else if (error.response.status === 403) {
        setMessage(error.response.data);
      } else {
        setMessage(error.message);
        console.log(error);
      }
    }
  };
  return (
    <>
      <button onClick={handleLogout}>LOGOUT</button>
      <button onClick={handleAdminClick}>ADMIN</button>
      <h1>{message}</h1>
    </>
  );
}
