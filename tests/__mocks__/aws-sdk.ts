import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

AWSMock.setSDKInstance(AWS);

AWSMock.mock('S3', 'getObject', (params: {
  Bucket: string,
  Key: string
}, callback) => {
  return callback(null, {
    ContentType: 'text',
    Body: `${params.Bucket}-${params.Key}`
  });
})

AWSMock.mock('SecretsManager', 'getSecretValue', (params: {
  SecretId: string
}, callback) => {
  return callback(null, {
    SecretString: params.SecretId
  })
})

AWSMock.mock('SSM', 'getParameter', (params: {
  Name: string,
  WithDecryption: boolean
}, callback) => {
  return callback(null, {
    Parameter: {
      Value: `${params.Name}-${String(params.WithDecryption)}`
    }
  })
})