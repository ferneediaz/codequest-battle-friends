
import React from 'react';
import { Token } from '@/types/battle';
import { tokenizeLine, getTokenColor } from '@/utils/codeTokenizer';

interface TokenizedCodeProps {
  code: string;
}

export const TokenizedCode: React.FC<TokenizedCodeProps> = ({ code }) => {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none font-mono p-4 text-sm leading-6"
      style={{
        whiteSpace: 'pre',
        fontFamily: 'monospace'
      }}
    >
      {code.split('\n').map((line, i) => (
        <div key={i} className="relative">
          {tokenizeLine(line).map((token, j) => (
            <span
              key={`${i}-${j}`}
              style={{ color: getTokenColor(token.type) }}
            >
              {token.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
