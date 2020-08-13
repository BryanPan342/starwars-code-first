var pluralize = require('pluralize');
import { ObjectType } from '@aws-cdk/aws-appsync';
import * as globals from './global-types';
import { required_string, int } from './scalar-types';

/**
 * The base options for creating an edge or connection
 * 
 * If base is Foo and target is Bar:
 * 
 * `FooBarsEdge | FooBarsConnection`
 * 
 * @option base - the prefix for this Object Type
 * @option target - the Object Type that the prefix is connected to
 */
export interface baseOptions {
  readonly base: ObjectType;
  readonly target: ObjectType;
};

/**
 * 
 * @param suffix the end of the name (i.e. Edge or Connection)
 * @param options the options associated with this name
 */
function obtainName(suffix: string, options: baseOptions): string {
  const sameType: boolean = options.base == options.target;
  const target = pluralize(options.target.name);
  const prefix = sameType ? '' : options.base.name;

  return `${prefix}${target}${suffix}`;
}

export function generateEdge(options: baseOptions): ObjectType {
  const name = obtainName('Edge', options);
  return new ObjectType(name, {
    definition:{
      node: options.target.attribute(),
      cursor: required_string,
    }
  });
};

export function generateConnection(edge: ObjectType, options: baseOptions): ObjectType {
  const name = obtainName('Connection', options);
  const plural = pluralize(options.target.name).toLowerCase();
  return new ObjectType(name, {
    definition:{
      pageInfo: globals.PageInfo.attribute({ isRequired: true }),
      edges: edge.attribute({ isList: true }),
      totalCount: int,
      [plural]: options.target.attribute({ isList: true }),
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