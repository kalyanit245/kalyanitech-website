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

export interface Job {
  id: string;
  title: string;
  technology: string;
  location: string;
  job_type: string;
  description: string;
  created_at: string;
}
