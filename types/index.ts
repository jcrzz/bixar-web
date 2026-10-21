export interface Project {
  name: string
  category: string
  /** Short free-text location; absent/empty means it isn't rendered. */
  location?: string | null
  description: string
  cover: string
  images: string[]
}

export interface Specialty {
  title: string
  description: string
  image: string
}

export interface Pillar {
  title: string
  description: string
  icon: string
}
