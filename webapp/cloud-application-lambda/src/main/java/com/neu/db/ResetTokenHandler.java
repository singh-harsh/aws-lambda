package com.neu.db;

import com.amazonaws.auth.InstanceProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.UpdateTimeToLiveRequest;

import javax.annotation.PostConstruct;
import java.util.UUID;

public class ResetTokenHandler {

    private AmazonDynamoDB amazonDynamoDB;
    private DynamoDB dynamoDB;
    private String tableName = "csye6225";

    public void generateToken(String email) {
        Table table = dynamoDB.getTable(tableName);
        UUID randomUUID = UUID.randomUUID();
        //
    }

    @PostConstruct
    public void setupClient() {
        InstanceProfileCredentialsProvider provider = new InstanceProfileCredentialsProvider(true);
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard().withCredentials(provider).withRegion(Regions.US_EAST_1).build();
        amazonDynamoDB.updateTimeToLive(new UpdateTimeToLiveRequest());
        dynamoDB = new DynamoDB(amazonDynamoDB);
    }
}
