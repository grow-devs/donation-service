// '기부현황' 탭을 선택했을 때 보여질 기부 목록을 담당
// DonationListTabContent.jsx

import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import DonationCard from './DonationCard'; // DonationCard 컴포넌트 임포트
import api from '../../apis/api';

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

const LoadMoreButton = styled.button`
  width: 18%;
  padding: 8px 0;
  margin-top: 10px;
  background-color: white;
  color: black;
  border: 1px solid #adaaaa;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  transition: background-color 0.2s ease;
  display: block;
  margin-left: auto;
  margin-right: auto;
  max-width: 160px;

  &:hover:not(:disabled) {
    background-color: #dedcdc;
  }
  &:disabled {
    background-color: var(--light-gray);
    cursor: not-allowed;
  }
`;

function DonationListTabContent({ postId }) {
  const [donations, setDonations] = useState([]); // 기부 목록 상태
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호 (0부터 시작)
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 기부 데이터를 비동기적으로 가져오는 함수
  const fetchDonations = async (page) => {
    if (loading) return; // 이미 로딩 중이면 중복 호출 방지
    setLoading(true);
    try {
      const response = await api.get(`/donation/${postId}`, {
        params: {
          page: page,
          size: 10, // 백엔드의 @PageableDefault와 동일
          sort: 'createdAt,desc', // 기부 목록은 최신순으로 고정
        },
      });

      const pagedDonationResponse = response.data.data;
      const fetchedDonations = pagedDonationResponse.content;

      if (page === 0) { // 첫 페이지 로드 (탭 전환 시)
        setDonations(fetchedDonations);
      } else { // '더보기'로 다음 페이지 로드
        setDonations((prevDonations) => [...prevDonations, ...fetchedDonations]);
      }
      
      setCurrentPage(pagedDonationResponse.number + 1); // 백엔드 Page 객체의 'number'는 0부터 시작하는 현재 페이지
      setHasMore(!pagedDonationResponse.last); // 'last'가 true면 마지막 페이지

    } catch (error) {
      console.error("기부 목록 불러오기 실패:", error);
      // 에러 처리 (예: 사용자에게 메시지 표시)
    } finally {
      setLoading(false);
    }
  };

  // 컴포넌트 마운트 시 또는 postId 변경 시 초기 기부 목록 로드
  useEffect(() => {
    if (postId) {
      // 새로운 게시물 또는 탭 전환 시 기부 목록 상태를 초기화하고 첫 페이지를 로드합니다.
      setDonations([]);
      setCurrentPage(0);
      setHasMore(true);
      fetchDonations(0); // 첫 페이지 로드
    }
  }, [postId]); // postId가 변경될 때마다 재실행

  // '더보기' 버튼 클릭 시 다음 페이지의 기부 내역을 로드하는 함수
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchDonations(currentPage); // 다음 페이지를 로드
    }
  };

  if (!donations || donations.length === 0) {
    // 로딩 중이 아니고 데이터가 없을 때만 메시지 표시
    return !loading && <NoDonationMessage>아직 기부 내역이 없습니다.</NoDonationMessage>;
  }

  return (
    <ListContainer>
      {donations.map((donation) => (
        <DonationCard key={donation.id} donation={donation} />
      ))}
      {/* 로딩 인디케이터 */}
      {loading && <p style={{ textAlign: 'center', color: '#888', padding: '20px 0', width: '100%' }}>기부 내역 불러오는 중...</p>}

      {/* '더보기' 버튼 */}
      {hasMore && ( // 더 불러올 기부 내역이 있을 때만 버튼 표시
        <LoadMoreButton onClick={handleLoadMore} disabled={loading}>
          {loading ? '불러오는 중...' : '더보기'}
        </LoadMoreButton>
      )}

      {/* 더 이상 기부 내역이 없을 때 메시지 (선택 사항) */}
      {!hasMore && !loading && donations.length > 0 && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text-color)', width: '100%' }}>더 이상 기부 내역이 없습니다.</p>
      )}
    </ListContainer>
  );
}

export default DonationListTabContent;