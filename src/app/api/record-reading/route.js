import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const dynamoDB = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  const { chapterId, person } = await request.json();

  try {
    const command = new PutItemCommand({
      TableName: "group-reading",
      Item: {
        chapterId: { S: chapterId },
        person: { S: person },
        date: { S: new Date().toLocaleDateString("en-CA") },
      },
    });

    await dynamoDB.send(command);
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("DynamoDB error:", error);
    return new Response(JSON.stringify({ error: "Failed to record reading" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const chapterId = searchParams.get("chapterId");

  try {
    const command = new QueryCommand({
      TableName: "group-reading",
      KeyConditionExpression: "chapterId = :chapterId",
      ExpressionAttributeValues: { ":chapterId": { S: chapterId } },
    });

    const data = await dynamoDB.send(command);
    return Response.json({ readings: data.Items });
  } catch (error) {
    console.error("DynamoDB error:", error);
    return Response.json({ error: "Failed to fetch readings" }, { status: 500 });
  }
}

export async function PUT() {
  return new Response(null, { status: 405 });
}

export async function DELETE() {
  return new Response(null, { status: 405 });
}
