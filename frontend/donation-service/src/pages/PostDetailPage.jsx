import React, {useState} from 'react';
import styled from 'styled-components';
import PostContentSection from '../components/post/PostContentSection';
import FundraisingSummary from '../components/post/FundraisingSummary';
import CommentSection from '../components/post/CommentSection';

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

  return (
    <PageContainer>
      <ContentWrapper>
        {/* 좌측 2/3 메인 콘텐츠 영역 */}
        <MainContentArea>
          <PostContentSection 
            post={postData} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            donations={donationListData} 
          />
          {/* 댓글 섹션은 탭과 관계없이 항상 아래에 표시됨 */}
          <CommentSection comments={commentsData} />
        </MainContentArea>

        {/* 우측 1/3 사이드바 영역 */}
        <SidebarArea>
          <FundraisingSummary 
            summary={donationSummaryData} 
            post={postData} 
          />
        </SidebarArea>
      </ContentWrapper>
    </PageContainer>
  );
}

export default PostDetailPage;