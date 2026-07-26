export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date_published: string;
  read_time: string;
  hero_emoji: string;
  content: string;
  content_bn: string | null;
  related_destinations: string[];
  cover_image_url: string | null;
  key_facts: KeyFact[] | null;
  highlights: string[];
  is_published: boolean;
}

export interface KeyFact {
  label: string;
  value: string;
  icon?: string;
}

export interface PublicTrip {
  id: string;
  slug: string;
  title: string;
  updated_at: string;
}
