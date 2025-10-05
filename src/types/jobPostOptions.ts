export interface JobPostOptionsRequest {
  loadingUnloadingService?: string | undefined;
  travelDistance?: string | undefined;
  dumpService?: boolean | undefined;
}

export interface JobPostOptionsResponse {
  id: number;
  jobPostId: number;
  loadingUnloadingService?: string | undefined;
  travelDistance?: string | undefined;
  dumpService: boolean;
  createdAt: Date;
  updatedAt: Date;
}

