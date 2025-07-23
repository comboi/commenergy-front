import fs from 'fs';
import path from 'path';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { TableOfContents } from './components/TableOfContents';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import 'highlight.js/styles/github.css';

export const metadata: Metadata = {
  title: 'CSV Import User Guide | Commenergy',
  description:
    'Complete guide for importing contracts using CSV files in Commenergy platform',
  keywords: [
    'CSV',
    'import',
    'contracts',
    'energy',
    'providers',
    'documentation',
  ],
};

export default async function CSVImportGuide() {
  // Read the markdown file from the docs directory
  const markdownPath = path.join(
    process.cwd(),
    'app/platform/communities/components/communities-contracts-table/modals/bulk-import-modal/docs/CSV_IMPORT_USER_GUIDE.md'
  );

  let markdownContent: string;

  try {
    markdownContent = fs.readFileSync(markdownPath, 'utf8');
  } catch (error) {
    console.error('Error reading markdown file:', error);
    markdownContent =
      '# Error loading documentation\n\nThe CSV Import User Guide could not be loaded.';
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b bg-white dark:bg-gray-800 shadow-sm border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/platform/communities"
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Communities</span>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  CSV Import User Guide
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  Complete guide for importing contracts using CSV files
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <ExternalLink className="h-4 w-4" />
                <span>Public Documentation</span>
              </div>
              <span>|</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Table of Contents - Hidden on mobile */}
          <aside className="hidden lg:block flex-shrink-0">
            <TableOfContents markdownContent={markdownContent} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-none">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    // Custom component for tables to make them responsive
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto my-6">
                        <table
                          className="min-w-full border-collapse border border-gray-300 dark:border-gray-600"
                          {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th
                        className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100"
                        {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td
                        className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100"
                        {...props}>
                        {children}
                      </td>
                    ),
                    // Custom styling for code blocks
                    pre: ({ children, ...props }) => (
                      <pre
                        className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto border border-gray-200 dark:border-gray-700"
                        {...props}>
                        {children}
                      </pre>
                    ),
                    code: ({ children, className, ...props }: any) => {
                      const isInline = !className?.includes('language-');
                      return isInline ? (
                        <code
                          className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600"
                          {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                    // Custom styling for alerts/warnings
                    blockquote: ({ children, ...props }) => (
                      <blockquote
                        className="border-l-4 border-yellow-400 dark:border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 p-4 my-4 text-yellow-800 dark:text-yellow-200"
                        {...props}>
                        {children}
                      </blockquote>
                    ),
                    // Add IDs to headings for navigation
                    h1: ({ children, ...props }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      return (
                        <h1
                          id={id}
                          className="text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2"
                          {...props}>
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      return (
                        <h2
                          id={id}
                          className="text-2xl font-semibold mt-8 mb-4 text-gray-900 dark:text-white"
                          {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      return (
                        <h3
                          id={id}
                          className="text-xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white"
                          {...props}>
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const id = children
                        ?.toString()
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, '-')
                        .replace(/(^-|-$)/g, '');
                      return (
                        <h4
                          id={id}
                          className="text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white"
                          {...props}>
                          {children}
                        </h4>
                      );
                    },
                    // Custom styling for lists
                    ul: ({ children, ...props }) => (
                      <ul
                        className="list-disc pl-6 my-4 text-gray-900 dark:text-gray-100"
                        {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol
                        className="list-decimal pl-6 my-4 text-gray-900 dark:text-gray-100"
                        {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="mb-1" {...props}>
                        {children}
                      </li>
                    ),
                    // Custom styling for links
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}>
                        {children}
                      </a>
                    ),
                    // Custom styling for horizontal rules
                    hr: ({ ...props }) => (
                      <hr
                        className="my-8 border-t border-gray-300 dark:border-gray-600"
                        {...props}
                      />
                    ),
                    // Enhanced details/summary styling
                    details: ({ children, ...props }) => (
                      <details
                        className="my-4 border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800"
                        {...props}>
                        {children}
                      </details>
                    ),
                    summary: ({ children, ...props }) => (
                      <summary
                        className="bg-gray-50 dark:bg-gray-700 px-4 py-3 cursor-pointer font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors border-b border-gray-200 dark:border-gray-600"
                        {...props}>
                        {children}
                      </summary>
                    ),
                  }}>
                  {markdownContent}
                </ReactMarkdown>
              </div>

              {/* Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Need Additional Support?
                    </h3>
                    <p className="text-blue-700 dark:text-blue-200 mb-4">
                      If you encounter issues not covered in this guide, our
                      support team is here to help.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        <strong>Contact Information:</strong>
                        <ul className="mt-2 space-y-1">
                          <li>📧 Email your CSV file and error screenshots</li>
                          <li>📱 Include your system administrator</li>
                          <li>
                            📝 Provide a detailed description of the issue
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
                  <p className="text-sm">
                    This documentation is automatically generated from the CSV
                    Import User Guide.
                    <br />
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
