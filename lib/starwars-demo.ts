const pluralize = require('pluralize');
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as schema from './dynamic-implementation/index';
import { request } from 'http';

/**
 * A placeholder request mapping template
 */
const dummyRequest = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-request.vtl"));
/**
 * A placeholder response mapping template
 */
const dummyResponse = appsync.MappingTemplate.fromFile(path.join(__dirname, "mapping-templates", "empty-response.vtl"));

export class StarwarsCodeFirstDynamicStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new appsync.GraphqlApi(this, 'SWAPI', {
      name: "SWAPI",
    });

    const string = appsync.GraphqlType.string(); 
    const list_string = appsync.GraphqlType.string({ isList: true });
    const int = appsync.GraphqlType.int();

    const film = new appsync.ObjectType('Film', {
      definition: {
        title: string,
        episodeID: int,
        openingCrawl: string,
        director: string,
        producers: list_string,
        releaseDate: string,
      },
    });

    api.addQuery('allFilms', new appsync.ResolvableField({
      returnType: film.attribute({ isList: true }),
      args: {
        after: string,
        first: int,
        before: string,
        last: int,
      },
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    }));

    api.addType(film);
  }
}