package com.neu.lambda;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SNSEvent;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailService;
import com.amazonaws.services.simpleemail.AmazonSimpleEmailServiceClientBuilder;
import com.amazonaws.services.simpleemail.model.*;
import com.neu.db.ResetTokenHandler;

public class Handler implements RequestHandler<SNSEvent, Object> {

    private ResetTokenHandler tokenHandler = new ResetTokenHandler();

    public Object handleRequest(SNSEvent snsEvent, Context context) {
        String emailAddress = snsEvent.getRecords().get(0).getSNS().getMessage();
        //Validate for DynamoDB TTL and send an e-mail if authenticated
        String token = tokenHandler.generateToken(emailAddress);
        if(token != null) {
            try {
                AmazonSimpleEmailService client =
                        AmazonSimpleEmailServiceClientBuilder.standard()
                                .withRegion(Regions.US_EAST_1).build();
                SendEmailRequest request = new SendEmailRequest()
                        .withDestination(
                                new Destination().withToAddresses(emailAddress))
                        .withMessage(new Message()
                                .withBody(new Body()
                                        .withText(new Content()
                                                .withCharset("UTF-8").withData("Bunty sends his regards for " + emailAddress + " and token is : " + token)))
                                .withSubject(new Content()
                                        .withCharset("UTF-8").withData("Apna kaam kar na")))
                        .withSource("bunty@csye6225-fall2018-singhhar.me");
                client.sendEmail(request);
            } catch (Exception ex) {
                System.out.println("The email was not sent. Error message: "
                        + ex.getMessage());
            }
            return emailAddress;
        }
        return "The email was not sent!!";
    }

}
