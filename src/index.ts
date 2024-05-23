// Import necessary libraries
import { v4 as uuidv4 } from "uuid";
import { Server, StableBTreeMap, Principal } from "azle";
import express from "express";

// Define the Pig class to represent pigs on the farm
class Pig {
  id: string;
  name: string;
  breed: string;
  birthDate: Date;
  weight: number;
  healthStatus: string;
  createdAt: Date;

  constructor(name: string, breed: string, birthDate: Date, weight: number, healthStatus: string) {
    this.id = uuidv4();
    this.name = name;
    this.breed = breed;
    this.birthDate = birthDate;
    this.weight = weight;
    this.healthStatus = healthStatus;
    this.createdAt = new Date();
  }
}

// Define the Feed class to represent feed records
class Feed {
  id: string;
  pigId: string;
  feedType: string;
  quantity: number;
  date: Date;
  createdAt: Date;

  constructor(pigId: string, feedType: string, quantity: number, date: Date) {
    this.id = uuidv4();
    this.pigId = pigId;
    this.feedType = feedType;
    this.quantity = quantity;
    this.date = date;
    this.createdAt = new Date();
  }
}

// Define the HealthRecord class to represent health records of pigs
class HealthRecord {
  id: string;
  pigId: string;
  description: string;
  date: Date;
  veterinarian: string;
  createdAt: Date;

  constructor(pigId: string, description: string, date: Date, veterinarian: string) {
    this.id = uuidv4();
    this.pigId = pigId;
    this.description = description;
    this.date = date;
    this.veterinarian = veterinarian;
    this.createdAt = new Date();
  }
}

// Define the Inventory class to represent inventory items
class Inventory {
  id: string;
  itemName: string;
  quantity: number;
  cost: number;
  createdAt: Date;

  constructor(itemName: string, quantity: number, cost: number) {
    this.id = uuidv4();
    this.itemName = itemName;
    this.quantity = quantity;
    this.cost = cost;
    this.createdAt = new Date();
  }
}

// Define the Invoice class to represent billing information
class Invoice {
  id: string;
  customerId: string;
  amount: number;
  date: Date;
  createdAt: Date;

  constructor(customerId: string, amount: number, date: Date) {
    this.id = uuidv4();
    this.customerId = customerId;
    this.amount = amount;
    this.date = date;
    this.createdAt = new Date();
  }
}

