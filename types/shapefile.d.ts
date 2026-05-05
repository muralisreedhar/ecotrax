declare module 'shapefile' {
  export interface ShapefileFeature {
    type: 'Feature'
    geometry: unknown
    properties: Record<string, unknown> | null
  }

  export interface ShapefileSource {
    read(): Promise<{ done: boolean; value: ShapefileFeature | null }>
  }

  export function open(
    shp: string,
    dbf?: string | null,
    options?: { encoding?: string },
  ): Promise<ShapefileSource>
}
