import { 
  users, 
  shipments, 
  shipmentEvents,
  verificationCodes,
  shippingServices,
  type User, 
  type InsertUser,
  type Shipment,
  type InsertShipment,
  type ShipmentEvent,
  type InsertShipmentEvent,
  type VerificationCode,
  type ShippingService
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserVerification(userId: string, emailVerified?: boolean, phoneVerified?: boolean): Promise<User | undefined>;
  
  createShipment(shipment: Omit<Shipment, "id" | "createdAt">): Promise<Shipment>;
  getShipmentByTrackingId(trackingId: string): Promise<Shipment | undefined>;
  getShipmentsByUserId(userId: string): Promise<Shipment[]>;
  updateShipmentStatus(trackingId: string, status: string): Promise<Shipment | undefined>;
  updateShipmentVerification(trackingId: string, verificationCode: string): Promise<Shipment | undefined>;
  
  createShipmentEvent(event: Omit<ShipmentEvent, "id" | "timestamp">): Promise<ShipmentEvent>;
  getShipmentEvents(shipmentId: string): Promise<ShipmentEvent[]>;
  
  createVerificationCode(code: VerificationCode): Promise<VerificationCode>;
  getVerificationCode(code: string, type: string): Promise<VerificationCode | undefined>;
  markVerificationCodeUsed(codeId: string): Promise<VerificationCode | undefined>;
  getUnusedVerificationCodes(userId: string, type: string): Promise<VerificationCode[]>;
  
  getAllUsers(): Promise<User[]>;
  getAllShipments(): Promise<Shipment[]>;
  updateUserAdminStatus(userId: string, isAdmin: boolean): Promise<User | undefined>;
  deleteShipment(shipmentId: string): Promise<boolean>;
  
  createShippingService(service: Omit<ShippingService, "id" | "createdAt">): Promise<ShippingService>;
  getShippingServices(): Promise<ShippingService[]>;
  getShippingServiceById(id: string): Promise<ShippingService | undefined>;
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

  async updateUserVerification(userId: string, emailVerified?: boolean, phoneVerified?: boolean): Promise<User | undefined> {
    const updates: any = {};
    if (emailVerified !== undefined) updates.isEmailVerified = emailVerified;
    if (phoneVerified !== undefined) updates.isPhoneVerified = phoneVerified;
    
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
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

  async updateShipmentVerification(trackingId: string, verificationCode: string): Promise<Shipment | undefined> {
    const [shipment] = await db
      .update(shipments)
      .set({ verificationCode, verificationCodeUsed: true })
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

  async createVerificationCode(codeData: VerificationCode): Promise<VerificationCode> {
    const [code] = await db
      .insert(verificationCodes)
      .values(codeData)
      .returning();
    return code;
  }

  async getVerificationCode(code: string, type: string): Promise<VerificationCode | undefined> {
    const now = new Date();
    const [vCode] = await db
      .select()
      .from(verificationCodes)
      .where(
        eq(verificationCodes.code, code) &&
        eq(verificationCodes.type, type) &&
        eq(verificationCodes.isUsed, false)
      );
    
    if (!vCode || new Date(vCode.expiresAt) < now) {
      return undefined;
    }
    return vCode;
  }

  async markVerificationCodeUsed(codeId: string): Promise<VerificationCode | undefined> {
    const [code] = await db
      .update(verificationCodes)
      .set({ isUsed: true })
      .where(eq(verificationCodes.id, codeId))
      .returning();
    return code || undefined;
  }

  async getUnusedVerificationCodes(userId: string, type: string): Promise<VerificationCode[]> {
    const now = new Date();
    return await db
      .select()
      .from(verificationCodes)
      .where(eq(verificationCodes.userId, userId) && eq(verificationCodes.type, type) && eq(verificationCodes.isUsed, false))
      .orderBy(desc(verificationCodes.createdAt));
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

  async createShippingService(serviceData: Omit<ShippingService, "id" | "createdAt">): Promise<ShippingService> {
    const [service] = await db
      .insert(shippingServices)
      .values(serviceData)
      .returning();
    return service;
  }

  async getShippingServices(): Promise<ShippingService[]> {
    return await db.select().from(shippingServices).orderBy(desc(shippingServices.createdAt));
  }

  async getShippingServiceById(id: string): Promise<ShippingService | undefined> {
    const [service] = await db.select().from(shippingServices).where(eq(shippingServices.id, id));
    return service || undefined;
  }
}

export const storage = new DatabaseStorage();
