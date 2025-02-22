import React, { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

// Import các ngôn ngữ cơ bản
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup'; // HTML
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-jsx';

// Thêm các ngôn ngữ mới
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-dart';

// Import plugins
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';

// Thêm mapping cho các ngôn ngữ
const languageMap = {
  'c': 'c',
  'cpp': 'cpp',
  'python': 'python',
  'java': 'java',
  'sql': 'sql',
  'csharp': 'csharp',
  'go': 'go',
  'kotlin': 'kotlin',
  'ruby': 'ruby',
  'rust': 'rust',
  'scala': 'scala',
  'swift': 'swift',
  'typescript': 'typescript',
  'php': 'php',
  'dart': 'dart',
  'javascript': 'javascript',
  'html': 'markup',
  'css': 'css',
  'jsx': 'jsx'
};

// Khai báo customPrismStyles trước
const customPrismStyles = `
  code[class*="language-"],
  pre[class*="language-"] {
    color: #d4d4d4;
    font-family: 'Fira Code', monospace;
    font-size: 14px;
    line-height: 1.5;
    direction: ltr;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    tab-size: 2;
    hyphens: none;
    background: none;
    padding: 0;
  }

  /* Chỉ giữ lại màu cho các token chính */
  .token.comment { color: #6A9955; }
  .token.string { color: #CE9178; }
  .token.number { color: #B5CEA8; }
  .token.keyword { color: #569CD6; }
  .token.function { color: #DCDCAA; }
  .token.class-name { color: #4EC9B0; }
  .token.operator { color: #D4D4D4; }
  .token.punctuation { color: #D4D4D4; }
`;

// Sau đó mới thêm styles vào head
const styleNode = document.createElement('style');
styleNode.textContent = customPrismStyles;
document.head.appendChild(styleNode);

const CodeEditor = ({ value, onChange, language, theme, options }) => {
  const editorRef = useRef(null);
  const lineNumbersRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      Prism.highlightElement(editorRef.current);
    }
    updateLineNumbers(value);
  }, [value]);

  const updateLineNumbers = (text) => {
    if (!lineNumbersRef.current) return;
    
    const lines = text.split('\n').length;
    
    const numbers = Array.from({ length: Math.max(lines, 1) }, (_, i) => i + 1);
    
    lineNumbersRef.current.innerHTML = numbers
      .map(num => `<div class="line-number">${num}</div>`)
      .join('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const spaces = '  ';
      
      const newValue = value.substring(0, start) + spaces + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + spaces.length;
      }, 0);
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      const currentLine = value.substring(0, start).split('\n').pop();
      
      const indent = currentLine.match(/^\s*/)[0];
      
      const newValue = value.substring(0, start) + '\n' + indent + value.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + indent.length + 1;
      }, 0);
    }
  };

  return (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#ffffff',
      overflow: 'hidden',
    }}>
      {/* Line Numbers */}
      <Box
        ref={lineNumbersRef}
        sx={{
          width: '50px',
          padding: '8px 0',
          color: '#858585',
          bgcolor: theme === 'vs-dark' ? '#1e1e1e' : '#f5f5f5',
          borderRight: '1px solid',
          borderColor: theme === 'vs-dark' ? '#333' : '#e0e0e0',
          fontFamily: '"Fira Code", monospace',
          fontSize: options?.fontSize || 14,
          lineHeight: '1.5',
          userSelect: 'none',
          '& .line-number': {
            padding: '0 8px',
            textAlign: 'right',
          },
        }}
      />

      {/* Editor */}
      <Box sx={{ 
        flex: 1,
        position: 'relative',
        '& textarea, & pre': {
          margin: 0,
          padding: '8px 12px',
          border: 'none',
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          fontFamily: '"Fira Code", monospace',
          fontSize: options?.fontSize || 14,
          lineHeight: '1.5',
          whiteSpace: 'pre',
          wordSpacing: 'normal',
          wordBreak: 'normal',
          tabSize: 2,
        },
        '& textarea': {
          color: theme === 'vs-dark' ? '#d4d4d4' : '#1e1e1e',
          background: 'transparent',
          caretColor: theme === 'vs-dark' ? '#fff' : '#000',
          resize: 'none',
          outline: 'none',
          overflow: 'auto',
          zIndex: 1,
        },
        '& pre': {
          pointerEvents: 'none',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          '& code': {
            color: 'inherit',
            fontSize: 'inherit',
            fontFamily: 'inherit !important',
            lineHeight: 'inherit',
            background: 'none',
            whiteSpace: 'inherit',
            padding: 0,
          }
        },
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: theme === 'vs-dark' ? '#424242' : '#bdbdbd',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        }
      }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          data-gramm="false"
          data-gramm_editor="false"
          data-enable-grammarly="false"
        />
        <pre aria-hidden="true">
          <code
            ref={editorRef}
            className={`language-${languageMap[language] || 'javascript'}`}
          >
            {value}
          </code>
        </pre>
      </Box>
    </Box>
  );
};

export default CodeEditor; 