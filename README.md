# Star Wars meets AppSync and CDK (code-first)

This example shows a code-first approach to generating a GraphQL API with 
AWS Cloud Development Kit ([CDK](https://github.com/aws/aws-cdk)).

Adapted from the swapi-graphql starwars [schema](https://swapi.dev/).

## Dynamic Schema Generation

AWS Cloud Development Kit offers dynamic schema generation that reduces code 
duplication and allows for modularity. For example, if we look at the SWAPI 
[schema](swapi.graphql) there are several components that are similar, but not 
identical. 

The following section will cover how we can take advantage of CDK's code-first
functionality to tackle dynamic schema generation. 

### Overview

There are 6 object types in the SWAPI Schema:
- Film
- Person
- Planet
- Species
- Starship
- Vehicle

These object types are linked together in a graph by `Connections` and `Edges`.

`Connections` hold a list of target objects that the base object connects to.
For example, the `FilmPersonsConnection` contains a list of `FilmPersonEdges`
and a list of `Person`, where a `Film` is the base object and a `Person` is the
target object.

`Edges` contain the target object within the `XxxConnection`.

This format allows for a paginated response as users can send a query that asks
for the first `X` connections for a specific Film.

If we take another look at the [schema](swapi.graphql), we can see there is 
quite a bit of similarity between each `Edge` and `Connection`, but not enough to
utilize an `interface`.

### File Overview

For the purposes of dynamic schema generation, these are the following files we will use.

`index.ts` - export schema related files

`object-types.ts` - file containing the base object types (Film, Person, etc.)

`scalar-types.ts` - file containing the scalar types

`utils.ts` - file containing the functions to generate `Connections` and `Edges`

```
starwars-code-first
├── bin
│   └── starwars-code-first.ts
├── lib
│   ├── dynamic-implementation
│   │   ├── index.ts
│   │   ├── object-types.ts
│   │   ├── scalar-types.ts
│   │   └── utils.ts
│   ├── starwars-dynamic-stack.ts
│   └── ...
├── README.md
├── swapi.graphql
└── ...
```

### Modularity

Noticing the similarity between each `Connection` and `Edge` we can create a function
that generates an `ObjectType` based its props.

```ts
export interface baseOptions {
  readonly base: ObjectType;
  readonly target: ObjectType;
};

export function generateEdge(options: baseOptions): ObjectType {
  const name = obtainName('Edge', options);
  return new ObjectType(name, {
    definition:{
      node: options.target.attribute(),
      cursor: required_string,
    }
  });
};
```
> You can find the implementation in [utils.ts](lib/dynamic-implementation/utils.ts).

The code snippet above does the job of generating an `XxxEdge` Object Type dynamically.
This allows us to pass properties dynamically in our `cdk-stack.ts` file to construct 
the schema and it's resolvers.

```ts
  /**
   * Generate all connection and edges for a base object type given it's targets
   */
  private generateTargets(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, targets: appsync.ObjectType[]): void{
    targets.map((target) => {
      this.generateAndAppendConnection(base, dataSource, {
        base: base,
        target: target,
      });
    });
  }

  /**
   * Generate a Connection, Edge and Resolver for a given base and target pair
   */
  private generateAndAppendConnection(base: appsync.ObjectType, dataSource: appsync.BaseDataSource, options: schema.baseOptions): void{
    // Create a the Object Types for Edge and Connection
    const link = schema.generateConnectionAndEdge(options);

    // Determine Field Name
    const fieldName = base == this.root ?
      `all${pluralize(options.target.name)}` :
      `${options.target.name.toLowerCase()}Connection`;

    // Create Resolver and add field to base Object Type
    base.addResolvableField(fieldName, link.connection.attribute(), dataSource, {
      args: schema.args,
      requestMappingTemplate: dummyRequest,
      responseMappingTemplate: dummyResponse,
    });
  
    // Push Edges and Connections to class member variable
    this.edges.push(link.edge);
    this.connections.push(link.connection);
  }
```
> You can find the implementation in [starwars-dynamic-stack.ts](lib/starwars-dynamic-stack.ts).

Essentially, we can create functions that define our schema dynamically, thereby
allowing for modular design for large, scalable projects.