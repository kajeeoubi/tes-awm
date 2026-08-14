"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { Check, Info, AlertTriangle, XCircle, Loader2 } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      position="top-center"
      duration={3000}
      visibleToasts={4}
      icons={{
        success: (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-white shrink-0">
            <Check className="h-3 w-3 stroke-[2.5]" />
          </div>
        ),
        info: (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-white shrink-0">
            <Info className="h-3 w-3 stroke-[2.5]" />
          </div>
        ),
        warning: (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-white shrink-0">
            <AlertTriangle className="h-3 w-3 stroke-[2.5]" />
          </div>
        ),
        error: (
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-white shrink-0">
            <XCircle className="h-3 w-3 stroke-[2.5]" />
          </div>
        ),
        loading: (
          <Loader2 className="h-4 w-4 animate-spin text-neutral-900 shrink-0" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group font-sans rounded-2xl border border-neutral-200/80 bg-white/95 px-4 py-3.5 shadow-lg backdrop-blur-md text-xs font-semibold text-neutral-900 flex items-center gap-3 transition-all",
          title: "text-xs font-semibold text-neutral-900 leading-tight",
          description: "text-[11px] font-normal text-neutral-500 mt-0.5",
          actionButton: "rounded-full bg-neutral-900 text-white text-xs font-semibold px-3 py-1",
          cancelButton: "rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold px-3 py-1",
          closeButton: "border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-full",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
