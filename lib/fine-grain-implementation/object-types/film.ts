import { ObjectType } from '@aws-cdk/aws-appsync';
import * as scalar from '../scalar-types';
import * as globals from '../global-types';
import { Person } from './person';
import { Planet } from './planet';
import { Species } from './species';
import { Starship } from './starship';
import { Vehicle } from './vehicle';

export const FilmVehiclesEdge = new ObjectType('FilmVehiclesEdge', {
  definition: {
    node: Vehicle.attribute(),
    cursor: scalar.required_string,
  },
});

export const FilmVehiclesConnection = new ObjectType('FilmVehiclesConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmVehiclesEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Vehicle.attribute({ isList: true }),
  },
});

export const FilmSpeciesEdge = new ObjectType('FilmSpeciesEdge', {
  definition: {
    node: Species.attribute(),
    cursor: scalar.required_string,
  },
});

export const FilmSpeciesConnection = new ObjectType('FilmSpeciesConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmSpeciesEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Species.attribute({ isList: true }),
  },
});

export const FilmStarshipsEdge = new ObjectType('FilmStarshipsEdge', {
  definition: {
    node: Starship.attribute(),
    cursor: scalar.required_string,
  },
});

export const FilmStarshipsConnection = new ObjectType('FilmStarshipsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmStarshipsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Starship.attribute({ isList: true }),
  },
});

export const FilmPlanetsEdge = new ObjectType('FilmPlanetsEdge', {
  definition: {
    node: Planet.attribute(),
    cursor: scalar.required_string,
  },
});

export const FilmPlanetsConnection = new ObjectType('FilmPlanetsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmPlanetsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Planet.attribute({ isList: true }),
  },
});

export const FilmCharactersEdge = new ObjectType('FilmCharactersEdge', {
  definition: {
    node: Person.attribute(),
    cursor: scalar.required_string,
  },
});

export const FilmCharactersConnection = new ObjectType('FilmCharactersConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmCharactersEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    characters: Person.attribute({ isList: true }),
  },
});

export const Film: ObjectType = ObjectType.fromInterface('Film', globals.Node, {
  definition: {
    title: scalar.string,
    episodeID: scalar.int,
    openingCrawl: scalar.string,
    director: scalar.string,
    producers: scalar.list_string,
    releaseDate: scalar.string,
    speciesConnections: {
      type: FilmSpeciesConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    starshipConnections: {
      type: FilmStarshipsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    vehicleConnections: {
      type: FilmVehiclesConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    characterConnections: {
      type: FilmCharactersConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
    planetConnections: {
      type: FilmPlanetsConnection.attribute(),
      args: globals.args,
      request: ...,
      response: ...,
    },
  }
});

export const FilmsEdge = new ObjectType('FilmsEdge', {
  definition:{
    node: Film.attribute(),
    cursor: scalar.required_string,
  }
});

export const FilmsConnection = new ObjectType('FilmsConnection', {
  definition: {
    pageInfo: globals.required_PageInfo,
    edges: FilmsEdge.attribute({ isList: true }),
    totalCount: scalar.int,
    films: Film.attribute({ isList: true }),
  }
});