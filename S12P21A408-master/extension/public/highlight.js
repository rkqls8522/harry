export function getHighlightsFromDOM() {
  const highlights = [];

  document.querySelectorAll('custommark[data-highlight-id]').forEach((mark) => {
    const text = mark.textContent;
    const id = mark.getAttribute('data-highlight-id');
    const startOffset = parseInt(mark.getAttribute('data-highlight-offset'));
    const color = mark.getAttribute('data-highlight-color') || '#f5e198';
    const xpath = mark.getAttribute('data-highlight-xpath');

    highlights.push({
      id,
      xpath,
      startOffset: startOffset,
      endOffset: startOffset + text.length,
      color,
    });
  });

  return highlights;
}

export function applyAllHighlights(savedHighlights) {
  const sorted = [...savedHighlights].sort((a, b) => {
    if (a.xpath === b.xpath) {
      return b.startOffset - a.startOffset;
    }
    return b.xpath.localeCompare(a.xpath); // XPath가 나중인 것부터
  });

  for (const h of sorted) {
    const node = getNodeByXPath(h.xpath);
    if (!node || node.nodeType !== Node.TEXT_NODE) continue;

    highlightTextNode(node, h.startOffset, h.endOffset, true, true, h.id, h.xpath, h.color);
  }
}

export function clearAllHighlights() {
  const marks = Array.from(document.querySelectorAll('custommark[data-highlight-id]'));

  marks.forEach((mark) => {
    const parent = mark.parentNode;
    let textNode = mark.firstChild;

    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      mark.remove();
      return;
    }

    // <mark> 제거하고 텍스트만 삽입
    parent.replaceChild(textNode, mark);

    // 👉 주변 텍스트 노드와 병합 (왼쪽/오른쪽)
    let mergedNode = textNode;

    const prev = mergedNode.previousSibling;
    if (prev && prev.nodeType === Node.TEXT_NODE) {
      prev.textContent += mergedNode.textContent;
      parent.removeChild(mergedNode);
      mergedNode = prev;
    }

    const next = mergedNode.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE) {
      mergedNode.textContent += next.textContent;
      parent.removeChild(next);
    }
  });
}

/**
 * XPath와 offset을 기반으로 HTML에서 특정 위치를 선택하는 함수
 */
export function getRangeFromXPathAndOffset(xpath, offset) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

  const node = result.singleNodeValue;

  if (!node) {
    console.error('XPath로 요소를 찾을 수 없습니다.');
    return null;
  }

  // 텍스트 노드가 아니면 내부의 텍스트 노드를 찾아야 함
  let textNode = node.nodeType === Node.TEXT_NODE ? node : node.firstChild;

  // 텍스트 노드를 찾을 수 없거나 offset이 범위를 벗어난 경우
  if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
    console.error('텍스트 노드를 찾을 수 없습니다.');
    return null;
  }

  if (offset < 0 || offset > textNode.textContent.length) {
    console.error('offset이 텍스트 길이를 벗어났습니다.');
    return null;
  }

  const range = document.createRange();
  range.setStart(textNode, offset);
  range.setEnd(textNode, offset); // 단일 위치 선택

  return range;
}

/**
 * XPath로 특정 노드를 찾아 반환하는 함수
 */
export function getNodeByXPath(xpath) {
  const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
  return result.singleNodeValue;
}

/**
 * 두 XPath 사이에 포함된 모든 텍스트 노드의 XPath 리스트 반환
 */
export function getIncludedXPathsBetween(startXPath, startOffset, endXPath, endOffset) {
  const startNode = getNodeByXPath(startXPath);
  const endNode = getNodeByXPath(endXPath);

  if (!startNode || !endNode) {
    return [];
  }

  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);

  const results = [];

  if (startNode === endNode) {
    const text = startNode.textContent.slice(startOffset, endOffset);
    if (text.trim().length > 0) {
      results.push({
        currentNode: startNode,
        xpath: getXPathForNode(startNode),
        text: text,
        parentHTML: startNode.parentNode.outerHTML,
      });
    }
    return results;
  }

  // 텍스트 노드만 가져오도록 TreeWalker 사용
  const walker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      if (node.textContent.trim().length === 0) {
        return NodeFilter.FILTER_REJECT;
      }

      try {
        return range.intersectsNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      } catch (e) {
        // Firefox에서 node가 잘린 경우 intersectsNode 오류 발생할 수 있음
        console.error(e);
        return NodeFilter.FILTER_REJECT;
      }
    },
  });

  let currentNode;
  while ((currentNode = walker.nextNode())) {
    const xpath = getXPathForNode(currentNode);

    let start = 0;
    let end = currentNode.textContent.length;

    if (currentNode === startNode) {
      start = startOffset;
    }
    if (currentNode === endNode) {
      end = endOffset;
    }

    const selectedText = currentNode.textContent.slice(start, end);
    if (selectedText.trim().length > 0) {
      results.push({
        currentNode,
        xpath,
        text: selectedText,
        parentHTML: currentNode.parentNode.outerHTML,
      });
    }
  }

  return results;
}

