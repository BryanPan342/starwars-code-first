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
      console.log(`Making Connections for ${k}`);
      this.generateConnections(this.objectTypes[k], dummy, objectConnections[k]);
    });

    this.root = new appsync.ObjectType('Root', {
      definition: {
        node: new appsync.ResolvableField(this.globals.Node.attribute(), dummy, {
          args: {
            id: schema.required_id,
          },
          requestMappingTemplate: dummyRequest,
          responseMappingTemplate: dummyResponse,
        })
      },
    });

    Object.keys(this.objectTypes).forEach((type) => {
      const objectType = this.objectTypes[type];
      const fieldName = type.toLowerCase();
      this.generateAndAppendConnection(this.root, dummy, {
        base: objectType,
        target: objectType,
      });
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

  private generateConnections(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, connections: string[]): void{
    connections.map((c) => {
      console.log(`..... connecting to ${c}`);
      this.generateAndAppendConnection(base, dataSource, {
        base: base,
        target: this.objectTypes[c],
      });
    });
  }

  private generateAndAppendConnection(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, options: schema.baseOptions): void{
    const link = schema.generateConnectionAndEdge(options);
    const fieldName = base == this.root ?
      `all${pluralize(options.target.name)}` :
      `${options.target.name.toLowerCase()}Connection`;

    base.addResolvableField(fieldName, link.connection.attribute(), dataSource, {
      args: schema.args,
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    });
  
    this.edges.push(link.edge);
    this.connections.push(link.connection);
  }

  private appendAllToSchema(): void{
    this.api.appendToSchema('schema {\n  query: Root\n}');
    this.api.appendToSchema(this.root.toString());

    console.log('Appending global types');
    Object.keys(this.globals).forEach((k) => {
      const type = this.globals[k];
      console.log(`..... writing ${type.name}`)
      this.api.appendToSchema(type.toString());
    });

    console.log('Appending object types');
    Object.keys(this.objectTypes).forEach((k) => {
      const type = this.objectTypes[k];
      console.log(`..... writing ${type.name}`)
      this.api.appendToSchema(type.toString());
    });

    console.log('Appending edges');
    this.edges.map((t) => this.api.appendToSchema(t.toString()));

    console.log('Appending connections');
    this.connections.map((t) => this.api.appendToSchema(t.toString()));
  }
}
