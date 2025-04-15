console.log('해리1');

export function addCatIcon() {
  // 스타일 추가
  const styleElement = document.createElement('style');
  styleElement.textContent = `
      :root {
        --main-color: #007BE5;
        --main-light: #5AA6F0; /* 메인 컬러보다 연한 톤 */
        --main-lighter: #B8D8F8; /* 더 연한 톤 */
        --main-lightest: #E6F3FF; /* 가장 연한 톤 (핑크빛 제거) */
        --accent-color: #FFFFFF; /* 액센트 컬러 (순수 흰색) */
        --text-dark: #333333; /* 진한 텍스트 */
        --text-medium: #666666; /* 중간 텍스트 */
        --text-light: #999999; /* 연한 텍스트 */
        --border-color: #E1E8ED; /* 테두리 색상 */
        --shadow-color: rgba(0, 0, 0, 0.1); /* 그림자 색상 (중립적인 색상) */
        --bg-light: #FFFFFF; /* 순수 흰색 배경 */
        --bg-medium: #F5F5F5; /* 중간 배경색 (중립적 회색) */
        --success-color: #5ECBB0; /* 성공 컬러 */
        --alert-color: #FFCC00; /* 알림 컬러 (노란색으로 복원) */
      }
      
      #cat-extension-icon {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--main-lighter) 0%, var(--main-light) 100%);
        box-shadow: 
          0 6px 25px var(--shadow-color),
          0 0 0 6px rgba(255, 255, 255, 0.7),
          0 0 0 12px rgba(90, 166, 240, 0.3);
        z-index: 9998;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border: none;
      }

      /* 호버 상태 시 효과 강화 및 부드러운 변형 */
      #cat-extension-icon:hover {
        transform: scale(1.05);
        box-shadow: 
          0 8px 30px var(--shadow-color),
          0 0 0 8px rgba(255, 255, 255, 0.8),
          0 0 0 16px rgba(0, 123, 229, 0.25);
        background: linear-gradient(135deg, var(--main-light) 0%, var(--main-color) 100%);
      }

      #cat-extension-icon:hover img {
        filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.15));
      }

      /* 추가: 버튼 누르는 효과 */
      #cat-extension-icon:active {
        transform: scale(0.95);
        box-shadow: 
          0 4px 15px var(--shadow-color),
          0 0 0 4px rgba(255, 255, 255, 0.8),
          0 0 0 10px rgba(0, 123, 229, 0.2);
      }

      /* 내부 이미지 조정 - 부드러운 효과 추가 */
      #cat-extension-icon img {
        width: 70%;
        height: 70%;
        border-radius: 50%;
        object-fit: contain;
        padding: 0;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
        background: white;
        box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
      }
      
      /* 알림 배지 스타일 */
      .notification-badge {
        position: absolute;
        top: -8px; /* 위치 약간 조정 */
        right: -8px; /* 위치 약간 조정 */
        width: 24px;
        height: 24px;
        background-color: #FF6B6B;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        border: 2px solid white;
        box-shadow: 0 2px 5px rgba(255, 107, 107, 0.3);
        z-index: 9999; /* 아이콘보다 높은 z-index */
      }
      
      /* 알림 메시지 스타일 */
      .notification-message {
        background-color: #FFF8E6; /* 노란색 알림 배경 복원 */
        border-left: 4px solid #FFCC00;
        padding: 12px 16px;
        margin-bottom: 12px;
        border-radius: 10px;
        font-size: 13px;
        color: var(--text-dark);
        font-weight: 500;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        line-height: 1.5;
      }
      
      #cat-extension-chat {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 380px;
        height: 580px;
        background-color: var(--bg-light);
        border-radius: 18px;
        box-shadow: 0 10px 30px var(--shadow-color);
        z-index: 9999;
        display: none;
        flex-direction: column;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow: hidden;
        border: 1px solid var(--border-color);
      }
      
      #cat-extension-chat.visible {
        display: flex;
        animation: fadeIn 0.3s ease forwards;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .chat-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 20px;
        background-color: white; /* 순수 흰색 배경으로 변경 */
        border-bottom: 1px solid var(--border-color);
      }
      
      .header-title {
        font-weight: 600;
        font-size: 15px;
        color: var(--main-color);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      
      .header-title:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: var(--main-color);
      }
      
      .close-button {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: var(--text-medium);
        font-weight: 500;
        background-color: var(--bg-light);
        border: 1px solid var(--border-color);
        transition: all 0.2s ease;
      }
      
      .close-button:hover {
        background-color: var(--main-lighter);
        color: white;
        border-color: var(--main-lighter);
      }
      
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 18px;
        background-color: white; /* 순수 흰색 배경으로 변경 */
      }

      /* 채팅창 스크롤바 스타일 */
      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }
      
      .chat-messages::-webkit-scrollbar-track {
        background-color: var(--bg-medium);
        border-radius: 10px;
      }
      
      .chat-messages::-webkit-scrollbar-thumb {
        background-color: var(--main-lighter);
        border-radius: 10px;
      }
      
      .chat-messages::-webkit-scrollbar-thumb:hover {
        background-color: var(--main-light);
      }
      
      .message {
        display: flex;
        gap: 12px;
        max-width: 85%;
      }
      
      .message.user {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      /* 고양이(해리) 프로필 크기 증가 */
      .message:not(.user) .avatar {
        width: 40px; /* 기존 32px에서 크기 증가 */
        height: 40px; /* 기존 32px에서 크기 증가 */
        border-radius: 8px;
      }

      /* 고양이 아바타 이미지 조정 */
      .message:not(.user) .avatar img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        padding: 3px;
      }

      /* 사용자 메시지 아바타 숨기기 */
      .message.user .avatar {
        display: none; /* 사용자 아바타 완전히 숨기기 */
      }

      /* 사용자 메시지 레이아웃 조정 (아바타가 없으므로 간격 조정) */
      .message.user {
        gap: 0; /* 아바타가 없으므로 간격 제거 */
      }

      /* 사용자 메시지 말풍선 조정 */
      .message.user .message-content {
        margin-left: 0; /* 왼쪽 마진 제거 */
      }

      /* 메시지 컨테이너 조정 */
      .message {
        display: flex;
        gap: 12px;
        max-width: 85%;
      }

      /* 타이핑 인디케이터 위치 조정 (아바타 크기가 커졌으므로) */
      .typing-indicator {
        margin-left: 52px; /* 기존 40px에서 아바타 크기에 맞게 조정 */
      }
      
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        background-color: var(--bg-light);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid var(--border-color);
        overflow: hidden; /* 이미지가 잘리지 않도록 설정 */
      }
      
      .user .avatar {
        background-color: var(--main-light);
        color: white;
      }
      
      .message-content {
        padding: 12px 16px;
        border-radius: 16px;
        font-size: 14px;
        line-height: 1.5;
        background-color: var(--bg-light);
        color: var(--text-dark);
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
        border: 1px solid var(--border-color);
      }
      
      .user .message-content {
        background-color: var(--main-lighter); /* 더 연한 색상으로 변경 */
        color: var(--text-dark); /* 가독성을 위해 텍스트 색상 변경 */
        border: none;
        box-shadow: 0 2px 8px var(--shadow-color);
      }
      
      .chat-input {
        padding: 14px 20px 20px;
        background-color: var(--bg-light);
        border-top: 1px solid var(--border-color);
      }
      
      .input-container {
        display: flex;
        align-items: center;
        gap: 10px;
        background-color: #F5F5F5; /* 중립적인 밝은 회색 */
        border-radius: 24px;
        padding: 8px 16px;
        border: 1px solid var(--border-color);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
        transition: all 0.3s ease;
      }

      /* 포커스 시 스타일 추가 */
      .input-container:focus-within {
        border-color: var(--main-light);
        box-shadow: 0 0 0 2px rgba(0, 123, 229, 0.1);
      }
      
      .input-field {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        color: var(--text-dark);
        font-weight: 400;
        outline: none;
        resize: none;
        max-height: 120px;
        min-height: 24px;
        line-height: 1.5;
        padding: 6px 0;
        /* 포커스 테두리 숨기기 */
        outline: none;
      }
      
      /* 입력 필드 포커스 시 테두리 제거 */
      .input-field:focus {
        outline: none;
        box-shadow: none;
      }

      .input-field::placeholder {
        color: var(--text-light);
        opacity: 1;
      }
      
      .send-button {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background-color: var(--main-color);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 2px 6px var(--shadow-color);
        transition: all 0.2s ease;
      }
      
      .send-button:hover:not(:disabled) {
        transform: scale(1.05);
        background-color: var(--main-color);
      }
      
      .send-button:disabled {
        background-color: var(--text-light);
        cursor: not-allowed;
        box-shadow: none;
      }
      
      .send-icon {
        width: 18px;
        height: 18px;
        fill: white;
      }
      
      /* 타이밍 애니메이션 */
      .typing-indicator {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        margin-left: 40px;
        background-color: var(--bg-light);
        border-radius: 10px;
        width: fit-content;
      }
      
      .typing-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: var(--main-light);
        animation: typingAnimation 1.4s infinite ease-in-out;
      }
      
      .typing-dot:nth-child(1) { animation-delay: 0s; }
      .typing-dot:nth-child(2) { animation-delay: 0.2s; }
      .typing-dot:nth-child(3) { animation-delay: 0.4s; }
      
      @keyframes typingAnimation {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
      }
      
      /* 감정 아이콘 전환 애니메이션 */
      #cat-extension-icon img {
        transition: all 0.5s ease;
      }
      
      .emotion-change {
        animation: emotion-pulse 0.5s ease;
      }
      
      @keyframes emotion-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `;
  document.head.appendChild(styleElement);

  // 이미 존재하는 요소 제거
  const existingIcon = document.getElementById('cat-extension-icon');
  if (existingIcon) {
    existingIcon.remove();
  }

  const existingChat = document.getElementById('cat-extension-chat');
  if (existingChat) {
    existingChat.remove();
  }

  // 고양이 아이콘 생성
  const iconElement = document.createElement('div');
  iconElement.id = 'cat-extension-icon';

  // 이미지 로드 오류 처리를 위한 코드
  const catIcon = document.createElement('img');
  catIcon.src = chrome.runtime.getURL('icons/cat2.png');

  // 이미지 로드 오류 시 기본 이미지로 대체
  catIcon.onerror = function () {
    console.error('Cat2 image failed to load. Falling back to default cat image.');
    this.src = chrome.runtime.getURL('icons/cat.png'); // 기본 이미지로 대체

    // 로딩 실패 디버깅을 위한 정보 출력
    console.log('Available resources:', chrome.runtime.getURL(''));
  };

  catIcon.style.width = '100%'; // 크기 줄임
  catIcon.style.height = '100%'; // 크기 줄임
  catIcon.style.borderRadius = '50%';
  catIcon.style.objectFit = 'contain'; // cover 대신 contain으로 변경
  catIcon.style.padding = '8px'; // 여백 추가

  iconElement.appendChild(catIcon);

  // 웹페이지에 아이콘 추가
  document.body.appendChild(iconElement);

  // 저장된 감정 상태 복원 (즉시 실행)
  setTimeout(() => {
    try {
      chrome.storage.sync.get(['catCurrentEmotion'], (result) => {
        const savedEmotion = result.catCurrentEmotion;
        console.log('저장된 감정 상태 확인:', savedEmotion);

        if (savedEmotion) {
          const iconPath = chrome.runtime.getURL(`icons/${savedEmotion}.png`);
          console.log(`저장된 감정 아이콘 경로: ${iconPath}`);

          catIcon.src = iconPath;
          catIcon.onerror = function () {
            console.error(`감정 아이콘 로드 실패: ${savedEmotion}`);
            this.src = chrome.runtime.getURL('icons/cat.png');
          };
        }
      });
    } catch (e) {
      console.error('감정 상태 복원 오류:', e);
    }
  }, 200);

  // 채팅창 생성
  const chatElement = document.createElement('div');
  chatElement.id = 'cat-extension-chat';
  chatElement.innerHTML = `
      <div class="chat-header">
        <div class="header-title">챗봇 해리</div>
        <div class="close-button">✕</div>
      </div>
      <div class="chat-messages">
        <div class="message">
          <div class="avatar">
            <!-- 고양이 이미지 사용 -->
            <img src="${chrome.runtime.getURL('icons/cat.png')}" style="width: 100%; height: 100%; object-fit: contain; padding: 3px;">
          </div>
          <div class="message-content">
            안녕하세요! 해리예요🐱<br>무엇을 도와드릴까요?
          </div>
        </div>
      </div>
      <div class="chat-input">
        <div class="input-container">
          <textarea class="input-field" placeholder="해리에게 메시지 보내기..." rows="1"></textarea>
          <button class="send-button" disabled>
            <svg class="send-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 2L11 13"/>
              <path d="M22 2L15 22L11 13L2 9L22 2Z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

  // 입력 필드 포커스 스타일 적용
  const style = document.createElement('style');
  style.textContent = `
    #cat-extension-chat textarea:focus {
      outline: none !important;
      box-shadow: none !important;
    }
  `;
  document.head.appendChild(style);

  // 웹페이지에 채팅창 추가
  document.body.appendChild(chatElement);

  // 아이콘 클릭 이벤트
  iconElement.addEventListener('click', () => {
    iconElement.style.display = 'none';
    chatElement.classList.add('visible');

    // 배지 제거
    const badge = iconElement.querySelector('.notification-badge');
    if (badge) {
      badge.remove();

      // 알림을 확인했음을 저장
      chrome.storage.sync.set({ notificationsViewed: true }, () => {
        console.log('✅ Notifications marked as viewed');
      });

      // 알림 일정을 채팅창에 표시
      chrome.storage.sync.get(['upcomingNotifications'], (result) => {
        if (
          result.upcomingNotifications &&
          Array.isArray(result.upcomingNotifications) &&
          result.upcomingNotifications.length > 0
        ) {
          addBotMessage('곧 다가오는 일정을 <br> 알려드릴게요! 👀✨');
          // 먼저 일정 알림 메시지 추가
          result.upcomingNotifications.forEach((notification) => {
            // 날짜 형식 변환
            let expireDate = '';

            if (notification.expireTime) {
              const expireDateTime = new Date(notification.expireTime);
              const hours = expireDateTime.getHours();
              const ampm = hours < 12 ? '오전' : '오후';
              const displayHours = hours % 12 || 12; // 12시간제로 변환 (0은 12로 표시)

              expireDate =
                expireDateTime.toLocaleDateString('ko-KR', {
                  month: 'long',
                  day: 'numeric',
                }) +
                ' ' +
                ampm +
                ' ' +
                displayHours +
                '시 ' +
                String(expireDateTime.getMinutes()).padStart(2, '0') +
                '분';
            }
            // 알림 메시지 생성
            setTimeout(() => {
              // 알림 메시지 생성
              const messageText = `🗓️ 일정: ${notification.content || '새 일정이 있습니다.'}\n⏰ 시간: ${expireDate}`;
              addNotificationMessage(messageText);
            }, 500);
          });
        }
      });
    }

    // 입력 필드에 포커스
    setTimeout(() => {
      const inputField = chatElement.querySelector('.input-field');
      if (inputField) inputField.focus();
    }, 50);
  });

  // 이벤트 리스너 추가
  const closeButton = chatElement.querySelector('.close-button');
  closeButton.addEventListener('click', () => {
    chatElement.classList.remove('visible');
    iconElement.style.display = 'flex';
  });

  // 입력 필드와 전송 버튼
  const inputField = chatElement.querySelector('.input-field');
  const sendButton = chatElement.querySelector('.send-button');

  // 검은색 테두리 제거를 위한 추가 설정
  inputField.addEventListener('focus', () => {
    // 브라우저 기본 포커스 스타일 제거
    setTimeout(() => {
      inputField.style.outline = 'none';

      // -webkit-focus-ring-color 제거 (Chrome/Safari)
      if (document.querySelector('style#remove-focus-styles') === null) {
        const focusStyle = document.createElement('style');
        focusStyle.id = 'remove-focus-styles';
        focusStyle.textContent = `
          #cat-extension-chat .input-field:focus,
          #cat-extension-chat .input-field:active,
          #cat-extension-chat .input-field:focus-visible {
            outline: none !important;
            outline-width: 0 !important;
            box-shadow: none !important;
            -moz-box-shadow: none !important;
            -webkit-box-shadow: none !important;
            border-color: transparent !important;
            caret-color: #666 !important; /* 커서 색상 설정 */
          }
        `;
        document.head.appendChild(focusStyle);
      }
    }, 0);
  });

  // 입력 필드 높이 자동 조절
  inputField.addEventListener('input', () => {
    // 전송 버튼 활성화/비활성화
    sendButton.disabled = inputField.value.trim() === '';

    // 높이 초기화 후 스크롤 높이에 맞게 조정
    inputField.style.height = 'auto';
    const newHeight = Math.min(inputField.scrollHeight, 120);
    inputField.style.height = newHeight + 'px';
  });

  // 엔터 키로 전송 (Shift+Enter는 줄바꿈)
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!sendButton.disabled) {
        sendMessage();
      }
    }
  });

  // 전송 버튼 클릭
  sendButton.addEventListener('click', sendMessage);

  // 메시지 전송 함수
  function sendMessage() {
    const text = inputField.value.trim();
    if (text) {
      // 사용자 메시지 추가
      addUserMessage(text);

      // 타이핑 표시기 추가
      showTypingIndicator();

      // 현재 저장된 감정 상태 먼저 가져오기
      chrome.storage.sync.get(['catCurrentEmotion'], (currentResult) => {
        const currentEmotion = currentResult.catCurrentEmotion || 'neutral';

        // Chrome 런타임을 통해 background.js로 메시지 전송
        chrome.runtime.sendMessage(
          {
            action: 'AI_CHAT',
            text: text,
          },
          (response) => {
            // 타이핑 표시기 제거
            hideTypingIndicator();

            if (response.success) {
              // 봇 메시지 추가
              addBotMessage(response.message);

              // 감정 처리
              if (response.emotions) {
                console.log('받은 감정 데이터:', response.emotions);

                // 10점 이상인 감정 찾기 (필터와 정렬)
                const emotionsOver10 = [];
                console.log('모든 감정 데이터:', response.emotions);

                // 객체를 배열로 변환하여 10점 이상인 항목 찾기
                for (const emotion in response.emotions) {
                  const score = response.emotions[emotion];
                  console.log(`감정: ${emotion}, 점수: ${score}`);
                  if (score >= 10) {
                    emotionsOver10.push([emotion, score]);
                  }
                }

                // 점수 기준 내림차순 정렬
                emotionsOver10.sort((a, b) => b[1] - a[1]);

                console.log('10점 이상 감정:', emotionsOver10);
                console.log('현재 감정:', currentEmotion);

                // 가장 높은 점수의 감정 적용
                if (emotionsOver10.length > 0) {
                  const highestEmotion = emotionsOver10[0][0];
                  const highestScore = emotionsOver10[0][1];
                  console.log(`최고 감정: ${highestEmotion} (${highestScore}점)`);

                  let newEmotion = highestEmotion;

                  // 현재 감정과 최고 감정이 같은 경우
                  if (highestEmotion === currentEmotion && emotionsOver10.length > 1) {
                    const secondEmotion = emotionsOver10[1][0];
                    const secondScore = emotionsOver10[1][1];

                    // 두 번째 감정의 점수가 첫 번째와 같다면 변경
                    if (secondScore === highestScore) {
                      newEmotion = secondEmotion;
                      console.log(`동점 감정 발견. 감정 상태 변경: ${currentEmotion} -> ${newEmotion}`);
                    }
                  }

                  // 새로운 감정으로 변경
                  if (newEmotion !== currentEmotion) {
                    chrome.storage.sync.set({ catCurrentEmotion: newEmotion }, () => {
                      console.log(`감정 상태 변경: ${currentEmotion} -> ${newEmotion}`);

                      // 아이콘 이미지 변경
                      const catIcon = document.querySelector('#cat-extension-icon img');
                      if (catIcon) {
                        const iconPath = chrome.runtime.getURL(`icons/${newEmotion}.png`);
                        console.log(`아이콘 변경 시도: ${iconPath}`);

                        catIcon.src = iconPath;
                        catIcon.style.transition = 'all 0.3s ease';
                        catIcon.classList.add('emotion-change');

                        setTimeout(() => {
                          catIcon.classList.remove('emotion-change');
                        }, 500);

                        // 채팅창 아바타도 업데이트
                        document.querySelectorAll('.message:not(.user) .avatar img').forEach((avatar) => {
                          avatar.src = iconPath;
                          avatar.onerror = function () {
                            this.src = chrome.runtime.getURL('icons/cat.png');
                          };
                        });
                      }
                    });
                  }
                }
              }

              // 일정이 추가된 경우 추가 처리
              if (response.schedule) {
                console.log('일정 추가:', response.schedule);
              }
            } else {
              // 에러 처리
              addBotMessage(response.message || '죄송합니다, 요청을 처리하는 중에 문제가 발생했습니다.');
            }
          },
        );

        // 입력 필드 초기화
        inputField.value = '';
        inputField.style.height = 'auto';
        sendButton.disabled = true;

        // 입력 필드에 포커스 유지
        inputField.focus();
      });
    }
  }

  // 타이핑 표시기 추가
  function showTypingIndicator() {
    const messagesContainer = chatElement.querySelector('.chat-messages');

    // 이미 있는 타이핑 표시기 제거
    hideTypingIndicator();

    const indicatorElement = document.createElement('div');
    indicatorElement.className = 'typing-indicator';
    indicatorElement.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;

    indicatorElement.id = 'typing-indicator';
    messagesContainer.appendChild(indicatorElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // 타이핑 표시기 제거
  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }

  // 사용자 메시지 추가
  function addUserMessage(text) {
    const messagesContainer = chatElement.querySelector('.chat-messages');

    const messageElement = document.createElement('div');
    messageElement.className = 'message user';
    messageElement.innerHTML = `
        <div class="avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21v-2a7 7 0 0 0-14 0v2" />
          </svg>
        </div>
        <div class="message-content">${formatMessageText(text)}</div>
      `;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // 봇 메시지 추가
  function addBotMessage(text) {
    const messagesContainer = chatElement.querySelector('.chat-messages');

    chrome.storage.sync.get(['catCurrentEmotion'], (result) => {
      const currentEmotion = result.catCurrentEmotion;

      // 사용할 아이콘 경로 결정
      let iconPath;
      if (currentEmotion) {
        iconPath = chrome.runtime.getURL(`icons/${currentEmotion}.png`);
      } else {
        iconPath = chrome.runtime.getURL('icons/cat.png');
      }

      const messageElement = document.createElement('div');
      messageElement.className = 'message';
      messageElement.innerHTML = `
          <div class="avatar">
            <img src="${iconPath}" style="width: 100%; height: 100%; object-fit: contain; padding: 3px;"
                 onerror="this.src='${chrome.runtime.getURL('icons/cat.png')}'">
          </div>
          <div class="message-content">${formatMessageText(text)}</div>
        `;

      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    });
  }

  // 알림 메시지 추가
  function addNotificationMessage(text) {
    const messagesContainer = chatElement.querySelector('.chat-messages');

    const messageElement = document.createElement('div');
    messageElement.className = 'notification-message';
    messageElement.innerHTML = formatMessageText(text);

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // 텍스트 포맷팅 함수 (줄바꿈, 이모지, 링크 등 처리)
  function formatMessageText(text) {
    // 줄바꿈 처리
    let formattedText = text.replace(/\n/g, '<br>');

    // URL을 링크로 변환
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" style="color: #007BE5; text-decoration: underline;">$1</a>',
    );

    return formattedText;
  }

  // 알림 배지 표시 함수 추가
  function showNotificationBadge(count, notifications) {
    // 기존 배지 제거
    const existingBadge = iconElement.querySelector('.notification-badge');
    if (existingBadge) {
      existingBadge.remove();
    }

    // 새 배지 추가
    if (count > 0) {
      const badge = document.createElement('div');
      badge.className = 'notification-badge';
      badge.textContent = count;
      iconElement.appendChild(badge);

      // 채팅창이 열려있으면 바로 알림 메시지 표시
      if (chatElement.classList.contains('visible')) {
        notifications.forEach((notification) => {
          addNotificationMessage(`🔔 나의 일정: ${notification.message || '새로운 알림이 있습니다.'}`);
        });
      }
    }
  }

  // 알림 이벤트 리스너 추가
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'SHOW_NOTIFICATION_BADGE') {
      showNotificationBadge(message.count, message.notifications);
      return true;
    }

    // 로그인 직후 알림 표시 처리
    if (message.action === 'SHOW_NOTIFICATION_AFTER_LOGIN') {
      if (message.notifications && Array.isArray(message.notifications) && message.notifications.length > 0) {
        // 알림 배지 즉시 표시
        showNotificationBadge(message.notifications.length, message.notifications);
      }
      return true;
    }
  });

  // 감정 상태 리셋 함수 (디버깅용)
  window.resetCatEmotions = function () {
    chrome.storage.sync.remove('catCurrentEmotion', () => {
      const catIcon = document.querySelector('#cat-extension-icon img');
      if (catIcon) {
        catIcon.src = chrome.runtime.getURL('icons/cat.png');
      }

      console.log('😺 고양이 감정 상태 초기화 완료!');
    });
  };

  return { showNotificationBadge }; // 함수를 외부에서 접근할 수 있도록 반환
}

// 페이지 로드 시 아이콘 추가
export function initChatUI() {
  let chatUIInstance = null;

  window.addEventListener('load', () => {
    chatUIInstance = addCatIcon();
  });

  // 페이지가 이미 로드된 상태라면 바로 아이콘 추가
  if (document.readyState === 'complete') {
    chatUIInstance = addCatIcon();
  }

  // 접근 가능한 함수 노출
  return chatUIInstance;
}
