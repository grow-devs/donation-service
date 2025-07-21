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
import PrivateRoute from './routes/PrivateRoute';
import AdminForm from './pages/AdminForm';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';


export default function App() {
  return (
    <Router>
      <ScrollToTop/>
      <MainAppBar />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/rankingPage" element={<RankingPage />} />
        <Route path="/mypage" element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>} />
        <Route path="/apply-agency" element={<ApplyAgencyPage />} />
        <Route path="/admin-page" element={
          <PrivateRoute>
            <AdminForm />
          </PrivateRoute>
        } />
        <Route path="/postListPage/:categoryId" element={<PostListPage />} />
        <Route path="/postListPage/" element={<PostListPage />} />
        <Route path="/createPost/" element={<CreatePostPage />} />
        <Route path='/post-detail' element={<PostDetailPage />} />
      </Routes>
    </Router>
  );
}