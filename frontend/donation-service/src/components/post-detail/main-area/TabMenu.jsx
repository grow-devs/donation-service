// 모금소개', '기부현황' 탭 메뉴 컴포넌트입니다.
// components/Common/TabMenu.jsx

import React from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  display: flex;
  width: fit-content;
  /* border-bottom: 1px solid var(--border-color); <- 이 선은 가상 요소로 대체하거나 제거할 수 있습니다. */
  margin-top: 15px;
  justify-content: flex-start;
`;

const TabButton = styled.button`
  flex: none;
  padding: 8px 15px;
  font-size: 0.95em;
  font-weight: bold;
  color: ${props => (props.$isActive ? 'var(--text-color)' : 'var(--secondary-color)')}; /* 활성화 시 색상 조정 */
  background-color: transparent;
  cursor: pointer;
  outline: none;
  border: none; /* 기존 border-bottom 제거 */
  position: relative; /* ::after 가상 요소의 위치 기준 */
  overflow: hidden; /* 혹시 모를 오버플로우 방지 */

  /* 밑줄 스타일 */
  &::after {
    content: '';
    position: absolute;
    bottom: 0; /* 버튼 하단에 위치 */
    left: 50%; /* 중앙에서 시작 */
    transform: translateX(-50%); /* 정확히 중앙 정렬 */
    width: ${props => (props.$isActive ? '80%' : '0')}; /* 활성화 시 너비 80%, 비활성화 시 0 */
    height: 3px; /* 밑줄 두께 */
    background-color: #555; /* 어두운 회색 (거의 검정색 느낌) */
    transition: width 0.3s ease-in-out; /* 너비 변화 애니메이션 */
  }

  /* 호버 시 텍스트 색상 변경 */
  &:hover {
    color: var(--text-color);
  }
`;

function TabMenu({ activeTab, onTabChange }) {
  return (
    <TabContainer>
      <TabButton
        $isActive={activeTab === 'story'} // activeTab 값이 'story'이면 활성화
        onClick={() => onTabChange('story')}
      >
        모금소개
      </TabButton>
      <TabButton
        $isActive={activeTab === 'donation'} // activeTab 값이 'donation'이면 활성화
        onClick={() => onTabChange('donation')}
      >
        기부현황
      </TabButton>
    </TabContainer>
  );
}

export default TabMenu;