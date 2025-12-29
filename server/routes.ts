import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  hashPassword, 
  comparePassword, 
  generateToken, 
  authMiddleware,
  adminMiddleware,
  generateTrackingId,
  type AuthenticatedRequest 
} from "./auth";
import { registerSchema, loginSchema, createShipmentSchema, addEventSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post("/api/auth/register", async (req, res) => {
    try {
      const parsed = registerSchema.safeParse(req.body);
      
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
        return;
      }

      const { name, email, password } = parsed.data;

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        res.status(400).json({ error: "Email already registered" });
        return;
      }

      const passwordHash = await hashPassword(password);
      const user = await storage.createUser({ name, email, passwordHash });
      const token = generateToken(user.id);

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin || false }
      });
    } catch (err) {
      console.error("Register error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const parsed = loginSchema.safeParse(req.body);
      
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
        return;
      }

      const { email, password } = parsed.data;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        res.status(400).json({ error: "Invalid email or password" });
        return;
      }

      const validPassword = await comparePassword(password, user.passwordHash);
      if (!validPassword) {
        res.status(400).json({ error: "Invalid email or password" });
        return;
      }

      const token = generateToken(user.id);

      res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin || false }
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/shipments", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const parsed = createShipmentSchema.safeParse(req.body);
      
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
        return;
      }

      const { senderName, recipientName, origin, destination, weightKg } = parsed.data;
      const trackingId = generateTrackingId();

      const shipment = await storage.createShipment({
        trackingId,
        senderName,
        recipientName,
        origin,
        destination,
        weightKg: weightKg || null,
        status: "Created",
        createdById: req.user!.id
      });

      await storage.createShipmentEvent({
        shipmentId: shipment.id,
        status: "Created",
        location: origin,
        note: "Shipment created and ready for pickup"
      });

      res.json({ shipment });
    } catch (err) {
      console.error("Create shipment error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/shipments", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const shipments = await storage.getShipmentsByUserId(req.user!.id);
      res.json({ shipments });
    } catch (err) {
      console.error("Get shipments error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/shipments/track/:trackingId", async (req, res) => {
    try {
      const { trackingId } = req.params;
      
      const shipment = await storage.getShipmentByTrackingId(trackingId);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      const events = await storage.getShipmentEvents(shipment.id);

      res.json({ shipment, events });
    } catch (err) {
      console.error("Track shipment error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.post("/api/shipments/:trackingId/event", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { trackingId } = req.params;
      const parsed = addEventSchema.safeParse(req.body);
      
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.errors[0]?.message || "Invalid input" });
        return;
      }

      const { status, location, note } = parsed.data;

      const shipment = await storage.getShipmentByTrackingId(trackingId);
      if (!shipment) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      const event = await storage.createShipmentEvent({
        shipmentId: shipment.id,
        status,
        location,
        note: note || null
      });

      const updatedShipment = await storage.updateShipmentStatus(trackingId, status);

      res.json({ shipment: updatedShipment, event });
    } catch (err) {
      console.error("Add event error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/admin/users", adminMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(({ passwordHash, ...user }) => user);
      res.json({ users: safeUsers });
    } catch (err) {
      console.error("Get all users error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.get("/api/admin/shipments", adminMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const shipments = await storage.getAllShipments();
      res.json({ shipments });
    } catch (err) {
      console.error("Get all shipments error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.patch("/api/admin/users/:id", adminMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const { isAdmin } = req.body;

      if (typeof isAdmin !== "boolean") {
        res.status(400).json({ error: "isAdmin must be a boolean" });
        return;
      }

      const user = await storage.updateUserAdminStatus(id, isAdmin);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { passwordHash, ...safeUser } = user;
      res.json({ user: safeUser });
    } catch (err) {
      console.error("Update user admin status error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  app.delete("/api/admin/shipments/:id", adminMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteShipment(id);
      
      if (!deleted) {
        res.status(404).json({ error: "Shipment not found" });
        return;
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Delete shipment error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return httpServer;
}
