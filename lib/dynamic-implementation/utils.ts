var pluralize = require('pluralize');
import { ObjectType } from '@aws-cdk/aws-appsync';
import { int, string, required_string, required_boolean } from './scalar-types';

export const args = {
  after: string,
  first: int,
  before: string,
  last: int,
};

export const PageInfo = new ObjectType('PageInfo', {
  definition: {
    hasNextPage: required_boolean,
    hasPreviousPage: required_boolean,
    startCursor: string,
    endCursor: string,
  },
});

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
  /**
   * the prefix for this Object Type
   */
  readonly base: ObjectType;
  /**
   * the Object Type that the prefix is connected to
   */
  readonly target: ObjectType;
};

/**
 * Utility Function to obtain the name of an Edge or Connection Type
 * 
 * @param suffix the end of the name (i.e. Edge or Connection)
 * @param options the options associated with this name
 */
function obtainName(suffix: string, options: baseOptions): string {
  // If base and target are the same, do not have prefix
  const isSame: boolean = options.base == options.target;
  const prefix = isSame ? '' : options.base.name;
  const target = pluralize(options.target.name);
  return `${prefix}${target}${suffix}`;
}

/**
 * Generate and xxxXxxEdge Object Type
 *
 * @param options.base the base object type 
 * @param options.target the target object type
 */
export function generateEdge(options: baseOptions): ObjectType {
  const name = obtainName('Edge', options);
  return new ObjectType(name, {
    definition:{
      node: options.target.attribute(),
      cursor: required_string,
    }
  });
};

/**
 * Generate and xxxXxxConnection Object Type
 *
 * @param edge the edge associated with this connection
 * @param options.base the base object type 
 * @param options.target the target object type
 */
export function generateConnection(edge: ObjectType, options: baseOptions): ObjectType {
  const name = obtainName('Connection', options);
  const plural = pluralize(options.target.name).toLowerCase();
  return new ObjectType(name, {
    definition:{
      pageInfo: PageInfo.attribute({ isRequired: true }),
      edges: edge.attribute({ isList: true }),
      totalCount: int,
      [plural]: options.target.attribute({ isList: true }),
    }
  });
};

/**
 * Generates both an edge and connection between two object types.
 *
 * @param options.base the base object type 
 * @param options.target the target object type
 *
 * @returns - `{ edge: ObjectType, connection: ObjectType}`
 */
export function generateConnectionAndEdge(options: baseOptions): { [key: string]: ObjectType } {
  const edge = generateEdge(options);
  const connection = generateConnection(edge, options);
  return {
    edge: edge,
    connection: connection,
  };
};