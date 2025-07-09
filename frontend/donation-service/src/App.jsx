// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 기존 App 내용은 MainPage.jsx로 분리해서 불러옵니다
import MainPage from './pages/MainPage';
import RankingPage from './pages/RankingPage'
import PostListPage from './pages/PostListPage';
import MainAppBar from './components/MainAppBar';
import ScrollToTop from './ScrollToTop';
import MyPage from './pages/MyPage';
import ApplyAgencyPage from './pages/ApplyAgencyPage';

export default function App() {
  return (
    <Router>
      <ScrollToTop/>
      <MainAppBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rankingPage" element={<RankingPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/apply-agency" element={<ApplyAgencyPage />} />
        <Route path="/postListPage" element={<PostListPage />} />

      </Routes>
    </Router>
  );
}