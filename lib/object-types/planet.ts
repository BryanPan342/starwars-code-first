import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Person } from './person';
import { Film } from './film';

export const PlanetResidentsEdge = new ObjectType('PlanetResidentsEdge', {
  definition: {
    node: Person.attribute(),
    cursor: scalar.required_string,
  },
});

export const PlanetResidentsConnection = new ObjectType('PlanetResidentsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PlanetResidentsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Person.attribute({ isList: true }),
  },
});

export const PlanetFilmsEdge = new ObjectType('PlanetFilmsEdge', {
  definition: {
    node: Film.attribute(),
    cursor: scalar.required_string,
  },
});

export const PlanetFilmsConnection = new ObjectType('PlanetFilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PlanetFilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Film.attribute({ isList: true }),
  },
});

export const Planet = ObjectType.fromInterface('Planet', globals.Node, {
  definition: {
    name: scalar.string,
    diameter: scalar.int,
    rotationPeriod: scalar.int,
    orbitalPeriod: scalar.int,
    gravity: scalar.string,
    population: scalar.float,
    climates: scalar.list_string,
    terrains: scalar.list_string,
    surfaceWater: scalar.float,
    filmConnections: {
      type: PlanetFilmsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: PlanetResidentsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  },
});

export const PlanetEdge = new ObjectType('PlanetEdge', {
  definition:{
    node: Planet.attribute(),
    cursor: scalar.required_string,
  }
});

export const PlanetsConnection = new ObjectType('PlanetsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PlanetEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    people: Planet.attribute({ isList: true }),
  }
});