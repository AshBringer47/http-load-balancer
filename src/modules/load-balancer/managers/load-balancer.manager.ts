import { LoadBalancingAlgorithm } from "~src/modules/load-balancer/types/load-balancing-algorithm.abstract";
import { QueueManager } from "~src/modules/load-balancer/managers/queue.manager";
import { MicroservicesDetails } from "~src/modules/load-balancer/types/microservices.types";
import { Injectable } from "@nestjs/common";
import { LBAlgorithmFactory } from "~src/modules/load-balancer/algorithms/load-balancing-algorithm.factory";
import { LoadBalancingAlgorithmNames } from "~src/modules/load-balancer/types/load-balancing-algorithm-names.enum";
import { ProcessRequestDto } from "~src/modules/requests/dtos/process-request-dto";
import { v4 } from "uuid";
import { RequestsCollectionRepository } from "~src/modules/requests/repositories/requests-collection.repository";
import _CONFIG from "~src/config";

@Injectable()
export class LoadBalancer {
  private algorithm: LoadBalancingAlgorithm;

  private microserviceGroups: MicroservicesDetails = {
    data_processor: {
      type: "async",
      microservices: [],
    },
    notifier: {
      type: "sync",
      microservices: [],
    },
  };
  private readonly selectedAlgoName: LoadBalancingAlgorithmNames;

  constructor(
    private readonly requestsCollectionRepository: RequestsCollectionRepository,
    // private readonly queueManager: QueueManager,
  ) {
    this.selectedAlgoName = _CONFIG.loadBalancer.algorithm;
    this.algorithm = LBAlgorithmFactory.createAlgorithm(this.selectedAlgoName);
  }

  async init() {
    // await this.queueManager.init(this.handleAlternateExchangeMessage);
  }

  async handleRequest(processRequestDto: ProcessRequestDto) {
    let correlationId: string;
    if (processRequestDto.headers["correlation-id"])
      correlationId = processRequestDto.headers["correlation-id"];
    else correlationId = v4();
    const group = processRequestDto.headers["microservice-group"];
    if (!this.microserviceGroups[group]) {
      throw new Error(`Group ${group} not found`);
    }
    const microserviceGroup = this.microserviceGroups[group];
    if (microserviceGroup.microservices.length === 0) {
      throw new Error(`No services available for group ${group}`);
    }
    const chosenService = this.algorithm.selectService(microserviceGroup);

    const requestData = {
      group_id: microserviceGroup,
      method: processRequestDto.method,
    };

    if (processRequestDto.method === "GET") {
      requestData["query"] = processRequestDto.query;
    } else {
      requestData["body"] = processRequestDto.body;
    }

    const clientId = processRequestDto.headers["client-id"]
      ? processRequestDto.headers["client-id"]
      : "User via API";

    await this.requestsCollectionRepository.create({
      correlation_id: correlationId,
      request_data: requestData,
      client_service_id: clientId,
      assigned_service_id: chosenService.name,
    });

    await this.commitRequest(processRequestDto);

    return { correlationId, chosenService: chosenService.name };
  }

  private async commitRequest(processMessageRequest: ProcessRequestDto) {
    switch (processMessageRequest.headers["microservice-group"]) {
      case "data_processor":
        await this.handleAsyncRequest();
        break;
      case "notifier":
        await this.handleSyncRequest();
        break;
      default:
        throw new Error("Unknown group");
    }
  }

  private async handleAsyncRequest() {}

  private async handleSyncRequest() {}

  async handleAlternateExchangeMessage(msg: AlternateExchangeMessage) {
    // msg - повідомлення з alternate-exchange
    // Зчитуємо correlation_id, інкрементимо retryNumber
    const { correlationId, group, inputData } = msg;
    await this.requestsCollectionRepository.incrementRetryCount(correlationId);
    const request =
      this.requestsCollectionRepository.findByCorrelationId(correlationId);
    // Знову обираємо сервіс та відправляємо повідомлення
    // return this.handleRequest({
    //   group: group,
    //   clientServiceId: request.client_service_id,
    //   method: request.request_data.method,
    //   request: inputData,
    //   correlationId: correlationId,
    // });
  }
}

export type AlternateExchangeMessage = any;
