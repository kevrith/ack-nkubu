import { useEffect } from 'react'

export const SITE_NAME = 'ACK St Francis Nkubu'
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://acknkubu.org').replace(/\/$/, '')

const DEFAULT_DESC =
  'ACK St Francis Nkubu — the Anglican Church of Kenya parish in Nkubu, Meru County. Service times, sermons, events, notices and parish life.'
const DEFAULT_IMAGE = '/og-image.jpg'

interface SEOProps {
  /** Page title. Rendered as "<title> | ACK St Francis Nkubu" unless it already names the parish. */
  title?: string
  description?: string
  image?: string
  type?: string
  /** Path only, e.g. "/bible". Combined with SITE_URL for the canonical URL. */
  canonicalPath?: string
  structuredData?: Record<string, unknown> | null
  noIndex?: boolean
}

interface Restore {
  el: Element
  /** null means we created the tag and should remove it on cleanup. */
  previous: string | null
}

/** Upsert a <meta> tag, recording enough to put the head back as we found it. */
function setMeta(attr: 'name' | 'property', key: string, content: string, undo: Restore[]) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
    undo.push({ el, previous: null })
  } else {
    undo.push({ el, previous: el.getAttribute('content') })
  }
  el.setAttribute('content', content)
}

/**
 * Per-route SEO tags. The static tags in index.html cover the site defaults and
 * are what most crawlers read first; this keeps title/description/canonical
 * correct once the SPA has routed.
 */
export function SEO({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  type = 'website',
  canonicalPath = '',
  structuredData = null,
  noIndex = false,
}: SEOProps) {
  useEffect(() => {
    const previousTitle = document.title
    const undo: Restore[] = []

    const fullTitle = !title
      ? `${SITE_NAME} — Anglican Church of Kenya, Nkubu`
      : title.includes('Nkubu')
        ? title
        : `${title} | ${SITE_NAME}`
    const canonical = `${SITE_URL}${canonicalPath || window.location.pathname}`
    const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

    document.title = fullTitle
    setMeta('name', 'description', description, undo)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large', undo)

    setMeta('property', 'og:title', fullTitle, undo)
    setMeta('property', 'og:description', description, undo)
    setMeta('property', 'og:image', ogImage, undo)
    setMeta('property', 'og:type', type, undo)
    setMeta('property', 'og:url', canonical, undo)

    setMeta('name', 'twitter:title', fullTitle, undo)
    setMeta('name', 'twitter:description', description, undo)
    setMeta('name', 'twitter:image', ogImage, undo)

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'canonical'
      document.head.appendChild(link)
      undo.push({ el: link, previous: null })
    } else {
      undo.push({ el: link, previous: link.getAttribute('href') })
    }
    link.href = canonical

    let ld: HTMLScriptElement | null = null
    if (structuredData) {
      ld = document.createElement('script')
      ld.type = 'application/ld+json'
      ld.dataset.seo = 'route'
      ld.textContent = JSON.stringify(structuredData)
      document.head.appendChild(ld)
    }

    return () => {
      document.title = previousTitle
      ld?.remove()
      undo.forEach(({ el, previous }) => {
        if (previous === null) {
          el.remove()
        } else {
          el.setAttribute(el.tagName === 'LINK' ? 'href' : 'content', previous)
        }
      })
    }
  }, [title, description, image, type, canonicalPath, noIndex, JSON.stringify(structuredData)])

  return null
}
