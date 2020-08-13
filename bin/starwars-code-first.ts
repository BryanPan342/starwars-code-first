#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StarwarsCodeFirstDynamicStack } from '../lib/starwars-dynamic-stack';
import { StarwarsCodeFirstFineGrainStack } from '../lib/starwars-fine-grain-stack';

const app = new cdk.App();
new StarwarsCodeFirstDynamicStack(app, 'StarwarsDynamicStack');
// new StarwarsCodeFirstFineGrainStack(app, 'StarwarsFineGrainStack');