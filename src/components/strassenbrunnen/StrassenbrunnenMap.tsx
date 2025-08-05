import { useStore } from '@nanostores/react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { type MapGeoJSONFeature, type MapLayerMouseEvent, useMap } from 'react-map-gl/maplibre'
import { BaseMap, type MapInitialViewState } from '../BaseMap/BaseMap'
import { $clickedMapData, $searchParams } from '../BaseMap/store'
import { StrassenbrunnenSidebar } from './StrassenbrunnenSidebar'
import { StrassenbrunnenSource } from './StrassenbrunnenSource'

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

type OverpassResponse = {
  version: number
  generator: string
  osm3s: {
    timestamp_osm_base: string
    timestamp_areas_base: string
    copyright: string
  }
  elements: Array<{
    type: 'node'
    id: number
    lat: number
    lon: number
    tags?: Record<string, string>
  }>
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: Infinity,
    },
  },
})

const fetchStrassenbrunnen = async (): Promise<StrassenbrunnenFeature[]> => {
  const query = `
    [out:json][timeout:25];
    area(id:3600062422)->.searchArea;
    node["network"="Berliner Straßenbrunnen"](area.searchArea);
    out geom;
  `

  const response = await fetch(
    `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`,
  )
  const data: OverpassResponse = await response.json()

  return data.elements.map((element) => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [element.lon, element.lat],
    },
    properties: {
      id: element.id.toString(),
      ...element.tags,
    },
  }))
}

const StrassenbrunnenMapInner = () => {
  const [selectedFeature, setSelectedFeature] = useState<StrassenbrunnenFeature | null>(null)
  const clickedData = useStore($clickedMapData)
  const searchParams = useStore($searchParams)
  const { current: map } = useMap()

  const { data: features, isLoading } = useQuery({
    queryKey: ['strassenbrunnen'],
    queryFn: fetchStrassenbrunnen,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const initialViewState: MapInitialViewState = {
    longitude: 13.38886,
    latitude: 52.517037,
    zoom: 11,
    maxBounds: [
      [13.0, 52.3], // southwest
      [13.8, 52.8], // northeast
    ],
    minZoom: 9,
    maxZoom: 18,
  }

  // Update URL when feature is selected
  const handleFeatureSelect = (feature: StrassenbrunnenFeature | null) => {
    setSelectedFeature(feature)
    if (feature) {
      $searchParams.open({ ...searchParams, selected: feature.properties.id })
    } else {
      const { selected, ...restParams } = searchParams
      $searchParams.open(restParams)
    }
  }

  // Listen to clicked map data from BaseMap
  useEffect(() => {
    if (clickedData && clickedData.length > 0) {
      const feature = clickedData[0] as unknown as StrassenbrunnenFeature
      handleFeatureSelect(feature)
    }
  }, [clickedData])

  // Show selected feature on page load if URL contains selected ID
  useEffect(() => {
    if (features && searchParams.selected && !selectedFeature) {
      const feature = features.find((f) => f.properties.id === searchParams.selected)
      if (feature) {
        setSelectedFeature(feature)
      }
    }
  }, [features, searchParams.selected, selectedFeature])

  const handleSidebarClose = () => {
    handleFeatureSelect(null)
  }

  const hoveredFeatures = useRef<MapGeoJSONFeature[]>([])

  const handleMouseMove = ({ features }: MapLayerMouseEvent) => {
    const currentFeatures = features || []

    // Clear previous hover states
    hoveredFeatures.current.forEach((f) => {
      if (f.id !== undefined) {
        map?.setFeatureState(f, { hover: false })
      }
    })

    // Set new hover states
    currentFeatures.forEach((f) => {
      if (f.id !== undefined) {
        map?.setFeatureState(f, { hover: true })
      }
    })

    hoveredFeatures.current = currentFeatures
  }

  const handleMouseLeave = () => {
    // Clear all hover states
    hoveredFeatures.current.forEach((f) => {
      if (f.id !== undefined) {
        map?.setFeatureState(f, { hover: false })
      }
    })
    hoveredFeatures.current = []
  }

  return (
    <div className="relative h-full w-full">
      <BaseMap
        initialViewState={initialViewState}
        interactiveLayerIds={['strassenbrunnen-points']}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <StrassenbrunnenSource
          features={features || []}
          isLoading={isLoading}
          selectedFeatureId={selectedFeature?.properties.id}
        />
      </BaseMap>

      <StrassenbrunnenSidebar feature={selectedFeature} onClose={handleSidebarClose} />
    </div>
  )
}

export const StrassenbrunnenMap = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StrassenbrunnenMapInner />
    </QueryClientProvider>
  )
}
