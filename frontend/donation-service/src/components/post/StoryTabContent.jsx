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
  return (
    <ContentContainer>
      <div dangerouslySetInnerHTML={{ __html: post.storyContent }} />

      <DetailSection>
        <DetailTitle>모금함 상세정보</DetailTitle>
        {/* DetailContentBox로 실제 상세 정보 항목들을 감쌉니다. */}
        <DetailContentBox>
          {post.details.map((item, index) => (
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