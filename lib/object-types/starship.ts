import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Person } from './person';
import { Film } from './film';

export const StarshipPilotsEdge = new ObjectType('StarshipPilotsEdge', {
  definition: {
    node: Person.attribute(),
    cursor: scalar.required_string,
  },
});

export const StarshipPilotsConnection = new ObjectType('StarshipPilotsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: StarshipPilotsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Person.attribute({ isList: true }),
  },
});

export const StarshipFilmsEdge = new ObjectType('StarshipFilmsEdge', {
  definition: {
    node: Film.attribute(),
    cursor: scalar.required_string,
  },
});

export const StarshipFilmsConnection = new ObjectType('StarshipFilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: StarshipFilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Film.attribute({ isList: true }),
  },
});

export const Starship = ObjectType.fromInterface('Starship', globals.Node, {
  definition: {
    name: scalar.string,
    model: scalar.string,
    starshipClass: scalar.string,
    manufacturers: scalar.list_string,
    costInCredits: scalar.float,
    length: scalar.float,
    crew: scalar.string,
    passengers: scalar.string,
    maxAtmospheringSpeed: scalar.int,
    hyperdriveRating: scalar.float,
    MGLT: scalar.int,
    cargoCapacity: scalar.float,
    consumables: scalar.string,
    filmConnections: {
      type: StarshipFilmsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: StarshipPilotsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  },
});

export const StarshipsEdge = new ObjectType('StarshipsEdge', {
  definition:{
    node: Starship.attribute(),
    cursor: scalar.required_string,
  }
});

export const StarshipsConnection = new ObjectType('StarshipsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: StarshipsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    people: Starship.attribute({ isList: true }),
  }
});