// src/SignupPage.jsx

import React, { useState } from "react";
import axios from "axios";

const SignupPage = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    userName: "",
    userRole: "USER", // 기본값
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/user/signup", form);
      setMessage(response.data.message || "회원가입 완료");
    } catch (error) {
      setMessage("회원가입 실패: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>비밀번호:</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>사용자 이름:</label>
          <input
            type="text"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>권한:</label>
          <select name="userRole" value={form.userRole} onChange={handleChange}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button type="submit">가입하기</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default SignupPage;
