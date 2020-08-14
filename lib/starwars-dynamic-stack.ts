const pluralize = require('pluralize');
import * as path from 'path';
import { writeFile } from 'fs';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as schema from './dynamic-implementation/index';

const dummyRequest = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-request.vtl"));
const dummyResponse = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-response.vtl"));

export class StarwarsCodeFirstDynamicStack extends cdk.Stack {

  protected globals: { [key: string]: appsync.ObjectType | appsync.InterfaceType };
  protected objectTypes: { [key: string]: appsync.ObjectType };
  protected edges: appsync.ObjectType[];
  protected connections: appsync.ObjectType[];
  protected root: appsync.ObjectType;
  protected api: appsync.GraphQLApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.api = new appsync.GraphQLApi(this, 'SWAPI', {
      name: "SWAPI",
      schemaDefinition: appsync.SchemaDefinition.CODE,
    });

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

    // Connections as strings
    const objectConnections: { [key: string]: string[]} = {
      Film: ['Species', 'Starship', 'Vehicle', 'Person', 'Planet'],
      Planet: ['Person', 'Film'],
      Starship: ['Person', 'Film'],
      Vehicle: ['Person', 'Film'],
      Species: ['Person', 'Film'],
      Person: ['Film', 'Starship', 'Vehicle'],
    };

    // Generating all Connections, Edges and their Resolvers
    Object.keys(objectConnections).forEach((k) => {
      const targets = objectConnections[k].map((type) => this.objectTypes[type]);
      this.generateTargets(this.objectTypes[k], dummy, targets);
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
