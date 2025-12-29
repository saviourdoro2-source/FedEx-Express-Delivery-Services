import { z } from 'zod';
import { insertShipmentSchema, insertSubscriptionSchema, shipments, subscriptions } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  shipments: {
    track: {
      method: 'GET' as const,
      path: '/api/shipments/:trackingNumber',
      responses: {
        200: z.custom<typeof shipments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/shipments',
      input: insertShipmentSchema,
      responses: {
        201: z.custom<typeof shipments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  subscriptions: {
    create: {
      method: 'POST' as const,
      path: '/api/subscriptions',
      input: insertSubscriptionSchema,
      responses: {
        201: z.custom<typeof subscriptions.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type ShipmentResponse = z.infer<typeof api.shipments.track.responses[200]>;
