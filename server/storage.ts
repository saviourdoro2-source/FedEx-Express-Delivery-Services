import { 
  users, 
  shipments, 
  shipmentEvents,
  type User, 
  type InsertUser,
  type Shipment,
  type InsertShipment,
  type ShipmentEvent,
  type InsertShipmentEvent
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createShipment(shipment: Omit<Shipment, "id" | "createdAt">): Promise<Shipment>;
  getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined>;
  getShipmentsByUserId(userId: string): Promise<Shipment[]>;
  updateShipmentStatus(trackingId: string, status: string): Promise<Shipment | undefined>;
  
  createShipmentEvent(event: Omit<ShipmentEvent, "id" | "timestamp">): Promise<ShipmentEvent>;
  getShipmentEvents(shipmentId: string): Promise<ShipmentEvent[]>;
  
  getAllUsers(): Promise<User[]>;
  getAllShipments(): Promise<Shipment[]>;
  updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined>;
  deleteShipment(shipmentId: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createShipment(shipmentData: Omit<Shipment, "id" | "createdAt">): Promise<Shipment> {
    const [shipment] = await db
      .insert(shipments)
      .values(shipmentData)
      .returning();
    return shipment;
  }

  async getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined> {
    const [shipment] = await db
      .select()
      .from(shipments)
      .where(eq(shipments.trackingId, trackingId));
    return shipment || undefined;
  }

  async getShipmentsByUserId(userId: string): Promise<Shipment[]> {
    return await db
      .select()
      .from(shipments)
      .where(eq(shipments.createdById, userId))
      .orderBy(desc(shipments.createdAt));
  }

  async updateShipmentStatus(trackingId: string, status: string): Promise<Shipment | undefined> {
    const [shipment] = await db
      .update(shipments)
      .set({ status })
      .where(eq(shipments.trackingId, trackingId))
      .returning();
    return shipment || undefined;
  }

  async createShipmentEvent(eventData: Omit<ShipmentEvent, "id" | "timestamp">): Promise<ShipmentEvent> {
    const [event] = await db
      .insert(shipmentEvents)
      .values(eventData)
      .returning();
    return event;
  }

  async getShipmentEvents(shipmentId: string): Promise<ShipmentEvent[]> {
    return await db
      .select()
      .from(shipmentEvents)
      .where(eq(shipmentEvents.shipmentId, shipmentId))
      .orderBy(desc(shipmentEvents.timestamp));
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllShipments(): Promise<Shipment[]> {
    return await db.select().from(shipments).orderBy(desc(shipments.createdAt));
  }

  async updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ isAdmin })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async deleteShipment(shipmentId: string): Promise<boolean> {
    await db.delete(shipmentEvents).where(eq(shipmentEvents.shipmentId, shipmentId));
    const result = await db.delete(shipments).where(eq(shipments.id, shipmentId)).returning();
    return result.length > 0;
  }
}

export const storage = new DatabaseStorage();
