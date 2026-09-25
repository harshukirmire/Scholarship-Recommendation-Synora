export interface SavedScholarship {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  category: string;
  deadline: string;
  savedAt: string;
  remindersEnabled: boolean;
  notes?: string;
}
