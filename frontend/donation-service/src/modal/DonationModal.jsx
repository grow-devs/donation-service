import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import api from "../apis/api";
// Snackbar 및 Alert 관련 import 제거 (더 이상 사용하지 않음)
// import { Snackbar } from "@mui/material";
// import MuiAlert from '@mui/material/Alert';
// import api from "../apis/api"; // api import 제거 (외부 의존성)

// Alert 컴포넌트 정의 (더 이상 사용하지 않으므로 주석 처리하거나 제거 가능)
// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });

// 모달 오버레이: 전체 화면을 덮고, 스크롤바가 생기지 않도록 hidden 처리
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* AppBar보다 높게 설정 */
  padding: 16px; /* 모달 컨테이너가 화면 가장자리에 붙지 않도록 여백 제공 */
  overflow: hidden; /* 오버레이 자체에 스크롤바가 생기지 않도록 숨김 */
`;

// 모달 컨테이너: 실제 모달 내용이 들어가는 박스
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 0; /* 내부 콘텐츠가 padding을 가질 것이므로 컨테이너 자체는 0 */
  width: 100%;
  max-width: 420px; /* 가로 크기 제한 */

  /* 중요: flexbox를 사용하여 Header, Body, Footer를 세로로 배치 */
  display: flex;
  flex-direction: column;

  /* ModalOverlay의 padding을 고려하여 ModalContainer가 화면을 벗어나지 않도록 최대 높이 설정 */
  /* 100vh (뷰포트 높이) - 16px (상단 패딩) - 16px (하단 패딩) = calc(100vh - 32px) */
  max-height: calc(100vh - 32px);

  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideUp 0.3s ease-out;

  /* 커스텀 스크롤바 (ModalBody에 적용될 스크롤바의 스타일) */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }

  @keyframes modalSlideUp {
    from {
      opacity: 0;
      transform: translateY(40px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (max-width: 768px) {
    max-width: calc(100vw - 32px); /* 모바일에서 좌우 여백 확보 */
    max-height: calc(100vh - 32px); /* 모바일에서도 Overlay padding만 고려 */
  }
`;

// 모달 헤더: 프로젝트 정보 및 닫기 버튼 포함
const ModalHeader = styled.div`
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  flex-shrink: 0; /* 내용이 많아도 줄어들지 않도록 고정 */
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
    color: #666;
    transform: scale(1.1);
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.4em;
  font-weight: 700;
  color: #333;
  margin: 0 0 16px 0;
  text-align: center;
  letter-spacing: -0.5px;
`;

const ProjectInfo = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 10px;
  border: 1px solid #e9ecef;
`;

const ProjectTitle = styled.h3`
  font-size: 1em;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  word-break: keep-all;
  line-height: 1.4;
`;

const ProjectProgress = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85em;
  color: #666;
  font-weight: 700;
`;

// 모달 본문: 스크롤 가능한 콘텐츠 영역
const ModalBody = styled.div`
  padding: 0px 20px 10px 20px;
  overflow-y: auto; /* 이 영역만 스크롤 가능하도록 설정 */
  flex-grow: 1; /* 남은 세로 공간을 모두 차지하도록 확장 */
  /* ModalContainer에 커스텀 스크롤바 스타일이 정의되어 있으므로 여기서는 추가할 필요 없음 */
`;

const Section = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.h4`
  font-size: 1em;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
  letter-spacing: -0.3px;
`;

const AmountButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 15px;
`;

const AmountButton = styled.button`
  padding: 10px 6px;
  border: 2px solid ${(props) => (props.$selected ? "#FF69B4" : "#e0e0e0")};
  background-color: ${(props) => (props.$selected ? "#fff0f8" : "white")};
  color: ${(props) => (props.$selected ? "#FF69B4" : "#666")};
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: #ff69b4;
    background-color: #fff0f8;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CustomAmountContainer = styled.div`
  position: relative;
`;

const AmountInput = styled.input`
  width: 100%;
  padding: 16px 50px 16px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
  outline: none;

  &:focus {
    border-color: #ff69b4;
  }

  &::placeholder {
    color: #999;
    font-weight: normal;
  }
