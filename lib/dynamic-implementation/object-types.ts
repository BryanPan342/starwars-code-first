import { ObjectType, InterfaceType } from '@aws-cdk/aws-appsync';
import * as scalar from './scalar-types';

export const Node = new InterfaceType('Node', {
  definition: {
    created: scalar.string,
    edited: scalar. string,
    id: scalar.required_id,
  },
});

export const Film = ObjectType.implementInterface('Film', {
  interfaceTypes: [Node],
  definition: {
    title: scalar.string,
    episodeID: scalar.int,
    openingCrawl: scalar.string,
    director: scalar.string,
    producers: scalar.list_string,
    releaseDate: scalar.string,
  },
});

export const Planet = ObjectType.implementInterface('Planet', {
  interfaceTypes: [Node],
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
  },
});

export const Starship = ObjectType.implementInterface('Starship', {
  interfaceTypes: [Node],
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
  },
});

export const Vehicle = ObjectType.implementInterface('Vehicle', {
  interfaceTypes: [Node],
  definition: {
    name: scalar.string,
    model: scalar.string,
    vehicleClass: scalar.string,
    manufacturers: scalar.list_string,
    costInCredits: scalar.float,
    length: scalar.float,
    crew: scalar.string,
    passengers: scalar.string,
    maxAtmospheringSpeed: scalar.int,
    cargoCapacity: scalar.float,
    consumables: scalar.string,
  },
});

export const Species = ObjectType.implementInterface('Species', {
  interfaceTypes: [Node],
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
  },
});

export const Person = ObjectType.implementInterface('Person', {
  interfaceTypes: [Node],
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
  },
});