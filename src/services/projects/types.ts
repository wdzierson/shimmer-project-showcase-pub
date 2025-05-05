
export interface ProjectSubmitData {
  id?: string;
  title: string;
  client: string;
  description: string;
  imageUrl: string;
  additionalImages?: string[];
  liveUrl?: string;
  involvement?: string;
  year: number;
  tags: string[];
  isNew: boolean;
}