`;

const CurrencyLabel = styled.span`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  font-weight: 600;
`;

// DonorInfo, InputField 등 기부자 정보 관련 스타일은 주석 처리된 채 유지됩니다.
// const DonorInfo = styled.div`...`;
// const InputField = styled.input`...`;

const TextAreaField = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95em;
  outline: none;
  resize: vertical;
  min-height: 70px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: #ff69b4;
    box-shadow: 0 0 0 3px rgba(255, 105, 180, 0.1);
  }

  &::placeholder {
    color: #999;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 20px;
`;

const Checkbox = styled.input`
  margin-top: 2px;
  cursor: pointer;
  transform: scale(1.1);
`;

const CheckboxLabel = styled.label`
  font-size: 0.85em;
  color: #666;
  line-height: 1.4;
  cursor: pointer;

  a {
    color: #ff69b4;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 0.8em;
  margin-top: 4px;
  font-weight: 500;
`;

// 모달 푸터: "기부하기" 버튼을 고정 배치
const ModalFooter = styled.div`
  padding: 16px 20px 20px 20px; /* 버튼 주변 여백 */
  background-color: white; /* 푸터 배경색 */
  border-top: 1px solid #f0f0f0; /* 상단 구분선 */
  flex-shrink: 0; /* 내용이 많아도 줄어들지 않도록 고정 */
  border-bottom-left-radius: 20px; /* 모달 하단 라운드 유지 */
  border-bottom-right-radius: 20px;
`;

const DonateButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #ccc 0%, #bbb 100%)"
      : "linear-gradient(135deg, #FF69B4 0%, #e55a9b 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  letter-spacing: -0.3px;
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 4px 15px rgba(255, 105, 180, 0.3)"};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 6px 20px rgba(255, 105, 180, 0.4)"};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }
`;

// 새로운 스타일: 기부 완료 메시지 컨테이너
const ThankYouMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* ModalBody의 남은 공간을 채우도록 */
  text-align: center;
  padding: 0px 0px;
`;

// 새로운 스타일: 기부 완료 메시지 텍스트
const ThankYouText = styled.p`
  font-size: 1.6em;
  font-weight: 700;
  color: #ff69b4; /* 핑크색 강조 */
  margin-bottom: 10px;
  line-height: 0.1;
`;

// 새로운 스타일: 기부 완료 서브 메시지 텍스트
const ThankYouSubText = styled.p`
  font-size: 1.1em;
  color: #666;
  line-height: 1.5;
`;

