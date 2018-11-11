console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
  region: 'us-east-1' 
});
exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const message = event.Records[0].Sns.Message;
    //rvice object, passing the parameters. Then handle the response in the promise callback.

    // Load the AWS SDK for Node.js
    

    // Create sendEmail params 
    var params = {
        Destination: { /* required */
            ToAddresses: [
                message
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Text: {
                    Charset: "UTF-8",
                    Data: "Kaam kar apna"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Bunty'
            }
        },
        Source: 'bunty@csye6225-fall2018-singhhar.me', /* required */
    };
    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(params, function(err, data){
        console.log("Inside Sending Email")
    if(err) {
       console.log(err);
       context.fail(err);
    }
    else {
        console.log("===EMAIL SENT===");
        console.log("EMAIL CODE END");
        console.log('EMAIL: ', email);
        console.log(data);
        context.succeed(event);
        
    }
});
    console.log("Lambda hit")
   // return message;
};

