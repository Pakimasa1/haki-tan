import { useState } from 'react'
import { Link, useParams, Navigate } from 'react-router-dom'
import { ChevronLeft, Trash2, User, Calendar, ArrowRight } from 'lucide-react'
import { getMapById } from '@/lib/maps'
import { useAuth } from '@/contexts/AuthContext'
import { useData } from '@/contexts/DataContext'
import { formatDate, formatDistanceToNow } from '@/lib/utils'

export default function LineupDetailsPage() {
  const { lineupId } = useParams<{ lineupId: string }>()
  const { user } = useAuth()
  const { getLineupPointById, getCommentsByLineup, addComment, deleteComment, deleteLineupPoint } =
    useData()

  const [commentText, setCommentText] = useState('')

  const lineup = lineupId ? getLineupPointById(lineupId) : undefined
  const comments = lineupId ? getCommentsByLineup(lineupId) : []
  const map = lineup ? getMapById(lineup.mapId) : undefined

  if (!lineup || !map) {
    return <Navigate to="/" replace />
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !commentText.trim()) return

    addComment({
      lineupId: lineup.id,
      userId: user.id,
      username: user.username,
      content: commentText.trim(),
    })
    setCommentText('')
  }

  const handleDeleteLineup = () => {
    if (confirm('Are you sure you want to delete this lineup? This action cannot be undone.')) {
      deleteLineupPoint(lineup.id)
      window.location.href = `/map/${map.id}/${lineup.side}`
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          HAKI TAN
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link to={`/map/${map.id}`} className="transition-colors hover:text-foreground">
          {map.name}
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <Link to={`/map/${map.id}/${lineup.side}`} className="transition-colors hover:text-foreground">
          {lineup.side} Side
        </Link>
        <ChevronLeft className="h-4 w-4 rotate-180" />
        <span className="text-foreground">{lineup.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: lineup.color }}
          />
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">{lineup.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{lineup.creatorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(lineup.createdAt)}</span>
              </div>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${lineup.side === 'T' ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}
              >
                {lineup.side} Side
              </span>
              {lineup.jumpThrow && (
                <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-500">
                  Jump Throw
                </span>
              )}
            </div>
          </div>
        </div>

        {user?.id === lineup.creatorId && (
          <button
            onClick={handleDeleteLineup}
            className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>

      {/* Images */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Start Position</h3>
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
            {lineup.startImage ? (
              <img
                src={lineup.startImage}
                alt="Start position"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image uploaded
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold">Result</h3>
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-secondary">
            {lineup.resultImage ? (
              <img
                src={lineup.resultImage}
                alt="Result"
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image uploaded
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="mb-8 flex flex-col gap-6">
        {lineup.description && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold">Description</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">{lineup.description}</p>
          </div>
        )}

        {lineup.throwInstructions && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold">Throw Instructions</h3>
            <div className="flex items-start gap-3">
              <ArrowRight className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="whitespace-pre-wrap text-muted-foreground">{lineup.throwInstructions}</p>
            </div>
          </div>
        )}

        {lineup.additionalNotes && (
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="mb-3 text-lg font-semibold">Additional Notes</h3>
            <p className="whitespace-pre-wrap text-muted-foreground">{lineup.additionalNotes}</p>
          </div>
        )}
      </div>

      {/* Comments */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold">
          Comments ({comments.length})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleAddComment} className="mb-6">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {user.username[0].toUpperCase()}
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={!commentText.trim()}
                  className="self-end rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="mb-6 rounded-lg border border-border bg-secondary/50 p-4 text-center text-sm text-muted-foreground">
            <Link to="/login" className="text-primary hover:underline">
              Login
            </Link>{' '}
            to leave a comment
          </div>
        )}

        {/* Comments List */}
        {comments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                  {comment.username[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(comment.createdAt)}
                    </span>
                    {user?.id === comment.userId && (
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="ml-auto rounded p-1 text-muted-foreground transition-colors hover:bg-destructive hover:text-destructive-foreground"
                        title="Delete comment"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
