import chalk from 'chalk';
import { ConsoleLogger, Logger } from '@nestjs/common';
import { EntityMetadata } from 'typeorm';

export function renderApplicationMetadata(
  metadata: EntityMetadata[],
  options?: { logger?: ConsoleLogger },
) {
  const logger = options?.logger ?? new Logger('RenderApplicationMetadata');
  metadata.forEach((entity: EntityMetadata) => {
    logger.log(chalk.bold.green(`Entity Name: ${entity.name}`));
    logger.log(chalk.yellow(`Table Name: ${entity.tableName}`));
    logger.log(chalk.blue('Columns:'));
    entity.columns.forEach((column) => {
      logger.log(chalk.cyan(`  - Name: ${column.propertyName}`));
      logger.log(chalk.cyan(`    Type: ${chalk.green(column.type)}`));
      if (column.length) {
        logger.log(chalk.cyan(`    Length: ${column.length}`));
      }
    });
    logger.log(chalk.blue('Relations:'));
    entity.relations.forEach((relation) => {
      logger.log(chalk.cyan(`  - Name: ${relation.propertyName}`));
      logger.log(chalk.cyan(`    Type: ${chalk.green(relation.relationType)}`));
      logger.log(
        chalk.cyan(
          `    Related Entity: ${relation.inverseEntityMetadata?.name}`,
        ),
      );
    });
    if (entity.indices.length > 0) {
      logger.log(chalk.blue('Indexes:'));
      entity.indices.forEach((index) => {
        logger.log(chalk.cyan(`  - Name: ${index.name}`));
        logger.log(
          chalk.cyan(
            `    Columns: ${index.columns.map((column) => column.propertyName).join(', ')}`,
          ),
        );
        logger.log(
          chalk.cyan(
            `    Unique: ${chalk.green(index.isUnique ? 'Yes' : 'No')}`,
          ),
        );
      });
    }
    logger.log(chalk.grey('========================='));
  });
}
