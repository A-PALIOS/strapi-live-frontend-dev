import { MetadataRoute } from 'next'
import qs from 'qs'

const STRAPI_URL = process.env.STRAPI_API_URL!
const SITE_URL = 'https://cmtprooptiki.gr'

async function fetchSlugs(endpoint: string): Promise<string[]> {
  const query = qs.stringify(
    { fields: ['slug'], pagination: { pageSize: 1000 } },
    { encodeValuesOnly: true }
  )
  try {
    const res = await fetch(`${STRAPI_URL}${endpoint}?${query}`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return (data?.data ?? []).map((item: any) => item.slug).filter(Boolean)
  } catch {
    return []
  }
}

async function fetchPages(): Promise<{ slug: string; parentSlug?: string }[]> {
  const query = qs.stringify(
    {
      fields: ['slug'],
      populate: { parent: { fields: ['slug'] } },
      pagination: { pageSize: 1000 },
    },
    { encodeValuesOnly: true }
  )
  try {
    const res = await fetch(`${STRAPI_URL}/api/pages?${query}`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return (data?.data ?? [])
      .map((item: any) => ({
        slug: item.slug as string,
        parentSlug: item.parent?.slug as string | undefined,
      }))
      .filter((p: { slug: string }) => Boolean(p.slug))
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articleSlugs, keyProjectSlugs, teamSlugs, pages] = await Promise.all([
    fetchSlugs('/api/articles'),
    fetchSlugs('/api/key-projects'),
    fetchSlugs('/api/team-members'),
    fetchPages(),
  ])

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/insights`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...pages.map(({ slug, parentSlug }) => ({
      url: parentSlug ? `${SITE_URL}/${parentSlug}/${slug}` : `${SITE_URL}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...articleSlugs.map(slug => ({
      url: `${SITE_URL}/insights/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...keyProjectSlugs.map(slug => ({
      url: `${SITE_URL}/key-projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    ...teamSlugs.map(slug => ({
      url: `${SITE_URL}/team/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
