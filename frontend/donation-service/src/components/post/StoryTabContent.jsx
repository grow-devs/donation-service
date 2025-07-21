// '모금소개' 탭을 선택했을 때 보여질 콘텐츠를 담당
// PostDetail/StoryTabContent.jsx

import React from 'react';
import styled from 'styled-components';

const ContentContainer = styled.div`
  padding: 20px 0; /* 상하 패딩 */
  line-height: 1.8; /* 가독성을 위한 줄 간격 */
  color: var(--text-color);

  h2 {
    font-size: 1.8em;
    font-weight: bold;
    margin-bottom: 20px;
    color: #333;
  }

  h3 {
    font-size: 1.4em;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 15px;
    color: #444;
  }

  p {
    margin-bottom: 15px;
    font-size: 1em;
  }

  ul {
    list-style: disc; /* 원형 리스트 스타일 */
    margin-left: 20px;
    margin-bottom: 15px;
  }

  li {
    margin-bottom: 8px;
    font-size: 1em;
  }

  /* ✨ 이미지 최대 너비 제한 스타일 추가 */
  img {
    max-width: 100%; /* 부모 요소의 최대 너비까지 */
    height: auto;   /* 이미지 비율 유지 */
  }
`;

const DetailSection = styled.div`
  margin-top: 40px;
  /* 기존 border-top은 전체 박스 테두리로 대체되므로 제거하거나 조정 */
  /* border-top: 1px solid var(--border-color); */
  padding-top: 30px; /* 기존 패딩 유지 또는 조정 */

  /* 새롭게 추가할 스타일 */
  padding: 25px; /* 내부 콘텐츠와 테두리 사이의 여백 */
`;

const DetailTitle = styled.h3`
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
  /* padding-top: 0; */ /* DetailSection에 패딩을 줬으므로 여기서는 불필요할 수 있음 */
`;

// 새로 추가할 컴포넌트: 실제 상세 정보 리스트를 감싸는 박스
const DetailContentBox = styled.div`
  border: 1px solid #A0A3A0; /* 더 진한 회색 테두리 */
  border-radius: 10px; /* 라운드 모서리 */
  padding: 20px; /* 내부 여백 */
  background-color: #fcfcfc; /* 배경색 */
`;


const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--light-gray);
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-weight: bold;
  color: var(--secondary-color);
  flex-basis: 30%;
`;

const DetailValue = styled.span`
  color: var(--text-color);
  flex-basis: 70%;
  text-align: right;
`;

function StoryTabContent({ post }) {

  // 이 부분은 PostDetailResponse DTO의 필드명에 맞춰서 구성
  const postDetails = [
    { label: '단체명', value: post.teamName || 'N/A' },
    { label: '모금 기간', value: `${post.createdAt?.split('T')[0] || 'N/A'} ~ ${post.deadline?.split('T')[0] || 'N/A'}` },
    { label: '목표 금액', value: `${post.targetAmount ? post.targetAmount.toLocaleString() : 'N/A'}원` },
    { label: '모인 금액', value: `${post.currentAmount ? post.currentAmount.toLocaleString() : 'N/A'}원` },
    { label: '참여 인원', value: `${post.participants ? post.participants.toLocaleString() : 'N/A'}명` },
    // 필요에 따라 더 많은 필드를 추가할 수 있습니다.
    // 예를 들어, 승인 상태: { label: '승인 상태', value: post.approvalStatus || 'N/A' },
  ];

  return (
    <ContentContainer>
      {/* ✨ post.content가 HTML 문자열로 들어오는 경우 */}
      {post.content ? (
        // dangerouslySetInnerHTML 사용 시 XSS 공격에 취약할 수 있으므로
        // 신뢰할 수 있는 소스의 데이터에만 사용해야 합니다.
        // 또는 DOMPurify 같은 라이브러리로 sanitize 후 사용하세요.
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      ) : (
        <p>게시물 내용이 없습니다.</p>
      )}


      <DetailSection>
        <DetailTitle>모금함 상세정보</DetailTitle>
        <DetailContentBox>
          {/* ✨ 백엔드 데이터(post)를 기반으로 생성한 postDetails 배열을 사용 */}
          {postDetails.map((item, index) => (
            <DetailItem key={index}>
              <DetailLabel>{item.label}</DetailLabel>
              <DetailValue>{item.value}</DetailValue>
            </DetailItem>
          ))}
        </DetailContentBox>
      </DetailSection>
    </ContentContainer>
  );
}

export default StoryTabContent;