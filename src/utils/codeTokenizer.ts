
import { Token } from '@/types/battle';

export const getTokenColor = (type?: Token['type']): string => {
  switch (type) {
    case 'comment': return '#6A9955';
    case 'keyword': return '#C586C0';
    case 'type': return '#4EC9B0';
    case 'function': return '#DCDCAA';
    case 'string': return '#CE9178';
    case 'number': return '#B5CEA8';
    default: return '#D4D4D4';
  }
};

export const tokenizeLine = (line: string): Token[] => {
  const tokens: Token[] = [];
  let currentToken = '';

  const addToken = (type?: Token['type']) => {
    if (currentToken) {
      tokens.push({ text: currentToken, type });
      currentToken = '';
    }
  };

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if ((char === '/' && line[i + 1] === '/') || char === '#') {
      addToken();
      tokens.push({ text: line.slice(i), type: 'comment' });
      break;
    }

    if (char === '"') {
      addToken();
      let stringContent = char;
      i++;
      while (i < line.length && line[i] !== '"') {
        stringContent += line[i];
        i++;
      }
      if (i < line.length) stringContent += line[i];
      tokens.push({ text: stringContent, type: 'string' });
      continue;
    }

    if (/\w/.test(char)) {
      currentToken += char;
    } else {
      if (currentToken) {
        if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
          addToken('keyword');
        } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
          addToken('type');
        } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
          addToken('function');
        } else if (/^\d+$/.test(currentToken)) {
          addToken('number');
        } else {
          addToken();
        }
      }
      tokens.push({ text: char });
      currentToken = '';
    }
  }

  if (currentToken) {
    if (/^(function|class|return|const|let|var|for|if|in|of|public|include|vector)$/.test(currentToken)) {
      addToken('keyword');
    } else if (/^(Map|unordered_map|vector|int|void)$/.test(currentToken)) {
      addToken('type');
    } else if (/^(solution|enumerate|find|size|has|get|set)$/.test(currentToken)) {
      addToken('function');
    } else if (/^\d+$/.test(currentToken)) {
      addToken('number');
    } else {
      addToken();
    }
  }

  return tokens;
};
