// 이 컴포넌트는 게시물 상세 페이지의 우측 1/3 영역 전체를 구성하는 핵심 컴포넌트이다. 하단에 DonationStatusCard 컴포넌트를 포함한다.
// FundraisingSummary.jsx

import React,{ useState, useEffect } from "react";
import styled from "styled-components";
import DonationStatusCard from "./DonationStatusCard"; // DonationStatusCard 컴포넌트 임포트
import DonationModal from '../../../modal/DonationModal';
import { FaHeart } from "react-icons/fa";
import useAuthStore from "../../../store/authStore";
import LoginForm from "../../../modal/LoginForm";
import api from "../../../apis/api";
import FloatingAuthModal from "../../../modal/FloatingAuthModal";

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
  font-size: 1.6em;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: 10px;
`;

const ProgressContainer = styled.div`
  width: 100%;
  background-color: #e0e0e0;
  border-radius: 10px;
  height: 10px;
  overflow: hidden; /* 프로그레스 바가 튀어나오지 않도록 */
  margin-bottom: 10px;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${(props) =>
    `${Math.min(
      100,
      props.$progress
    )}%`}; /* 달성률에 따라 너비 조절, 100% 초과 방지 */
  background-color: #fc7979; /* 바의 진행 색상 */
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
  width: 90%;
  padding: 15px 20px;
  background-color: var; /* 카카오톡 노란색 */
  color: #3c1e1e; /* 카카오톡 버튼 텍스트 색상 */
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
  display: block;       /* block 요소로 */
  margin: 0 auto;       /* 좌우 auto → 가운데 정렬 */

  &:hover {
    background-color: #5c595935; /* 호버 시 약간 어둡게 */
  }
