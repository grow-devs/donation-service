// src/routes/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, adminOnly = false }) {
    const accessToken = localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
  
    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return <Navigate to="/" replace />;
    }
  
    if (adminOnly && userRole !== 'ADMIN_ROLE') {
      alert('관리자만 접근할 수 있습니다.');
      return <Navigate to="/" replace />;
    }
  
    return children;
  }