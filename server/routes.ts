import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.shipments.track.path, async (req, res) => {
    const shipment = await storage.getShipmentByTracking(req.params.trackingNumber);
    if (!shipment) {
      return res.status(404).json({ message: 'Shipment not found' });
    }
    res.json(shipment);
  });

  app.post(api.shipments.create.path, async (req, res) => {
    try {
      const input = api.shipments.create.input.parse(req.body);
      const shipment = await storage.createShipment(input);
      res.status(201).json(shipment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.post(api.subscriptions.create.path, async (req, res) => {
    try {
      const input = api.subscriptions.create.input.parse(req.body);
      const subscription = await storage.createSubscription(input);
      
      // Twilio SMS integration pending user configuration
      console.log('Subscription created for:', input.phoneNumber);
      
      res.status(201).json(subscription);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  await seedDatabase();

  return httpServer;
}

export async function seedDatabase() {
  const existing = await storage.getShipmentByTracking("123456789012");
  if (!existing) {
    await storage.createShipment({
      trackingNumber: "123456789012",
      status: "In Transit",
      currentLocation: "Memphis, TN",
      estimatedDelivery: "Monday, Dec 30 by 8:00 PM"
    });
    await storage.createShipment({
      trackingNumber: "987654321098",
      status: "Delivered",
      currentLocation: "Front Porch",
      estimatedDelivery: "Delivered"
    });
  }
}
