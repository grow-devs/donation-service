// GlobalStyles.js

import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset'; // styled-reset 라이브러리를 사용하여 브라우저 기본 스타일 초기화

const GlobalStyles = createGlobalStyle`
  ${reset} /* styled-reset을 이용해 모든 브라우저의 기본 스타일 초기화 */

  /* 전역 변수 (색상 팔레트 등) */
  :root {
    --primary-color: #FFC0CB; /* 예시: 카카오핑크와 유사한 색상 */
    --secondary-color: #6A6A6A; /* 회색 계열 */
    --text-color: #333333;
    --light-gray: #F5F5F5;
    --border-color: #E0E0E0;
    --kakao-yellow: #FEE500;
  }

  body {
    font-family: 'KakaoSmall', 'Apple SD Gothic Neo', 'Nanum Gothic', 'Malgun Gothic', sans-serif;
    color: var(--text-color);
    line-height: 1.5;
    background-color: #F8F8F8; /* 전체 페이지 배경색 */
    margin: 0;
    padding: 0;
    box-sizing: border-box; /* 모든 요소에 border-box 적용 */
  }

  a {
    color: inherit; /* 링크 색상 부모 요소 상속 */
    text-decoration: none; /* 링크 밑줄 제거 */
  }

  button {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    font-family: inherit; /* 폰트 상속 */
  }

  /* HTML5 display-role reset for older browsers */
  article, aside, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section {
    display: block;
  }

  ol, ul {
    list-style: none;
  }

  blockquote, q {
    quotes: none;
  }

  blockquote:before, blockquote:after,
  q:before, q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  /* 커스텀 스크롤바 (선택 사항) */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
`;

export default GlobalStyles;