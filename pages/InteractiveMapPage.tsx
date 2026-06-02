import { useState, useRef } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, Plus, X, Pencil, Trash2 } from 'lucide-react'
import { getMapById, LINEUP_COLORS } from '@/lib/maps'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import type { LineupPoint } from '@/types'

export default function InteractiveMapPage() {
  const { mapId, side } = useParams<{ mapId: string; side: string }>()
  const map = mapId ? getMapById(mapId) : undefined
  const validSide = side === 'T' || side === 'CT' ? side : null

  const { user } = useAuth()
  const { getLineupPointsByMap, addLineupPoint, updateLineupPoint, deleteLineupPoint } = useData()

  const [isCreating, setIsCreating] = useState(false)
  const [selectedPoint, setSelectedPoint] = useState<LineupPoint | null>(null)
  const [newPointPos, setNewPointPos] = useState<{ x: number; y: number } | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    color: LINEUP_COLORS[0].value,
    throwInstructions: '',
    jumpThrow: false,
    additionalNotes: '',
  })

  const mapContainerRef = useRef<HTMLDivElement>(null)

  if (!map || !validSide) {
    return <Navigate to="/" replace />
  }

  const lineupPoints = getLineupPointsByMap(map.id, validSide)

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!user || !isCreating) return

    const rect = mapContainerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setNewPointPos({ x, y })
    setSelectedPoint(null)
  }

  const handleCreatePoint = () => {
    if (!user || !newPointPos || !formData.title.trim()) return

    addLineupPoint({
      mapId: map.id,
      side: validSide,
      title: formData.title,
      description: formData.description,
      color: formData.color,
      x: newPointPos.x,
      y: newPointPos.y,
      throwInstructions: formData.throwInstructions,
      jumpThrow: formData.jumpThrow,
      additionalNotes: formData.additionalNotes,
      creatorId: user.id,
      creatorName: user.username,
    })

    resetForm()
  }

  const handleUpdatePoint = () => {
    if (!selectedPoint || !formData.title.trim()) return

    updateLineupPoint(selectedPoint.id, {
      title: formData.title,
      description: formData.description,
      color: formData.color,
      throwInstructions: formData.throwInstructions,
      jumpThrow: formData.jumpThrow,
      additionalNotes: formData.additionalNotes,
    })

    resetForm()
  }

  const handleDeletePoint = (pointId: string) => {
    if (confirm('Are you sure you want to delete this lineup point?')) {
      deleteLineupPoint(pointId)
      setSelectedPoint(null)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      color: LINEUP_COLORS[0].value,
      throwInstructions: '',
      jumpThrow: false,
      additionalNotes: '',
    })
    setNewPointPos(null)
    setSelectedPoint(null)
    setIsCreating(false)
  }

  const selectPointForEdit = (point: LineupPoint) => {
    setSelectedPoint(point)
    setNewPointPos(null)
    setIsCreating(false)
    setFormData({
      title: point.title,
      description: point.description,
      color: point.color,
      throwInstructions: point.throwInstructions || '',
      jumpThrow: point.jumpThrow || false,
      additionalNotes: point.additionalNotes || '',
    })
  }

  const sideColor = validSide === 'T' ? 'orange' : 'blue'

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          HAKI TAN
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link to={`/map/${map.id}`} className="transition-colors hover:text-foreground">
          {map.name}
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-foreground">{validSide} Side</span>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {map.name} - <span className={`text-${sideColor}-500`}>{validSide} Side</span>
          </h1>
          <p className="text-muted-foreground">
            {lineupPoints.length} lineup{lineupPoints.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {user && (
          <button
            onClick={() => {
              setIsCreating(!isCreating)
              setSelectedPoint(null)
              setNewPointPos(null)
            }}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${isCreating ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
          >
            {isCreating ? (
              <>
                <X className="h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Lineup
              </>
            )}
          </button>
        )}
      </div>

      {isCreating && (
        <div className="rounded-lg border border-primary/50 bg-primary/10 p-4 text-sm">
          Click anywhere on the map below to place a new lineup point
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Interactive Map */}
        <div className="lg:col-span-2">
          <div
            ref={mapContainerRef}
            onClick={handleMapClick}
            className={`relative aspect-square overflow-hidden rounded-xl border border-border bg-card ${isCreating ? 'cursor-crosshair' : ''}`}
          >
            <img
              src={map.radarT}
              alt={`${map.name} radar`}
              className="h-full w-full object-contain"
              crossOrigin="anonymous"
            />

            {/* Existing Points */}
            {lineupPoints.map((point) => (
              <div
                key={point.id}
                className="group absolute"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Link
                  to={`/lineup/${point.id}`}
                  className="block"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="h-4 w-4 rounded-full border-2 border-white shadow-lg transition-transform hover:scale-125"
                    style={{ backgroundColor: point.color }}
                  />
                </Link>
                <div className="absolute left-1/2 top-6 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-popover px-2 py-1 text-xs text-popover-foreground shadow-lg group-hover:block">
                  {point.title}
                  {user?.id === point.creatorId && (
                    <div className="mt-1 flex justify-center gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          selectPointForEdit(point)
                        }}
                        className="rounded p-0.5 hover:bg-accent"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDeletePoint(point.id)
                        }}
                        className="rounded p-0.5 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* New Point Preview */}
            {newPointPos && (
              <div
                className="absolute animate-pulse"
                style={{
                  left: `${newPointPos.x}%`,
                  top: `${newPointPos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div
                  className="h-5 w-5 rounded-full border-2 border-white shadow-lg"
                  style={{ backgroundColor: formData.color }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex flex-col gap-4">
          {(newPointPos || selectedPoint) && (
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-lg font-semibold">
                {selectedPoint ? 'Edit Lineup Point' : 'New Lineup Point'}
              </h3>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., A Site Smoke"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {LINEUP_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setFormData({ ...formData, color: c.value })}
                        className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${formData.color === c.value ? 'border-foreground scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.value }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe this lineup..."
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Throw Instructions</label>
                  <textarea
                    value={formData.throwInstructions}
                    onChange={(e) => setFormData({ ...formData, throwInstructions: e.target.value })}
                    placeholder="Step-by-step throwing instructions..."
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="jumpThrow"
                    checked={formData.jumpThrow}
                    onChange={(e) => setFormData({ ...formData, jumpThrow: e.target.checked })}
                    className="h-4 w-4 rounded border-input"
                  />
                  <label htmlFor="jumpThrow" className="text-sm font-medium">
                    Requires Jump Throw
                  </label>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Additional Notes</label>
                  <textarea
                    value={formData.additionalNotes}
                    onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                    placeholder="Any extra tips or notes..."
                    rows={2}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={resetForm}
                    className="flex-1 rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={selectedPoint ? handleUpdatePoint : handleCreatePoint}
                    disabled={!formData.title.trim()}
                    className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {selectedPoint ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Points List */}
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-4 text-lg font-semibold">Lineup Points</h3>
            {lineupPoints.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No lineup points yet.{' '}
                {user ? 'Click "Create Lineup" to add one!' : 'Login to create lineups.'}
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {lineupPoints.map((point) => (
                  <Link
                    key={point.id}
                    to={`/lineup/${point.id}`}
                    className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <div
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{ backgroundColor: point.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{point.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        by {point.creatorName}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
