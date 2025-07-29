/* eslint-disable react-refresh/only-export-components */
"use client";
import { forwardRef, createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";

import { useIsMobile } from "../hooks/use-mobile";
import { TooltipProvider } from "../ui/tooltip";
import { cn } from "../../lib/utils";

import type { ComponentProps, CSSProperties } from "react";


// ————— constants —————
const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// ————— context value type —————
export type SidebarContextValue = {
  /** "expanded" when open, "collapsed" when closed */
  state: "expanded" | "collapsed";
  /** sidebar open state (desktop only) */
  open: boolean;
  /** setter for desktop open/closed */
  setOpen: (open: boolean) => void;
  /** overlay open state (mobile only) */
  openMobile: boolean;
  /** setter for mobile overlay */
  setOpenMobile: (open: boolean) => void;
  /** if the viewport is mobile */
  isMobile: boolean;
  /** toggle either desktop or mobile */
  toggleSidebar: () => void;
};

// ————— the context itself —————
export const SidebarContext = createContext<SidebarContextValue | null>(null);

// ————— hook for easy consumption —————
export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }
  return ctx;
}

// ————— provider props —————
interface SidebarProviderProps
  extends ComponentProps<"div"> {
  /** initial desktop open state */
  defaultOpen?: boolean;
  /** controlled desktop open state */
  open?: boolean;
  /** callback when desktop open changes */
  onOpenChange?: (open: boolean) => void;
}

// ————— the provider component —————
export const SidebarProvider = forwardRef<
  HTMLDivElement,
  SidebarProviderProps
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = useState(false);

    // desktop uncontrolled state (read from cookie)
    const [internalOpen, setInternalOpen] = useState<boolean>(() => {
      if (typeof window !== "undefined") {
        const match = document.cookie
          .split("; ")
          .find((c) => c.startsWith(`${SIDEBAR_COOKIE_NAME}=`));
        if (match) {
          return match.split("=")[1] === "true";
        }
      }
      return defaultOpen;
    });

    // actual open = controlled or uncontrolled
    const open = openProp ?? internalOpen;

    // setter that updates cookie and calls onOpenChange if provided
    const setOpen = useCallback(
      (value: boolean | ((prev: boolean) => boolean)) => {
        const newOpen =
          typeof value === "function" ? value(open) : value;
        if (onOpenChange) {
          onOpenChange(newOpen);
        } else {
          setInternalOpen(newOpen);
        }
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${newOpen}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [onOpenChange, open]
    );

    // toggles appropriate state for mobile vs desktop
    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setOpenMobile((o) => !o);
      } else {
        setOpen((o) => !o);
      }
    }, [isMobile, setOpen]);

    // listen for ⌘B / Ctrl+B
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (
          (e.metaKey || e.ctrlKey) &&
          e.key === SIDEBAR_KEYBOARD_SHORTCUT
        ) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    // memoize the context value
    const contextValue = useMemo<SidebarContextValue>(
      () => ({
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }),
      [
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      ]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = "SidebarProvider";
