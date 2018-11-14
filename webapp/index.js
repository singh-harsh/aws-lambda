console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});

exports.handler = async (event, context) => {

    const to = event.Records[0].Sns.Message;

    // Create listIdentities params 
    var params1 = {
        IdentityType: "Domain",
        MaxItems: 10
    };

    // Create the promise and SES service object
    var listIDsPromise = await new aws.SES({ apiVersion: '2010-12-01' }).listIdentities(params1).promise();
    const domainName = listIDsPromise.Identities[0];

    var from = "do-not-reply@";
    from += domainName;

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
                Html: {
                    Charset: "UTF-8",
                    Data: "<p>Click the link below to reset your password:</p> <br> <b>http://mycloudwebapi.com/reset?email=" + to + "&token=4e163b8b-889a-4ce7-a3f7-61041e323c23<b>"
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
    await ses.sendEmail(params).promise();
};