// 기부 현황 탭 내에서 개별 기부 내역을 표시하는 카드 컴포넌트입니다.
// DonationCard.jsx

import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08); /* 부드러운 그림자 */
  padding: 20px;
  margin-bottom: 20px; /* 카드 간 세로 간격 */
  width: calc(50% - 10px); /* 2열 배치, flex gap 고려 */
  box-sizing: border-box; /* padding이 너비에 포함되도록 */

  @media (max-width: 768px) {
    width: 100%; /* 모바일에서는 1열로 변경 */
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
  background-color: var(--light-gray); /* 이미지가 없을 경우 대체 배경색 */
`;

const DefaultProfileImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f0f0f0; /* 기본 프로필 배경색 */
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 0.8em;
  color: var(--secondary-color);
  font-weight: bold;
`;


const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const UserId = styled.span`
  font-weight: bold;
  font-size: 1.05em;
  color: var(--text-color);
`;

const Amount = styled.span`
  font-size: 1.2em;
  font-weight: bold;
  color: var(--primary-color);
  margin-top: 5px;
`;

const Comment = styled.p`
  font-size: 0.95em;
  color: var(--secondary-color);
  margin-bottom: 10px;
  word-break: break-word; /* 긴 멘트가 넘치지 않도록 줄 바꿈 */
`;

const DateText = styled.span`
  font-size: 0.85em;
  color: #999;
  align-self: flex-end; /* 오른쪽 하단에 위치 */
`;

function DonationCard({ donation }) {
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  return (
    <CardWrapper>
      <Header>
        {donation.profileImg ? (
          <ProfileImage src={donation.profileImg} alt={`${donation.userId} 프로필`} />
        ) : (
          <DefaultProfileImage>
            {donation.userId.charAt(0)}
          </DefaultProfileImage>
        )}
        <UserInfo>
          <UserId>{donation.userId}</UserId>
          <Amount>{formatAmount(donation.amount)}원</Amount>
        </UserInfo>
      </Header>
      <Comment>{donation.comment}</Comment>
      <DateText>{donation.date}</DateText>
    </CardWrapper>
  );
}

export default DonationCard;