import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Person } from './person';
import { Film } from './film';

export const VehiclePilotsEdge = new ObjectType('VehiclePilotsEdge', {
  definition: {
    node: Person.attribute(),
    cursor: scalar.required_string,
  },
});

export const VehiclePilotsConnection = new ObjectType('VehiclePilotsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: VehiclePilotsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Person.attribute({ isList: true }),
  },
});

export const VehicleFilmsEdge = new ObjectType('VehicleFilmsEdge', {
  definition: {
    node: Film.attribute(),
    cursor: scalar.required_string,
  },
});

export const VehicleFilmsConnection = new ObjectType('VehicleFilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: VehicleFilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Film.attribute({ isList: true }),
  },
});

export const Vehicle = ObjectType.fromInterface('Vehicle', globals.Node, {
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
    cargoCapacity: scalar.float,
    consumables: scalar.string,
    filmConnections: {
      type: VehicleFilmsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: VehiclePilotsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  },
});

export const VehiclesEdge = new ObjectType('VehiclesEdge', {
  definition:{
    node: Vehicle.attribute(),
    cursor: scalar.required_string,
  }
});

export const VehiclesConnection = new ObjectType('VehiclesConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: VehiclesEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    people: Vehicle.attribute({ isList: true }),
  }
});