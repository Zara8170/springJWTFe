import "./App.css";
import { useEffect } from "react";
import TestConponents from "./TestConponents";
import Login from "./Login";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { saveCsrfToken } from "./store";

function App() {
  const loginFlag = useSelector((state) => state.userInfo.loginFlag);
  const dispatch = useDispatch();

  return (
    <>
      {!loginFlag && <Login></Login>}
      {loginFlag && <TestConponents />}
    </>
  );
}

export default App;
