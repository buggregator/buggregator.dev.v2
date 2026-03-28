export type SponsorTier = 'gold' | 'silver' | 'community'

export type Sponsor = {
  id: string
  name: string
  url: string
  avatar: string
  tier: SponsorTier
  since?: string
  description?: string
}

export const sponsors: Sponsor[] = [
  // Add sponsors here. Example:
  // {
  //   id: 'acme',
  //   name: 'Acme Corp',
  //   url: 'https://acme.example.com',
  //   avatar: 'https://acme.example.com/logo.png',
  //   tier: 'gold',
  //   since: '2024-06',
  //   description: 'Cloud infrastructure for developers',
  // },
]
