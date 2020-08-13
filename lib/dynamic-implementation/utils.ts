var pluralize = require('pluralize');
import { ObjectType } from '@aws-cdk/aws-appsync';
import * as globals from './global-types';
import { required_string, int } from './scalar-types';

export interface baseOptions {
  readonly prefix: string;
  readonly objectType: ObjectType
  readonly self?: boolean;
};

export function generateEdge(options: baseOptions): ObjectType {
  const name = `${options.prefix}${options.self ? '' : options.objectType.name}Edge`;
  return new ObjectType(name, {
    definition:{
      node: options.objectType.attribute(),
      cursor: required_string,
    }
  });
};

export function generateConnection(edge: ObjectType, options: baseOptions): ObjectType {
  const connection = `${options.self ? '' : options.objectType.name}`;
  const name = `${options.prefix}${connection}Connection`;
  const plural = pluralize(`${options.self ? options.prefix : options.objectType.name}`);
  return new ObjectType(name, {
    definition:{
      pageInfo: globals.PageInfo.attribute({ isRequired: true }),
      edges: edge.attribute({ isList: true }),
      totalCount: int,
      [plural]: options.objectType.attribute({ isList: true }),
    }
  });
};

export function generateConnectionAndEdge(options: baseOptions): { [key: string]: ObjectType } {
  const edge = generateEdge(options);
  const connection = generateConnection(edge, options);
  return {
    edge: edge,
    connection: connection,
  };
};