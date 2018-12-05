console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
    region: 'us-east-1'
});
var docClient = new aws.DynamoDB.DocumentClient({
    region: 'us-east-1'
});

exports.handler = async (event, context) => {
    const to = event.Records[0].Sns.Message;

    var table = "csye6225";
    var params = {
        TableName: table,
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
            ":email": to
        }
    };

    var token = '';
    var dbResult = await docClient.query(params).promise();
    if (dbResult.Count === 0) {
        console.log('Records not found!');
        const uuidv1 = require('uuid');
        token = uuidv1.v4();
        const secondsSinceEpoch = Math.round(Date.now() / 1000);
        var params = {
            TableName: table,
            Item: {
                "Email": to,
                "Id": token,
                "ttl": secondsSinceEpoch + (60 * 15)
            }
        };
        console.log("Adding a new item for " + to);
        var putEmail = await docClient.put(params).promise();
    }

    if (token !== '') {
        // Create listIdentities params 
        console.log('Token value received is: ' + token);
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
                        Data: "<p>Click the link below to reset your password:</p> <br> <b>http://mycloudwebapi.com/reset?email=" + to + "&token=" + token + "<b>"
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
    }
};
