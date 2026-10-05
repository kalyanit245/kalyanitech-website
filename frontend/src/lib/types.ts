export interface Inquiry {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  service: string;
  budget?: string | null;
  message: string;
  created_at: string;
}
