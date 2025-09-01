// 게시물 상세 페이지의 좌측 2/3 영역을 구성하는 메인 컴포넌트
// PostContentSection.jsx

import React from 'react';
import styled from 'styled-components';
import TabMenu from './TabMenu';
import StoryTabContent from './StoryTabContent';
import DonationListTabContent from './DonationListTabContent';

const SectionContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px; /* 하단 댓글 섹션과의 간격 */

  @media (max-width: 768px) {
    padding: 15px; /* 모바일에서 패딩 줄이기 */
  }
`;

const PostImage = styled.img`
  width: 100%;
  max-height: 400px; /* 이미지 최대 높이 제한 */
  object-fit: cover; /* 이미지가 잘리지 않고 비율 유지하며 채우기 */
  border-radius: 8px;
  margin-bottom: 20px;
`;

// 전체 폭 연한 밑줄 컴포넌트
const FullWidthUnderline = styled.div`
  width: 100%;
  height: 1px;            /* 선 두께 */
  background-color: #e0e0e0; /* 연한 회색 */
  margin: 5px 0 20px;     /* 탭과 콘텐츠 사이 간격 */
`;

function PostContentSection({ post, activeTab, setActiveTab, postId }) {
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <SectionContainer>
      <PostImage src={post.displayImageUrl} alt={post.title} />

      <TabMenu activeTab={activeTab} onTabChange={handleTabChange} />

      {/* 전체 폭 연한 밑줄 */}
      <FullWidthUnderline />

      {activeTab === 'story' ? (
        <StoryTabContent post={post} />
      ) : (
        <DonationListTabContent postId={postId} />
      )}
    </SectionContainer>
  );
}

export default PostContentSection;