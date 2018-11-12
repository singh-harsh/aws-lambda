console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});

exports.handler = async(event, context) => {

    const to = event.Records[0].Sns.MessageAttributes.email.Value;
    const domainName = event.Records[0].Sns.MessageAttributes.domainName.Value;
    const from = "do-not-reply@" + domainName;
    // Create sendEmail params 
    var params = {
        Destination: { /* required */
            ToAddresses: [
                to
                /* more items */
            ]
        },
        Message: { /* required */
            Body: { /* required */
                Text: {
                    Charset: "UTF-8",
                    Data: "Click the link below to reset your password:"
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Reset password at MyCloudWebApi'
            }
        },
        Source: from,
        /* required */
    };
    console.log('===SENDING EMAIL===');
    var sendPromise = await ses.sendEmail(params).promise();
};