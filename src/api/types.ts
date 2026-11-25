export interface Launch {
  id: string;
  name: string;
  date: string;
  statusAbbrev: string;
  statusName: string;
  provider: string;
  rocket: string;
  mission: string;
  missionType: string;
  description: string;
  pad: string;
  location: string;
  image: string;
}

export interface RawLaunch {
  id: string;
  name?: string;
  net?: string;
  image?: string | { image_url?: string } | null;
  status?: { abbrev?: string; name?: string } | null;
  launch_service_provider?: { name?: string } | null;
  rocket?: { configuration?: { full_name?: string; name?: string } | null } | null;
  mission?: { name?: string; type?: string; description?: string } | null;
  pad?: { name?: string; location?: { name?: string } | null } | null;
}

export interface LaunchResponse {
  results: RawLaunch[];
}
