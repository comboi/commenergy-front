'use client';

import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  BookOpen,
  FileText,
  Download,
} from 'lucide-react';

interface TocItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  markdownContent: string;
}

export function TableOfContents({ markdownContent }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(markdownContent)) !== null) {
      if (match[1] && match[2]) {
        const level = match[1].length;
        const title = match[2].replace(/[#*`]/g, '').trim();
        const id = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

        items.push({ id, title, level });
      }
    }

    setTocItems(items);
  }, [markdownContent]);

  useEffect(() => {
    // Observe headings and update active item
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -66%' }
    );

    // Observer all headings
    setTimeout(() => {
      tocItems.forEach(({ id }) => {
        const element = document.getElementById(id);
        if (element) {
          observer.observe(element);
        }
      });
    }, 100);

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable version
    const element = document.createElement('a');
    const file = new Blob([markdownContent], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = 'CSV_Import_User_Guide.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="sticky top-4 w-64">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Contents
            </span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {isExpanded && (
          <>
            {/* Action buttons */}
            <div className="flex space-x-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                title="Print documentation">
                <FileText className="h-3 w-3" />
                <span>Print</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                title="Download markdown file">
                <Download className="h-3 w-3" />
                <span>Download</span>
              </button>
            </div>

            {/* Table of contents */}
            <nav className="p-4 max-h-96 overflow-y-auto">
              <ul className="space-y-1">
                {tocItems.map(({ id, title, level }) => (
                  <li key={id}>
                    <button
                      onClick={() => scrollToSection(id)}
                      className={`
                        w-full text-left px-2 py-1 text-sm rounded transition-colors
                        ${level === 1 ? 'font-semibold' : ''}
                        ${level === 2 ? 'ml-3' : ''}
                        ${level === 3 ? 'ml-6' : ''}
                        ${level >= 4 ? 'ml-9' : ''}
                        ${
                          activeId === id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-2 border-blue-500 dark:border-blue-400 pl-1'
                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                        }
                      `}>
                      {title}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
