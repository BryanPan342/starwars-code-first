const pluralize = require('pluralize');
import * as path from 'path';
import { writeFile } from 'fs';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as schema from './dynamic-implementation/index';

/**
 * A placeholder request mapping template
 */
const dummyRequest = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-request.vtl"));
/**
 * A placeholder response mapping template
 */
const dummyResponse = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-response.vtl"));

export class StarwarsCodeFirstDynamicStack extends cdk.Stack {

  /**
   * Types used by other types (i.e. interface Node, type PageInfo)
   */
  protected globals: { [key: string]: appsync.ObjectType | appsync.InterfaceType };
  /**
   * Object Types (i.e. Film, Person, Starship, etc.)
   */
  protected objectTypes: { [key: string]: appsync.ObjectType };
  /**
   * Edges between two Object Types (i.e. FilmStarshipEdge, etc.)
   */
  protected edges: appsync.ObjectType[];
  /**
   * Connections between two Object Types (i.e. FilmStarshipsEdges, etc.)
   */
  protected connections: appsync.ObjectType[];
  /**
   * The Root type for Queries
   */
  protected root: appsync.ObjectType;
  /**
   * the GraphQL Api for this 
   */
  protected api: appsync.GraphQLApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.api = new appsync.GraphQLApi(this, 'SWAPI', {
      name: "SWAPI",
      schemaDefinition: appsync.SchemaDefinition.CODE,
    });

    /**
     * A placeholder data source
     */
    const dummy = this.api.addNoneDataSource('DummyDS', 'Just to fill up space');

    this.globals = {
      Node: schema.Node,
      PageInfo: schema.PageInfo,
    };

    this.objectTypes = {
      Film: schema.Film,
      Planet: schema.Planet,
      Starship: schema.Starship,
      Vehicle: schema.Vehicle,
      Species: schema.Species,
      Person: schema.Person,
    };

    this.edges = [];
    this.connections = [];

    /**
     * An array for object type connections
     *
     * base: the base object type
     * targets: the targets to connect between
     */
    const objectTargets: {base: appsync.ObjectType, targets: appsync.ObjectType[]}[] = [
      {
        base: schema.Film,
        targets: [schema.Species, schema.Starship, schema.Vehicle, schema.Person, schema.Planet],
      },
      {
        base: schema.Planet,
        targets: [schema.Person, schema.Film],
      },
      {
        base: schema.Starship,
        targets: [schema.Person, schema.Film],
      },
      {
        base: schema.Vehicle,
        targets: [schema.Person, schema.Film],
      },
      {
        base: schema.Species,
        targets: [schema.Person, schema.Film],
      },
      {
        base: schema.Person,
        targets: [schema.Film, schema.Starship, schema.Vehicle],
      },
    ];

    // Generating all Connections, Edges and their Resolvers
    objectTargets.map((connection) => {
      this.generateTargets(connection.base, dummy, connection.targets);
    });

    // Creating the Root Object Type (our query)
    this.root = new appsync.ObjectType('Root', {
      definition: {
        node: new appsync.ResolvableField(this.globals.Node.attribute(), dummy, {
          args: { id: schema.required_id },
          requestMappingTemplate: dummyRequest,
          responseMappingTemplate: dummyResponse,
        })
      },
    });

    // Generate the fields for Root
    Object.keys(this.objectTypes).forEach((type) => {
      const objectType = this.objectTypes[type];
      const fieldName = type.toLowerCase();

      // Generate `TypesConnection` and `TypesEdge` and its resolvable fields
      // i.e. allFilms(...): FilmsConnection
      this.generateAndAppendConnection(this.root, dummy, {
        base: objectType,
        target: objectType,
      });

      // Generate single type queries: type(id: ID, typeID: ID): Type
      // i.e. film(id: ID, filmID: ID): Film
      this.root.addResolvableField(fieldName, objectType.attribute(), dummy, {
        args: {
          id: schema.id,
          [`${fieldName}ID`]: schema.id,
        },
        requestMappingTemplate: dummyRequest,
        responseMappingTemplate: dummyResponse,
      });
    });

    this.appendAllToSchema();
    
    writeFile('generated.dynamic.graphql', this.api.schema.definition, (err) =>{
      if (err) throw err;
    });
  }

  /**
   * Generate all connection and edges for a base object type
   *
   * @param base the base object type
   * @param dataSource the data source linking these types
   * @param targets a list of targets object types
   */
  private generateTargets(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, targets: appsync.ObjectType[]): void{
    targets.map((target) => {
      this.generateAndAppendConnection(base, dataSource, {
        base: base,
        target: target,
      });
    });
  }

  /**
   * Generate a Connection, Edge and Resolver for a given base and target pair
   * @param base the base object type
   * @param dataSource the data source linking these types
   * @param options  a list of targets object types
   */
  private generateAndAppendConnection(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, options: schema.baseOptions): void{
    // Create a the Object Types for Edge and Connection
    const link = schema.generateConnectionAndEdge(options);

    // Determine Field Name
    const fieldName = base == this.root ?
      `all${pluralize(options.target.name)}` :
      `${options.target.name.toLowerCase()}Connection`;

    // Create Resolver and add field to base Object Type
    base.addResolvableField(fieldName, link.connection.attribute(), dataSource, {
      args: schema.args,
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    });
  
    // Push Edges and Connections to class member variable
    this.edges.push(link.edge);
    this.connections.push(link.connection);
  }

  /**
   * Append all schema-related objects to schem
   */
  private appendAllToSchema(): void{
    // Utility Functions
    const append = (input: string) => { this.api.appendToSchema(input); }
    const map = (dict: { [key: string]: appsync.ObjectType | appsync.InterfaceType } ) => {
      Object.keys(dict).forEach((key) => { append(dict[key].toString()); })
    };

    // Appending to schema
    append('schema {\n  query: Root\n}');
    append(this.root.toString());
    map(this.globals);
    map(this.objectTypes);
    this.edges.map((t) => this.api.appendToSchema(t.toString()));
    this.connections.map((t) => this.api.appendToSchema(t.toString()));

  }
}
