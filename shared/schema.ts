import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  phoneNumber: text("phone_number"),
  isEmailVerified: boolean("is_email_verified").default(false).notNull(),
  isPhoneVerified: boolean("is_phone_verified").default(false).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  shipments: many(shipments),
  verificationCodes: many(verificationCodes),
}));

export const verificationCodes = pgTable("verification_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  code: varchar("code", { length: 6 }).notNull(),
  type: text("type").notNull(), // "email" or "phone"
  isUsed: boolean("is_used").default(false).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const verificationCodesRelations = relations(verificationCodes, ({ one }) => ({
  user: one(users, {
    fields: [verificationCodes.userId],
    references: [users.id],
  }),
}));

export const shippingServices = pgTable("shipping_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  trackingId: varchar("tracking_id", { length: 20 }).notNull().unique(),
  senderName: text("sender_name").notNull(),
  recipientName: text("recipient_name").notNull(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  weightKg: integer("weight_kg"),
  status: text("status").notNull().default("Created"),
  serviceId: varchar("service_id").references(() => shippingServices.id),
  verificationCode: varchar("verification_code", { length: 6 }),
  verificationCodeUsed: boolean("verification_code_used").default(false).notNull(),
  createdById: varchar("created_by_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [shipments.createdById],
    references: [users.id],
  }),
  service: one(shippingServices, {
    fields: [shipments.serviceId],
    references: [shippingServices.id],
  }),
  events: many(shipmentEvents),
}));

export const shipmentEvents = pgTable("shipment_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  shipmentId: varchar("shipment_id").references(() => shipments.id).notNull(),
  status: text("status").notNull(),
  location: text("location").notNull(),
  note: text("note"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const shipmentEventsRelations = relations(shipmentEvents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentEvents.shipmentId],
    references: [shipments.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  passwordHash: true,
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  trackingId: true,
  status: true,
  createdById: true,
  createdAt: true,
  verificationCode: true,
  verificationCodeUsed: true,
});

export const createShipmentSchema = z.object({
  senderName: z.string().min(2, "Sender name is required"),
  recipientName: z.string().min(2, "Recipient name is required"),
  origin: z.string().min(2, "Origin is required"),
  destination: z.string().min(2, "Destination is required"),
  weightKg: z.number().optional(),
  serviceId: z.string().optional(),
  verificationCode: z.string().optional(),
});

export const insertShipmentEventSchema = createInsertSchema(shipmentEvents).omit({
  id: true,
  timestamp: true,
});

export const addEventSchema = z.object({
  status: z.string().min(1, "Status is required"),
  location: z.string().min(1, "Location is required"),
  note: z.string().optional(),
});

export const verifyCodeSchema = z.object({
  code: z.string().length(6, "Code must be 6 characters"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
export type InsertShipmentEvent = z.infer<typeof insertShipmentEventSchema>;
export type VerificationCode = typeof verificationCodes.$inferSelect;
export type ShippingService = typeof shippingServices.$inferSelect;
