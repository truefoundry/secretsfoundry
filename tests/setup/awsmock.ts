import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

AWSMock.setSDKInstance(AWS);

AWSMock.mock('S3', 'getObject', (params: {
  Bucket: string,
  Key: string
}, callback) => {
  let Body: AWS.S3.Body;
  if (params.Bucket == 'python' && params.Key == 'testing') {
    Body = "7h15#7357@5h0uld$p455";
  } else {
    return callback("Unavailable", null);
  }
  return callback(null, {
    ContentType: 'text',
    Body
  });
})