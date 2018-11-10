package com.neu.db;

import com.amazonaws.auth.InstanceProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.dynamodbv2.document.DynamoDB;
import com.amazonaws.services.dynamodbv2.document.Item;
import com.amazonaws.services.dynamodbv2.document.Table;
import com.amazonaws.services.dynamodbv2.model.UpdateTimeToLiveRequest;

import javax.annotation.PostConstruct;
import java.util.UUID;

public class ResetTokenHandler {

    private AmazonDynamoDB amazonDynamoDB;
    private DynamoDB dynamoDB;
    private Table table;
    private String tableName = "csye6225";

    public String generateToken(String email) {
        String uuid = UUID.randomUUID().toString();
        Item item = table.getItem("Email", email);

        if(item == null) {
            item = new Item().withPrimaryKey("id", uuid).withString("Email", email);
            table.putItem(item);
            return uuid;
        }
        return null;
}

    @PostConstruct
    public void setupClient() {
        InstanceProfileCredentialsProvider provider = new InstanceProfileCredentialsProvider(true);
        this.amazonDynamoDB = AmazonDynamoDBClientBuilder.standard().withCredentials(provider).withRegion(Regions.US_EAST_1).build();
        dynamoDB = new DynamoDB(amazonDynamoDB);
        table = dynamoDB.getTable(tableName);
    }
}
