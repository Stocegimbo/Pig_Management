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

// Validation functions
const validatePig = (req, res, next) => {
  const { name, breed, birthDate, weight, healthStatus } = req.body;
  if (
    !name || typeof name !== "string" ||
    !breed || typeof breed !== "string" ||
    !birthDate || isNaN(Date.parse(birthDate)) ||
    !weight || typeof weight !== "number" ||
    !healthStatus || typeof healthStatus !== "string"
  ) {
    res.status(400).json({
      error: "Invalid input: Ensure 'name', 'breed', 'birthDate', 'weight', and 'healthStatus' are provided and are of the correct types.",
    });
    return;
  }
  next();
};

const validateFeed = (req, res, next) => {
  const { pigId, feedType, quantity, date } = req.body;
  if (
    !pigId || typeof pigId !== "string" ||
    !feedType || typeof feedType !== "string" ||
    !quantity || typeof quantity !== "number" ||
    !date || isNaN(Date.parse(date))
  ) {
    res.status(400).json({
      error: "Invalid input: Ensure 'pigId', 'feedType', 'quantity', and 'date' are provided and are of the correct types.",
    });
    return;
  }
  next();
};

const validateHealthRecord = (req, res, next) => {
  const { pigId, description, date, veterinarian } = req.body;
  if (
    !pigId || typeof pigId !== "string" ||
    !description || typeof description !== "string" ||
    !date || isNaN(Date.parse(date)) ||
    !veterinarian || typeof veterinarian !== "string"
  ) {
    res.status(400).json({
      error: "Invalid input: Ensure 'pigId', 'description', 'date', and 'veterinarian' are provided and are of the correct types.",
    });
    return;
  }
  next();
};

const validateInventory = (req, res, next) => {
  const { itemName, quantity, cost } = req.body;
  if (
    !itemName || typeof itemName !== "string" ||
    !quantity || typeof quantity !== "number" ||
    !cost || typeof cost !== "number"
  ) {
    res.status(400).json({
      error: "Invalid input: Ensure 'itemName', 'quantity', and 'cost' are provided and are of the correct types.",
    });
    return;
  }
  next();
};

const validateInvoice = (req, res, next) => {
  const { customerId, amount, date } = req.body;
  if (
    !customerId || typeof customerId !== "string" ||
    !amount || typeof amount !== "number" ||
    !date || isNaN(Date.parse(date))
  ) {
    res.status(400).json({
      error: "Invalid input: Ensure 'customerId', 'amount', and 'date' are provided and are of the correct types.",
    });
    return;
  }
  next();
};

// Define the express server
export default Server(() => {
  const app = express();
  app.use(express.json());

  // Endpoint for creating a new pig
  app.post("/pigs", validatePig, (req, res) => {
    try {
      const { name, breed, birthDate, weight, healthStatus } = req.body;
      const pig = new Pig(name, breed, new Date(birthDate), weight, healthStatus);
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
  app.post("/feeds", validateFeed, (req, res) => {
    try {
      const { pigId, feedType, quantity, date } = req.body;
      const feed = new Feed(pigId, feedType, quantity, new Date(date));
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
  app.post("/healthRecords", validateHealthRecord, (req, res) => {
    try {
      const { pigId, description, date, veterinarian } = req.body;
      const healthRecord = new HealthRecord(pigId, description, new Date(date), veterinarian);
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
  app.post("/inventory", validateInventory, (req, res) => {
    try {
      const { itemName, quantity, cost } = req.body;
      const inventory = new Inventory(itemName, quantity, cost);
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
  app.post("/invoices", validateInvoice, (req, res) => {
    try {
      const { customerId, amount, date } = req.body;
      const invoice = new Invoice(customerId, amount, new Date(date));
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
