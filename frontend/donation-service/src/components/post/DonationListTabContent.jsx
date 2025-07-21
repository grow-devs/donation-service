// '기부현황' 탭을 선택했을 때 보여질 기부 목록을 담당
// DonationListTabContent.jsx

import React from 'react';
import styled from 'styled-components';
import DonationCard from './DonationCard'; // DonationCard 컴포넌트 임포트

const ListContainer = styled.div`
  padding: 20px 0;
  display: flex;
  flex-wrap: wrap; /* 카드가 넘치면 다음 줄로 */
  gap: 20px; /* 카드 사이의 간격 */
  justify-content: flex-start; /* 왼쪽부터 정렬 */

  @media (max-width: 768px) {
    justify-content: center; /* 모바일에서는 중앙 정렬 */
  }
`;

const NoDonationMessage = styled.p`
  text-align: center;
  color: var(--secondary-color);
  font-size: 1.1em;
  padding: 50px 0;
  width: 100%; /* 메시지가 중앙에 오도록 */
`;

function DonationListTabContent({ donations }) {
  if (!donations || donations.length === 0) {
    return <NoDonationMessage>아직 기부 내역이 없습니다.</NoDonationMessage>;
  }

  return (
    <ListContainer>
      {donations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} />
      ))}
    </ListContainer>
  );
}

export default DonationListTabContent;