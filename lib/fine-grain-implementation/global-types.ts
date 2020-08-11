import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from './scalar-types';

export const PageInfo = new ObjectType('PageInfo', {
  definition: {
    hasNextPage: scalar.required_boolean,
    hasPreviousPage: scalar.required_boolean,
    startCursor: scalar.string,
    endCursor: scalar.string,
  },
});

export const required_PageInfo = PageInfo.attribute({ isRequired: true });

export const Node = new Interface('Node', {
  defintion: {
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