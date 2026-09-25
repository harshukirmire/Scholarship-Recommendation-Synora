export type ApplicationStatus = 
  | 'NOT_STARTED' 
  | 'IN_PROGRESS' 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED';

export interface ScholarshipApplication {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  category: string;
  status: ApplicationStatus;
  startedAt: string;
  submittedAt?: string;
  updatedAt: string;
  referenceNumber?: string;
  notes?: string;
  deadline: string;
  officialPortalUrl: string;
}
