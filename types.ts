export interface ClientData {
  name: string;
  email: string;
  instagram: string;
  country: string;
  timestamp: string;
}

export interface FormStatus {
  submitted: boolean;
  submitting: boolean;
  error: string | null;
}