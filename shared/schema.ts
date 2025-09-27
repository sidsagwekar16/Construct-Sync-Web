import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, date, varchar, decimal, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Sessions table for authentication
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: integer("user_id").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Session = typeof sessions.$inferSelect;

// Refresh tokens table for mobile JWT auth (hashed opaque tokens with rotation)
export const refreshTokens = pgTable("refresh_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
  replacedByTokenHash: text("replaced_by_token_hash"),
  userAgent: text("user_agent"),
  ip: text("ip"),
});
export type RefreshToken = typeof refreshTokens.$inferSelect;

// User/Worker table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("worker"), // admin, manager, worker
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  emergencyContact: text("emergency_contact"),
  status: text("status").default("available"), // available, on_job, off_duty
  skills: text("skills").array(),
  teamId: integer("team_id"),
  avatar: text("avatar"),
  notificationPrefs: jsonb('notification_prefs'),
  safetyCardNumber: text("safety_card_number"),
  safetyCardExpiry: date("safety_card_expiry"),
  hourlyRate: real("hourly_rate").default(0), // Added for automatic labor cost tracking
  type: text("type").notNull().default("Employee"), // Employee or Subcontractor
  contractId: integer("contract_id"), // Links worker to subcontractor contract for hour attribution
  latitude: real("latitude"),
  longitude: real("longitude"),
  lastLocationUpdate: timestamp("last_location_update"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
  name: true,
  email: true,
  phone: true,
  address: true,
  emergencyContact: true,
  status: true,
  skills: true,
  teamId: true,
  hourlyRate: true,
  type: true,
  contractId: true,
  avatar: true,
  safetyCardNumber: true,
  safetyCardExpiry: true,
  latitude: true,
  longitude: true,
  lastLocationUpdate: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Worker = typeof users.$inferSelect;

// Subcontractor Contracts table
export const subcontractorContracts = pgTable("subcontractor_contracts", {
  id: serial("id").primaryKey(),
  subcontractorId: integer("subcontractor_id"), // Individual subcontractor (nullable for team contracts)
  teamId: integer("team_id"), // Team assignment (nullable for individual contracts)
  jobId: integer("job_id").notNull(),
  contractTitle: text("contract_title").notNull(),
  description: text("description"),
  category: text("category"), // Work category (Drywall, Plumbing, etc.)
  baseAmount: real("base_amount").notNull(), // Fixed price for the base contract
  // Phase 1: Default rates for variation pricing
  defaultHourlyRate: decimal("default_hourly_rate", { precision: 8, scale: 2 }), // Fallback hourly rate
  variationRateOverride: decimal("variation_rate_override", { precision: 8, scale: 2 }), // Special variation rate
  contractDate: date("contract_date").notNull(),
  expectedStartDate: date("expected_start_date"),
  expectedEndDate: date("expected_end_date"),
  actualStartDate: date("actual_start_date"),
  actualEndDate: date("actual_end_date"),
  status: text("status").notNull().default("pending"), // pending, active, completed, cancelled
  paymentTerms: text("payment_terms"), // e.g., "50% upfront, 50% on completion"
  scope: text("scope"), // Detailed scope of work
  notes: text("notes"),
  // Payment tracking fields for Phase 5
  totalPaid: decimal("total_paid", { precision: 10, scale: 2 }).default("0"),
  totalVariations: decimal("total_variations", { precision: 10, scale: 2 }).default("0"),
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }),
  retentionPercentage: decimal("retention_percentage", { precision: 5, scale: 2 }).default("0"),
  retentionAmount: decimal("retention_amount", { precision: 10, scale: 2 }).default("0"),
  paymentStatus: text("payment_status").default("pending"), // pending, partial, paid, overdue
  invoiceGenerated: boolean("invoice_generated").default(false),
  lastPaymentDate: date("last_payment_date"),
  nextPaymentDue: date("next_payment_due"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubcontractorContractSchema = createInsertSchema(subcontractorContracts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SubcontractorContract = typeof subcontractorContracts.$inferSelect;
export type InsertSubcontractorContract = z.infer<typeof insertSubcontractorContractSchema>;

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  workerIds: integer("worker_ids").array(),
  leaderId: integer("leader_id"), // Manager/supervisor for this team
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  description: true,
  workerIds: true,
  leaderId: true,
});

export type InsertTeam = z.infer<typeof insertTeamSchema>;
export type Team = typeof teams.$inferSelect;

// Materials table
export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  quantity: integer("quantity").notNull().default(0),
  unit: text("unit").notNull(),
  costPerUnit: real("cost_per_unit").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
  targetStockLevel: integer("target_stock_level").notNull().default(20),
  supplier: text("supplier"),
  supplierContact: text("supplier_contact"),
  lastRestockDate: timestamp("last_restock_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMaterialSchema = createInsertSchema(materials).pick({
  name: true,
  description: true,
  category: true,
  quantity: true,
  unit: true,
  costPerUnit: true,
  lowStockThreshold: true,
  targetStockLevel: true,
  supplier: true,
  supplierContact: true,
  lastRestockDate: true,
});

export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;

// Jobs table
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  address: text("address").notNull(),
  latitude: real("latitude"),
  longitude: real("longitude"),
  jobType: text("job_type").notNull(),
  description: text("description"),
  clientName: text("client_name").notNull(),
  clientPhone: text("client_phone"),
  clientEmail: text("client_email"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  completedTime: timestamp("completed_time"),
  status: text("status").notNull().default("scheduled"), // scheduled, in_progress, completed, cancelled
  teamId: text("team_id"),
  workerIds: integer("worker_ids").array(),
  projectManagerIds: integer("project_manager_ids").array(), // Managers overseeing this project
  assignedTo: integer("assigned_to"), // Single job manager
  createdBy: integer("created_by"), // Who created this job
  priority: text("priority").default("medium"), // low, medium, high
  materials: jsonb("materials"), // [{materialId, quantity, used}]
  tasks: jsonb("tasks"), // [{id, name, description, completed, inProgress, status, blockId, unitId}]
  blocks: jsonb("blocks"), // [{id, name, color, units: [{id, name, color}]}]
  photos: jsonb("photos"), // [{url, description, uploadedBy, timestamp}]
  documents: jsonb("documents"), // [{url, name, description, fileType, uploadedBy, timestamp, size}]
  issues: jsonb("issues"), // [{id, title, description, reportedBy, reportedTime, status, photos}]
  notes: text("notes"),
  archived: boolean("archived").default(false), // Archive jobs to hide from active views
  archivedAt: timestamp("archived_at"),
  archivedBy: integer("archived_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Indexes for frequently queried fields
  statusIdx: index("jobs_status_idx").on(table.status),
  teamIdIdx: index("jobs_team_id_idx").on(table.teamId),
  assignedToIdx: index("jobs_assigned_to_idx").on(table.assignedTo),
  startTimeIdx: index("jobs_start_time_idx").on(table.startTime),
  archivedIdx: index("jobs_archived_idx").on(table.archived),
  endTimeIdx: index("jobs_end_time_idx").on(table.endTime),
  createdByIdx: index("jobs_created_by_idx").on(table.createdBy),
  priorityIdx: index("jobs_priority_idx").on(table.priority),
  // Composite indexes for common queries
  statusTimeIdx: index("jobs_status_time_idx").on(table.status, table.startTime),
  teamStatusIdx: index("jobs_team_status_idx").on(table.teamId, table.status),
}));

