import { Project, SearchResponse, TeamMember } from '@/types/modrinth';

const API_BASE_URL = 'https://api.modrinth.com/v2';
const USER_AGENT = 'ModrinthWiki-App/1.0.0 (https://github.com/APPLEPIE6969/Modrinth-wiki)';

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

async function fetchLabrinth<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...customOptions } = options;
  let url = `${API_BASE_URL}${endpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(params);
    const queryString = searchParams.toString();
    if (queryString) {
        url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    ...customOptions,
    // Implement edge caching: cache responses for 1 hour by default to achieve <1s load times
    // and prevent Gateway Timeouts from hammering the origin API.
    next: { revalidate: 3600, ...customOptions.next },
    headers: {
      'User-Agent': USER_AGENT,
      'Content-Type': 'application/json',
      ...(customOptions.headers || {}),
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Not Found');
    }
    throw new Error(`Labrinth API error: ${response.status} ${response.statusText} for URL: ${url}`);
  }

  return response.json();
}

export async function searchProjects(
  query: string = '',
  limit: number = 24,
  offset: number = 0,
  facets?: string[][],
  index: 'relevance' | 'downloads' | 'follows' | 'newest' | 'updated' = 'relevance'
): Promise<SearchResponse> {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
    index,
  };

  if (query) {
    params.query = query;
  }

  if (facets && facets.length > 0) {
    params.facets = JSON.stringify(facets);
  }

  return fetchLabrinth<SearchResponse>('/search', { params });
}

export async function getProject(idOrSlug: string): Promise<Project> {
  return fetchLabrinth<Project>(`/project/${idOrSlug}`);
}

export async function getProjectTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    return await fetchLabrinth<TeamMember[]>(`/team/${teamId}/members`);
  } catch (error) {
    console.error(`Failed to fetch team members for team ${teamId}:`, error);
    return [];
  }
}

export async function getTrendingProjects(limit: number = 12): Promise<SearchResponse> {
  return searchProjects('', limit, 0, undefined, 'relevance');
}

export async function getGameVersions(): Promise<{version: string, version_type: string, date: string, major: boolean}[]> {
  try {
    // Cache versions for 24 hours as they change rarely
    const data = await fetchLabrinth<{version: string, version_type: string, date: string, major: boolean}[]>('/tag/game_version', { next: { revalidate: 86400 } });
    return data.filter(v => v.version_type === 'release').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function getLoaders(): Promise<{icon: string, name: string, supported_project_types: string[]}[]> {
  try {
    // Cache loaders for 24 hours
    const data = await fetchLabrinth<{icon: string, name: string, supported_project_types: string[]}[]>('/tag/loader', { next: { revalidate: 86400 } });
    return data;
  } catch {
    return [];
  }
}
