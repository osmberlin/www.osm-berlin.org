import NavigationNews from './layouts/Navigation/NavigationNews.astro'
import PageAboutHeader from './layouts/Navigation/page_about/PageAboutHeader.astro'
import PageAboutMenu from './layouts/Navigation/page_about/PageAboutMenu.astro'

export type NavigationProjects = keyof typeof projectConfigs

// ATTENTION:
// Whenever we add a new project, we need to also add it to
// `src/content/config.ts` which enables adding posts for this project.

type AstroComponentFunction = (_props: Record<string, any>) => any
export type ProjectConfigItem = {
  enabled: boolean
  name: string | null
  root: string
  customHeader?: AstroComponentFunction
  menus:
    | null
    | (
        | {
            label: null | string
            items: { href: string; label: string }[]
          }
        | AstroComponentFunction
      )[]
  additionalFooterLinks: { href: string; label: string }[]
  meta: null | {
    title: string
    description: string | null
    imagePath: string
    imageAlt: string | null
    language: 'de' | 'en'
  }
}

type ProjectConfig = Record<string, ProjectConfigItem>

export const projectConfigs = {
  about: {
    enabled: true,
    name: null,
    root: '/',
    customHeader: PageAboutHeader,
    menus: [PageAboutMenu, NavigationNews],
    additionalFooterLinks: [],
    meta: {
      title: 'OpenStreetMap Berlin',
      description:
        'Projekte der OSM Berlin Community die das Potential von offenen, collaborativen Geodaten zeigen.',
      imagePath: '/social-sharing.png',
      imageAlt: null,
      language: 'de',
    },
  },
  strassenraumkarte: {
    enabled: true,
    name: 'Straßenraumkarte Neukölln',
    root: 'https://strassenraumkarte.osm-berlin.org/',
    menus: null,
    additionalFooterLinks: [],
    // menus: [
    //   {
    //     label: null,
    //     items: [
    //       { href: '/parking/', label: 'Über das Projekt' },
    //       { href: '/parking/project-prototype-neukoelln/report/', label: 'Methodenbericht' },
    //       { href: '/parking/participate/', label: 'Mitmachen' },
    //       { href: '/parking/faq/', label: 'FAQ' },
    //     ],
    //   },
    //   NavigationNews,
    // ],
    // additionalFooterLinks: [],
    meta: {
      title: 'OSM Straßenraumkarte — OpenStreetMap Verkehrswende',
      description: 'Spezialkarten für Neukölln zum Straßenraum.',
      imagePath: '/social-sharing-strassenraumkarte.png',
      imageAlt: 'Detaillierte Darstellung des Straßenraumes auf Basis von OpenStreetMap.',
      language: 'de',
    },
  },
  spielplatzkarte: {
    enabled: true,
    name: 'Spielplatzkarte',
    root: '/spielplatzkarte',
    menus: [
      {
        label: null,
        items: [
          { href: '/spielplatzkarte/', label: 'Über das Projekt' },
          { href: '/spielplatzkarte/karte', label: 'Karte' },
          { href: 'https://osmbln.uber.space/spielplatzkarte/', label: 'Karte in neuem Fenster' },
          { href: '/spielplatzkarte/datenqualitaet', label: 'Daten verbessern' },
        ],
      },
      NavigationNews,
    ],
    additionalFooterLinks: [],
    meta: {
      title: 'Spielplatzkarte Berlin',
      description:
        'Eine freie und interaktive Web-Karte zur digitalen Erkundung von Spielplätzen und Spielgeräten in Berlin',
      imagePath: '/social-sharing-spielplatzkarte.png',
      imageAlt:
        'Beispiel eines Spielplatzes in Neukölln in dem Spielgeräte mit Attributen zu sehen sind.',
      language: 'de',
    },
  },
  crowdmap: {
    enabled: true,
    name: 'Crowdmap',
    root: '/crowdmap',
    menus: [
      {
        label: null,
        items: [{ href: '/crowdmap/', label: 'Über das Projekt' }],
      },
      NavigationNews,
    ],
    additionalFooterLinks: [],
    meta: {
      title: 'Crowdmap-Experiment zur Prüfung von Gebäude Daten in Berlin',
      description:
        'Ein Projekt um die Datenqualität von Geäbuden in OSM für Berlin zu prüfen und zu verbessern.',
      imagePath: '/social-sharing-crowdmap.png',
      imageAlt: 'Luftbild mit OSM Gebäudedaten und Angaben zur Validierung der Gebäude.',
      language: 'de',
    },
  },
  unknown: {
    enabled: false,
    name: null,
    root: '/',
    customHeader: PageAboutHeader,
    menus: null,
    additionalFooterLinks: [],
    meta: {
      title: 'OpenStreetMap Verkehrswende',
      description: null,
      imagePath: '/social-sharing.png',
      imageAlt: '/social-sharing.png',
      language: 'de',
    },
  },
} satisfies ProjectConfig