export const insertJobSchema = createInsertSchema(jobs).pick({
  address: true,
  latitude: true,
  longitude: true,
  jobType: true,
  description: true,
  clientName: true,
  clientPhone: true,
  clientEmail: true,
  startTime: true,
  endTime: true,
  completedTime: true,
  status: true,
  teamId: true,
  workerIds: true,
  projectManagerIds: true,
  assignedTo: true,
  createdBy: true,
  priority: true,
  materials: true,
  tasks: true,
  blocks: true,  // Add blocks to the schema
  photos: true,
  documents: true,
  issues: true,
  notes: true,
}).extend({
  // Override date fields to coerce strings to dates
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  completedTime: z.coerce.date().optional(),
});

export type InsertJob = z.infer<typeof insertJobSchema>;
export type Job = typeof jobs.$inferSelect;

// Time entries table for tracking worker hours
export const timeEntries = pgTable("time_entries", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  jobId: integer("job_id").notNull(),
  jobName: text("job_name"),
  variationId: integer("variation_id"), // Phase 4: Link time entries to specific variations
  // Phase 1: Worker type and billing tracking
  workerType: text("worker_type").default("employee"), // contractor, employee
  billingRate: decimal("billing_rate", { precision: 8, scale: 2 }), // Actual rate used for billing
  isBillable: boolean("is_billable").default(false), // Contract billable vs internal
  checkInTime: text("check_in_time").notNull(), // Store as ISO string
  checkOutTime: text("check_out_time"), // Store as ISO string
  checkInLocation: jsonb("check_in_location"), // {latitude, longitude, accuracy}
  checkOutLocation: jsonb("check_out_location"), // {latitude, longitude, accuracy}
  hours: real("hours"), // Calculated hours worked
  date: text("date"), // Date in YYYY-MM-DD format
  description: text("description"), // Work description
  category: text("category").default("regular"), // regular, overtime, travel, break
  notes: text("notes"),
  archived: boolean("archived").default(false), // Archive old entries to reduce clutter
  archivedAt: text("archived_at"), // When entry was archived (ISO string)
  laborCostCalculated: boolean("labor_cost_calculated").default(false), // Track if labor cost was generated
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  // Indexes for frequently queried fields
  workerIdIdx: index("time_entries_worker_id_idx").on(table.workerId),
  jobIdIdx: index("time_entries_job_id_idx").on(table.jobId),
  variationIdIdx: index("time_entries_variation_id_idx").on(table.variationId),
  archivedIdx: index("time_entries_archived_idx").on(table.archived),
  checkOutTimeIdx: index("time_entries_checkout_time_idx").on(table.checkOutTime),
  createdAtIdx: index("time_entries_created_at_idx").on(table.createdAt),
  // Composite index for active entries query
  activeEntriesIdx: index("time_entries_active_idx").on(table.workerId, table.checkOutTime, table.archived),
  // Composite index for variation time tracking
  variationTimeIdx: index("time_entries_variation_time_idx").on(table.variationId, table.workerId, table.archived),
}));

export const insertTimeEntrySchema = z.object({
  workerId: z.number(),
  jobId: z.number(),
  jobName: z.string().optional(),
  variationId: z.number().optional(), // Phase 4: Optional link to variation
  checkInTime: z.string().datetime(),
  checkOutTime: z.string().datetime().optional(),
  checkInLocation: z.any().optional(),
  checkOutLocation: z.any().optional(),
  hours: z.number().optional(),
  date: z.string().optional(),
  description: z.string().optional(),
  category: z.string().default("regular"),
  notes: z.string().optional(),
  archived: z.boolean().default(false),
  archivedAt: z.string().datetime().optional(),
});

export type InsertTimeEntry = z.infer<typeof insertTimeEntrySchema>;
export type TimeEntry = typeof timeEntries.$inferSelect;

// Material requests table
export const materialRequests = pgTable("material_requests", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  jobId: integer("job_id").notNull(),
  requestedBy: integer("requested_by").notNull(),
  quantity: integer("quantity").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected, fulfilled
  notes: text("notes"),
  approvedBy: integer("approved_by"),
  approvedAt: timestamp("approved_at"),
  fulfilledAt: timestamp("fulfilled_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMaterialRequestSchema = createInsertSchema(materialRequests).pick({
  materialId: true,
  jobId: true,
  requestedBy: true,
  quantity: true,
  status: true,
  notes: true,
  approvedBy: true,
  approvedAt: true,
  fulfilledAt: true,
});

export type InsertMaterialRequest = z.infer<typeof insertMaterialRequestSchema>;
export type MaterialRequest = typeof materialRequests.$inferSelect;

