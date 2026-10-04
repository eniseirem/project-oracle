"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ConfirmButton({
  label,
  confirmLabel = "ARE YOU SURE?",
  variant = "primary",
  onConfirm,
  disabled,
}: {
  label: string;
  confirmLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex gap-2">
        <Button
          variant="danger"
          full
          onClick={() => {
            setConfirming(false);
            onConfirm();
          }}
        >
          {confirmLabel}
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          CANCEL
        </Button>
      </div>
    );
  }

  return (
    <Button variant={variant} full disabled={disabled} onClick={() => setConfirming(true)}>
      {label}
    </Button>
  );
}
