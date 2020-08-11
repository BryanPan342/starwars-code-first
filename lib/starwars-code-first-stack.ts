import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as schema from './function-based-implementation/index';
import { ObjectType } from '@aws-cdk/aws-appsync';

export class StarwarsCodeFirstStack extends cdk.Stack {
  protected globals: { [key: string]: appsync.ObjectType | appsync.InterfaceType };
  protected objectTypes: { [key: string]: appsync.ObjectType };
  protected edges: appsync.ObjectType[];
  protected connections: appsync.ObjectType[];
  protected api: appsync.GraphQLApi;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.api = new appsync.GraphQLApi(this, 'SWAPI', {
      name: "SWAPI",
      schemaDefinition: appsync.SchemaDefinition.CODE,
    });

    this.globals = {
      Node: schema.Node,
      PageInfo: schema.PageInfo,
    };

    this.objectTypes = {
      Film: schema.Film,
      Planet: schema.Planet,
      Starship: schema.Planet,
      Vehicle: schema.Vehicle,
      Species: schema.Species,
      Person: schema.Person,
    };

    this.edges = [];
    this.connections = [];

    const dummy = this.api.addNoneDataSource('DummyDS', 'Just to fill up space');

    // Connections as strings
    const objectConnections: { [key: string]: string[]} = {
      Film: ['Species', 'Starship', 'Vehicle', 'Person', 'Planet'],
      Planet: ['Person', 'Film'],
      Starship: ['Person', 'Film'],
      Vehicle: ['Person', 'Film'],
      Species: ['Person', 'Film'],
      Person: ['Film', 'Starship', 'Vehicle'],
    };

    Object.keys(objectConnections).forEach((k) => {
      this.generateConnections(this.objectTypes[k], dummy, objectConnections[k]);
    });

    this.appendAllToSchema();
  }

  private generateConnections(base: ObjectType, dataSource: appsync.BaseDataSource, connections: string[]): void{
    connections.map((c) => {
      this.generateAndAppendConnection(this.objectTypes.Film, dataSource, {
        prefix: base.name,
        objectType: this.objectTypes[c],
      });
    });
    this.generateAndAppendConnection(this.objectTypes.Film, dataSource, {
      prefix: base.name,
      objectType: base,
      self: true,
    });
  }

  private generateAndAppendConnection(base: ObjectType, dataSource: appsync.BaseDataSource, options: schema.baseOptions): void{
    const link = schema.generateConnectionAndEdge(options);
    const fieldName = `${options.objectType.name}Connection`;
    base.addResolvableType(fieldName, dataSource, {
      type: options.objectType,
      args: schema.args,
      request: ...,
      response: ...,
    });
    this.edges.push(link.edge);
    this.connections.push(link.connection);
  }

  private appendAllToSchema(): void{
    Object.keys(this.globals).forEach( (k) => { this.api.appendToSchema(this.globals.k); });
    Object.keys(this.objectTypes).forEach( (k) => { this.api.appendToSchema(this.objectTypes.k); });
    this.edges.map((t) => this.api.appendToSchema(t));
    this.connections.map((t) => this.api.appendToSchema(t));
  }
}
