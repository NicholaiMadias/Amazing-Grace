export type ProjectCategory = 'All' | 'Investment' | 'Infrastructure' | 'Technology'

export interface Project {
  id: string
  title: string
  region: string
  budget: number
  category: Exclude<ProjectCategory, 'All'>
  timeline: string
  tag: string
  summary: string
  impact: string[]
}

export interface IndustryOption {
  value: string
  label: string
  description?: string
}

export type Intent = 'investor' | 'service-provider' | 'project-owner'
