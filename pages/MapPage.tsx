import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getMapById } from '@/lib/maps'

export default function MapPage() {
  const { mapId } = useParams<{ mapId: string }>()
  const map = mapId ? getMapById(mapId) : undefined

  if (!map) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          HAKI TAN
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-foreground">{map.name}</span>
      </div>

      {/* Map Header */}
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="aspect-video max-h-64 overflow-hidden">
          <img
            src={map.image}
            alt={map.name}
            className="h-full w-full object-cover"
            crossOrigin="anonymous"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">{map.name}</h1>
          <p className="mt-1 text-white/70">Select a side to view lineups</p>
        </div>
      </div>

      {/* Side Selection */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Link to={`/map/${map.id}/T`}>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-500/10 transition-transform group-hover:scale-150" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-500/20 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <span className="text-4xl font-bold">T</span>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Terrorist Side</h2>
                <p className="mt-1 text-muted-foreground">Attacking lineups</p>
              </div>
            </div>
          </div>
        </Link>

        <Link to={`/map/${map.id}/CT`}>
          <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150" />
            <div className="relative flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <span className="text-4xl font-bold">CT</span>
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Counter-Terrorist Side</h2>
                <p className="mt-1 text-muted-foreground">Defensive lineups</p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  )
}
