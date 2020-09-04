#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { StarwarsCodeFirstDynamicStack } from '../lib/starwars-dynamic-stack';
import { readFile, writeFile } from 'fs';

const app = new cdk.App();
const stack = new StarwarsCodeFirstDynamicStack(app, 'StarwarsDynamicStack');
// new StarwarsCodeFirstFineGrainStack(app, 'StarwarsFineGrainStack');
app.synth();
readFile('cdk.out/StarwarsDynamicStack.template.json', 'utf8', (err, data) => {
  if (err){
    console.log('Error');
    throw err;
  }
  const definition = JSON.parse(data).Resources.SWAPISchema10C907DB.Properties.Definition;
  writeFile('generated.dynamic.graphql', definition, (err) => {
    if (err) throw err;
  });
});