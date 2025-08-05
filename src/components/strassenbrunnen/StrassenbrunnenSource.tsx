import { Layer, Source } from 'react-map-gl/maplibre'
import { AddMapImage } from './AddMapImage'

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
    pump_status?: string
    pump_style?: string
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
    <Source id="strassenbrunnen" type="geojson" data={geojson} promoteId="id">
      {/* Load pump style icons */}
      <AddMapImage name="pumpe-default" url="/icons/strassenbrunnen/pumpe_.png" sdf={false} />
      <AddMapImage name="pumpe-borsig" url="/icons/strassenbrunnen/pumpe_Borsig.png" sdf={false} />
      <AddMapImage name="pumpe-fsh-l" url="/icons/strassenbrunnen/pumpe_FSH-L.png" sdf={false} />
      <AddMapImage name="pumpe-krause" url="/icons/strassenbrunnen/pumpe_Krause.png" sdf={false} />
      <AddMapImage
        name="pumpe-lauchhammer"
        url="/icons/strassenbrunnen/pumpe_Lauchhammer.png"
        sdf={false}
      />
      <AddMapImage
        name="pumpe-neue-krause"
        url="/icons/strassenbrunnen/pumpe_Neue_Krause.png"
        sdf={false}
      />
      <AddMapImage name="pumpe-pankow" url="/icons/strassenbrunnen/pumpe_Pankow.png" sdf={false} />
      <AddMapImage
        name="pumpe-ruemmler"
        url="/icons/strassenbrunnen/pumpe_Rümmler.png"
        sdf={false}
      />
      <AddMapImage name="pumpe-wolf" url="/icons/strassenbrunnen/pumpe_Wolf.png" sdf={false} />
      <AddMapImage name="pumpe-wolf-2" url="/icons/strassenbrunnen/pumpe_Wolf_2.png" sdf={false} />
      <AddMapImage
        name="pumpe-historic"
        url="/icons/strassenbrunnen/pumpe_historic.png"
        sdf={false}
      />
      <AddMapImage name="pumpe-modern" url="/icons/strassenbrunnen/pumpe_modern.png" sdf={false} />

      {/* Small circle for hover/click target */}
      <Layer
        id="strassenbrunnen-points-background"
        type="circle"
        paint={{
          'circle-radius': 8,
          'circle-color': [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            '#2563eb',
            '#3182ce',
          ],
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 2,
          'circle-opacity':[
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.95,
            0.6,
          ],
        }}
        filter={['!=', ['get', 'id'], selectedFeatureId || '']}
      />


      {/* Selected/highlight layer */}
      <Layer
        id="strassenbrunnen-points-selected"
        type="circle"
        paint={{
          'circle-radius': 14,
          'circle-color': '#1d4ed8',
          'circle-stroke-color': '#ffffff',
          'circle-stroke-width': 4,
          'circle-opacity': selectedFeatureId ? 0.8 : 0,
        }}
        filter={['==', ['get', 'id'], selectedFeatureId || '']}
      />

      {/* Pump style icons layer */}
      <Layer
        id="strassenbrunnen-points-icons"
        type="symbol"
        layout={{
          'icon-image': [
            'case',
            ['==', ['get', 'pump:style'], 'Borsig'],
            'pumpe-borsig',
            ['==', ['get', 'pump:style'], 'FSH-L'],
            'pumpe-fsh-l',
            ['==', ['get', 'pump:style'], 'Krause'],
            'pumpe-krause',
            ['==', ['get', 'pump:style'], 'Lauchhammer'],
            'pumpe-lauchhammer',
            ['==', ['get', 'pump:style'], 'Neue Krause'],
            'pumpe-neue-krause',
            ['==', ['get', 'pump:style'], 'Pankow'],
            'pumpe-pankow',
            ['==', ['get', 'pump:style'], 'Rümmler'],
            'pumpe-ruemmler',
            ['==', ['get', 'pump:style'], 'Wolf'],
            'pumpe-wolf',
            ['==', ['get', 'pump:style'], 'Wolf 2'],
            'pumpe-wolf-2',
            ['==', ['get', 'pump:style'], 'historic'],
            'pumpe-historic',
            ['==', ['get', 'pump:style'], 'modern'],
            'pumpe-modern',
            'pumpe-default', // default for unknown style
          ],
          'icon-size': 0.1,
          'icon-allow-overlap': true,
          'icon-anchor': 'bottom',
        }}
      />
    </Source>
  )
}
