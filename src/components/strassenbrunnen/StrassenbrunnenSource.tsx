import { Layer, Source } from 'react-map-gl/maplibre'

type StrassenbrunnenFeature = {
  type: 'Feature'
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
  properties: {
    id: string
    name?: string
    description?: string
    operator?: string
    start_date?: string
    access?: string
    drinking_water?: string
    [key: string]: any
  }
}

type Props = {
  features: StrassenbrunnenFeature[]
  isLoading: boolean
  selectedFeatureId?: string
}

export const StrassenbrunnenSource = ({ features, isLoading, selectedFeatureId }: Props) => {
  if (isLoading) return null

  const geojson = {
    type: 'FeatureCollection' as const,
    features: features,
  }

  return (
    <Source id="strassenbrunnen" type="geojson" data={geojson}>
      {/* Base layer */}
      <Layer
        id="strassenbrunnen-points"
        type="circle"
        paint={{
          'circle-radius': 6,
          'circle-color': '#3182ce',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-opacity': 0.8,
        }}
      />

      {/* Hover layer using feature state */}
      <Layer
        id="strassenbrunnen-points-hover"
        type="circle"
        paint={{
          'circle-radius': 8,
          'circle-color': '#2563eb',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 3,
          'circle-opacity': ['case', ['boolean', ['feature-state', 'hover'], false], 1, 0],
        }}
      />

      {/* Selected/highlight layer */}
      <Layer
        id="strassenbrunnen-points-selected"
        type="circle"
        paint={{
          'circle-radius': 10,
          'circle-color': '#1d4ed8',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 4,
          'circle-opacity': selectedFeatureId ? 1 : 0,
        }}
        filter={
          selectedFeatureId
            ? ['==', ['get', 'id'], selectedFeatureId]
            : ['==', ['get', 'id'], ['literal', '']]
        }
      />

      <Layer
        id="strassenbrunnen-labels"
        type="symbol"
        layout={{
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-size': 12,
          'text-offset': [0, -1.5],
          'text-anchor': 'bottom',
          'text-allow-overlap': false,
          'text-ignore-placement': false,
        }}
        paint={{
          'text-color': '#1f2937',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1,
        }}
      />
    </Source>
  )
}
