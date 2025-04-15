import {
  getHighlightsFromDOM,
  clearAllHighlights,
  applyAllHighlights,
  getXPathForNode,
  getIncludedXPathsBetween,
  showHighlightMenu,
  generateAllGroupedHTML,
} from './highlight.js';

export function main() {
  const savedHighlights = [];
  const existingHighlights = [];

  window.addEventListener('load', () => {
    const pageTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
    const pageImage =
      document.querySelector('meta[property="og:image"]')?.content ||
      document.querySelector('meta[name="twitter:image"]')?.content ||
      document.querySelector('img')?.src ||
      null;
    const iconLink = document.querySelector(
      'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
    );
    const pageIcon = iconLink?.href || null;

    chrome.runtime.sendMessage(
      {
        action: 'GET_PAGE_INFO_FROM_SITE',
        url: window.location.href,
        title: pageTitle,
        image: pageImage,
        icon: pageIcon,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.log('Failed to send initial page info:', chrome.runtime.lastError);
        } else {
          console.log('Page info sent successfully:', response);
        }
      },
    );
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // page info가 필요한 시점에 데이터 응답
    if (message.action === 'FETCH_PAGE_INFO') {
      const pageTitle = document.querySelector('meta[property="og:title"]')?.content || document.title;
      const pageImage =
        document.querySelector('meta[property="og:image"]')?.content ||
        document.querySelector('meta[name="twitter:image"]')?.content ||
        document.querySelector('img')?.src ||
        null;
      const iconLink = document.querySelector(
        'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]',
      );
      const pageIcon = iconLink?.href || null;

      sendResponse({
        pageInfo: {
          url: window.location.href,
          title: pageTitle,
          image: pageImage,
          icon: pageIcon,
        },
      });

      return true;
    }

    // background.js에서 서버로 부터 받은 하이라이트 데이터 처리
    if (message.action === 'LOAD_HIGHLIGHTS') {
      console.log('LOAD_HIGHLIGHTS', message);
      const highlights = message.highlights;

      // 서버로 부터 받은 하이라이트들 데이터 전처리
      highlights.forEach((highlight) => {
        const includedResults = getIncludedXPathsBetween(
          highlight.startXpath,
          highlight.startOffset,
          highlight.endXpath,
          highlight.endOffset,
        );
        console.log('includedResults', includedResults);

        if (includedResults.length === 0) return;

        const startNode = includedResults[0].currentNode;
        const endNode = includedResults[includedResults.length - 1].currentNode;

        const result = [];

        includedResults.forEach(({ currentNode, xpath, text, parentHTML }) => {
          const isStartNode = currentNode === startNode;
          const isEndNode = currentNode === endNode;

          const start = isStartNode ? highlight.startOffset : 0;
          const end = isEndNode ? highlight.endOffset : currentNode.textContent.length;

          result.push({
            id: highlight.highlightId,
            xpath,
            parentHTML: parentHTML,
            content: text,
            startOffset: start,
            endOffset: end,
            color: highlight.color, // 🎨 저장된 색상
          });
        });
        savedHighlights.push(...result);
      });

      applyAllHighlights(savedHighlights);

      sendResponse({ status: 'success' });

      return true;
    }
  });

  let lastMousePosition = { x: 0, y: 0 };
  // 마우스 클릭 위치를 추적
  document.addEventListener('mousedown', (e) => {
    lastMousePosition = { x: e.pageX, y: e.pageY };
  });

  // 순수 JS debounce 함수
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  // 선택된 텍스트를 처리하는 함수
  function handleSelection() {
    const oldSelection = window.getSelection();
    if (!oldSelection || !oldSelection.toString().trim()) {
      return;
    }

    const highlightMenu = document.getElementById('highlight-menu');

    // ✅ 메뉴가 떠 있는 동안은 모든 클릭 무시
    if (highlightMenu) return;

    // 1. 기존 하이라이트 백업
    existingHighlights.length = 0;
    existingHighlights.push(...getHighlightsFromDOM());

    // 2. <mark> 제거 → 원본 복원
    clearAllHighlights();

    // == 다시 selection 가져오기 == //
    const selection = window.getSelection();

    // 드래그한 영역이 텍스트 노드인지 확인
    const range = selection.getRangeAt(0);
    if (range.startContainer.nodeType !== Node.TEXT_NODE || range.endContainer.nodeType !== Node.TEXT_NODE) {
      savedHighlights.length = 0;
      savedHighlights.push(...existingHighlights);

      applyAllHighlights(savedHighlights);
      window.getSelection()?.removeAllRanges();
      console.log('선택한 영역이 텍스트 노드가 아닙니다.');
      return;
    }

    // 💡 메뉴 표시
    const { x, y } = lastMousePosition;
    showHighlightMenu(
      x,
      y,
      (color) => {
        const startXPath = getXPathForNode(range.startContainer);
        const endXPath = getXPathForNode(range.endContainer);
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const includedResults = getIncludedXPathsBetween(startXPath, startOffset, endXPath, endOffset);
        if (includedResults.length === 0) {
          savedHighlights.length = 0;
          savedHighlights.push(...existingHighlights);
          applyAllHighlights(savedHighlights);
          return;
        }

        const startNode = includedResults[0].currentNode;
        const endNode = includedResults[includedResults.length - 1].currentNode;

        const newHighlightId = crypto.randomUUID();
        const newHighlights = [];

        includedResults.forEach(({ currentNode, xpath, text, parentHTML }) => {
          const isStartNode = currentNode === startNode;
          const isEndNode = currentNode === endNode;

          const start = isStartNode ? startOffset : 0;
          const end = isEndNode ? endOffset : currentNode.textContent.length;

          newHighlights.push({
            id: newHighlightId,
            xpath,
            parentHTML: parentHTML,
            content: text,
            startOffset: start,
            endOffset: end,
            color, // 🎨 저장된 색상
          });
        });

        const blocks = generateAllGroupedHTML(newHighlights);

        const content = newHighlights.reduce((acc, highlight) => {
          return acc + highlight.content;
        }, '');
        const rawContent = blocks.reduce((acc, block) => {
          return acc + block.html;
        }, '');

        if (newHighlights.length !== 0) {
          chrome.runtime.sendMessage(
            {
              action: 'ADD_HIGHLIGHT',
              payload: {
                highlightId: newHighlightId,
                content: content,
                rawContent: rawContent,
                color: newHighlights[0].color,
                startXpath: newHighlights[0].xpath,
                endXpath: newHighlights[newHighlights.length - 1].xpath,
                startOffset: newHighlights[0].startOffset,
                endOffset: newHighlights[newHighlights.length - 1].endOffset,
                title: document.querySelector('meta[property="og:title"]')?.content || document.title,
                url: window.location.href,
                image:
                  document.querySelector('meta[property="og:image"]')?.content ||
                  document.querySelector('meta[name="twitter:image"]')?.content ||
                  document.querySelector('img')?.src ||
                  null,
              },
            },
            (response) => {
              if (chrome.runtime.lastError) {
                console.log('Failed to send initial page info:', chrome.runtime.lastError);
              } else {
                console.log('Highlight sent successfully:', response);
              }
            },
          );
        }

        savedHighlights.length = 0;
        savedHighlights.push(...existingHighlights, ...newHighlights);

        applyAllHighlights(savedHighlights); // 👉 color 포함해서 마킹되도록 수정 필요
        window.getSelection()?.removeAllRanges();
      },
      () => {
        // 👉 취소 시 기존 하이라이트 복원
        savedHighlights.length = 0;
        savedHighlights.push(...existingHighlights);

        applyAllHighlights(savedHighlights);
        window.getSelection()?.removeAllRanges();
      },
    );
  }

  // debounce 적용 (300ms 지연)
  const debouncedSelectionHandler = debounce(handleSelection, 300);

  // 이벤트 리스너 등록
  document.addEventListener('selectionchange', () => {
    const activeElement = document.activeElement;

    // 입력창(`input`, `textarea`, 또는 `contenteditable`)에서 발생한 이벤트는 무시
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable) {
      return; // 입력창에서는 handleSelection 호출하지 않음
    }

    // 입력창이 아닌 경우에만 handleSelection 호출
    debouncedSelectionHandler();
  });

  // 로그인 accessToken
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data.source !== 'HARY') return;

    // ACCESS_TOKEN 타입 메시지 처리
    if (event.data.type === 'ACCESS_TOKEN') {
      const token = event.data.accessToken;

      chrome.runtime.sendMessage({
        type: 'ACCESS_TOKEN',
        token,
      });
    }
    // ACCESS_TOKEN_AND_NOTIFICATIONS 타입 메시지 처리
    else if (event.data.type === 'ACCESS_TOKEN_AND_NOTIFICATIONS') {
      const token = event.data.accessToken;
      const notifications = event.data.notifications;

      // 토큰과 알림을 하나의 메시지로 전송
      chrome.runtime.sendMessage({
        type: 'ACCESS_TOKEN_AND_NOTIFICATIONS',
        accessToken: token,
        notifications,
      });
    }
  });
}
