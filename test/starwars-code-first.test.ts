import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as StarwarsCodeFirst from '../lib/starwars-code-first-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new StarwarsCodeFirst.StarwarsCodeFirstStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
