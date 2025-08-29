// 이 컴포넌트는 게시물 상세 페이지의 우측 사이드바에 위치할 '모금함 기부현황' 정보를 표시하는 카드이다.
// DonationStatusCard.jsx

import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  border: 1px solid #e0e0e0; /* 연한 회색 테두리 추가 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 25px;
  margin-top: 30px; /* 상단 요약 정보와의 간격 */

  @media (max-width: 1024px) {
    padding: 20px; /* 태블릿 크기에서 패딩 줄이기 */
  }
`;

const CardTitle = styled.h3`
  font-size: 1.3em;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--text-color);
  text-align: center; /* 제목 중앙 정렬 */
`;

const StatusItem = styled.div`
  display: flex;
  justify-content: space-between; /* 항목명과 금액 양 끝 정렬 */
  align-items: baseline; /* 텍스트 기준선 정렬 */
  padding: 10px 0;
  border-top: 1px dashed var(--light-gray); /* 점선 구분선 */

  &:first-of-type {
    border-top: none; /* 첫 번째 항목은 상단 선 없음 */
  }
`;

const ItemLabel = styled.span`
  font-size: 0.95em;
  color: var(--secondary-color);
  display: flex; /* 아이콘과 텍스트 정렬을 위해 */
  align-items: center;
`;

const ItemValue = styled.span`
  font-size: 1.05em;
  font-weight: bold;
  color: var(--text-color);
`;

const TotalItemLabel = styled(ItemLabel)`
  font-weight: bold;
  font-size: 1.05em;
  color: var(--primary-color);
`;

const TotalItemValue = styled(ItemValue)`
  font-size: 1.3em;
  color: var(--primary-color);
`;

function DonationStatusCard({ summary }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <CardContainer>
      <CardTitle>모금함 기부현황</CardTitle>

      <StatusItem>
        <TotalItemLabel>총 기부 횟수({formatAmount(summary.totalDonors)}회)</TotalItemLabel>
        <TotalItemValue>{formatAmount(summary.totalAmount)}원</TotalItemValue>
      </StatusItem>

      <StatusItem>
        <ItemLabel>직접기부 횟수({formatAmount(summary.directDonors)}회)</ItemLabel>
        <ItemValue>{formatAmount(summary.directAmount)}원</ItemValue>
      </StatusItem>

      <StatusItem>
        <ItemLabel>참여기부 횟수({formatAmount(summary.participatoryDonors)}회)</ItemLabel>
        <ItemValue>{formatAmount(summary.participatoryAmount)}원</ItemValue>
      </StatusItem>
    </CardContainer>
  );
}

export default DonationStatusCard;