// 이 컴포넌트는 게시물 상세 페이지의 우측 1/3 영역 전체를 구성하는 핵심 컴포넌트이다. 하단에 DonationStatusCard 컴포넌트를 포함한다.
// FundraisingSummary.jsx

import React from 'react';
import styled from 'styled-components';
import DonationStatusCard from './DonationStatusCard'; // DonationStatusCard 컴포넌트 임포트

const SummaryContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 25px;
  position: sticky; /* 스크롤 시 고정되도록 */
  top: 20px; /* 상단에서 20px 아래에 고정 */

  @media (max-width: 1024px) {
    position: static; /* 태블릿 이하에서는 고정 해제 */
    margin-top: 30px; /* 메인 콘텐츠와의 간격 */
  }

  @media (max-width: 768px) {
    padding: 15px; /* 모바일에서 패딩 줄이기 */
  }
`;

const FundraisingTitle = styled.h2`
  font-size: 1.4em;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
  word-break: keep-all; /* 단어 단위로 줄바꿈 */
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-size: 0.95em;
  color: var(--secondary-color);
`;

const CurrentAmount = styled.div`
  font-size: 2.0em;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 10px;
`;

const ProgressContainer = styled.div`
  width: 100%;
  background-color: #E0E0E0;
  border-radius: 10px;
  height: 10px;
  overflow: hidden; /* 프로그레스 바가 튀어나오지 않도록 */
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => `${Math.min(100, props.$progress)}%`}; /* 달성률에 따라 너비 조절, 100% 초과 방지 */
  background-color: #FF69B4; /* 바의 진행 색상 */
  border-radius: 10px; /* 둥근 모서리 */
  transition: width 0.5s ease-in-out; /* 너비 변화 애니메이션 */
`;

const ProgressText = styled.div`
  font-size: 0.95em;
  color: var(--secondary-color);
  text-align: right; /* 달성률 텍스트 오른쪽 정렬 */
  margin-bottom: 20px; /* 아래 버튼과의 간격 */
`;

const DonateButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  background-color: var; /* 카카오톡 노란색 */
  color: #3C1E1E; /* 카카오톡 버튼 텍스트 색상 */
  border: none;
  border-radius: 10px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f7dd00; /* 호버 시 약간 어둡게 */
  }
`;


function FundraisingSummary({ summary, post }) {
  // const formatAmount = (amount) => {
  //   return new Intl.NumberFormat('ko-KR').format(amount);
  // };

  const formatAmount = (amount) => {
    // 금액이 유효한 숫자인 경우에만 포맷팅
    if (typeof amount === 'number') {
      return new Intl.NumberFormat('ko-KR').format(amount);
    }
    return '0'; // 금액이 유효하지 않으면 '0' 또는 'N/A' 등으로 표시
  };

  // ✨ 현재 금액과 목표 금액을 사용하여 진행률 계산
  const currentAmount = post?.currentAmount || 0; // post가 undefined일 경우를 대비하여 기본값 0
  const targetAmount = post?.targetAmount || 0;   // post가 undefined일 경우를 대비하여 기본값 0

  let progress = 0;
  if (targetAmount > 0) { // 목표 금액이 0보다 클 경우에만 계산 (0으로 나누는 에러 방지)
    progress = (currentAmount / targetAmount) * 100;
  }
  // 진행률을 소수점 첫째 자리까지 표시
  const formattedProgress = progress.toFixed(1);

  return (
    <SummaryContainer>
      <FundraisingTitle>{post.title}</FundraisingTitle>

      <DetailRow>
        <span>목표 모금액</span>
        {/* <span>{formatAmount(post.goalAmount)}원</span> */}
        <span>{formatAmount(targetAmount)}원</span>
      </DetailRow>
      <DetailRow>
        <span>참여자</span>
        <span>{formatAmount(post.participants)}명</span>
      </DetailRow>

      {/* <CurrentAmount>{formatAmount(post.currentAmount)}원</CurrentAmount> */}
      <CurrentAmount>{formatAmount(currentAmount)}원</CurrentAmount>

      <ProgressContainer>
        <ProgressBar $progress={post.progress} />
      </ProgressContainer>
      <ProgressText>{formattedProgress}% 달성</ProgressText>

      <DonateButton>응원하고 기부하기</DonateButton>

      {/* 모금함 기부현황 카드 */}
      <DonationStatusCard summary={summary} />
    </SummaryContainer>
  );
}

export default FundraisingSummary;