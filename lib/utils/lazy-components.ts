import dynamic from "next/dynamic"

// Lazy load heavy components
export const LazyMap = dynamic(
  () =>
    import("@/components/features/startups/StartupMap").then(
      (mod) => mod.StartupMap
    ),
  {
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
    ssr: false
  }
)

export const LazyCalendar = dynamic(
  () =>
    import("@/components/features/events/EventCalendar").then(
      (mod) => mod.EventCalendar
    ),
  {
    loading: () => <div className="h-96 bg-muted animate-pulse rounded-lg" />,
    ssr: false
  }
)
