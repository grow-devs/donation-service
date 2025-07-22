// PostDetailPage.jsx
import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import PostContentSection from '../components/post/PostContentSection';
import FundraisingSummary from '../components/post/FundraisingSummary';
import CommentSection from '../components/post/CommentSection';
import api from '../apis/api';
import { useParams } from 'react-router-dom';
import { postData, donationSummaryData, donationListData, commentsData } from '../components/post/dummyData';

const PageContainer = styled.div`
  display: flex;
  justify-content: center; /* 콘텐츠를 중앙에 정렬 */
  width: 100%;
  padding: 40px 0; /* 페이지 상하 여백 */
  min-height: 100vh; /* 최소 높이를 뷰포트 높이로 설정 */
  background-color: #F8F8F8; /* GlobalStyles의 body 배경색과 일치 */

  @media (max-width: 768px) {
    padding: 20px 0; /* 모바일에서 패딩 줄이기 */
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 77%; /* 화면의 약 70% 너비 차지 */
  max-width: 1200px; /* 콘텐츠가 너무 넓어지지 않도록 최대 너비 설정 */
  gap: 30px; /* 좌측 메인 콘텐츠와 우측 사이드바 사이의 간격 */

  @media (max-width: 1024px) {
    flex-direction: column; /* 태블릿 이하에서는 세로로 배치 */
    width: 90%; /* 너비 확장 */
    gap: 20px;
  }
`;

const MainContentArea = styled.div`
  flex: 2; /* 좌측 영역이 우측 영역보다 2배 넓게 */
  min-width: 400px; /* 콘텐츠 최소 너비 */

  @media (max-width: 1024px) {
    flex: none; /* 세로 배치 시 flex 비율 해제 */
    width: 100%; /* 전체 너비 차지 */
    min-width: unset;
  }
`;

const SidebarArea = styled.div`
  flex: 1; /* 우측 영역 */
  min-width: 280px; /* 사이드바 최소 너비 */

  @media (max-width: 1024px) {
    flex: none; /* 세로 배치 시 flex 비율 해제 */
    width: 100%; /* 전체 너비 차지 */
    min-width: unset;
  }
`;

function PostDetailPage() {
  // '모금소개'와 '기부현황' 탭 상태 관리
  // PostContentSection과 TabMenu가 이 상태를 공유합니다.
  const [activeTab, setActiveTab] = useState('story');
  const { postId } = useParams(); 
  // const testPostId = 4; // todo : 동적으로 바꿔야함

  const [post, setPost] = useState(null); // ✨ 게시물 데이터를 저장할 state
  const [loading, setLoading] = useState(true); // ✨ 로딩 상태 관리
  const [error, setError] = useState(null); // ✨ 에러 상태 관리

  useEffect(() => {
    const fetchPostDetail = async () => {
      // ✨✨✨ postId가 유효한 숫자인지 확인합니다. ✨✨✨
      // URL 파라미터는 문자열이므로 Number()로 변환해야 한다 - 근데 필수는 아니고 그냥 postId를 api 요청해도 된다.
      const idToFetch = Number(postId);
      if (isNaN(idToFetch) || idToFetch <= 0) {
        setError("유효하지 않은 게시물 ID입니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 true
        setError(null); // 에러 초기화

        // ✨ 백엔드 API 호출
        const response = await api.get(`/post/${idToFetch}`);
        console.log('~~~~ : ', response.data.data);
        setPost(response.data.data); // ✨ 가져온 데이터를 post state에 저장
      } catch (err) {
        console.error("게시물 상세 정보 불러오기 실패:", err);
        setError("게시물 정보를 불러오는 데 실패했습니다."); // ✨ 에러 메시지 설정
        alert(err.response?.data?.message || '게시글 상세 정보를 불러오지 못했습니다.'); // 사용자에게 알림
      } finally {
        setLoading(false); // 데이터 가져오기 완료 시 로딩 false
      }
    };

    fetchPostDetail(); // 컴포넌트 마운트 시 데이터 가져오기 함수 호출
  }, [postId]); // testPostId가 변경될 때마다 재실행 (현재는 고정값)

  // ✨ 로딩 중일 때 표시할 내용
  if (loading) {
    return (
      <PageContainer>
        <ContentWrapper>
          <p>게시물 정보를 불러오는 중입니다...</p>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // ✨ 에러 발생 시 표시할 내용
  if (error) {
    return (
      <PageContainer>
        <ContentWrapper>
          <p>오류 발생: {error}</p>
        </ContentWrapper>
      </PageContainer>
    );
  }

  // ✨ 게시물 데이터가 성공적으로 로드되지 않았을 때 (예: 404 Not Found)
  if (!post) {
    return (
      <PageContainer>
        <ContentWrapper>
          <p>게시물을 찾을 수 없습니다.</p>
        </ContentWrapper>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentWrapper>
        {/* 좌측 2/3 메인 콘텐츠 영역 */}
        <MainContentArea>
          <PostContentSection 
            post={post}
            // post={post} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            donations={donationListData} /* 더미 데이터 */
          />
          {/* 댓글 섹션은 탭과 관계없이 항상 아래에 표시됨 */}
          <CommentSection postId={Number(postId)} /> 
        </MainContentArea>

        {/* 우측 1/3 사이드바 영역 */}
        <SidebarArea>
          <FundraisingSummary 
            summary={donationSummaryData} 
            post={post} 
          />
        </SidebarArea>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PostDetailPage;