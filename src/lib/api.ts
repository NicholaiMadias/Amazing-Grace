import type { IndustryOption, Intent, Project, ProjectCategory } from './types'

export const projectCategories: ProjectCategory[] = [
  'All',
  'Investment',
  'Infrastructure',
  'Technology',
]

export const projects: Project[] = [
  {
    id: 'gx-01',
    title: 'NEO Port Logistics Expansion',
    region: 'Dammam, KSA',
    budget: 240_000_000,
    category: 'Infrastructure',
    timeline: 'Phase 1 · 2025',
    tag: 'Strategic Logistics',
    summary: 'Automated bonded warehouse network with AI route optimization for Gulf maritime trade.',
    impact: ['Cuts dwell time by 28%', 'Creates 1.8k jobs', 'Net-zero ready corridors'],
  },
  {
    id: 'gx-02',
    title: 'Solar Cooling Microgrid',
    region: 'Muscat, Oman',
    budget: 86_000_000,
    category: 'Technology',
    timeline: 'Ready for EPC',
    tag: 'Climate Tech',
    summary: 'Hybrid solar + thermal storage for coastal industry parks with grid services revenue.',
    impact: ['-34% energy cost', '3-hour ride-through', 'Bankable PPAs'],
  },
  {
    id: 'gx-03',
    title: 'Blue Carbon Mangrove Fund',
    region: 'Abu Dhabi, UAE',
    budget: 120_000_000,
    category: 'Investment',
    timeline: 'Anchor LPs secured',
    tag: 'Nature Capital',
    summary: 'Restoration fund with tokenized MRV and pre-sold removal credits to regional utilities.',
    impact: ['IRR 17.2%', 'Verified removals', 'Biodiversity uplift'],
  },
  {
    id: 'gx-04',
    title: 'Smart Desalination Retrofit',
    region: 'Al Khobar, KSA',
    budget: 310_000_000,
    category: 'Technology',
    timeline: 'Pilot proven',
    tag: 'Water Tech',
    summary: 'Membrane AI controls with low-pressure pumps to cut brine output and power draw.',
    impact: ['-22% OPEX', 'Reuse brine minerals', 'Grid-flex ready'],
  },
  {
    id: 'gx-05',
    title: 'Giga Logistics Freezone',
    region: 'Jebel Ali, UAE',
    budget: 520_000_000,
    category: 'Infrastructure',
    timeline: 'Concession signed',
    tag: 'Freezone',
    summary: 'High-throughput smart yards with bonded drone lanes and automated customs clearance.',
    impact: ['2.1M TEU capacity', 'Customs in 6 minutes', 'Green lease standards'],
  },
  {
    id: 'gx-06',
    title: 'Circular Construction Fund II',
    region: 'Doha, Qatar',
    budget: 190_000_000,
    category: 'Investment',
    timeline: 'Raising',
    tag: 'Circularity',
    summary: 'Growth equity for adaptive reuse, low-carbon materials, and modular fabrication.',
    impact: ['Scope 3 reduction', 'Regional manufacturing', 'Offtake MOUs signed'],
  },
]

export const industries: IndustryOption[] = [
  { value: 'energy', label: 'Energy & Utilities', description: 'Generation, transmission, distribution, storage' },
  { value: 'logistics', label: 'Logistics & Freezones', description: 'Ports, bonded zones, smart warehousing' },
  { value: 'construction', label: 'Construction & Materials', description: 'Modular, low-carbon materials, adaptive reuse' },
  { value: 'climate', label: 'Climate & Nature', description: 'Carbon projects, MRV, blue carbon, mangroves' },
  { value: 'finance', label: 'Capital & Funds', description: 'Sovereign partners, growth equity, blended finance' },
  { value: 'technology', label: 'Technology & AI', description: 'Automation, IoT, data layers, AI control planes' },
]

export const intents: { value: Intent; title: string; description: string; badge: string }[] = [
  {
    value: 'investor',
    title: 'Investor',
    description: 'Curated deal room with risk filters, co-GP slots, and data rooms.',
    badge: 'Capital ready',
  },
  {
    value: 'service-provider',
    title: 'Service Provider',
    description: 'Get matched with owners that need EPC, advisory, or operations capacity.',
    badge: 'Delivery partner',
  },
  {
    value: 'project-owner',
    title: 'Project Owner',
    description: 'Structure, secure, and launch projects with bankable data and trusted execution.',
    badge: 'Portfolio upload',
  },
]

export function filterProjects(category: ProjectCategory) {
  if (category === 'All') return projects
  return projects.filter((project) => project.category === category)
}
