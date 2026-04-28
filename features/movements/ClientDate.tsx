"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils/formatting";

interface ClientDateProps {
  date: Date;
  className?: string;
}

export function ClientDate({ date, className }: ClientDateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder during SSR to avoid hydration mismatch
    return <span className={className}>--</span>;
  }

  return <span className={className}>{formatDate(date)}</span>;
}
