import { ObjectType, InterfaceType } from '@aws-cdk/aws-appsync';
import * as scalar from './scalar-types';

export const PageInfo = new ObjectType('PageInfo', {
  definition: {
    hasNextPage: scalar.required_boolean,
    hasPreviousPage: scalar.required_boolean,
    startCursor: scalar.string,
    endCursor: scalar.string,
  },
});

export const Node = new InterfaceType('Node', {
  definition: {
    created: scalar.string,
    edited: scalar. string,
    id: scalar.required_id,
  },
});

export const args = {
  after: scalar.string,
  first: scalar.int,
  before: scalar.string,
  last: scalar.int,
};