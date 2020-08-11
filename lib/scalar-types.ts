import { GraphqlType } from '@aws-cdk/aws-appsync';

// Int
export const int = new GraphqlType.int();

// String
export const string = new GraphqlType.string();
export const list_string = new GraphqlType.string({ isList: true });
export const required_string = new GraphqlType.string({ isRequired: true });

// ID
export const required_id = new GraphqlType.id({ isRequired: true });

// Boolean
export const required_boolean = new GraphqlType.boolean({ isRequired: true });

// Float
export const float = new GraphqlType.float();