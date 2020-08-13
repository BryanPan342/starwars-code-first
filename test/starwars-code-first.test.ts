import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as StarwarsCodeFirst from '../lib/starwars-dynamic-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StarwarsCodeFirst.StarwarsCodeFirstDynamicStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
