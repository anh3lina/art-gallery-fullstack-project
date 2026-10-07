export const TYPES = ['painting', 'sculpture', 'ceramics', 'digital_art']
export type ArtworkType = (typeof TYPES)[number]

export interface Artwork {
    _id: string
    title: string
    artist: string
    type: ArtworkType
    price: number
    available: boolean
}

export interface FormState {
    title: string
    artist: string
    type: ArtworkType
    price: string
    available: boolean
}