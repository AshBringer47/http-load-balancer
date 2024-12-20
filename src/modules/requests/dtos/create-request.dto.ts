export class CreateRequestDto {
  correlation_id: string;
  request_data: {
    group_id: string;
    method: string;
    body: unknown;
  };
  client_service_id: string;
  assigned_service_id: string;
  retry_number?: number;
}
