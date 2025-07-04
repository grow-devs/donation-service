import axios from "axios";

export const loginApi = async ({ email, password }) => {
  const response = await axios.post('/auth/login', {
    email,
    password,
  });
  return response.data; // { accessToken: '...' }
};
