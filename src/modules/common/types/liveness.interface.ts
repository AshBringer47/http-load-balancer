import {
  LivenessStatuses,
  LivenessServices,
  LivenessHealthStatuses,
} from "./liveness.enum";

export interface ILivenessService {
  status: LivenessStatuses;
  name: LivenessServices;
  condition: {
    health: LivenessHealthStatuses;
  };
}

export interface ILivenessResponse {
  status: string;
  statusCode: number;
  services: ILivenessService[];
}
