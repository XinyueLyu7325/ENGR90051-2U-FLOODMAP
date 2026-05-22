import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X } from "lucide-react";

export interface HelpTooltipProps {
  title: string;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function HelpTooltip({ title, content, position = "bottom" }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const positionStyles = {
    top: { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    bottom: { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" },
    left: { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
    right: { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" },
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-5 h-5 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(30,136,229,0.12)",
          border: "1px solid rgba(30,136,229,0.2)",
        }}
      >
        <HelpCircle size={12} color="#1E88E5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: "rgba(11,37,69,0.3)" }}
            />

            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: position === "bottom" ? -10 : 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute z-50 rounded-2xl p-4"
              style={{
                ...positionStyles[position],
                background: "white",
                boxShadow: "0 12px 32px -8px rgba(11,37,69,0.25)",
                border: "1px solid rgba(30,136,229,0.15)",
                minWidth: 240,
                maxWidth: 320,
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0B2545" }}>
                  {title}
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "rgba(11,37,69,0.06)" }}
                >
                  <X size={12} color="#0B2545" />
                </button>
              </div>
              <div style={{ fontSize: 13, color: "#44525F", lineHeight: 1.5 }}>
                {content}
              </div>

              
              <div
                className="absolute w-3 h-3 rotate-45"
                style={{
                  background: "white",
                  border: "1px solid rgba(30,136,229,0.15)",
                  ...(position === "bottom" && {
                    top: -6,
                    left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    borderRight: "none",
                    borderBottom: "none",
                  }),
                  ...(position === "top" && {
                    bottom: -6,
                    left: "50%",
                    transform: "translateX(-50%) rotate(45deg)",
                    borderLeft: "none",
                    borderTop: "none",
                  }),
                  ...(position === "right" && {
                    left: -6,
                    top: "50%",
                    transform: "translateY(-50%) rotate(45deg)",
                    borderRight: "none",
                    borderTop: "none",
                  }),
                  ...(position === "left" && {
                    right: -6,
                    top: "50%",
                    transform: "translateY(-50%) rotate(45deg)",
                    borderLeft: "none",
                    borderBottom: "none",
                  }),
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
