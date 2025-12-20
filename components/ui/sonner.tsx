"use client";

import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-50 group-[.toaster]:border-zinc-800 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-zinc-400",
          actionButton:
            "group-[.toast]:bg-amber-500 group-[.toast]:text-zinc-900",
          cancelButton:
            "group-[.toast]:bg-zinc-800 group-[.toast]:text-zinc-400",
          success:
            "group-[.toaster]:bg-emerald-900/90 group-[.toaster]:border-emerald-800",
          error:
            "group-[.toaster]:bg-red-900/90 group-[.toaster]:border-red-800",
          info: "group-[.toaster]:bg-blue-900/90 group-[.toaster]:border-blue-800",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
