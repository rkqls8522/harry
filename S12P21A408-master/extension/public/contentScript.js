(async () => {
  const src = chrome.runtime.getURL('main.js');
  const contentScript = await import(src);
  contentScript.main();

  // Chat UI 초기화
  const chatSrc = chrome.runtime.getURL('chatUI.js');
  const chatModule = await import(chatSrc);
  chatModule.initChatUI();

  // content script에서 메시지 처리
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'SHOW_NOTIFICATION_BADGE') {
      // 채팅 UI가 초기화된 후에 알림 표시
      if (document.readyState !== 'complete') {
        // 페이지 로드가 완료될 때까지 대기
        window.addEventListener('load', () => {
          const chatUI = chatModule.addCatIcon();
          if (chatUI && typeof chatUI.showNotificationBadge === 'function') {
            chatUI.showNotificationBadge(message.count, message.notifications);
          }
        });
      } else {
        // 이미 로드 완료된 경우
        const chatUI = chatModule.addCatIcon();
        if (chatUI && typeof chatUI.showNotificationBadge === 'function') {
          chatUI.showNotificationBadge(message.count, message.notifications);
        }
      }
    }
    return true;
  });
})();
