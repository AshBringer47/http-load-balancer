export class ProcessRequestDto {
  body?: body;
  query?: query;
  headers: LBHeaders;
  params: LBParams;
  method: string;
}

export type LBHeaders = {
  "microservice-group": string;
  "correlation-id"?: string;
  "client-id"?: string;
};

export type LBParams = {
  "*": string;
};

type body = Record<string, unknown>;
type query = Record<string, unknown>;
