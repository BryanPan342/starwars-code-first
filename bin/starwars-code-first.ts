#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StarwarsCodeFirstStack } from '../lib/starwars-code-first-stack';

const app = new cdk.App();
new StarwarsCodeFirstStack(app, 'StarwarsCodeFirstStack');
