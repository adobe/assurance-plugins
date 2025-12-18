/*
Copyright 2024 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  textColor?: string;
}

/**
 * Simple markdown renderer that handles basic formatting without external libraries
 */
export default function MarkdownRenderer({ content, textColor = 'black' }: MarkdownRendererProps) {
  if (!content) {
    return null;
  }

  const renderContent = () => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeContent: string[] = [];
    let listItems: string[] = [];
    let inList = false;
    let inTable = false;
    let tableRows: string[][] = [];
    let tableHeaders: string[] = [];

    lines.forEach((line, index) => {
      // Handle code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          elements.push(
            <pre key={`code-${index}`} style={{
              backgroundColor: '#2d2d2d',
              color: '#f8f8f2',
              padding: '1em',
              borderRadius: '6px',
              overflow: 'auto',
              margin: '0.5em 0',
              fontSize: '0.85em',
              fontFamily: 'Monaco, Consolas, "Courier New", monospace',
            }}>
              <code>{codeContent.join('\n')}</code>
            </pre>
          );
          codeContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeContent.push(line);
        return;
      }

      // Handle tables
      const isTableRow = line.trim().startsWith('|') && line.trim().endsWith('|');
      const isTableSeparator = /^\|[\s:-]+\|/.test(line.trim());

      if (isTableRow && !isTableSeparator) {
        const cells = line
          .split('|')
          .slice(1, -1) // Remove empty first and last elements
          .map(cell => cell.trim());

        if (!inTable) {
          // First row is header
          inTable = true;
          tableHeaders = cells;
        } else {
          // Data rows
          tableRows.push(cells);
        }
        return;
      } else if (isTableSeparator) {
        // Skip separator row
        return;
      } else if (inTable) {
        // End of table
        elements.push(
          <div key={`table-wrapper-${index}`} style={{ overflowX: 'auto', margin: '1em 0' }}>
            <table key={`table-${index}`} style={{
              borderCollapse: 'collapse',
              width: '100%',
              fontSize: '0.9em',
              border: '1px solid #ddd',
            }}>
              <thead>
                <tr>
                  {tableHeaders.map((header, i) => (
                    <th key={i} style={{
                      border: '1px solid #ddd',
                      padding: '8px 12px',
                      textAlign: 'left',
                      backgroundColor: 'rgba(0, 0, 0, 0.05)',
                      fontWeight: 'bold',
                    }}>
                      {formatInlineText(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} style={{
                        border: '1px solid #ddd',
                        padding: '8px 12px',
                      }}>
                        {formatInlineText(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        inTable = false;
        tableRows = [];
        tableHeaders = [];
      }

      // Handle lists
      const listMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
      const numberedListMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);
      
      if (listMatch || numberedListMatch) {
        if (!inList) {
          inList = true;
          listItems = [];
        }
        listItems.push(listMatch ? listMatch[1] : numberedListMatch![1]);
        return;
      } else if (inList) {
        // End of list
        elements.push(
          <ul key={`list-${index}`} style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
            {listItems.map((item, i) => (
              <li key={i} style={{ marginBottom: '0.25em' }}>
                {formatInlineText(item)}
              </li>
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }

      // Handle headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={index} style={{ fontSize: '1.15em', fontWeight: 'bold', margin: '0.4em 0' }}>
            {formatInlineText(line.substring(4))}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={index} style={{ fontSize: '1.3em', fontWeight: 'bold', margin: '0.5em 0' }}>
            {formatInlineText(line.substring(3))}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={index} style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '0.5em 0' }}>
            {formatInlineText(line.substring(2))}
          </h1>
        );
      } else if (line.startsWith('---')) {
        elements.push(
          <hr key={index} style={{ border: 'none', borderTop: '2px solid #ddd', margin: '1em 0' }} />
        );
      } else if (line.trim() === '') {
        elements.push(<div key={index} style={{ height: '0.5em' }} />);
      } else {
        // Regular paragraph
        elements.push(
          <p key={index} style={{ margin: '0.5em 0' }}>
            {formatInlineText(line)}
          </p>
        );
      }
    });

    // Close any remaining list
    if (inList) {
      elements.push(
        <ul key="list-end" style={{ margin: '0.5em 0', paddingLeft: '1.5em' }}>
          {listItems.map((item, i) => (
            <li key={i} style={{ marginBottom: '0.25em' }}>
              {formatInlineText(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Close any remaining table
    if (inTable && tableHeaders.length > 0) {
      elements.push(
        <div key="table-wrapper-end" style={{ overflowX: 'auto', margin: '1em 0' }}>
          <table key="table-end" style={{
            borderCollapse: 'collapse',
            width: '100%',
            fontSize: '0.9em',
            border: '1px solid #ddd',
          }}>
            <thead>
              <tr>
                {tableHeaders.map((header, i) => (
                  <th key={i} style={{
                    border: '1px solid #ddd',
                    padding: '8px 12px',
                    textAlign: 'left',
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    fontWeight: 'bold',
                  }}>
                    {formatInlineText(header)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} style={{
                      border: '1px solid #ddd',
                      padding: '8px 12px',
                    }}>
                      {formatInlineText(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return elements;
  };

  const formatInlineText = (text: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = text;
    let key = 0;

    // Handle inline code
    const codeRegex = /`([^`]+)`/g;
    let match;
    let lastIndex = 0;

    while ((match = codeRegex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(...formatBoldAndItalic(remaining.substring(lastIndex, match.index), key++));
      }
      parts.push(
        <code key={`code-${key++}`} style={{
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          padding: '2px 6px',
          borderRadius: '3px',
          fontSize: '0.9em',
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        }}>
          {match[1]}
        </code>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < remaining.length) {
      parts.push(...formatBoldAndItalic(remaining.substring(lastIndex), key++));
    }

    return parts.length > 0 ? parts : [text];
  };

  const formatBoldAndItalic = (text: string, baseKey: number): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    
    // Handle bold **text**
    const boldRegex = /\*\*([^*]+)\*\*/g;
    let match;
    let lastIndex = 0;
    let key = 0;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${baseKey}-${key++}`} style={{ fontWeight: 'bold' }}>
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [text];
  };

  return (
    <div
      style={{
        color: textColor,
        fontSize: '0.95em',
        lineHeight: '1.6',
        maxWidth: '100%',
        overflowX: 'auto',
        wordWrap: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
      className="markdown-content"
    >
      {renderContent()}
    </div>
  );
}
