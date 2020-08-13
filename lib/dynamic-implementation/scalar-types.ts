import { GraphqlType } from '@aws-cdk/aws-appsync';

// Int
export const int = GraphqlType.int();

// String
export const string = GraphqlType.string();
export const list_string = GraphqlType.string({ isList: true });
export const required_string = GraphqlType.string({ isRequired: true });

// ID
export const id = GraphqlType.id();
export const required_id = GraphqlType.id({ isRequired: true });

// Boolean
export const required_boolean = GraphqlType.boolean({ isRequired: true });

// Float
export const float = GraphqlType.float();