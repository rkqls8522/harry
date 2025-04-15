// === background에서 가지고 있는 변수들 ===
let pageInfo = {
  url: null,
  title: null,
  image: null,
  icon: null,
}; // 페이지 정보

let accessToken = null; // JWT 토큰

let hasVisitRecord = null; // 방문 기록 여부

// 사이트를 방문했을 때 페이지 정보를 가져오기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'GET_PAGE_INFO_FROM_SITE') {
    pageInfo.url = message.url;
    pageInfo.title = message.title;
    pageInfo.image = message.image;
    pageInfo.icon = message.icon;

    console.log('Page info received:', pageInfo);

    chrome.storage.local.get(['accessToken'], (result) => {
      const accessToken = result.accessToken;
      // 서버로 GET 요청
      fetch(`https://j12a408.p.ssafy.io/api/archives/detail?url=${pageInfo.url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error(`Failed to [GET] highlights: accessToken 없거나 만료 됨`);
            }
          }
          return response.json();
        })
        .then((data) => {
          if (data.content.isHighlighted && data.content.archive.highlights.length > 0) {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
              const tab = tabs[0];
              if (tab?.id) {
                chrome.tabs.sendMessage(tab.id, {
                  action: 'LOAD_HIGHLIGHTS',
                  highlights: data.content.archive.highlights,
                });
              }
            });
          }
          sendResponse({ status: 'success' });
        })
        .catch((error) => {
          console.log('Error fetching highlights:', error);
          sendResponse({ status: 'error', message: error.message });
        });
    });

    return true;
  }
});

// 익스텐션 팝업을 열 때 페이지 정보를 가져오기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // 현재 활성 탭에 content script에 요청
  if (message.type === 'PAGE_INFO') {
    if (message.action === 'GET') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, { action: 'FETCH_PAGE_INFO' }, (response) => {
            if (chrome.runtime.lastError) {
              console.log('Failed to fetch page info from content script');
              sendResponse({ error: 'Failed to fetch page info' });
            } else {
              // contentScript로부터 받은 pageInfo를 업데이트
              pageInfo = response.pageInfo || {};
              sendResponse({ pageInfo, hasVisitRecord });
            }
          });
        } else {
          sendResponse({ error: 'No active tab found' });
        }
      });
    }
    return true;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ADD_HIGHLIGHT') {
    const { highlightId, rawContent, content, color, startXpath, endXpath, startOffset, endOffset, title, url, image } =
      message.payload;

    chrome.storage.local.get(['accessToken'], (result) => {
      const accessToken = result.accessToken;
      // 서버로 POST 요청
      fetch('https://j12a408.p.ssafy.io/api/highlights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          highlightId,
          archiveTitle: title,
          archiveUrl: url,
          archiveImage: image,
          rawContent,
          content,
          color,
          type: 'TEXT',
          startXpath,
          endXpath,
          startOffset,
          endOffset,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to post highlights: ${response.status}`);
          }
          return response.json();
        })
        .then(() => {
          sendResponse({ status: 'success' });
        })
        .catch((error) => {
          console.log('Error posting highlights:', error);
          sendResponse({ status: 'error', message: error.message });
        });
    });

    return true;
  }
});

// AI 채팅 API 호출
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'AI_CHAT') {
    chrome.storage.local.get(['accessToken'], (result) => {
      const accessToken = result.accessToken;

      if (!accessToken) {
        // 로그인 메시지 응답
        sendResponse({
          success: false,
          message: '로그인이 필요한 기능이에요! 로그인 페이지로 이동합니다.',
        });

        // 로그인 페이지 URL
        const loginUrl = 'https://j12a408.p.ssafy.io/login';

        // 약간의 딜레이 후 새 탭에서 로그인 페이지 열기 (메시지가 표시될 시간 부여)
        setTimeout(() => {
          chrome.tabs.create({ url: loginUrl });
        }, 1500);

        return;
      }

      fetch('https://j12a408.p.ssafy.io/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`, // JWT 토큰 헤더에 추가
        },
        body: JSON.stringify({
          message: message.text,
          pageInfo: {
            url: pageInfo.url,
            title: pageInfo.title,
            image: pageInfo.image,
            isNotified: false,
          },
        }),
      })
        .then((response) => {
          console.log('API 응답 상태:', response.status);
          return response.json();
        })
        .then((data) => {
          console.log('API 응답 데이터:', data);

          if (data.success) {
            sendResponse({
              success: true,
              message: data.message,
              emotions: data.emotions || {},
              schedule: data.schedule || null,
            });
          } else {
            sendResponse({
              success: false,
              message: '죄송합니다. 요청 처리 중 문제가 발생했습니다.',
            });
          }
        })
        .catch((error) => {
          console.log('API 호출 중 오류:', error);
          sendResponse({
            success: false,
            message: '네트워크 연결에 문제가 있습니다. 다시 시도해주세요.',
          });
        });
    });

    return true;
  }
});