// Stock adjustments table for tracking inventory changes
export const stockAdjustments = pgTable("stock_adjustments", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  adjustmentType: text("adjustment_type").notNull(), // in, out, adjustment, waste
  quantity: integer("quantity").notNull(),
  reason: text("reason").notNull(),
  jobId: integer("job_id"), // optional, for usage tracking
  adjustedBy: integer("adjusted_by").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertStockAdjustmentSchema = createInsertSchema(stockAdjustments).pick({
  materialId: true,
  adjustmentType: true,
  quantity: true,
  reason: true,
  jobId: true,
  adjustedBy: true,
  notes: true,
});

export type InsertStockAdjustment = z.infer<typeof insertStockAdjustmentSchema>;
export type StockAdjustment = typeof stockAdjustments.$inferSelect;

// Material usage table for tracking consumption per job
export const materialUsage = pgTable("material_usage", {
  id: serial("id").primaryKey(),
  materialId: integer("material_id").notNull(),
  jobId: integer("job_id").notNull(),
  quantityUsed: integer("quantity_used").notNull(),
  usedBy: integer("used_by").notNull(),
  usageDate: timestamp("usage_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMaterialUsageSchema = createInsertSchema(materialUsage).pick({
  materialId: true,
  jobId: true,
  quantityUsed: true,
  usedBy: true,
  usageDate: true,
  notes: true,
});

export type InsertMaterialUsage = z.infer<typeof insertMaterialUsageSchema>;
export type MaterialUsage = typeof materialUsage.$inferSelect;

// Variations table
export const variations = pgTable("issues", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reportedBy: integer("reported_by").notNull(),
  reportedTime: timestamp("reported_time").notNull(),
  status: text("status").notNull().default("open"), // open, in_progress, resolved
  priority: text("priority").notNull().default("medium"), // low, medium, high
  photos: jsonb("photos").array(), // [{url, description}]
  // New issue collaboration fields
  comments: jsonb("comments"), // [{id, userId, message, createdAt}]
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgedBy: integer("acknowledged_by"),
  assignedTo: integer("assigned_to"),
  startDate: timestamp("start_date"),
  dueDate: timestamp("due_date"),
  resolvedAt: timestamp("resolved_at"),
  resolvedBy: integer("resolved_by"),
  resolutionNotes: text("resolution_notes"),
  // Enhanced Unified Variation Fields
  isVariation: boolean("is_variation").default(false),
  contractId: integer("contract_id"), // Links to subcontractor_contracts
  
  // Classification
  variationType: text("variation_type").default("client_requested"), // client_requested, quote_oversight, third_party_damage
  isChargeable: boolean("is_chargeable").default(true),
  requiresSubcontractor: boolean("requires_subcontractor").default(false),
  clientApprovalRequired: boolean("client_approval_required").default(false),
  clientApprovedAt: timestamp("client_approved_at"),
  clientApprovedBy: integer("client_approved_by"),
  
  // Phase 1: Enhanced Pricing Model Support
  pricingModel: text("pricing_model").default("hourly"), // fixed, hourly, hybrid
  
  // Fixed Pricing Fields
  fixedAmount: decimal("fixed_amount", { precision: 10, scale: 2 }), // Fixed price for contractor
  clientAmount: decimal("client_amount", { precision: 10, scale: 2 }), // What client pays
  subcontractorAmount: decimal("subcontractor_amount", { precision: 10, scale: 2 }), // What we pay contractor
  
  // Hourly Pricing Fields
  hourlyRate: decimal("hourly_rate", { precision: 8, scale: 2 }), // Contractor hourly rate
  clientHourlyRate: decimal("client_hourly_rate", { precision: 8, scale: 2 }), // What we charge client
  contractorHourlyRate: decimal("contractor_hourly_rate", { precision: 8, scale: 2 }), // What we pay contractor
  maxHours: integer("max_hours"), // Optional hour cap for hourly work
  estimatedHours: decimal("estimated_hours", { precision: 5, scale: 2 }),
  actualHours: decimal("actual_hours", { precision: 5, scale: 2 }),
  
  // Hybrid Pricing Fields (Phase 1)
  fixedHoursThreshold: integer("fixed_hours_threshold"), // Hours before switching to hourly
  basePrice: decimal("base_price", { precision: 10, scale: 2 }), // Base amount for hybrid pricing
  
  // Materials
  materialsClientCharge: decimal("materials_client_charge", { precision: 10, scale: 2 }),
  materialsActualCost: decimal("materials_actual_cost", { precision: 10, scale: 2 }),
  
  // Phase 1: Worker Assignment and Type Tracking
  primaryWorkerType: text("primary_worker_type").default("contractor"), // contractor, employee
  workerType: text("worker_type").default("employee"), // employee, contractor, subcontractor
  contractorId: integer("contractor_id"), // Links to workers table for subcontractor assignment
  fallbackWorkerId: integer("fallback_worker_id"), // Employee backup if contractor unavailable
  billMeLater: boolean("bill_me_later").default(false), // Bill me later workflow flag
  
  // Legacy fields for backward compatibility
  variationAmount: decimal("variation_amount", { precision: 10, scale: 2 }),
  variationStatus: text("variation_status").default("pending"), // pending, approved, rejected, completed
  variationScope: text("variation_scope"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Enhanced schema for unified variation creation
export const insertVariationSchema = z.object({
  jobId: z.number(),
  title: z.string(),
  description: z.string(),
  reportedBy: z.number(),
  reportedTime: z.string().transform((val) => new Date(val)),
  status: z.string().default("open"),
  priority: z.string().default("medium"),
  photos: z.array(z.any()).optional(),
  assignedTo: z.number().optional(),
  startDate: z.string().transform((val) => val ? new Date(val) : undefined).optional(),
  dueDate: z.string().transform((val) => val ? new Date(val) : undefined).optional(),
  isVariation: z.boolean().default(false),
  contractId: z.number().optional(),
  
  // Enhanced Classification Fields
  variationType: z.enum(["client_requested", "quote_oversight", "third_party_damage"]).default("client_requested"),
  isChargeable: z.boolean().default(true),
  requiresSubcontractor: z.boolean().default(false),
  clientApprovalRequired: z.boolean().default(false),
  
  // Enhanced Pricing Fields
  pricingModel: z.enum(["fixed", "hourly", "hybrid"]).default("fixed"),
  fixedPrice: z.number().optional(),
  hourlyRate: z.number().optional(),
  estimatedHours: z.number().optional(),
  basePrice: z.number().optional(),
  workerType: z.enum(["employee", "contractor", "subcontractor"]).default("employee"),
  billMeLater: z.boolean().default(false),
  clientAmount: z.number().optional(),
  subcontractorAmount: z.number().optional(),
  subcontractorCost: z.number().optional(), // What subcontractor charges us
  materialsCost: z.number().optional(), // Actual material costs
  laborCost: z.number().optional(), // Internal labor costs
  clientHourlyRate: z.number().optional(),
  contractorHourlyRate: z.number().optional(),
  materialsClientCharge: z.number().optional(),
  materialsActualCost: z.number().optional(),
  contractorId: z.number().optional(),
  
  // Legacy fields for backward compatibility
  variationAmount: z.number().optional(),
  variationStatus: z.string().default("pending"),
});

export type InsertVariation = z.infer<typeof insertVariationSchema>;
export type Variation = typeof variations.$inferSelect;

// Schema for legacy photo object structure (for jobs.photos JSONB field)
export const photoSchema = z.object({
  url: z.string(),
  description: z.string().optional(),
  uploadedBy: z.number().optional(),
  timestamp: z.date().or(z.string()).optional(),
  album: z.string().default("general"), // Album category: progress, before, after, issues, materials, completed, general
});

export type PhotoObject = z.infer<typeof photoSchema>;

// Schema for document file object structure
export const documentSchema = z.object({
  url: z.string(),
  name: z.string(),
  description: z.string().optional(),
  fileType: z.string().optional(),
  uploadedBy: z.number().optional(),
  timestamp: z.date().or(z.string()).optional(),
  size: z.number().optional(),
});

export type Document = z.infer<typeof documentSchema>;

// Enhanced Photos Table for AI Analysis  
export const photos: any = pgTable("photos", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  url: text("url").notNull(),
  description: text("description"),
  album: text("album").default("general"), // progress, before, after, issues, materials, completed, general
  uploadedBy: integer("uploaded_by").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
  
  // AI Analysis Fields
  aiDescription: text("ai_description"),
  progressPercentage: integer("progress_percentage"),
  qualityScore: integer("quality_score"),
  safetyCompliance: integer("safety_compliance"),
  workPhase: text("work_phase"),
  defectsDetected: jsonb("defects_detected"), // string[]
  recommendations: jsonb("recommendations"), // string[]
  completionStatus: text("completion_status"), // not_started, in_progress, completed, rework_needed
  analyzedAt: timestamp("analyzed_at"),
  
  // Photo Metadata
  beforePhotoId: integer("before_photo_id").references(() => photos.id),
  afterPhotoId: integer("after_photo_id").references(() => photos.id),
  fileSize: integer("file_size"),
  width: integer("width"),
  height: integer("height"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdIdx: index("photos_job_id_idx").on(table.jobId),
  albumIdx: index("photos_album_idx").on(table.album),
  analyzedIdx: index("photos_analyzed_idx").on(table.analyzedAt),
  workPhaseIdx: index("photos_work_phase_idx").on(table.workPhase),
}));

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// === PHASE 1: ENHANCED PHOTO SYSTEM FOR PROFESSIONAL CONSTRUCTION REPORTS ===

// Professional construction photos with enhanced metadata for reports
export const constructionPhotos = pgTable("construction_photos", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  variationId: integer("variation_id").references(() => variations.id),
  url: text("url").notNull(),
  filename: text("filename").notNull(),
  stage: text("stage").notNull(), // 'before', 'during', 'after', 'milestone'
  tradeType: text("trade_type"), // 'drywall', 'painting', 'plastering'
  zoneId: text("zone_id"), // Site zone identifier (100-250 sq ft areas)
  gpsLat: decimal("gps_lat", { precision: 10, scale: 8 }),
  gpsLng: decimal("gps_lng", { precision: 11, scale: 8 }),
  photographerId: integer("photographer_id").references(() => users.id),
  description: text("description"),
  isProgressPhoto: boolean("is_progress_photo").default(false),
  qualityScore: integer("quality_score").default(0), // AI-generated assessment
  metadata: jsonb("metadata"), // Camera settings, weather, etc.
  timestamp: timestamp("timestamp").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdIdx: index("construction_photos_job_id_idx").on(table.jobId),
  stageIdx: index("construction_photos_stage_idx").on(table.stage),
  tradeTypeIdx: index("construction_photos_trade_type_idx").on(table.tradeType),
  zoneIdIdx: index("construction_photos_zone_id_idx").on(table.zoneId),
}));

// Progress milestone tracking for reports
export const progressMilestones = pgTable("progress_milestones", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  name: text("name").notNull(),
  targetDate: date("target_date"),
  actualDate: date("actual_date"),
  completionPercentage: integer("completion_percentage").default(0),
  photosRequired: integer("photos_required").default(3),
  photosCaptured: integer("photos_captured").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdIdx: index("progress_milestones_job_id_idx").on(table.jobId),
  targetDateIdx: index("progress_milestones_target_date_idx").on(table.targetDate),
}));

