import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { LineupPoint, Comment, ChatMessage } from '@/types'
import { v4 as uuid } from 'uuid'

interface DataContextType {
  lineupPoints: LineupPoint[]
  comments: Comment[]
  chatMessages: ChatMessage[]
  addLineupPoint: (point: Omit<LineupPoint, 'id' | 'createdAt'>) => LineupPoint
  updateLineupPoint: (id: string, data: Partial<LineupPoint>) => void
  deleteLineupPoint: (id: string) => void
  getLineupPointsByMap: (mapId: string, side: 'T' | 'CT') => LineupPoint[]
  getLineupPointById: (id: string) => LineupPoint | undefined
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void
  deleteComment: (id: string) => void
  getCommentsByLineup: (lineupId: string) => Comment[]
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'createdAt'>) => void
  getLineupPointsByUser: (userId: string) => LineupPoint[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const LINEUP_POINTS_KEY = 'haki-tan-lineup-points'
const COMMENTS_KEY = 'haki-tan-comments'
const CHAT_MESSAGES_KEY = 'haki-tan-chat-messages'

export function DataProvider({ children }: { children: ReactNode }) {
  const [lineupPoints, setLineupPoints] = useState<LineupPoint[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const savedPoints = localStorage.getItem(LINEUP_POINTS_KEY)
    const savedComments = localStorage.getItem(COMMENTS_KEY)
    const savedMessages = localStorage.getItem(CHAT_MESSAGES_KEY)
    if (savedPoints) setLineupPoints(JSON.parse(savedPoints))
    if (savedComments) setComments(JSON.parse(savedComments))
    if (savedMessages) setChatMessages(JSON.parse(savedMessages))
  }, [])

  const saveLineupPoints = (points: LineupPoint[]) => {
    localStorage.setItem(LINEUP_POINTS_KEY, JSON.stringify(points))
    setLineupPoints(points)
  }

  const saveComments = (comms: Comment[]) => {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comms))
    setComments(comms)
  }

  const saveChatMessages = (messages: ChatMessage[]) => {
    localStorage.setItem(CHAT_MESSAGES_KEY, JSON.stringify(messages))
    setChatMessages(messages)
  }

  const addLineupPoint = (point: Omit<LineupPoint, 'id' | 'createdAt'>): LineupPoint => {
    const newPoint: LineupPoint = {
      ...point,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }
    saveLineupPoints([...lineupPoints, newPoint])
    return newPoint
  }

  const updateLineupPoint = (id: string, data: Partial<LineupPoint>) => {
    const updated = lineupPoints.map((p) => (p.id === id ? { ...p, ...data } : p))
    saveLineupPoints(updated)
  }

  const deleteLineupPoint = (id: string) => {
    saveLineupPoints(lineupPoints.filter((p) => p.id !== id))
    saveComments(comments.filter((c) => c.lineupId !== id))
  }

  const getLineupPointsByMap = (mapId: string, side: 'T' | 'CT') => {
    return lineupPoints.filter((p) => p.mapId === mapId && p.side === side)
  }

  const getLineupPointById = (id: string) => {
    return lineupPoints.find((p) => p.id === id)
  }

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }
    saveComments([...comments, newComment])
  }

  const deleteComment = (id: string) => {
    saveComments(comments.filter((c) => c.id !== id))
  }

  const getCommentsByLineup = (lineupId: string) => {
    return comments.filter((c) => c.lineupId === lineupId)
  }

  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'createdAt'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: uuid(),
      createdAt: new Date().toISOString(),
    }
    saveChatMessages([...chatMessages, newMessage])
  }

  const getLineupPointsByUser = (userId: string) => {
    return lineupPoints.filter((p) => p.creatorId === userId)
  }

  return (
    <DataContext.Provider
      value={{
        lineupPoints,
        comments,
        chatMessages,
        addLineupPoint,
        updateLineupPoint,
        deleteLineupPoint,
        getLineupPointsByMap,
        getLineupPointById,
        addComment,
        deleteComment,
        getCommentsByLineup,
        addChatMessage,
        getLineupPointsByUser,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