function checkAlarms() {
  chrome.storage.sync.get(['upcomingNotifications'], (result) => {
    if (!result.upcomingNotifications || !Array.isArray(result.upcomingNotifications)) {
      return;
    }

    const now = new Date();
    const currentTime = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 현재 시간과 일치하는 알림이 있는지 확인
    const activeNotifications = result.upcomingNotifications.filter((notification) => {
      // notification.alarmTime이 현재 시간과 일치하고, 오늘 날짜에 해당하는지 확인
      return notification.alarmTime === currentTime && (!notification.date || notification.date === today);
    });

    if (activeNotifications.length > 0) {
      // 활성화된 알림이 있으면 모든 탭에 알림 메시지 전송
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'SHOW_NOTIFICATION_BADGE',
              count: activeNotifications.length,
              notifications: activeNotifications,
            });
          }
        });
      });

      // 배지 표시
      chrome.action.setBadgeText({
        text: activeNotifications.length.toString(),
      });
      chrome.action.setBadgeBackgroundColor({
        color: '#ff4d4f',
      });
    }
  });
}

// 확장 프로그램 아이콘 클릭 시 배지 제거
chrome.action.onClicked.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});

// 1분마다 알람 체크 설정
setInterval(checkAlarms, 60000); // 60초마다 체크

// 익스텐션이 시작될 때 한 번 체크
checkAlarms();

// 로그인
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'ACCESS_TOKEN') {
    // 알람 조회 실패 시 accessToken만 갔을 경우
    accessToken = message.token;
    chrome.storage.local.set({ accessToken: message.accessToken }, () => {
      console.log('✅ accessToken saved in chrome.storage.local');
    });
    sendResponse({ status: 'success' });
  } else if (message.type === 'ACCESS_TOKEN_AND_NOTIFICATIONS') {
    // 토큰 저장 (기존 방식과 동일)
    accessToken = message.accessToken;
    chrome.storage.local.set({ accessToken: message.accessToken }, () => {
      console.log('✅ accessToken saved in chrome.storage.local');
    });

    // 방문기록 보낸 여부
    if (!message.hasVisitRecord) {
      const oneWeekAgo = Date.now() - 1000 * 60 * 60 * 24 * 7;

      chrome.history.search(
        {
          text: '', // 빈 문자열로 전체 기록
          startTime: oneWeekAgo,
          maxResults: 50, // 최대 1000개까지
        },
        (results) => {
          const data = results.map((item) => {
            const date = new Date(item.lastVisitTime);
            const formattedDate = date.toISOString().replace('T', ' ').substring(0, 19);

            return {
              url: item.url,
              title: item.title,
              timestamp: formattedDate,
            };
          });

          fetch('https://j12a408.p.ssafy.io/ai/histories/keywords', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${message.accessToken}`, // JWT 토큰 헤더에 추가
            },
            body: JSON.stringify(data),
          })
            .then((response) => {
              console.log('API 응답 상태:', response.status);
              if (!response.ok) {
                throw new Error(`Failed to [POST] histories: ${response.status}`);
              }
              return response.json();
            })
            .then(() => {
              chrome.storage.sync.set({ hasVisitRecord: true }, () => {
                console.log('✅ hasVisitRecord saved in chrome.storage.sync');
                hasVisitRecord = true;
              });
            })
            .catch(() => {
              chrome.storage.sync.set({ hasVisitRecord: false }, () => {
                console.log('💥 hasVisitRecord saved in chrome.storage.sync');
              });
            });
        },
      );
    } else {
      chrome.storage.sync.set({ hasVisitRecord: true }, () => {
        console.log('✅ hasVisitRecord saved in chrome.storage.sync');
        hasVisitRecord = true;
      });
    }

    // 알림 데이터를 sync 스토리지에 저장
    chrome.storage.sync.set({ upcomingNotifications: message.notifications, notificationsViewed: false }, () => {
      console.log('✅ upcoming notifications saved in chrome.storage.sync');

      // 모든 탭에 알림 표시 메시지 전송
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              action: 'SHOW_NOTIFICATION_AFTER_LOGIN',
              notifications: message.notifications,
            });
          }
        });
      });
    });

    sendResponse({ status: 'success' });
  }

  return true;
});

chrome.storage.local.get(['accessToken'], (result) => {
  if (result.accessToken) {
    accessToken = result.accessToken;
    console.log('✅ accessToken loaded from chrome.storage.local:', accessToken);
  } else {
    console.log('❌ No accessToken found in chrome.storage.local');
  }
});

chrome.storage.sync.get(['hasVisitRecord'], (result) => {
  if (result.hasVisitRecord) {
    hasVisitRecord = result.hasVisitRecord;
    console.log('✅ hasVisitRecord loaded from chrome.storage.sync:', hasVisitRecord);
  } else if (result.hasVisitRecord === false) {
    hasVisitRecord = result.hasVisitRecord;
    console.log('✅ hasVisitRecord loaded from chrome.storage.sync:', hasVisitRecord);
  } else {
    console.log('❌ No hasVisitRecord found in chrome.storage.sync');
  }
});
