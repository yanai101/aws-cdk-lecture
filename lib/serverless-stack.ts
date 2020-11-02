import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda";
import * as apiGw from "@aws-cdk/aws-apigateway";
import { AuthorizationType } from '@aws-cdk/aws-apigateway';
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3Deployment from "@aws-cdk/aws-s3-deployment";
import * as cf from "@aws-cdk/aws-cloudfront";



const path = require("path");
    
const appDir = path.join(__dirname, "..", "webSite", "my-project", "dist");




// export class ServerlessStack extends cdk.Stack {
//   constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
//     super(scope, id, props);

//     // The code that defines your stack goes here
//   }
// }

// code2 - interface

interface EvnStackProps extends cdk.StackProps {
  prod: boolean;
}

export class ServerlessStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: EvnStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    //code3 - config
    // The code that defines your stack goes here
    const bucketName = "todo-s3-sample";
    let tableName, lambdaConst, apiGetWayName, dynamoDbReadWrite, concurrency;

    if (props?.prod) {
      dynamoDbReadWrite = 200;
      concurrency = 100;
      tableName = "prod-cdk-todo";
      lambdaConst = { TABLE_NAME: tableName };
      apiGetWayName = "prod-api-gw";
    } else {
      dynamoDbReadWrite = 5;
      concurrency = 5;
      tableName = "staging-cdk-todo";
      lambdaConst = { TABLE_NAME: tableName };
      apiGetWayName = "staging-api-gw";
    }
  
    // --- lambda function ---
    // code4 - lambda function
    const welcomeLambda = new lambda.Function(this, "helloHandler", {
      runtime: lambda.Runtime.NODEJS_12_X,
      code: lambda.Code.fromAsset("lambda"),
      environment: lambdaConst,
      handler: "hello.handler",
    });

    //code6- api-gw (with Cors)

    const api = new apiGw.RestApi(this, apiGetWayName, {
      defaultCorsPreflightOptions: {
        allowOrigins: apiGw.Cors.ALL_ORIGINS,
        allowMethods: apiGw.Cors.ALL_METHODS,
      },
    });

    // code7- getter lambda integration api gw
     const apiHelloInt = new apiGw.LambdaIntegration(welcomeLambda);
     const apiHello = api.root.addResource("hello");
     apiHello.addMethod("GET", apiHelloInt, {
       authorizationType: AuthorizationType.NONE,
     });

     // code8 - dynamodb          
    const table = new dynamodb.Table(this, "todos", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      tableName: tableName,
      readCapacity: dynamoDbReadWrite,
      billingMode: dynamodb.BillingMode.PROVISIONED,
    });

    // code9 - bucketInit 
    const myBucket =
      new s3.Bucket(this, "todoApp", {
        versioned: false,
        bucketName,
        // encryption: BucketEncryption.KMS_MANAGED,
        publicReadAccess: true,
        websiteIndexDocument: "index.html",
      });

   //code10 -Publish to bucket     
    const deployment = new s3Deployment.BucketDeployment(this,"deployStaticWebsite",
      {
        sources: [s3Deployment.Source.asset(appDir)],
        destinationBucket: myBucket,
        destinationKeyPrefix: "",
      }
    );    

   //code11- cloudFront (basic)

  }
}