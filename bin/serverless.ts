#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ServerlessStack } from '../lib/serverless-stack';



const app = new cdk.App();
new ServerlessStack(app, 'ServerlessStack');

// code1- stacks

new ServerlessStack(app, "prod-cdk", {
    prod: true,
    env: {
      region: "eu-west-1",
    },
  });
  new ServerlessStack(app, "staging-cdk", {
    prod: false,
    env: {
      region: "eu-west-1",
    },
  });