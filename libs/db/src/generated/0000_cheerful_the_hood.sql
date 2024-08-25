DO $$ BEGIN
 CREATE TYPE "public"."anonProjectPaymentStatus" AS ENUM('Draft', 'Pending', 'Canceled', 'Expired', 'ConvertedToProject');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."loginprovider" AS ENUM('email', 'google', 'github');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."projectPaymentStatus" AS ENUM('Draft', 'Pending', 'Paid', 'Canceled', 'Expired');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "AnonProject" (
	"anonProjectId" char(26) PRIMARY KEY NOT NULL,
	"project" jsonb NOT NULL,
	"paymentResult" jsonb,
	"paymentStatus" "anonProjectPaymentStatus" NOT NULL,
	"createdAt" timestamp (3) DEFAULT '2024-08-24T11:16:18.345Z' NOT NULL,
	"updatedAt" timestamp (3) DEFAULT '2024-08-24T11:16:18.345Z' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Feedback" (
	"feedbackId" text PRIMARY KEY NOT NULL,
	"userId" text,
	"subject" text,
	"email" text,
	"contactMe" boolean NOT NULL,
	"createdAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "NotifyMe" (
	"notifyMeId" char(26) PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"notification" text NOT NULL,
	"createdAt" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Project" (
	"projectId" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"config" jsonb NOT NULL,
	"description" text,
	"name" text NOT NULL,
	"meta" jsonb,
	"createdAt" timestamp (3) DEFAULT '2024-08-24T11:16:18.344Z' NOT NULL,
	"updatedAt" timestamp (3) DEFAULT '2024-08-24T11:16:18.344Z' NOT NULL,
	"paymentStatus" "projectPaymentStatus" DEFAULT 'Draft'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "User" (
	"userId" char(26) PRIMARY KEY NOT NULL,
	"subId" char(36) NOT NULL,
	"email" text,
	"loginProvider" loginprovider[] NOT NULL,
	"createdAt" timestamp (3) NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_User_userId_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("userId") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
