import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import api from "../apis/api";

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
  z-index: 9999;
  padding: 16px;
  overflow: hidden;
`;

// 모달 컨테이너: 실제 모달 내용이 들어가는 박스
const ModalContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  padding: 0;
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 32px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  animation: modalSlideUp 0.3s ease-out;

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
    max-width: calc(100vw - 32px);
    max-height: calc(100vh - 32px);
  }
`;

// 모달 헤더
const ModalHeader = styled.div`
  padding: 20px 20px 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  flex-shrink: 0;
  text-align: center;
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
  margin: 0;
  letter-spacing: -0.5px;
`;

// 모달 본문
const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
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
  border: 2px solid ${(props) => (props.$selected ? "#4CAF50" : "#e0e0e0")};
  background-color: ${(props) => (props.$selected ? "#e8f5e9" : "white")};
  color: ${(props) => (props.$selected ? "#4CAF50" : "#666")};
  border-radius: 8px;
  font-size: 0.85em;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    border-color: #4CAF50;
    background-color: #e8f5e9;
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
    border-color: #4CAF50;
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

const ErrorMessage = styled.div`
  color: #ff4757;
  font-size: 0.8em;
  margin-top: 4px;
  font-weight: 500;
`;

// 모달 푸터
const ModalFooter = styled.div`
  padding: 16px 20px 20px 20px;
  background-color: white;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

const AddPointButton = styled.button`
  width: 100%;
  padding: 14px;
  background: ${(props) =>
    props.disabled
      ? "linear-gradient(135deg, #ccc 0%, #bbb 100%)"
      : "linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)"};
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1em;
  font-weight: 700;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  letter-spacing: -0.3px;
  box-shadow: ${(props) =>
    props.disabled ? "none" : "0 4px 15px rgba(76, 175, 80, 0.3)"};

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) =>
      props.disabled ? "none" : "0 6px 20px rgba(76, 175, 80, 0.4)"};
  }

  &:active {
    transform: ${(props) => (props.disabled ? "none" : "translateY(0)")};
  }
`;

// 포인트 추가 완료 메시지 컨테이너
const ThankYouMessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
  padding: 40px 20px;
`;

const ThankYouText = styled.p`
  font-size: 1.8em;
  font-weight: 700;
  color: #4caf50;
  margin-bottom: 10px;
  line-height: 1.3;
`;

const ThankYouSubText = styled.p`
  font-size: 1.1em;
  color: #666;
  line-height: 1.5;
`;

function AddPointModal({ isOpen, onClose, onPointAdded }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showThankYouMessage, setShowThankYouMessage] = useState(false);
  const [addedPoints, setAddedPoints] = useState(0); // 추가된 포인트를 저장할 상태 추가

  const mouseDownTargetRef = useRef(null);
  const scrollYRef = useRef(0);

  const presetAmounts = [1000, 5000, 10000, 30000, 50000, 100000];

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

    // 최소 충전 금액 유효성 검사
    if (!currentAmount || currentAmount < 100) { // 최소 금액을 100포인트로 설정
      newErrors.amount = "최소 충전 금액은 100P입니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetFormState = () => {
    setSelectedAmount(null);
    setCustomAmount("");
    setErrors({});
    setLoading(false);
    setShowThankYouMessage(false);
    setAddedPoints(0);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const pointsToAdd = getCurrentAmount();
    const requestBody = {
      points: pointsToAdd
    };

    try {
      const response = await api.post('/user/point', requestBody);
      console.log('포인트 추가 성공:', response.data);
      setAddedPoints(pointsToAdd); // 추가된 포인트 저장
      setShowThankYouMessage(true);
      if (onPointAdded) {
        onPointAdded();
      }
    } catch (err) {
      console.error('포인트 추가 실패:', err);
      // alert는 사용하지 않고, 모달 내부에 에러 메시지를 표시하거나 콘솔에 로그만 남깁니다.
      setErrors({ ...errors, api: "포인트 추가에 실패했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
        // 모달이 열릴 때 상태 초기화
        resetFormState();

        scrollYRef.current = window.scrollY;
        document.body.style.setProperty("overflow", "hidden", "important");
        document.body.style.setProperty("position", "fixed", "important");
        document.body.style.setProperty("width", "100%", "important");
        document.body.style.setProperty("top", `-${scrollYRef.current}px`, "important");
        document.documentElement.style.setProperty("overflow", "hidden", "important");
    } else {
        document.body.style.setProperty("overflow", "", "important");
        document.body.style.setProperty("position", "", "important");
        document.body.style.setProperty("width", "", "important");
        document.body.style.setProperty("top", "", "important");
        document.documentElement.style.setProperty("overflow", "", "important");
        window.scrollTo(0, scrollYRef.current);
    }
    return () => {
        document.body.style.setProperty("overflow", "", "important");
        document.body.style.setProperty("position", "", "important");
        document.body.style.setProperty("width", "", "important");
        document.body.style.setProperty("top", "", "important");
        document.documentElement.style.setProperty("overflow", "", "important");
        window.scrollTo(0, scrollYRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (mouseDownTargetRef.current === e.target && e.target === e.currentTarget) {
      onClose();
    //   resetFormState();
    }
    mouseDownTargetRef.current = null;
  };
  
  const handleOverlayMouseDown = (e) => {
    mouseDownTargetRef.current = e.target;
  };

  return (
    <ModalOverlay
      onMouseDown={handleOverlayMouseDown}
      onMouseUp={handleOverlayClick}
    >
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <CloseButton
            onClick={() => {
              onClose();
            //   resetFormState();
            }}
          >
            ×
          </CloseButton>
          <ModalTitle>포인트 추가하기</ModalTitle>
        </ModalHeader>

        <ModalBody>
          {showThankYouMessage ? (
            <ThankYouMessageContainer>
              {/* <ThankYouText>포인트 추가가 완료되었습니다! ^^</ThankYouText> */}
              <ThankYouText>{formatAmount(addedPoints)} P가 추가되었습니다! ^^</ThankYouText>
              <ThankYouSubText>
                총 기부 금액 옆의 내역이 갱신됩니다.
              </ThankYouSubText>
            </ThankYouMessageContainer>
          ) : (
            <>
              <Section>
                <SectionTitle>추가할 포인트 금액</SectionTitle>
                <AmountButtons>
                  {presetAmounts.map((amount) => (
                    <AmountButton
                      key={amount}
                      $selected={selectedAmount === amount}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      {formatAmount(amount)} P
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
                  <CurrencyLabel>P</CurrencyLabel>
                </CustomAmountContainer>
                {errors.amount && <ErrorMessage>{errors.amount}</ErrorMessage>}
                {errors.api && <ErrorMessage>{errors.api}</ErrorMessage>}
              </Section>
            </>
          )}
        </ModalBody>

        {!showThankYouMessage && (
          <ModalFooter>
            <AddPointButton
              disabled={!getCurrentAmount() || loading}
              onClick={handleSubmit}
            >
              {loading
                ? "추가하는 중..."
                : getCurrentAmount()
                ? `${formatAmount(getCurrentAmount())} P 추가하기`
                : "포인트 추가하기"}
            </AddPointButton>
          </ModalFooter>
        )}
      </ModalContainer>
    </ModalOverlay>
  );
}

export default AddPointModal;
