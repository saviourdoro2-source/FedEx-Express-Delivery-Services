import { db } from "./db";
import {
  shipments,
  subscriptions,
  type CreateShipmentRequest,
  type CreateSubscriptionRequest,
  type Shipment,
  type Subscription
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
  createShipment(shipment: CreateShipmentRequest): Promise<Shipment>;
  createSubscription(subscription: CreateSubscriptionRequest): Promise<Subscription>;
}

export class DatabaseStorage implements IStorage {
  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber));
    return shipment;
  }

  async createShipment(shipment: CreateShipmentRequest): Promise<Shipment> {
    const [newShipment] = await db.insert(shipments).values(shipment).returning();
    return newShipment;
  }

  async createSubscription(subscription: CreateSubscriptionRequest): Promise<Subscription> {
    const [newSubscription] = await db.insert(subscriptions).values(subscription).returning();
    return newSubscription;
  }
}

export const storage = new DatabaseStorage();