// Systematic site documentation zones for professional reporting
export const siteZones = pgTable("site_zones", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id),
  zoneName: text("zone_name").notNull(),
  areaSqft: decimal("area_sqft", { precision: 8, scale: 2 }),
  tradeAssignment: text("trade_assignment"),
  referencePointGps: text("reference_point_gps"), // Storing as text for simplicity
  photoAngles: jsonb("photo_angles"), // Standardized viewpoints
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdIdx: index("site_zones_job_id_idx").on(table.jobId),
  tradeAssignmentIdx: index("site_zones_trade_assignment_idx").on(table.tradeAssignment),
}));

// Insert schemas for the new tables
export const insertConstructionPhotoSchema = createInsertSchema(constructionPhotos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProgressMilestoneSchema = createInsertSchema(progressMilestones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteZoneSchema = createInsertSchema(siteZones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for the new tables
export type InsertConstructionPhoto = z.infer<typeof insertConstructionPhotoSchema>;
export type ConstructionPhoto = typeof constructionPhotos.$inferSelect;
export type InsertProgressMilestone = z.infer<typeof insertProgressMilestoneSchema>;
export type ProgressMilestone = typeof progressMilestones.$inferSelect;
export type InsertSiteZone = z.infer<typeof insertSiteZoneSchema>;
export type SiteZone = typeof siteZones.$inferSelect;

// Schema for task object structure
export const taskSchema = z.object({
  id: z.number().or(z.string()).optional(),
  name: z.string().min(1, "Task name is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  inProgress: z.boolean().default(false),
  status: z.string().optional(),
  blockId: z.string().optional(),
  unitId: z.number().or(z.string()).optional(),
  unitNumber: z.string().optional(),
  type: z.string().optional(),
  assignedTo: z.number().or(z.string()).optional(),
  dueDate: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().nullable().optional()
});

export type Task = z.infer<typeof taskSchema>;

// Schema for job material object structure
export const jobMaterialSchema = z.object({
  id: z.number(),
  materialId: z.number(),
  name: z.string(),
  quantity: z.number(),
  used: z.number().default(0),
  unit: z.string(),
});

export type JobMaterial = z.infer<typeof jobMaterialSchema>;

// Schema for issue object structure within jobs
export const jobIssueSchema = z.object({
  id: z.number().or(z.string()),
  title: z.string(),
  description: z.string(),
  reportedBy: z.number(),
  reportedTime: z.string().or(z.date()),
  status: z.string().default("open"),
  priority: z.string().optional().default("medium"),
  photos: z.array(z.any()).optional(),
});

export type JobIssue = z.infer<typeof jobIssueSchema>;

// Schema for location coordinates with optional variation ID for check-in
export const locationSchema = z.object({
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  accuracy: z.number().optional(),
  variationId: z.coerce.number().nullable().optional(), // Phase 4: Allow variation selection during check-in
  timestamp: z.string().optional(), // Allow timestamp parameter
});

// Schema for checkout with optional location data
export const checkoutSchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  timestamp: z.string().optional(),
});

export type Location = z.infer<typeof locationSchema>;

// Dedicated blocks table
export const blocks = pgTable("blocks", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  name: text("name").notNull(),
  color: text("color").default("blue"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBlockSchema = createInsertSchema(blocks).pick({
  jobId: true,
  name: true,
  color: true,
});

export type InsertBlock = z.infer<typeof insertBlockSchema>;
export type Block = typeof blocks.$inferSelect;

// Dedicated units table
export const units = pgTable("units", {
  id: serial("id").primaryKey(),
  blockId: integer("block_id").notNull(),
  name: text("name").notNull(),
  number: text("number"),
  color: text("color").default("green"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUnitSchema = createInsertSchema(units).pick({
  blockId: true,
  name: true,
  number: true,
  color: true,
});

export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Unit = typeof units.$inferSelect;

// Schema for unit object structure within blocks (for JSON representations)
export const unitSchema = z.object({
  id: z.number().or(z.string()),
  name: z.string(),
  number: z.string().optional(),
  color: z.string().optional(),
});

// Schema for block object structure (for JSON representations)
export const blockSchema = z.object({
  id: z.string().or(z.number()),
  name: z.string(),
  color: z.string().optional(),
  units: z.array(unitSchema).optional(),
  order: z.number().optional(), // Add order field for block positioning
});

// Job revenue table - tracks job pricing and quotes
export const jobRevenue = pgTable("job_revenue", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  quotedPrice: real("quoted_price").notNull(),
  finalPrice: real("final_price"), // Actual agreed price if different from quote
  status: text("status").notNull().default("quoted"), // quoted, accepted, completed
  quotedAt: timestamp("quoted_at").defaultNow(),
  acceptedAt: timestamp("accepted_at"),
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job budgets table - simplified for planned costs
export const jobBudgets = pgTable("job_budgets", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  materialsbudget: real("materials_budget").notNull().default(0),
  laborBudget: real("labor_budget").notNull().default(0),
  equipmentBudget: real("equipment_budget").notNull().default(0),
  otherBudget: real("other_budget").notNull().default(0),
  totalBudget: real("total_budget").notNull(), // Sum of all categories
  notes: text("notes"),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Budget line items for detailed cost tracking
export const budgetLineItems = pgTable("budget_line_items", {
  id: serial("id").primaryKey(),
  budgetId: integer("budget_id").notNull(),
  category: text("category").notNull(), // materials, labor, equipment, overhead, contingency
  subcategory: text("subcategory"), // drywall, electrical, plumbing, etc.
  description: text("description").notNull(),
  budgetedAmount: real("budgeted_amount").notNull(),
  actualAmount: real("actual_amount").default(0),
  unit: text("unit"), // hours, sq ft, linear ft, each, etc.
  quantity: real("quantity").default(1),
  unitCost: real("unit_cost").default(0),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Expense categories table for custom category management
export const expenseCategories = pgTable("expense_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon").default("📊"),
  color: text("color").default("#6B7280"),
  isDefault: boolean("is_default").default(false),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Cost transactions for tracking actual expenses - simplified
export const costTransactions = pgTable("cost_transactions", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  category: text("category").notNull(), // Now references expense category name
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  expenseDate: timestamp("expense_date").defaultNow(),
  receiptPhoto: text("receipt_photo"), // URL to receipt photo
  notes: text("notes"),
  timeEntryId: integer("time_entry_id"), // Link to time entry for automatic labor costs
  status: text("status").default("paid"), // committed, paid - for accrual accounting
  contractId: integer("contract_id"), // Link to subcontractor contract
  variationId: integer("variation_id"), // Link to variation for automatic variation costs
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Document folders for organizing construction documents
export const documentFolders = pgTable("document_folders", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  name: text("name").notNull(),
  parentFolderId: integer("parent_folder_id"), // For nested folders
  isSystemFolder: boolean("is_system_folder").default(false), // Auto-created folders that can't be deleted
  icon: text("icon").default("📁"),
  createdBy: integer("created_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertDocumentFolderSchema = createInsertSchema(documentFolders).pick({
  jobId: true,
  name: true,
  parentFolderId: true,
  isSystemFolder: true,
  icon: true,
  createdBy: true,
});

export type InsertDocumentFolder = z.infer<typeof insertDocumentFolderSchema>;
export type DocumentFolder = typeof documentFolders.$inferSelect;

// Construction plans document storage
export const constructionDocuments = pgTable("construction_documents", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id"),
  folderId: integer("folder_id"), // Link to document folder
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(), // pdf, image, dwg, etc.
  uploadedBy: integer("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  processingStatus: text("processing_status").default("pending"), // pending, processing, completed, failed
  textContent: text("text_content"), // Extracted text content
  pageCount: integer("page_count"),
  metadata: jsonb("metadata"), // Additional metadata about the document
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertConstructionDocumentSchema = createInsertSchema(constructionDocuments).pick({
  jobId: true,
  folderId: true,
  title: true,
  description: true,
  fileUrl: true,
  fileType: true,
  uploadedBy: true,
  processingStatus: true,
  textContent: true,
  pageCount: true,
  metadata: true,
});

export type InsertConstructionDocument = z.infer<typeof insertConstructionDocumentSchema>;
export type ConstructionDocument = typeof constructionDocuments.$inferSelect;

// Document chunks for RAG system
export const documentChunks = pgTable("document_chunks", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  jobId: integer("job_id"),
  chunkIndex: integer("chunk_index").notNull(),
  content: text("content").notNull(),
  chunkText: text("chunk_text"),
  embedding: text("embedding"), // Vector embedding as JSON string
  pageNumber: integer("page_number"),
  sectionType: text("section_type"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertDocumentChunkSchema = createInsertSchema(documentChunks).pick({
  documentId: true,
  jobId: true,
  chunkIndex: true,
  content: true,
  chunkText: true,
  embedding: true, 
  pageNumber: true,
  sectionType: true,
  metadata: true,
});

export type InsertDocumentChunk = z.infer<typeof insertDocumentChunkSchema>;
export type DocumentChunk = typeof documentChunks.$inferSelect;

// Building codes knowledge base
export const buildingCodes = pgTable("building_codes", {
  id: serial("id").primaryKey(),
  codeSection: text("code_section").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  embedding: text("embedding"), // Vector embedding as JSON string
  regulationType: text("regulation_type"),
  countryCode: text("country_code").default("NZ"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBuildingCodeSchema = createInsertSchema(buildingCodes).pick({
  codeSection: true,
  title: true,
  content: true,
  embedding: true,
  regulationType: true,
  countryCode: true,
});

export type InsertBuildingCode = z.infer<typeof insertBuildingCodeSchema>;
export type BuildingCode = typeof buildingCodes.$inferSelect;

// AI query history for audit and learning
export const aiQueryHistory = pgTable("ai_query_history", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id"),
  userId: integer("user_id"),
  queryText: text("query_text").notNull(),
  responseText: text("response_text").notNull(),
  citedDocuments: jsonb("cited_documents"),
  citedCodes: jsonb("cited_codes"),
  confidenceScore: real("confidence_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAiQueryHistorySchema = createInsertSchema(aiQueryHistory).pick({
  jobId: true,
  userId: true,
  queryText: true,
  responseText: true,
  citedDocuments: true,
  citedCodes: true,
  confidenceScore: true,
});

export type InsertAiQueryHistory = z.infer<typeof insertAiQueryHistorySchema>;
export type AiQueryHistory = typeof aiQueryHistory.$inferSelect;

// Revenue, Budget, and Cost schemas
export const insertJobRevenueSchema = createInsertSchema(jobRevenue).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobBudgetSchema = createInsertSchema(jobBudgets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExpenseCategorySchema = createInsertSchema(expenseCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCostTransactionSchema = createInsertSchema(costTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertJobRevenue = z.infer<typeof insertJobRevenueSchema>;
export type JobRevenue = typeof jobRevenue.$inferSelect;
export type InsertJobBudget = z.infer<typeof insertJobBudgetSchema>;
export type JobBudget = typeof jobBudgets.$inferSelect;
export type InsertExpenseCategory = z.infer<typeof insertExpenseCategorySchema>;
export type ExpenseCategory = typeof expenseCategories.$inferSelect;
export type InsertCostTransaction = z.infer<typeof insertCostTransactionSchema>;
export type CostTransaction = typeof costTransactions.$inferSelect;

// Keep existing budget line items for backward compatibility but mark as deprecated
export const insertBudgetLineItemSchema = createInsertSchema(budgetLineItems).pick({
  budgetId: true,
  category: true,
  subcategory: true,
  description: true,
  budgetedAmount: true,
  actualAmount: true,
  unit: true,
  quantity: true,
  unitCost: true,
  notes: true,
});

export type InsertBudgetLineItem = z.infer<typeof insertBudgetLineItemSchema>;
export type BudgetLineItem = typeof budgetLineItems.$inferSelect;

// Job diary entries - timestamped notes for each job
export const jobDiaryEntries = pgTable("job_diary_entries", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertJobDiaryEntrySchema = createInsertSchema(jobDiaryEntries).pick({
  jobId: true,
  content: true,
  authorId: true,
});

export type InsertJobDiaryEntry = z.infer<typeof insertJobDiaryEntrySchema>;
export type JobDiaryEntry = typeof jobDiaryEntries.$inferSelect;

// Chat conversations with the AI about documents
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id"),
  title: text("title").notNull().default("New Conversation"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).pick({
  userId: true,
  jobId: true,
  title: true,
});

export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;

// Individual messages in a chat conversation
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(), // user, assistant, system
  content: text("content").notNull(),
  documentReferences: jsonb("document_references"), // [{documentId, chunkIds}]
  timestamp: timestamp("timestamp").defaultNow(),
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  conversationId: true,
  role: true,
  content: true,
  documentReferences: true,
});

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

// Contract Payments table for Phase 5 - Revenue Integration
export const contractPayments = pgTable("contract_payments", {
  id: serial("id").primaryKey(),
  contractId: integer("contract_id").notNull(),
  jobId: integer("job_id").notNull(),
  paymentType: text("payment_type").notNull(), // base_contract, variation, retention_release, penalty
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date").notNull(),
  description: text("description"),
  invoiceNumber: text("invoice_number"),
  paymentMethod: text("payment_method"), // bank_transfer, check, cash, card
  reference: text("reference"), // Payment reference or transaction ID
  status: text("status").default("completed"), // pending, completed, failed, disputed
  variationId: integer("variation_id"), // Links to issues.id when payment is for variation
  recordedBy: integer("recorded_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertContractPaymentSchema = createInsertSchema(contractPayments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertContractPayment = z.infer<typeof insertContractPaymentSchema>;
export type ContractPayment = typeof contractPayments.$inferSelect;

// Notifications table for role-based notification system - Phase 3 Enhanced
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // recipient of notification
  type: text("type").notNull(), // check_in, check_out, note_added, job_assigned, variation_assigned, entry_updated, distance_warning, auto_checkout, arrival, departure
  title: text("title").notNull(), // notification headline
  message: text("message").notNull(), // detailed content
  jobId: integer("job_id"), // related job - for worker filtering
  variationId: integer("variation_id"), // related variation - optional
  taskId: integer("task_id"), // related task - optional
  triggeredByUserId: integer("triggered_by_user_id").notNull(), // who caused the notification
  read: boolean("read").default(false), // notification status
  priority: text("priority").default("medium"), // critical, high, medium, low
  metadata: jsonb("metadata"), // flexible data storage
  // Phase 3: GPS-specific notification fields
  alertType: varchar("alert_type", { length: 50 }), // 'distance_warning', 'auto_checkout', 'arrival', 'departure', 'session_alert'
  workerId: integer("worker_id"), // Link to specific worker for GPS alerts
  locationData: jsonb("location_data"), // GPS coordinates and metadata
  alertThreshold: decimal("alert_threshold", { precision: 10, scale: 2 }), // Distance threshold that triggered alert
  actualDistance: decimal("actual_distance", { precision: 10, scale: 2 }), // Actual distance when alert triggered
  sessionDuration: integer("session_duration"), // Worker session duration in minutes
  alertPriority: varchar("alert_priority", { length: 20 }).default("medium"), // 'low', 'medium', 'high', 'critical'
  autoDismissed: boolean("auto_dismissed").default(false),
  dismissedAt: timestamp("dismissed_at"),
  notificationPreferences: jsonb("notification_preferences"), // User-specific notification settings
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  userIdReadCreatedAtIdx: index("notifications_user_id_read_created_at_idx").on(table.userId, table.read, table.createdAt),
  jobIdCreatedAtIdx: index("notifications_job_id_created_at_idx").on(table.jobId, table.createdAt),
  typeCreatedAtIdx: index("notifications_type_created_at_idx").on(table.type, table.createdAt),
  // Phase 3: GPS-specific indexes
  alertTypeCreatedAtIdx: index("notifications_alert_type_created_at_idx").on(table.alertType, table.createdAt),
  workerIdAlertTypeIdx: index("notifications_worker_id_alert_type_idx").on(table.workerId, table.alertType),
  alertPriorityReadIdx: index("notifications_alert_priority_read_idx").on(table.alertPriority, table.read),
}));

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// Worker locations table for Phase 1 GPS background service
export const workerLocations = pgTable("worker_locations", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  accuracy: decimal("accuracy", { precision: 6, scale: 2 }),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  source: varchar("source", { length: 50 }).notNull(), // 'checkin', 'app_load', 'manual', 'api', 'background'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  // Index for efficient queries on active locations by worker and timestamp
  workerTimestampActiveIdx: index("worker_locations_worker_timestamp_active_idx")
    .on(table.workerId, table.timestamp),
}));

export const insertWorkerLocationSchema = createInsertSchema(workerLocations).omit({
  id: true,
  createdAt: true,
});

export type InsertWorkerLocation = z.infer<typeof insertWorkerLocationSchema>;
export type WorkerLocation = typeof workerLocations.$inferSelect;

// Safety Management System Tables - Phase 1 Implementation

// Safety Incidents table for tracking workplace incidents
export const safetyIncidents = pgTable("safety_incidents", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  reporterId: integer("reporter_id").notNull(),
  incidentDate: timestamp("incident_date").notNull(),
  incidentType: text("incident_type").notNull(), // 'injury', 'property_damage', 'environmental', 'equipment_failure'
  severityLevel: text("severity_level").notNull(), // 'minor', 'moderate', 'severe', 'fatal'
  title: text("title").notNull(),
  description: text("description").notNull(),
  locationDescription: text("location_description"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Personnel Information
  injuredPersonName: text("injured_person_name"),
  injuredPersonId: integer("injured_person_id"),
  witnesses: jsonb("witnesses"), // Array of witness information
  supervisorNotified: boolean("supervisor_notified").default(false),
  supervisorId: integer("supervisor_id"),
  
  // Medical/Response Information
  firstAidGiven: boolean("first_aid_given").default(false),
  medicalTreatmentRequired: boolean("medical_treatment_required").default(false),
  hospitalTransport: boolean("hospital_transport").default(false),
  medicalFacility: text("medical_facility"),
  
  // Body Parts & Injury Classification
  bodyPartsAffected: text("body_parts_affected").array(), // Array of affected body parts
  injuryType: text("injury_type"), // 'cut', 'burn', 'fracture', 'strain', 'bruise', etc.
  potentialCause: text("potential_cause"),
  
  // Investigation & Analysis
  rootCauseAnalysis: text("root_cause_analysis"),
  immediateCause: text("immediate_cause"),
  contributingFactors: text("contributing_factors").array(),
  correctiveActions: text("corrective_actions").array(),
  preventiveMeasures: text("preventive_measures").array(),
  
  // Status & Workflow
  status: text("status").default("reported"), // 'reported', 'investigating', 'under_review', 'closed'
  investigationCompleted: boolean("investigation_completed").default(false),
  investigationDueDate: date("investigation_due_date"),
  investigationNotes: text("investigation_notes"),
  
  // Regulatory & Compliance
  regulatoryNotificationRequired: boolean("regulatory_notification_required").default(false),
  regulatoryReported: boolean("regulatory_reported").default(false),
  regulatoryReportDate: timestamp("regulatory_report_date"),
  oshaReportable: boolean("osha_reportable").default(false),
  
  // Media & Documentation
  photos: jsonb("photos"), // Array of photo URLs and metadata
  documents: jsonb("documents"), // Array of document URLs and metadata
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").notNull(),
  updatedBy: integer("updated_by"),
}, (table) => ({
  jobIdIdx: index("safety_incidents_job_id_idx").on(table.jobId),
  reporterIdIdx: index("safety_incidents_reporter_id_idx").on(table.reporterId),
  incidentDateIdx: index("safety_incidents_incident_date_idx").on(table.incidentDate),
  severityTypeIdx: index("safety_incidents_severity_type_idx").on(table.severityLevel, table.incidentType),
}));

export const insertSafetyIncidentSchema = createInsertSchema(safetyIncidents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSafetyIncident = z.infer<typeof insertSafetyIncidentSchema>;
export type SafetyIncident = typeof safetyIncidents.$inferSelect;

// Near Miss Reports table for tracking potential incidents
export const nearMissReports = pgTable("near_miss_reports", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  reporterId: integer("reporter_id").notNull(),
  reportDate: timestamp("report_date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  locationDescription: text("location_description"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Risk Assessment
  likelihoodLevel: integer("likelihood_level").notNull(), // 1-5 scale
  consequenceLevel: integer("consequence_level").notNull(), // 1-5 scale
  riskScore: integer("risk_score"), // Generated: likelihood * consequence
  
  // Hazard Information
  hazardType: text("hazard_type").notNull(), // 'physical', 'chemical', 'biological', 'ergonomic', 'psychosocial'
  hazardCategory: text("hazard_category"), // 'fall', 'struck_by', 'caught_in', 'electrical', etc.
  potentialConsequences: text("potential_consequences").array(),
  
  // Prevention & Learning
  whatPreventedIncident: text("what_prevented_incident"),
  preventiveActionsTaken: text("preventive_actions_taken").array(),
  recommendations: text("recommendations").array(),
  lessonsLearned: text("lessons_learned"),
  
  // Follow-up Actions
  followUpRequired: boolean("follow_up_required").default(false),
  followUpActions: text("follow_up_actions").array(),
  followUpDueDate: date("follow_up_due_date"),
  followUpCompleted: boolean("follow_up_completed").default(false),
  followUpNotes: text("follow_up_notes"),
  
  // Status & Workflow
  status: text("status").default("reported"), // 'reported', 'under_review', 'action_required', 'closed'
  reviewedBy: integer("reviewed_by"),
  reviewedDate: timestamp("reviewed_date"),
  
  // Media & Documentation
  photos: jsonb("photos"),
  documents: jsonb("documents"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").notNull(),
}, (table) => ({
  jobIdIdx: index("near_miss_reports_job_id_idx").on(table.jobId),
  reporterIdIdx: index("near_miss_reports_reporter_id_idx").on(table.reporterId),
  reportDateIdx: index("near_miss_reports_report_date_idx").on(table.reportDate),
  riskScoreIdx: index("near_miss_reports_risk_score_idx").on(table.riskScore),
}));

export const insertNearMissReportSchema = createInsertSchema(nearMissReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNearMissReport = z.infer<typeof insertNearMissReportSchema>;
export type NearMissReport = typeof nearMissReports.$inferSelect;

// Safety Inspections table for tracking safety audits
export const safetyInspections = pgTable("safety_inspections", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  inspectorId: integer("inspector_id").notNull(),
  inspectionDate: timestamp("inspection_date").notNull(),
  inspectionType: text("inspection_type").notNull(), // 'daily', 'weekly', 'monthly', 'pre_task', 'post_incident'
  inspectionCategory: text("inspection_category"), // 'scaffolding', 'electrical', 'fall_protection', 'general'
  
  // Inspection Details
  title: text("title").notNull(),
  checklistTemplateId: integer("checklist_template_id"), // Reference to checklist templates
  checklistAnswers: jsonb("checklist_answers"), // Simplified daily inspection answers [{item, pass, note}]
  areasInspected: text("areas_inspected").array(),
  
  // Scoring & Results
  overallScore: integer("overall_score"), // Percentage score
  totalItemsChecked: integer("total_items_checked"),
  itemsPassed: integer("items_passed"),
  itemsFailed: integer("items_failed"),
  criticalFailures: integer("critical_failures"),
  
  // Findings & Issues
  findings: text("findings").array(),
  hazardsIdentified: text("hazards_identified").array(),
  immediateActionsRequired: text("immediate_actions_required").array(),
  correctiveActions: text("corrective_actions").array(),
  
  // Compliance & Certification
  complianceStatus: text("compliance_status").default("compliant"), // 'compliant', 'non_compliant', 'conditional'
  certificationRequired: boolean("certification_required").default(false),
  certifiedBy: integer("certified_by"),
  certificationDate: timestamp("certification_date"),
  
  // Follow-up & Deadlines
  followUpRequired: boolean("follow_up_required").default(false),
  followUpDueDate: date("follow_up_due_date"),
  followUpCompleted: boolean("follow_up_completed").default(false),
  nextInspectionDue: date("next_inspection_due"),
  
  // Status & Workflow
  status: text("status").default("completed"), // 'in_progress', 'completed', 'approved', 'rejected'
  approvedBy: integer("approved_by"),
  approvalDate: timestamp("approval_date"),
  
  // Media & Documentation
  photos: jsonb("photos"),
  documents: jsonb("documents"),
  digitalSignature: jsonb("digital_signature"), // Inspector signature data
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdIdx: index("safety_inspections_job_id_idx").on(table.jobId),
  inspectorIdIdx: index("safety_inspections_inspector_id_idx").on(table.inspectorId),
  inspectionDateIdx: index("safety_inspections_inspection_date_idx").on(table.inspectionDate),
  statusIdx: index("safety_inspections_status_idx").on(table.status),
}));

export const insertSafetyInspectionSchema = createInsertSchema(safetyInspections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSafetyInspection = z.infer<typeof insertSafetyInspectionSchema>;
export type SafetyInspection = typeof safetyInspections.$inferSelect;

// Hazard Reports table for tracking workplace hazards
export const hazardReports = pgTable("hazard_reports", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull(),
  reporterId: integer("reporter_id").notNull(),
  reportDate: timestamp("report_date").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  locationDescription: text("location_description"),
  latitude: real("latitude"),
  longitude: real("longitude"),
  
  // Hazard Classification
  hazardType: text("hazard_type").notNull(), // 'physical', 'chemical', 'biological', 'ergonomic'
  hazardCategory: text("hazard_category"), // 'fall_risk', 'electrical', 'chemical_exposure', etc.
  severityLevel: text("severity_level").notNull(), // 'low', 'medium', 'high', 'critical'
  
  // Risk Assessment
  likelihood: integer("likelihood"), // 1-5 scale
  consequence: integer("consequence"), // 1-5 scale
  riskRating: integer("risk_rating"), // Generated: likelihood * consequence
  
  // Control Measures
  currentControls: text("current_controls").array(),
  recommendedControls: text("recommended_controls").array(),
  controlHierarchy: text("control_hierarchy"), // 'elimination', 'substitution', 'engineering', 'administrative'
  
  // Action Items
  immediateActions: text("immediate_actions").array(),
  longTermActions: text("long_term_actions").array(),
  responsiblePersonId: integer("responsible_person_id"),
  targetCompletionDate: date("target_completion_date"),
  
  // Status & Tracking
  status: text("status").default("open"), // 'open', 'in_progress', 'resolved', 'closed'
  resolutionDate: timestamp("resolution_date"),
  resolutionNotes: text("resolution_notes"),
  verifiedBy: integer("verified_by"),
  verificationDate: timestamp("verification_date"),
  
  // Monitoring & Review
  monitoringRequired: boolean("monitoring_required").default(false),
  monitoringFrequency: text("monitoring_frequency"), // 'daily', 'weekly', 'monthly'
  nextReviewDate: date("next_review_date"),
  
  // Media & Documentation
  photos: jsonb("photos"),
  documents: jsonb("documents"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  resolvedBy: integer("resolved_by"),
}, (table) => ({
  jobIdIdx: index("hazard_reports_job_id_idx").on(table.jobId),
  reporterIdIdx: index("hazard_reports_reporter_id_idx").on(table.reporterId),
  reportDateIdx: index("hazard_reports_report_date_idx").on(table.reportDate),
  severityStatusIdx: index("hazard_reports_severity_status_idx").on(table.severityLevel, table.status),
}));

export const insertHazardReportSchema = createInsertSchema(hazardReports).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertHazardReport = z.infer<typeof insertHazardReportSchema>;
export type HazardReport = typeof hazardReports.$inferSelect;

// Safety Training Records table for tracking worker certifications
export const safetyTrainingRecords = pgTable("safety_training_records", {
  id: serial("id").primaryKey(),
  workerId: integer("worker_id").notNull(),
  trainingType: text("training_type").notNull(), // 'induction', 'refresher', 'specific_skill', 'certification'
  trainingName: text("training_name").notNull(),
  trainingProvider: text("training_provider"),
  
  // Training Details
  trainingDate: date("training_date").notNull(),
  expiryDate: date("expiry_date"),
  certificationNumber: text("certification_number"),
  competencyLevel: text("competency_level"), // 'basic', 'intermediate', 'advanced', 'expert'
  
  // Verification
  verifiedBy: integer("verified_by"),
  verificationDate: timestamp("verification_date"),
  verificationNotes: text("verification_notes"),
  
  // Status & Compliance
  status: text("status").default("active"), // 'active', 'expired', 'pending_renewal', 'revoked'
  renewalRequired: boolean("renewal_required").default(false),
  renewalDueDate: date("renewal_due_date"),
  
  // Documentation
  certificateUrl: text("certificate_url"),
  trainingDocuments: jsonb("training_documents"),
  
  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdBy: integer("created_by").notNull(),
}, (table) => ({
  workerIdIdx: index("safety_training_records_worker_id_idx").on(table.workerId),
  trainingTypeIdx: index("safety_training_records_training_type_idx").on(table.trainingType),
  statusIdx: index("safety_training_records_status_idx").on(table.status),
  expiryDateIdx: index("safety_training_records_expiry_date_idx").on(table.expiryDate),
}));

export const insertSafetyTrainingRecordSchema = createInsertSchema(safetyTrainingRecords).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSafetyTrainingRecord = z.infer<typeof insertSafetyTrainingRecordSchema>;
export type SafetyTrainingRecord = typeof safetyTrainingRecords.$inferSelect;

// Mobile worker media uploads (evidence photos/videos)
export const mediaUploads = pgTable("media_uploads", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  jobId: integer("job_id").notNull(),
  url: text("url").notNull(),
  originalName: text("original_name"),
  mimeType: text("mime_type"),
  size: integer("size"),
  tags: jsonb("tags"), // ["before","after","hazard"]
  createdAt: timestamp("created_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => ({
  jobIdx: index("media_uploads_job_id_idx").on(table.jobId),
  userIdx: index("media_uploads_user_id_idx").on(table.userId),
  createdIdx: index("media_uploads_created_at_idx").on(table.createdAt),
}));

export type MediaUpload = typeof mediaUploads.$inferSelect;

// Mobile documents master + user assignments/acknowledgments
export const documentsMaster = pgTable("documents_master", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id"),
  name: text("name").notNull(),
  url: text("url").notNull(),
  mimeType: text("mime_type"),
  size: integer("size"),
  version: integer("version").default(1),
  tags: jsonb("tags"),
  uploadedBy: integer("uploaded_by"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  jobIdx: index("documents_master_job_id_idx").on(table.jobId),
  updatedIdx: index("documents_master_updated_at_idx").on(table.updatedAt),
}));

export const documentAssignments = pgTable("document_assignments", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  userId: integer("user_id").notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  acknowledgedAt: timestamp("acknowledged_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => ({
  docIdx: index("document_assignments_doc_id_idx").on(table.documentId),
  userIdx: index("document_assignments_user_id_idx").on(table.userId),
  updatedIdx: index("document_assignments_updated_at_idx").on(table.updatedAt),
}));

export type DocumentMaster = typeof documentsMaster.$inferSelect;
export type DocumentAssignment = typeof documentAssignments.$inferSelect;