`;

const LikeButton = styled.button`
  width: 90%;
  padding: 15px 20px;
  display: flex;       /* block 요소로 */
  margin: 0 auto;       /* 좌우 auto → 가운데 정렬 */
  margin-top: 15px; /* '응원하고 기부하기' 버튼과의 간격 */
  background-color: #e0e0e0; /* 기본 회색 배경 */
  color: #555; /* 기본 텍스트 색상 */
  border: none;
  border-radius: 10px;
  font-size: 1.1em;
  font-weight: bold;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  gap: 10px; /* 아이콘과 텍스트 사이 간격 */
  transition: background-color 0.2s ease, color 0.2s ease;

  &.liked {
    background-color: #ff69b4; /* 좋아요 눌렀을 때 핑크색 */
    color: white; /* 좋아요 눌렀을 때 텍스트 색상 */
  }

  &:hover:not(.liked) {
    background-color: #d0d0d0; /* 호버 시 약간 어둡게 */
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;


function FundraisingSummary({ summary, post }) {
  const [isModalOpen, setIsModalOpen] = useState(false); // 기부 모달 상태 관리
  // ✨ 로그인 모달 상태 관리
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 
  // const formatAmount = (amount) => {
  //   return new Intl.NumberFormat('ko-KR').format(amount);
  // };
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [isLiked, setIsLiked] = useState(false); // 사용자가 현재 게시글을 좋아요했는지 여부 (백엔드에서 가져오거나, 초기 로드 시 확인 필요)
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  // 컴포넌트 마운트 시 또는 post prop 변경 시 좋아요 상태를 확인
  useEffect(() => {
    if (post && post.id && isLoggedIn) {
      setLikesCount(post.likesCount || 0); // 초기 좋아요 수는 post prop에서 가져옵니다.

      const checkUserLikeStatus = async () => {
        try {
          // 백엔드의 GET /api/post-like/check/{postId} 엔드포인트 호출
          // api.js의 baseURL에 /api가 있으므로, 여기서는 /post-like/check/{postId}만 사용
          const response = await api.get(`/post-like/check/${post.id}`);
          // 백엔드에서 `data: isLiked` 형태로 boolean 값을 바로 반환하므로, response.data.data로 접근합니다.
          setIsLiked(response.data.data); // isLiked 값을 true/false로 설정합니다.
        } catch (error) {
          console.error("좋아요 상태 확인 중 에러:", error);
          // 에러 발생 시 (예: 게시물/사용자 없음, 네트워크 오류 등)
          // 기본적으로 좋아요를 누르지 않은 상태로 처리하거나, 필요에 따라 사용자에게 알림
          setIsLiked(false);
        }
      };
      checkUserLikeStatus();
    }
  }, [post, isLoggedIn]); // post 객체가 변경될 때마다 다시 실행


  const formatAmount = (amount) => {
    // 금액이 유효한 숫자인 경우에만 포맷팅
    if (typeof amount === "number") {
      return new Intl.NumberFormat("ko-KR").format(amount);
    }
    return "0"; // 금액이 유효하지 않으면 '0' 또는 'N/A' 등으로 표시
  };

  // ✨ 현재 금액과 목표 금액을 사용하여 진행률 계산
  const currentAmount = post?.currentAmount || 0; // post가 undefined일 경우를 대비하여 기본값 0
  const targetAmount = post?.targetAmount || 0; // post가 undefined일 경우를 대비하여 기본값 0

  let progress = 0;
  if (targetAmount > 0) {
    // 목표 금액이 0보다 클 경우에만 계산 (0으로 나누는 에러 방지)
    progress = (currentAmount / targetAmount) * 100;
  }
  // 진행률을 소수점 첫째 자리까지 표시
  const formattedProgress = progress.toFixed(1);

  // 모달 열기 함수
  const handleDonateClick = () => {
        // 로그인 상태 확인
    if (!isLoggedIn) {
      setIsLoginModalOpen(true); // FloatingAuthModal 모달 열기
      return; // 로그인하지 않았으면 여기서 함수 실행을 멈춤
    }
    setIsModalOpen(true);
  };

  // 모달 닫기 함수
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // 로그인 모달 닫기 함수
  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLikeClick = async () => {

    // 로그인 상태 확인
    if (!isLoggedIn) {
      setIsLoginModalOpen(true); // FloatingAuthModal 모달 열기
      return; // 로그인하지 않았으면 여기서 함수 실행을 멈춤
    }

    if (isLiked) {
      alert("이미 좋아요를 누르셨습니다.");
      return;
    }

    try {
      // api.js의 인스턴스를 사용하여 POST 요청
      const response = await api.post(`/post-like/${post.id}`);

      // 응답 객체는 axios 응답 스키마를 따릅니다.
      if (response.status === 200) { // HTTP 200 OK
        setLikesCount(response.data.data.currentLikesCount); // 백엔드에서 받은 새로운 좋아요 수로 업데이트
        setIsLiked(true); // 좋아요 상태를 true로 변경
        alert("게시글을 좋아요했습니다!");
      }
    } catch (error) {
      // 에러 응답 처리
      if (error.response) {
        // 서버가 응답을 했고, 상태 코드가 2xx 범위 밖일 때
        const errorResult = error.response.data;
        if (errorResult.message === "POST_LIKE_ALREADY_EXISTS") {
            alert("이미 이 게시글에 좋아요를 누르셨습니다.");
            setIsLiked(true); // 혹시 모를 상황에 대비하여 isLiked를 true로 강제 설정
        } else {
            alert(`좋아요 처리 중 오류 발생: ${errorResult.message || '알 수 없는 오류'}`);
        }
      } else if (error.request) {
        // 요청이 전송되었지만 응답을 받지 못했을 때 (네트워크 오류 등)
        alert("네트워크 오류: 서버에 연결할 수 없습니다.");
      } else {
        // 요청 설정 중 오류 발생
        console.error("좋아요 API 호출 중 에러:", error.message);
        alert("좋아요 처리 중 예상치 못한 오류가 발생했습니다.");
      }
    }
  };

  return (
    <>
      <SummaryContainer>
        <FundraisingTitle>{post.title}</FundraisingTitle>

        <DetailRow>
          <span>목표 모금액</span>
          {/* <span>{formatAmount(post.goalAmount)}원</span> */}
          <span>{formatAmount(targetAmount)} 원</span>
        </DetailRow>
        <DetailRow>
          <span>참여자</span>
          <span>{formatAmount(post.participants)} 명</span>
        </DetailRow>

        {/* <CurrentAmount>{formatAmount(post.currentAmount)}원</CurrentAmount> */}
        <CurrentAmount>{formatAmount(currentAmount)} 원</CurrentAmount>

        <ProgressContainer>
          <ProgressBar $progress={progress} />
        </ProgressContainer>
        <ProgressText>{formattedProgress}% 달성</ProgressText>

        <DonateButton
          onClick={handleDonateClick}
        >
          응원하고 기부하기</DonateButton>

        {/* 좋아요 버튼 추가 */}
        <LikeButton
          onClick={handleLikeClick}
          className={isLiked ? 'liked' : ''} // 좋아요 상태에 따라 클래스 적용
          disabled={isLiked} // 이미 좋아요를 눌렀으면 버튼 비활성화
        >
          <FaHeart />
          <span>{formatAmount(likesCount)} 좋아요</span>
        </LikeButton>

        {/* 모금함 기부현황 카드 */}
        <DonationStatusCard summary={summary} />
      </SummaryContainer>

      {/* 기부 모달 */}
      <DonationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        post={post}
      />
      {/* FloatingAuthModal을 사용 */}
      <FloatingAuthModal
        open={isLoginModalOpen}
        onClose={handleLoginModalClose}
      />
    </>
  );
}

export default FundraisingSummary;