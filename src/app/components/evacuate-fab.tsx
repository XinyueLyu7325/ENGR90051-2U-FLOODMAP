import { motion } from "motion/react";
import { Navigation } from "lucide-react";
import { t } from "./i18n";
import { useApp } from "./state";

interface EvacuateFABProps {
  onClick: () => void;
}

export function EvacuateFAB({ onClick }: EvacuateFABProps) {
  const { state } = useApp();

  return (
    <motion.button
      onClick={onClick}
      aria-label={t("evacuate", state.lang)}
      className="absolute z-20"
      style={{
        bottom: 216,
        right: 16,
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#1F7A3A",
        boxShadow: "0 4px 12px rgba(31,122,58,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 20,
      }}
    >
      <Navigation size={24} color="white" fill="white" />
    </motion.button>
  );
}