function DonationModal({ isOpen, onClose, post }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [message, setMessage] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  // 기부 완료 메시지 표시 여부 상태 추가
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);

  // useRef 훅을 사용하여 onMouseDown 이벤트가 시작된 요소를 추적합니다.
  const mouseDownTargetRef = useRef(null);
  // Ref to store the scroll position when the modal opens
  const scrollYRef = useRef(0);

  const presetAmounts = [10000, 30000, 50000, 100000, 300000, 500000];

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setErrors({ ...errors, amount: null });
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(value);
    setSelectedAmount(null);
    setErrors({ ...errors, amount: null });
  };

  const getCurrentAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount);
    return 0;
  };

  const validateForm = () => {
    const newErrors = {};

    const currentAmount = getCurrentAmount();
    // 최소 기부 금액 유효성 검사
    if (!currentAmount || currentAmount < 1000) {
      newErrors.amount = "최소 기부 금액은 1,000원입니다.";
    }

    // 약관 동의 필수 조건
    if (!agreeTerms) {
      newErrors.terms = "개인정보 처리방침에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormState = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    setMessage("");
    setAgreeTerms(false); // 약관 동의 초기화
    setErrors({});
    setShowThankYouMessage(false); // 메시지 상태도 초기화
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // 유효성 검사 실패 시, 에러 메시지 표시 (Snackbar 대신 기존 ErrorMessage 사용)
      // 예를 들어, 약관 동의가 안 되어 있다면 errors.terms가 표시될 것임
      return;
    }

    const donationData = {
      postId: post.id,
      points: getCurrentAmount(),
      message: message.trim(),
    };

    console.log("기부 데이터:", donationData);

    try {
      console.log("API 호출 시도 중...");
      // 실제 API 호출 (api import가 없으므로 임시로 주석 처리하고 성공 응답 가정)
      const res = await api.post("/donation", donationData);
      //   const res = { status: 200, data: { message: "기부 성공!" } }; // 임시 성공 응답 가정

      if (res.status === 201 || res.status === 200) {
        setShowThankYouMessage(true); // 성공 메시지 표시
        setErrorMessage(null);
      } else {
        // API 호출 실패 시 (서버 응답이 200/201이 아닐 경우)
        // 에러 메시지 표시 (필요하다면 모달 내부에 표시 로직 추가)
        console.error(
          "기부하기에 실패했습니다:",
          res.data?.message || "알 수 없는 오류"
        );
        alert(
          "기부하기에 실패했습니다:",
          res.data?.message || "알 수 없는 오류"
        );
      }
    } catch (err) {
      // 네트워크 오류 등 예외 발생 시
      // 에러 메시지 표시 (필요하다면 모달 내부에 표시 로직 추가)
      const msg =
        err.response?.data?.message || "기부 요청 중 오류가 발생했습니다.";
      if (msg.includes("포인트가 부족")) {
        setErrorMessage(
          "💡 보유 포인트가 부족합니다. 충전 후 다시 시도해주세요."
        );
      } else {
        setErrorMessage(msg);
      }

      //백엔드에서 받은 응답 본문에서 에러 메시지 띄우기
      // alert(err.response.data.message);
    }
    // alert("기부가 완료되었습니다! 감사합니다."); // alert 제거
  };

  // 모달이 열릴 때 body 스크롤 숨기고, 닫힐 때 다시 보이게 함
  // 가장 강력한 CSS 우선순위와 모바일 대응을 포함합니다.
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY; // 현재 스크롤 위치 저장
      document.body.style.setProperty("overflow", "hidden", "important");
      document.body.style.setProperty("position", "fixed", "important");
      document.body.style.setProperty("width", "100%", "important");
      document.body.style.setProperty(
        "top",
        `-${scrollYRef.current}px`,
        "important"
      ); // 저장된 스크롤 위치 사용
      document.documentElement.style.setProperty(
        "overflow",
        "hidden",
        "important"
      ); // html 태그 스크롤도 숨김
    } else {
      // 모달 닫을 때 원래 스타일로 복원
      document.body.style.setProperty("overflow", "", "important");
      document.body.style.setProperty("position", "", "important");
      document.body.style.setProperty("width", "", "important");
      document.body.style.setProperty("top", "", "important");
      document.documentElement.style.setProperty("overflow", "", "important");
      window.scrollTo(0, scrollYRef.current); // 저장된 스크롤 위치로 복원
    }
    // 컴포넌트 언마운트 시 또는 isOpen이 변경되기 전에 cleanup
    return () => {
      document.body.style.setProperty("overflow", "", "important");
      document.body.style.setProperty("position", "", "important");
      document.body.style.setProperty("width", "", "important");
      document.body.style.setProperty("top", "", "important");
      document.documentElement.style.setProperty("overflow", "", "important");
      window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]); // isOpen이 변경될 때마다 실행

  if (!isOpen) return null;

  // ModalOverlay에 onMouseDown 이벤트 핸들러 추가
  const handleOverlayMouseDown = (e) => {
    // 마우스 누름이 시작된 요소를 저장합니다.
    mouseDownTargetRef.current = e.target;
  };

  // ModalOverlay에 onMouseUp 이벤트 핸들러 추가
  const handleOverlayMouseUp = (e) => {
    // 마우스 누름이 오버레이 자체에서 시작했고, 마우스 떼는 것도 오버레이 자체에서 일어났을 때만 모달을 닫습니다.
    // 이는 모달 내부에서 드래그를 시작하여 모달 밖에서 놓는 경우를 방지합니다.
    if (
      mouseDownTargetRef.current === e.target &&
      e.target === e.currentTarget
    ) {
      onClose();
      resetFormState();
    }
    // 참조를 초기화합니다.
    mouseDownTargetRef.current = null;
  };

  return (
    <ModalOverlay
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayMouseUp}
    >
      {" "}
      {/* 모달 컨테이너 내부 클릭은 이벤트 전파를 막아 모달이 닫히지 않도록 합니다. */}
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CloseButton
            onClick={() => {
              onClose();
              resetFormState();
            }}
          >
            ×
          </CloseButton>{" "}
          {/* 닫기 버튼 클릭 시 상태 초기화 추가 */}
          <ModalTitle>기부하기</ModalTitle>
          <ProjectInfo>
            <ProjectTitle>{post?.title}</ProjectTitle>
            <ProjectProgress>
              <span>현재 {formatAmount(post?.currentAmount || 0)}원</span>
              <span>목표 {formatAmount(post?.targetAmount || 0)}원</span>
            </ProjectProgress>
          </ProjectInfo>
        </ModalHeader>

        <ModalBody>
          {showThankYouMessage ? (
            <ThankYouMessageContainer>
              <ThankYouText>소중한 기부 감사합니다! ^^</ThankYouText>
              <ThankYouSubText>
                따뜻한 마음이 잘 전달되었습니다.
              </ThankYouSubText>
            </ThankYouMessageContainer>
          ) : (
            <>
              <Section>
                <SectionTitle>기부 금액</SectionTitle>
                <AmountButtons>
                  {presetAmounts.map((amount) => (
                    <AmountButton
                      key={amount}
                      $selected={selectedAmount === amount}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      {formatAmount(amount)}원
                    </AmountButton>
                  ))}
                </AmountButtons>
                <CustomAmountContainer>
                  <AmountInput
                    type="text"
                    placeholder="직접 입력"
                    value={
                      customAmount ? formatAmount(parseInt(customAmount)) : ""
                    }
                    onChange={handleCustomAmountChange}
                  />
                  <CurrencyLabel>원</CurrencyLabel>
                </CustomAmountContainer>
                {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
              </Section>

              <Section>
                {/* "응원 메시지 (선택사항)" 제목을 "응원 메세지를 보내주세요!"로 변경 */}
                <SectionTitle>응원 메세지를 보내주세요!</SectionTitle>
                {/* 기부자 정보 필드 (DonorInfo)는 주석 처리된 채 유지됩니다. */}
                {/*
                <DonorInfo>
                  <div>
                    <InputField
                      type="text"
                      placeholder="기부자명 (선택사항)"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                    />
                    {errors.donorName && (
                      <ErrorMessage>{errors.donorName}</ErrorMessage>
                    )}
                  </div>
                  <div>
                    <InputField
                      type="tel"
                      placeholder="연락처 (선택사항)"
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                    />
                    {errors.donorPhone && (
                      <ErrorMessage>{errors.donorPhone}</ErrorMessage>
                    )}
                  </div>
                </DonorInfo>
                */}
                <TextAreaField
                  placeholder="메시지를 입력해주세요." // 플레이스홀더 텍스트 변경
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </Section>

              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <CheckboxLabel htmlFor="agreeTerms">
                  <a href="#" target="_blank">
                    개인정보 처리방침
                  </a>{" "}
                  및
                  <a href="#" target="_blank">
                    {" "}
                    서비스 이용약관
                  </a>
                  에 동의합니다. (필수)
                  {errors.terms && <ErrorMessage>{errors.terms}</ErrorMessage>}
                </CheckboxLabel>
              </CheckboxContainer>
            </>
          )}
        </ModalBody>
        {errorMessage && (
          <div
            style={{
              backgroundColor: "#fff4f4", // 좀 더 은은한 붉은 배경
              color: "#b71c1c", // 진한 레드 계열 텍스트
              padding: "6px 0px",
              borderRadius: "8px",
              marginTop: "0px",
              fontSize: "0.80rem", // 글씨 크기 축소
              fontWeight: 400, // 보통 두께
              textAlign: "center",
              border: "1px solid #f5c2c7", // 부드러운 테두리
              lineHeight: 1.2,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* "기부하기" 버튼을 ModalFooter로 감싸서 고정 배치 */}
        {/* 기부 완료 메시지 표시 중에는 버튼을 숨깁니다. */}
        {!showThankYouMessage && (
          <ModalFooter>
            <DonateButton
              // 기부 금액과 약관 동의만 필수 조건으로 변경
              disabled={
                !getCurrentAmount() || !agreeTerms
              } /* agreeTerms 조건 추가 */
              onClick={handleSubmit}
            >
              {getCurrentAmount()
                ? `${formatAmount(getCurrentAmount())}원 기부하기`
                : "기부하기"}
            </DonateButton>
          </ModalFooter>
        )}
      </ModalContainer>
      {/* Snackbar 컴포넌트 제거 (더 이상 사용하지 않음) */}
    </ModalOverlay>
  );
}

export default DonationModal;
