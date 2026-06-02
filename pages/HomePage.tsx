import { Link } from 'react-router-dom'
import { CS2_MAPS } from '@/lib/maps'
import MapCard from '@/components/MapCard'

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      {/* Hero Section */}
      <section className="flex flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Counter-Strike 2 Lineups
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
          Master Your <span className="text-primary">CS2 Lineups</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground text-pretty">
          Browse, create, and share lineup points for all competitive maps. Perfect your utility
          usage and dominate every round.
        </p>
      </section>

      {/* Maps Grid */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">Select a Map</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {CS2_MAPS.map((map) => (
            <Link key={map.id} to={`/map/${map.id}`}>
              <MapCard map={map} />
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Features</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h3 className="font-semibold">Interactive Maps</h3>
            <p className="text-sm text-muted-foreground">
              Click anywhere on the map to create and manage lineup points
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-semibold">Community Driven</h3>
            <p className="text-sm text-muted-foreground">
              Share your lineups and learn from other players in the community
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="font-semibold">Global Chat</h3>
            <p className="text-sm text-muted-foreground">
              Discuss strategies and connect with other players in real-time
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
