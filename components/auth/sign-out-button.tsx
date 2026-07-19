"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";

export default function SignOutButton({
  className = "",
}: {
  className?: string;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleSignOut}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[#8892b0] transition-colors ${className}`}
      style={{ border: "1px solid rgba(0,201,255,0.15)" }}
    >
      <LogOut size={14} />
      Sign out
    </motion.button>
  );
}
