import { Project, SearchResponse } from '@/types/modrinth';

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
    throw new Error(`Labrinth API error: ${response.statusText} for URL: ${url}`);
  }

  return response.json();
}

export async function searchProjects(
  query: string = '',
  limit: number = 20,
  offset: number = 0,
  facets?: string[][]
): Promise<SearchResponse> {
  const params: Record<string, string> = {
    limit: limit.toString(),
    offset: offset.toString(),
  };

  if (query) {
    params.query = query;
  }

  if (facets && facets.length > 0) {
    params.facets = JSON.stringify(facets);
  }

  return fetchLabrinth<SearchResponse>('/search', { params });
}

import { TeamMember } from "@/types/modrinth";

export async function getProject(idOrSlug: string): Promise<Project> {
  return fetchLabrinth<Project>(`/project/${idOrSlug}`);
}

export async function getTrendingProjects(limit: number = 12): Promise<SearchResponse> {
  return searchProjects('', limit, 0, undefined);
}

export async function getProjectTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    return await fetchLabrinth<TeamMember[]>(`/team/${teamId}/members`);
  } catch (error) {
    console.error(`Failed to fetch team members for team ${teamId}:`, error);
    return [];
  }
}
