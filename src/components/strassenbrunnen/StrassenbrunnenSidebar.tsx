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
    'pump:status'?: string
    'pump:style'?: string
    check_date?: string
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
      userlayout:
        'https://studio.mapcomplete.org/11881/themes/berlin_emergency_water_pumps/berlin_emergency_water_pumps.json',
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
      'pump:status': 'Pumpen Status',
      'pump:style': 'Pumpen Stil',
      check_date: 'Prüfdatum',
      wikimedia_commons: 'Wikimedia Commons',
      image: 'Bild',
      wikipedia: 'Wikipedia',
    }

    return {
      label: labels[key] || key,
      value: value,
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

  const relevantProperties = [
    'name',
    'description',
    'operator',
    'start_date',
    'access',
    'drinking_water',
    'network',
    'ref',
    'pump:status',
    'pump:style',
    'check_date',
  ]
  const displayProperties = relevantProperties
    .filter((key) => properties[key])
    .map((key) => formatProperty(key, properties[key]))

  const imageUrl = getWikimediaCommonsImage()
  const wikimediaCommonsProperty = getWikimediaCommonsProperty()
  const wikipediaUrl = getWikipediaUrl()

  return (
    <div className="absolute top-0 right-0 h-full w-96 overflow-y-auto border-l border-gray-200 bg-white shadow-lg">
      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Straßenbrunnen Details</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
              Bilder
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Pump Icon */}
              <div className="rounded-md border border-gray-200 bg-gray-100 p-2">
                <div className="flex h-32 items-center justify-center">
                  {properties['pump:style'] ? (
                    <img
                      src={`/icons/strassenbrunnen/pumpe_${properties['pump:style'].replace(/\s+/g, '_')}.png`}
                      alt={`Pump style: ${properties['pump:style']}`}
                      className="max-h-20 max-w-20 object-contain"
                      onError={(e) => {
                        // Fallback to default icon if specific style not found
                        e.currentTarget.src = '/icons/strassenbrunnen/pumpe_.png'
                      }}
                    />
                  ) : (
                    <img
                      src="/icons/strassenbrunnen/pumpe_.png"
                      alt="Default pump style"
                      className="max-h-20 max-w-20 object-contain"
                    />
                  )}
                </div>
                <p className="mt-2 text-center text-xs text-gray-600">
                  {properties['pump:style'] || 'Standard'}
                </p>
              </div>

              {/* Wikimedia Commons Image */}
              {imageUrl && (
                <div className="relative rounded-md border border-gray-200 bg-gray-100 p-2">
                  <img
                    src={imageUrl}
                    alt={`Straßenbrunnen ${properties.name || properties.id}`}
                    className="h-32 w-full rounded object-contain"
                    onError={(e) => {
                      // Hide image if it fails to load
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                  <a
                    href={`https://commons.wikimedia.org/wiki/${encodeURIComponent(wikimediaCommonsProperty)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-opacity-50 hover:bg-opacity-70 absolute right-2 bottom-2 rounded bg-black px-2 py-1 text-xs text-white transition-colors"
                  >
                    Wikimedia Commons
                  </a>
                </div>
              )}
            </div>
          </div>

          {displayProperties.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-medium tracking-wide text-gray-500 uppercase">
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
            <h3 className="text-sm font-medium tracking-wide text-gray-500 uppercase">Aktionen</h3>
            <div className="space-y-2">
              <a
                href={getMapCompleteEditUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-md border border-blue-600 bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                In MapComplete bearbeiten
              </a>
              <a
                href={getOsmUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
              >
                In OpenStreetMap anzeigen
              </a>
              {wikipediaUrl && (
                <a
                  href={wikipediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
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
