// dummyData.js

export const postData = {
    id: 128873,
    imageUrl: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/animal-1867160_1280.jpg', // 예시 이미지 URL
    title: '따뜻한 보살핌이 필요한 유기동물에게 행복을 선물해주세요!',
    goalAmount: 50000000, // 5천만원
    currentAmount: 13372644, // 1천3백만원
    participants: 10604,
    progress: (13372644 / 50000000) * 100, // 달성률 계산
  
    // 에디터로 작성된 글이라고 가정 (HTML 형태로 들어올 수 있음)
    storyContent: `
      <h2>안녕하세요, 사단법인 동물자유연대입니다.</h2>
      <p>차가운 길거리에서 힘겹게 살아가고 있는 유기동물들에게 따뜻한 보살핌과 사랑을 전해주세요. 이 작은 관심이 아이들에게는 큰 희망이 됩니다.</p>
      <p>저희 동물자유연대는 유기동물 구조, 치료, 입양 지원은 물론, 동물 학대 방지와 동물 복지 개선을 위한 다양한 활동을 펼치고 있습니다. 여러분의 소중한 후원금은 유기동물들의 생명과 건강을 지키는 데 사용될 것입니다.</p>
      <h3>후원금 사용 계획</h3>
      <ul>
        <li>길거리 구조 및 긴급 치료비</li>
        <li>입양센터 운영 및 보호 비용</li>
        <li>사료 및 의료 용품 구입</li>
        <li>동물 보호 캠페인 및 교육 활동</li>
      </ul>
      <p>함께 만들어가는 아름다운 세상, 여러분의 따뜻한 손길을 기다립니다. 감사합니다.</p>
    `,
  
    // 모금함 상세 정보
    details: [
      { label: '프로젝트팀', value: '사단법인 동물자유연대' },
      { label: '모금기간', value: '2025. 07. 10 ~ 2025. 10. 10' },
      { label: '사업기간', value: '2025. 10. 21 ~ 2025. 12. 31' },
      { label: '영수증 발급기관', value: '사단법인 동물자유연대' },
    ],
  };
  
  export const donationSummaryData = {
    totalDonors: 10604,
    totalAmount: 13372644,
    directDonors: 866,
    directAmount: 12330444,
    participatoryDonors: 9738,
    participatoryAmount: 1042200,
  };
  
  export const donationListData = [
    { id: 1, userId: '익명', amount: 5000, comment: '작은 힘이나마 보태요!', date: '2025.07.15', profileImg: '' },
    { id: 2, userId: '행복한시민', amount: 10000, comment: '응원합니다!', date: '2025.07.15', profileImg: 'https://cdn.pixabay.com/photo/2017/08/06/21/01/man-2594957_1280.jpg' },
    { id: 3, userId: '사랑이맘', amount: 20000, comment: '아이들이 행복하길 바라요.', date: '2025.07.14', profileImg: 'https://cdn.pixabay.com/photo/2016/11/14/17/39/girl-1824707_1280.jpg' },
    { id: 4, userId: '따뜻한마음', amount: 3000, comment: '화이팅!', date: '2025.07.14', profileImg: '' },
    { id: 5, userId: '익명', amount: 1000, comment: '힘내세요!', date: '2025.07.13', profileImg: '' },
    { id: 6, userId: '지켜줄개', amount: 50000, comment: '동물들에게 좋은 세상이 오기를!', date: '2025.07.13', profileImg: 'https://cdn.pixabay.com/photo/2020/05/17/04/45/dog-5180637_1280.jpg' },
    { id: 7, userId: '나눔천사', amount: 7000, comment: '항상 응원합니다.', date: '2025.07.12', profileImg: '' },
    { id: 8, userId: '익명', amount: 2000, comment: '조금이나마 보탭니다.', date: '2025.07.12', profileImg: '' },
    { id: 9, userId: '희망찬하루', amount: 15000, comment: '모든 생명은 소중합니다.', date: '2025.07.11', profileImg: 'https://cdn.pixabay.com/photo/2016/09/01/08/24/woman-1635396_1280.jpg' },
    { id: 10, userId: '익명', amount: 8000, comment: '고생 많으세요.', date: '2025.07.11', profileImg: '' },
    { id: 11, userId: '기부요정', amount: 10000, comment: '더 많은 아이들이 행복해지길!', date: '2025.07.10', profileImg: 'https://cdn.pixabay.com/photo/2015/09/02/13/24/girl-919048_1280.jpg' },
    { id: 12, userId: '익명', amount: 4000, comment: '응원합니다!', date: '2025.07.10', profileImg: '' },
  ];
  
  
  export const commentsData = [
    {
      id: 1,
      author: '용감한라이언',
      avatar: 'https://cdn.pixabay.com/photo/2017/07/26/17/28/korea-2542017_1280.png', // 라이언 이미지
      content: '유기동물들이 따뜻한 보금자리를 찾기를 응원합니다! 🙏',
      likes: 25,
      time: '2시간 전',
    },
    {
      id: 2,
      author: '행복한펭귄',
      avatar: 'https://cdn.pixabay.com/photo/2016/03/31/19/52/animal-1295982_1280.png', // 펭귄 이미지
      content: '좋은 일에 함께할 수 있어서 기쁩니다. 동물자유연대 화이팅!',
      likes: 18,
      time: '1일 전',
    },
    {
      id: 3,
      author: '익명',
      avatar: '', // 익명은 아바타 없음
      content: '모든 생명이 존중받는 세상이 오기를 바랍니다.',
      likes: 12,
      time: '3일 전',
    },
    {
      id: 4,
      author: '선한영향력',
      avatar: 'https://cdn.pixabay.com/photo/2020/05/17/04/45/dog-5180637_1280.jpg',
      content: '작은 금액이지만 도움이 되었으면 좋겠습니다!',
      likes: 8,
      time: '4일 전',
    },
    {
      id: 5,
      author: '김고양이',
      avatar: 'https://cdn.pixabay.com/photo/2016/11/29/05/45/cat-1867160_1280.jpg',
      content: '길고양이들도 행복할 수 있기를... 늘 응원합니다!',
      likes: 5,
      time: '1주일 전',
    },
  ];