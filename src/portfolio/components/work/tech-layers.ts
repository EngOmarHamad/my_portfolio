export type TechLayer = 'client' | 'api' | 'data' | 'other'

const CLIENT = /react|typescript|javascript|bootstrap|tailwind|html|css|chart|datatables|jquery|next|vue|angular/i
const DATA = /sql|postgres|entity framework|ef core|linq|mongo|redis|data management|database/i
const OTHER = /docker|git|ci\/cd|azure|aws|postman|swagger/i

export function techLayer(name: string): TechLayer {
  if (DATA.test(name)) return 'data'
  if (CLIENT.test(name)) return 'client'
  if (OTHER.test(name)) return 'other'
  return 'api'
}

export function groupByLayer(technologies: string[]) {
  const layers: Record<TechLayer, string[]> = { client: [], api: [], data: [], other: [] }
  technologies.forEach((tech) => layers[techLayer(tech)].push(tech))
  return layers
}