// Initialize stable maps for storing pig farm data
const pigsStorage = StableBTreeMap<string, Pig>(0);
const feedsStorage = StableBTreeMap<string, Feed>(1);
const healthRecordsStorage = StableBTreeMap<string, HealthRecord>(2);
const inventoryStorage = StableBTreeMap<string, Inventory>(3);
const invoicesStorage = StableBTreeMap<string, Invoice>(4);

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new pig
  app.post("/pigs", (req, res) => {
    if (
      !req.body.name ||
      typeof req.body.name !== "string" ||
      !req.body.breed ||
      typeof req.body.breed !== "string" ||
      !req.body.birthDate ||
      !req.body.weight ||
      typeof req.body.weight !== "number" ||
      !req.body.healthStatus ||
      typeof req.body.healthStatus !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'name', 'breed', 'birthDate', 'weight', and 'healthStatus' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const pig = new Pig(
        req.body.name,
        req.body.breed,
        new Date(req.body.birthDate),
        req.body.weight,
        req.body.healthStatus
      );
      pigsStorage.insert(pig.id, pig);
      res.status(201).json({
        message: "Pig created successfully",
        pig: pig,
      });
    } catch (error) {
      console.error("Failed to create pig:", error);
      res.status(500).json({
        error: "Server error occurred while creating the pig.",
      });
    }
  });

  // Endpoint for retrieving all pigs
  app.get("/pigs", (req, res) => {
    try {
      const pigs = pigsStorage.values();
      res.status(200).json({
        message: "Pigs retrieved successfully",
        pigs: pigs,
      });
    } catch (error) {
      console.error("Failed to retrieve pigs:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving pigs.",
      });
    }
  });

  // Endpoint for creating a new feed record
  app.post("/feeds", (req, res) => {
    if (
      !req.body.pigId ||
      typeof req.body.pigId !== "string" ||
      !req.body.feedType ||
      typeof req.body.feedType !== "string" ||
      !req.body.quantity ||
      typeof req.body.quantity !== "number" ||
      !req.body.date
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'pigId', 'feedType', 'quantity', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const feed = new Feed(
        req.body.pigId,
        req.body.feedType,
        req.body.quantity,
        new Date(req.body.date)
      );
      feedsStorage.insert(feed.id, feed);
      res.status(201).json({
        message: "Feed record created successfully",
        feed: feed,
      });
    } catch (error) {
      console.error("Failed to create feed record:", error);
      res.status(500).json({
        error: "Server error occurred while creating the feed record.",
      });
    }
  });

  // Endpoint for retrieving all feed records
  app.get("/feeds", (req, res) => {
    try {
      const feeds = feedsStorage.values();
      res.status(200).json({
        message: "Feed records retrieved successfully",
        feeds: feeds,
      });
    } catch (error) {
      console.error("Failed to retrieve feed records:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving feed records.",
      });
    }
  });

  // Endpoint for creating a new health record
  app.post("/healthRecords", (req, res) => {
    if (
      !req.body.pigId ||
      typeof req.body.pigId !== "string" ||
      !req.body.description ||
      typeof req.body.description !== "string" ||
      !req.body.date ||
      !req.body.veterinarian ||
      typeof req.body.veterinarian !== "string"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'pigId', 'description', 'date', and 'veterinarian' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const healthRecord = new HealthRecord(
        req.body.pigId,
        req.body.description,
        new Date(req.body.date),
        req.body.veterinarian
      );
      healthRecordsStorage.insert(healthRecord.id, healthRecord);
      res.status(201).json({
        message: "Health record created successfully",
        healthRecord: healthRecord,
      });
    } catch (error) {
      console.error("Failed to create health record:", error);
      res.status(500).json({
        error: "Server error occurred while creating the health record.",
      });
    }
  });

  // Endpoint for retrieving all health records
  app.get("/healthRecords", (req, res) => {
    try {
      const healthRecords = healthRecordsStorage.values();
      res.status(200).json({
        message: "Health records retrieved successfully",
        healthRecords: healthRecords,
      });
    } catch (error) {
      console.error("Failed to retrieve health records:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving health records.",
      });
    }
  });

  // Endpoint for creating a new inventory item
  app.post("/inventory", (req, res) => {
    if (
      !req.body.itemName ||
      typeof req.body.itemName !== "string" ||
      !req.body.quantity ||
      typeof req.body.quantity !== "number" ||
      !req.body.cost ||
      typeof req.body.cost !== "number"
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'itemName', 'quantity', and 'cost' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const inventory = new Inventory(
        req.body.itemName,
        req.body.quantity,
        req.body.cost
      );
      inventoryStorage.insert(inventory.id, inventory);
      res.status(201).json({
        message: "Inventory item created successfully",
        inventory: inventory,
      });
    } catch (error) {
      console.error("Failed to create inventory item:", error);
      res.status(500).json({
        error: "Server error occurred while creating the inventory item.",
      });
    }
  });

  // Endpoint for retrieving all inventory items
  app.get("/inventory", (req, res) => {
    try {
      const inventory = inventoryStorage.values();
      res.status(200).json({
        message: "Inventory items retrieved successfully",
        inventory: inventory,
      });
    } catch (error) {
      console.error("Failed to retrieve inventory items:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving inventory items.",
      });
    }
  });

  // Endpoint for creating a new invoice
  app.post("/invoices", (req, res) => {
    if (
      !req.body.customerId ||
      typeof req.body.customerId !== "string" ||
      !req.body.amount ||
      typeof req.body.amount !== "number" ||
      !req.body.date
    ) {
      res.status(400).json({
        error: "Invalid input: Ensure 'customerId', 'amount', and 'date' are provided and are of the correct types.",
      });
      return;
    }

    try {
      const invoice = new Invoice(
        req.body.customerId,
        req.body.amount,
        new Date(req.body.date)
      );
      invoicesStorage.insert(invoice.id, invoice);
      res.status(201).json({
        message: "Invoice created successfully",
        invoice: invoice,
      });
    } catch (error) {
      console.error("Failed to create invoice:", error);
      res.status(500).json({
        error: "Server error occurred while creating the invoice.",
      });
    }
  });

  // Endpoint for retrieving all invoices
  app.get("/invoices", (req, res) => {
    try {
      const invoices = invoicesStorage.values();
      res.status(200).json({
        message: "Invoices retrieved successfully",
        invoices: invoices,
      });
    } catch (error) {
      console.error("Failed to retrieve invoices:", error);
      res.status(500).json({
        error: "Server error occurred while retrieving invoices.",
      });
    }
  });

  // Start the server
  return app.listen();
});
