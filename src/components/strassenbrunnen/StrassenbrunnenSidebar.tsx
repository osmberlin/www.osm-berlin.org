import { XMarkIcon } from '@heroicons/react/24/outline'

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
  feature: StrassenbrunnenFeature | null
  onClose: () => void
}

export const StrassenbrunnenSidebar = ({ feature, onClose }: Props) => {
  if (!feature) return null

  const { properties } = feature
  const [lon, lat] = feature.geometry.coordinates

  const getMapCompleteEditUrl = () => {
    const baseUrl = 'https://mapcomplete.org/theme.html'
    const params = new URLSearchParams({
      z: '18',
      lat: lat.toString(),
      lon: lon.toString(),
      userlayout: 'https://studio.mapcomplete.org/11881/themes/berlin_emergency_water_pumps/berlin_emergency_water_pumps.json'
    })
    return `${baseUrl}?${params.toString()}#about_theme`
  }

  const getOsmUrl = () => {
    return `https://www.openstreetmap.org/node/${properties.id}`
  }

  const formatProperty = (key: string, value: string) => {
    const labels: Record<string, string> = {
      name: 'Name',
      description: 'Beschreibung',
      operator: 'Betreiber',
      start_date: 'Eröffnungsdatum',
      access: 'Zugang',
      drinking_water: 'Trinkwasser',
      network: 'Netzwerk',
      ref: 'Referenz',
      wikimedia_commons: 'Wikimedia Commons',
      image: 'Bild',
      wikipedia: 'Wikipedia'
    }

    return {
      label: labels[key] || key,
      value: value
    }
  }

  const getWikimediaCommonsImage = () => {
    // Check for wikimedia_commons tag first, then image tag
    const wikimediaCommons = properties.wikimedia_commons || properties.image
    if (wikimediaCommons && wikimediaCommons.startsWith('File:')) {
      // Convert Wikimedia Commons filename to image URL
      const filename = wikimediaCommons.replace(/^File:/, '')
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}`
    }
    return null
  }

  const getWikimediaCommonsProperty = () => {
    // Return the property name that contains the Wikimedia Commons value
    if (properties.wikimedia_commons) return properties.wikimedia_commons
    if (properties.image && properties.image.startsWith('File:')) return properties.image
    return null
  }

  const getWikipediaUrl = () => {
    // Check for wikipedia tag (e.g., "de:Liste der Straßenbrunnen im Berliner Bezirk Friedrichshain-Kreuzberg")
    const wikipedia = properties.wikipedia
    if (wikipedia) {
      // Extract language and article title
      const match = wikipedia.match(/^([a-z]{2}):(.+)$/)
      if (match) {
        const [, lang, article] = match
        return `https://${lang}.wikipedia.org/wiki/${encodeURIComponent(article)}`
      }
    }
    return null
  }

  const relevantProperties = ['name', 'description', 'operator', 'start_date', 'access', 'drinking_water', 'network', 'ref']
  const displayProperties = relevantProperties
    .filter(key => properties[key])
    .map(key => formatProperty(key, properties[key]))

  const imageUrl = getWikimediaCommonsImage()
  const wikimediaCommonsProperty = getWikimediaCommonsProperty()
  const wikipediaUrl = getWikipediaUrl()

  return (
    <div className="absolute top-0 right-0 h-full w-96 bg-white shadow-lg border-l border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Straßenbrunnen Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {imageUrl && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Bild
              </h3>
              <div className="relative bg-gray-100 border border-gray-200 rounded-md p-2">
                <img
                  src={imageUrl}
                  alt={`Straßenbrunnen ${properties.name || properties.id}`}
                  className="w-full max-h-48 object-contain rounded"
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <a
                  href={`https://commons.wikimedia.org/wiki/${encodeURIComponent(wikimediaCommonsProperty)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded hover:bg-opacity-70 transition-colors"
                >
                  Wikimedia Commons
                </a>
              </div>
            </div>
          )}

          {displayProperties.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                Eigenschaften
              </h3>
              <dl className="space-y-2">
                {displayProperties.map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-700">{label}:</dt>
                    <dd className="text-sm text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}



          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Aktionen
            </h3>
            <div className="space-y-2">
              <a
                href={getMapCompleteEditUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-700 transition-colors"
              >
                In MapComplete bearbeiten
              </a>
              <a
                href={getOsmUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
              >
                In OpenStreetMap anzeigen
              </a>
              {wikipediaUrl && (
                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Wikipedia Artikel
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
