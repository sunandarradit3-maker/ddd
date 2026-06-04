import React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, variant = "default", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "secondary" | "outline" }) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition";
  const styles = {
    default: "bg-emerald-500 text-white hover:bg-emerald-600",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-100",
    outline: "border border-slate-200 bg-transparent hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800",
  }[variant];
  return <button className={cn(base, styles, className)} {...props} />;
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-2xl border border-slate-200 bg-transparent px-4 py-3 outline-none placeholder:text-slate-400 dark:border-slate-800", props.className)} />;
}

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-3xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur dark:border-slate-800 dark:bg-slate-900/80", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-4 md:p-5", className)} {...props} />;
}

export function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
