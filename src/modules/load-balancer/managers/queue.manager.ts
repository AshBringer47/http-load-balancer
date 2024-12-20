import amqp, { Channel, Connection } from "amqplib";
import { Injectable } from "@nestjs/common";
import _CONFIG from "~src/config";

@Injectable()
export class QueueManager {
  private channel: Channel;
  private connection: Connection;

  async init(alternateExchangeMethod: (msg: any) => void): Promise<void> {
    this.connection = await amqp.connect(_CONFIG.loadBalancer.rabbitMqUrl);
    this.channel = await this.connection.createChannel();

    await this.channel.consume("balancer_queue", async (msg) => {});

    // Обмін для недоставлених повідомлень
    await this.channel.assertExchange("balancer_exchange", "direct", {
      durable: true,
    });

    // Черга, на яку підписаний балансувальник
    await this.channel.assertQueue("balancer_queue", { durable: true });
    await this.channel.bindQueue("balancer_queue", "balancer_exchange", "");

    await this.channel.assertExchange("main_exchange", "direct", {
      durable: true,
      alternateExchange: "balancer_exchange", // Вказуємо alternate-exchange
    });
  }

  sendToServiceQueue(group: string, serviceName: string, request: unknown) {
    const queueName = `${group}-${serviceName}`;
    this.channel.publish(
      "main_exchange",
      queueName,
      Buffer.from(request as any),
      {
        persistent: true,
      },
    );
  }
}
