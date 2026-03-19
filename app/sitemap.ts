import { MetadataRoute } from 'next'
import { searchProjects } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modrinth-wiki.vercel.app'

  try {
    // Fetch the top 100 trending projects for the sitemap
    const data = await searchProjects('', 100, 0, undefined, 'relevance')

    const projects = data.hits.map((project) => ({
      url: `${baseUrl}/project/${project.slug}`,
      lastModified: new Date(project.date_modified),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      ...projects,
    ]
  } catch (error) {
    console.error("Failed to generate sitemap", error)
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ]
  }
}
