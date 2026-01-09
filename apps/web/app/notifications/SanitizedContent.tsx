"use client";

import DOMPurify from "dompurify";

interface SanitizedContentProps {
  content: string;
}

export function SanitizedContent({ content }: SanitizedContentProps) {
  return (
    <div
      className="text-sm whitespace-pre-wrap"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(content),
      }}
    />
  );
}
