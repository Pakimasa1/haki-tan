import type { Map } from '@/types'

interface MapCardProps {
  map: Map
}

export default function MapCard({ map }: MapCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10">
      <div className="aspect-video overflow-hidden">
        <img
          src={map.image}
          alt={map.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          crossOrigin="anonymous"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-xl font-bold text-white">{map.name}</h3>
        <p className="text-sm text-white/70">Click to view lineups</p>
      </div>
      <div className="absolute right-3 top-3 rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
        View Map
      </div>
    </div>
  )
}
