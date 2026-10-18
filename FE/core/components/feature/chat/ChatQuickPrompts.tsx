"use client";

import { QUICK_PROMPTS } from "@/core/hooks/useChatPresenter";

interface ChatQuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export default function ChatQuickPrompts({
  onSelectPrompt,
  disabled = false,
}: ChatQuickPromptsProps) {
  return (
    <div className="px-3 py-2 border-t border-border/40 bg-muted/20">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1.5">
        <span>Gợi ý câu hỏi nhanh:</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {QUICK_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="text-[11px] text-left px-2.5 py-1 rounded-full bg-background/80 hover:bg-primary/10 hover:text-primary border border-border/60 hover:border-primary/40 transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-95"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
