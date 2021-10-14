import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

import { response } from './constants';

AWSMock.setSDKInstance(AWS);

AWSMock.mock('S3', 'getObject', (params: {
  Bucket: string,
  Key: string
}, callback) => {
  if (params.Bucket == 'python' && params.Key == 'testing') {
    return callback(null, {
      ContentType: 'text',
      Body: response
    });
  }
  return callback("Unavailable", null);
})

AWSMock.mock('SecretsManager', 'getSecretValue', (params: {
  SecretId: string
}, callback) => {
  if (params.SecretId === 'secret-1-key-usage') {
    return callback(null, {
      SecretString: response
    })
  }
  return callback("Unavailable", null);
})

AWSMock.mock('SSM', 'getParameter', (params: {
  Name: string,
  WithDecryption: boolean
}, callback) => {
  if (params.Name === 'ssm-key-uS1ge' && params.WithDecryption === true) {
    return callback(null, {
      Parameter: {
        Value: response
      }
    })
  }
  return callback("Unavailable", null);
})