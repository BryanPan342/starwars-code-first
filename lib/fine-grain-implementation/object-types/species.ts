import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Person } from './person';
import { Film } from './film';
import { Planet } from './planet';

export const SpeciesPeopleEdge = new ObjectType('SpeciesPeopleEdge', {
  definition: {
    node: Person.attribute(),
    cursor: scalar.required_string,
  },
});

export const SpeciesPeopleConnection = new ObjectType('SpeciesPeopleConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: SpeciesPeopleEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Person.attribute({ isList: true }),
  },
});

export const SpeciesFilmsEdge = new ObjectType('SpeciesFilmsEdge', {
  definition: {
    node: Film.attribute(),
    cursor: scalar.required_string,
  },
});

export const SpeciesFilmsConnection = new ObjectType('SpeciesFilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: SpeciesFilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Film.attribute({ isList: true }),
  },
});

export const Species = ObjectType.fromInterface('Species', globals.Node, {
  definition: {
    name: scalar.string,
    classification: scalar.string,
    designation: scalar.string,
    averageHeight: scalar.float,
    averageLifespan: scalar.int,
    eyeColors: scalar.list_string,
    hairColors: scalar.list_string,
    skinColors: scalar.list_string,
    lanuage: scalar.string,
    homeworld: Planet.attribute(),
    filmConnections: {
      type: SpeciesFilmsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: SpeciesPeopleConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  },
});

export const SpeciesEdge = new ObjectType('SpeciesEdge', {
  definition:{
    node: Species.attribute(),
    cursor: scalar.required_string,
  }
});

export const SpeciesConnection = new ObjectType('SpeciesConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: SpeciesEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    people: Species.attribute({ isList: true }),
  }
});