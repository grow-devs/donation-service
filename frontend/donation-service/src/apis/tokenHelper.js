// src/apis/tokenHelper.js
import api from './api'

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return null

  try {
    const res = await api.post('/user/reissue', null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    })

    const newAccessToken = res.data.data.accessToken
    localStorage.setItem('accessToken', newAccessToken)
    return newAccessToken
  } catch (err) {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    window.location.href = '/' // or '/login'
    return null
  }
}
