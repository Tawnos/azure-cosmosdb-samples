// @ts-check
export class AppConfig {
  public static PORT_NUMBER = 3000
  public static MAX_REQUEST_SIZE = 20000000
  public static COSMOSDB_CONFIG = {
    endpoint: "<Your Azure Cosmos account URI>",
    key: "<Your Azure Cosmos account key>",
    databaseId: "DamonSlayer",
    containerId: "Characters",
    partitionKey: { kind: "Hash", paths: ["/category"] }
  }
}