/**
 * 노드로부터 XPath를 반환하는 함수
 */
export function getXPathForNode(node) {
  if (node.nodeName.toLowerCase() === 'custommark') {
    return getXPathForNode(node.parentNode);
  }

  if (node.nodeType === Node.TEXT_NODE) {
    const parent = node.parentNode;
    const siblings = Array.from(parent.childNodes).filter((n) => n.nodeType === Node.TEXT_NODE);
    const index = siblings.indexOf(node) + 1;
    return getXPathForNode(parent) + `/text()[${index}]`;
  }

  if (node === document.body) return '/html/body';

  const parent = node.parentNode;
  const siblings = Array.from(parent.childNodes).filter(
    (n) => n.nodeType === node.nodeType && n.nodeName === node.nodeName,
  );
  const index = siblings.indexOf(node) + 1;
  const tagName = node.nodeName.toLowerCase();

  return getXPathForNode(parent) + `/${tagName}[${index}]`;
}

export function highlightTextNode(node, startOffset, endOffset, isStartNode, isEndNode, highlightId, xpath, color) {
  const parent = node.parentNode;
  if (!parent) return;

  const text = node.textContent;
  let before = null;
  let target = null;
  let after = null;

  // 텍스트 노드를 필요한 구간으로 분리
  if (isStartNode && isEndNode) {
    // 한 노드 내에서 시작과 끝 모두 존재
    before = text.slice(0, startOffset);
    target = text.slice(startOffset, endOffset);
    after = text.slice(endOffset);
  } else if (isStartNode) {
    before = text.slice(0, startOffset);
    target = text.slice(startOffset);
  } else if (isEndNode) {
    target = text.slice(0, endOffset);
    after = text.slice(endOffset);
  } else {
    target = text; // 전체 선택
  }

  const fragment = document.createDocumentFragment();

  if (before) fragment.appendChild(document.createTextNode(before));

  if (target) {
    const mark = document.createElement('custommark');
    mark.textContent = target;
    mark.setAttribute('data-highlight-id', highlightId);
    mark.setAttribute('data-highlight-xpath', xpath);
    mark.setAttribute('data-highlight-offset', startOffset);
    mark.setAttribute('data-highlight-color', color || '#f5e198');
    mark.style.backgroundColor = color || '#f5e198'; // 스타일 속성 추가
    fragment.appendChild(mark);
  }

  if (after) fragment.appendChild(document.createTextNode(after));

  parent.replaceChild(fragment, node);
}

export function buildMergedHTMLFromSnippets(snippets) {
  if (!snippets.length) return '';

  // 1. 가장 태그 구조가 깊은 parentHTML을 기준으로 사용
  const reference = snippets.reduce((a, b) => (a.parentHTML.length >= b.parentHTML.length ? a : b));

  const container = document.createElement('div');
  container.innerHTML = reference.parentHTML;
  const root = container.firstElementChild;

  if (!root) return '';

  // 2. 모든 snippet의 xpath에 해당하는 textNode에 content 삽입
  snippets.forEach(({ xpath, content }) => {
    const relativeXPath = xpath.replace(/^.*?(\/text\(\[\d+\]\))$/, './/$1');

    const result = document.evaluate(relativeXPath, root, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

    const textNode = result.singleNodeValue;
    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
      textNode.textContent = content;
    }
  });

  // 3. content에 포함되지 않은 텍스트 제거하고,
  // 포함되어 있다면 content만 남김
  const allTextNodes = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    allTextNodes.push(walker.currentNode);
  }

  const usedContents = snippets.map((s) => s.content.trim());

  allTextNodes.forEach((node) => {
    const text = node.textContent.trim();
    const match = usedContents.find((content) => text.includes(content));

    if (match) {
      node.textContent = match; // ✅ 일치하는 부분만 남김
    } else {
      node.textContent = ''; // ❌ 해당되지 않는 노드는 제거
    }
  });

  return root.outerHTML;
}

