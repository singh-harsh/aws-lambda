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
    var token = handleDynamo(to);
    if(token !== '') {
        // Create listIdentities params 
        console.log('Token value received is : ' + token);
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

function handleDynamo(email) {
    var table = "csye6225";
    var params = {
        TableName:table,
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
            ":email": email
        }
    };

    var items =[];
    var token = '';
    docClient.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        } else {
            console.log("Query succeeded.");
            items = data.Items;
        }
    });

    if(items.length === 1) {
        const uuidv1 = require('uuid/v1');
        token = uuidv1();
        const secondsSinceEpoch = Math.round(Date.now() / 1000);
        var params = {
            TableName:table,
            Item:{
                "Email": email,
                "Id": token,
                "ttl": secondsSinceEpoch + (60*20)
            }
        };
        console.log("Adding a new item for " + email);
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:" + JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:" + JSON.stringify(data, null, 2));
            }
        });
    }
    return token;
};