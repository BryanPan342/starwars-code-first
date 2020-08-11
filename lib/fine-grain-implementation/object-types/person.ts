import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Planet } from './planet';
import { Species } from './species';
import { Starship } from './starship';
import { Vehicle } from './vehicle';
import { Film } from './film';

export const PersonVehiclesEdge = new ObjectType('PersonVehiclesEdge', {
  definition: {
    node: Vehicle.attribute(),
    cursor: scalar.required_string,
  },
});

export const PersonVehiclesConnection = new ObjectType('PersonVehiclesConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PersonVehiclesEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Vehicle.attribute({ isList: true }),
  },
});

export const PersonStarshipsEdge = new ObjectType('PersonStarshipsEdge', {
  definition: {
    node: Starship.attribute(),
    cursor: scalar.required_string,
  },
});

export const PersonStarshipsConnection = new ObjectType('PersonStarshipsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PersonStarshipsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Starship.attribute({ isList: true }),
  },
});

export const PersonFilmsEdge = new ObjectType('PersonFilmsEdge', {
  definition: {
    node: Film.attribute(),
    cursor: scalar.required_string,
  },
});

export const PersonFilmsConnection = new ObjectType('PersonFilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PersonFilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Film.attribute({ isList: true }),
  },
});

export const Person: ObjectType = ObjectType.fromInterface('Person', globals.Node, {
  definition: {
    name: scalar.string,
    birthYear: scalar.string,
    gender: scalar.string,
    eyeColor: scalar.string,
    hairColor: scalar.string,
    skinColor: scalar.string,
    height: scalar.int,
    mass: scalar.float,
    homeworld: Planet.attribute(),
    species: Species.attribute(),
    filmConnections: {
      type: PersonFilmsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    starshipConnections: {
      type: PersonStarshipsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: PersonVehiclesConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  },
});

export const PeopleEdge = new ObjectType('PeopleEdge', {
  definition:{
    node: Person.attribute(),
    cursor: scalar.required_string,
  }
});

export const PeopleConnection = new ObjectType('PeopleConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: PeopleEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    people: Person.attribute({ isList: true }),
  }
});