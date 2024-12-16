import axios from "axios";
import store, { saveJwtToken } from "../store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.data instanceof URLSearchParams) {
      // body 타입이 URLSearchParams면 이걸로
      config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    const jwtToken = store.getState().userInfo.jwtToken;
    config.headers["authorization"] = jwtToken;
    return config; // 결과값을 바깥으로 내보내기 위해 필요
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // 요청을 다시 하기 위해서 따로 빼놓음
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry // 무한반복 방지 차원, 처음에는 true
    ) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          "http://localhost:8080/reissue",
          null,
          { withCredentials: true }
        );
        const newAccessToken = refreshResponse.headers["authorization"];
        store.dispatch(saveJwtToken(newAccessToken));
        console.log("만료된 토큰 재발급 신청");
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.log("리프레쉬 토큰으로 재발급 실패");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// admin 과정 -> token 없어지면 response interceptors로 오고 재발급 해서 apiClient에 집어넣고 그걸 request가 받아서 결과 내고
// 그걸 다시 response가 받아서 정상 response가 넘어간다. 그리고 맨 아래있는 promise.reject가 다시 발생하는데 그건 !originalRequest._retry가 false가 되면서 재실행되지 않는다.