export function extractBlockXPath(xpath, blockTags = ['p', 'div', 'section', 'article']) {
  const parts = xpath.split('/');
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i];
    if (blockTags.some((tag) => part.startsWith(tag + '['))) {
      return parts.slice(0, i + 1).join('/');
    }
  }
  // fallback: 전체 경로
  return xpath;
}

export function groupSnippetsByParentBlock(snippets) {
  const groups = {};

  snippets.forEach((snippet) => {
    const parentXPath = extractBlockXPath(snippet.xpath);
    if (!groups[parentXPath]) {
      groups[parentXPath] = [];
    }
    groups[parentXPath].push(snippet);
  });

  return groups; // { '/html/body/.../p[11]': [ ... ], '/p[12]': [ ... ] }
}

export function generateAllGroupedHTML(snippets) {
  const grouped = groupSnippetsByParentBlock(snippets);
  console.log('grouped:', grouped);
  const results = [];

  for (const parentXPath in grouped) {
    const snippetsForBlock = grouped[parentXPath];
    const html = buildMergedHTMLFromSnippets(snippetsForBlock);
    results.push({
      parentXPath,
      html,
    });
  }

  return results;
}

export function showHighlightMenu(x, y, onConfirm, onCancel) {
  // 이미 떠 있던 거 제거
  const old = document.getElementById('highlight-menu');
  if (old) old.remove();

  const container = document.createElement('div');
  container.id = 'highlight-menu';
  container.style.position = 'absolute';
  container.style.top = `${y - 85}px`;
  container.style.left = `${x}px`;
  container.style.padding = '12px';
  container.style.background = '#f9f9f9';
  container.style.border = '1px solid #ddd';
  container.style.borderRadius = '8px';
  container.style.zIndex = 9999;
  container.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
  container.style.fontSize = '14px';
  container.style.fontFamily = 'Arial, sans-serif';

  container.innerHTML = `
    <div id="color-options" style="display: flex; justify-content: center; gap: 12px;">
      <div class="color-circle" data-color="#f5e198" style="width: 36px; height: 36px; border-radius: 50%; background: #f5e198; cursor: pointer; border: 3px solid transparent; transition: transform 0.2s, border-color 0.2s;"></div>
      <div class="color-circle" data-color="#aec9ff" style="width: 36px; height: 36px; border-radius: 50%; background: #aec9ff; cursor: pointer; border: 3px solid transparent; transition: transform 0.2s, border-color 0.2s;"></div>
      <div class="color-circle" data-color="#4caf52" style="width: 36px; height: 36px; border-radius: 50%; background: #4caf52; cursor: pointer; border: 3px solid transparent; transition: transform 0.2s, border-color 0.2s;"></div>
      <div class="color-circle" data-color="#ffb6c7" style="width: 36px; height: 36px; border-radius: 50%; background: #ffb6c7; cursor: pointer; border: 3px solid transparent; transition: transform 0.2s, border-color 0.2s;"></div>
    </div>
  `;

  document.body.appendChild(container);

  // 외부 클릭 시 닫기
  const handleOutsideClick = (e) => {
    if (!container.contains(e.target)) {
      onCancel();
      container.remove();
      window.removeEventListener('mousedown', handleOutsideClick);
    }
  };
  // 리스너 등록
  window.addEventListener('mousedown', handleOutsideClick);

  // 색상 선택 로직
  let selectedColor = null;
  const colorCircles = document.querySelectorAll('.color-circle');
  colorCircles.forEach((circle) => {
    circle.addEventListener('click', () => {
      // 모든 원의 테두리를 초기화
      colorCircles.forEach((c) => {
        c.style.border = '3px solid transparent';
        c.style.transform = 'scale(1)';
      });
      // 선택된 원에 테두리 강조 및 확대 효과
      circle.style.border = '3px solid #333';
      circle.style.transform = 'scale(1.2)';
      selectedColor = circle.getAttribute('data-color');
      // 하이라이트 적용
      onConfirm(selectedColor);
      container.remove();
      window.removeEventListener('mousedown', handleOutsideClick);
    });

    // 호버 효과 추가
    circle.addEventListener('mouseenter', () => {
      circle.style.transform = 'scale(1.1)';
    });
    circle.addEventListener('mouseleave', () => {
      if (circle.getAttribute('data-color') !== selectedColor) {
        circle.style.transform = 'scale(1)';
      }
    });
  });
}
