export interface Project {
  id: string;
  slug: string;
  project_type: string;
  team: string;
  title: string;
  description: string;
  body: string;
  body_url: string | null;
  published: string;
  updated: string;
  approved: string;
  queued: string;
  status: 'approved' | 'archived' | 'rejected' | 'draft' | 'unlisted' | 'processing' | 'withheld' | 'scheduled' | 'private' | 'unknown';
  requested_status: string | null;
  moderator_message: string | null;
  license: {
    id: string;
    name: string;
    url: string | null;
  };
  client_side: 'required' | 'optional' | 'unsupported';
  server_side: 'required' | 'optional' | 'unsupported';
  downloads: number;
  followers: number;
  categories: string[];
  additional_categories: string[];
  game_versions: string[];
  loaders: string[];
  versions: string[];
  icon_url: string | null;
  issues_url: string | null;
  source_url: string | null;
  wiki_url: string | null;
  discord_url: string | null;
  donation_urls: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  gallery: Array<{
    url: string;
    featured: boolean;
    title: string | null;
    description: string | null;
    created: string;
    ordering: number;
  }>;
  organization: string | null;
}

export interface SearchResultProject {
  slug: string;
  title: string;
  description: string;
  categories: string[];
  client_side: 'required' | 'optional' | 'unsupported';
  server_side: 'required' | 'optional' | 'unsupported';
  project_type: string;
  downloads: number;
  icon_url: string | null;
  project_id: string;
  author: string;
  versions: string[];
  follows: number;
  date_created: string;
  date_modified: string;
  latest_version: string;
  license: string;
  gallery: string[];
  featured_gallery: string | null;
}

export interface SearchResponse {
  hits: SearchResultProject[];
  offset: number;
  limit: number;
  total_hits: number;
}

export interface TeamMember {
  team_id: string;
  user: {
    id: string;
    github_id: number;
    username: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
    bio: string | null;
    created: string;
    role: string;
    badges: number;
  };
  role: string;
  permissions: number;
  accepted: boolean;
  payouts_split: number | null;
  ordering: number;
}
