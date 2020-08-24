import '@aws-cdk/assert/jest';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as StarwarsCodeFirst from '../lib/starwars-dynamic-stack';
import { readFileSync } from 'fs';

test('Check Definition', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StarwarsCodeFirst.StarwarsCodeFirstDynamicStack(app, 'MyTestStack');
    // THEN
    const filePath = path.join(__dirname, 'definition');
    const def = readFileSync(filePath).toString();
    expect(stack).toHaveResourceLike("AWS::AppSync::GraphQLSchema", {
      Definition: def,
    });
});
