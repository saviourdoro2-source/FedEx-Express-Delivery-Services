import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull().unique(),
  status: text("status").notNull(), // 'Label Created', 'On the Way', 'Out for Delivery', 'Delivered'
  currentLocation: text("current_location").notNull(),
  estimatedDelivery: text("estimated_delivery").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  trackingNumber: text("tracking_number").notNull(),
  phoneNumber: text("phone_number").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({ id: true, lastUpdated: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;

export type CreateShipmentRequest = InsertShipment;
export type CreateSubscriptionRequest = InsertSubscription;
