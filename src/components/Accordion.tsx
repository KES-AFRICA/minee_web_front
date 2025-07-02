import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean; // Maintenant false par défaut
  className?: string;
}

export function Accordion({ 
  title, 
  children, 
  className = ""
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <button
        className={`w-full flex items-center justify-between p-4 text-left font-medium transition-colors ${
          isOpen 
            ? "bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-800"
            : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-blue-600 dark:text-blue-400">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-blue-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      <div
        ref={contentRef}
        style={{
          height: `${contentHeight}px`,
          transition: "height 0.3s ease-in-out",
          overflow: "hidden",
        }}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}