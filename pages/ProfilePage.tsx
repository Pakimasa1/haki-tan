import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { User, Mail, Calendar, MapPin } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { formatDate } from '@/lib/utils'
import { getMapById } from '@/lib/maps'

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const { getLineupPointsByUser } = useData()

  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(user?.username || '')

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const userLineups = getLineupPointsByUser(user.id)

  const handleSave = () => {
    if (username.trim() && username.trim().length >= 3) {
      updateProfile({ username: username.trim() })
      setIsEditing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Profile Header */}
      <div className="mb-8 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
            {user.username[0].toUpperCase()}
          </div>

          <div className="flex-1">
            {isEditing ? (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full max-w-xs rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false)
                      setUsername(user.username)
                    }}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <h1 className="text-2xl font-bold">{user.username}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md border border-border px-3 py-1 text-sm transition-colors hover:bg-accent"
                  >
                    Edit
                  </button>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{userLineups.length} lineup{userLineups.length !== 1 ? 's' : ''} created</span>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={logout}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-destructive hover:text-destructive-foreground"
          >
            Logout
          </button>
        </div>
      </div>

      {/* User Lineups */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Your Lineups</h2>

        {userLineups.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">No lineups yet</p>
              <p className="text-sm text-muted-foreground">
                Start creating lineups on any map!
              </p>
            </div>
            <Link
              to="/"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Browse Maps
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {userLineups.map((lineup) => {
              const map = getMapById(lineup.mapId)
              return (
                <Link
                  key={lineup.id}
                  to={`/lineup/${lineup.id}`}
                  className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                >
                  <div
                    className="h-4 w-4 shrink-0 rounded-full"
                    style={{ backgroundColor: lineup.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{lineup.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {map?.name} - {lineup.side} Side
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(lineup.createdAt)}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
