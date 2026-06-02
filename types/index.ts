export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  createdAt: string
}

export interface LineupPoint {
  id: string
  mapId: string
  side: 'T' | 'CT'
  title: string
  description: string
  color: string
  x: number
  y: number
  startImage?: string
  resultImage?: string
  throwInstructions?: string
  jumpThrow?: boolean
  additionalNotes?: string
  creatorId: string
  creatorName: string
  createdAt: string
}

export interface Comment {
  id: string
  lineupId: string
  userId: string
  username: string
  content: string
  createdAt: string
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  content: string
  createdAt: string
}

export interface Map {
  id: string
  name: string
  image: string
  radarT: string
  radarCT: string
}
