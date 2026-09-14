"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { db } from "@/db/drizzle";
import { business } from "@/db/schema";

export async function createBusiness(formData: FormData) {
  // 1. Get the logged-in user
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 2. Make sure they're authenticated
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // 3. Get values from the form
  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const email = formData.get("email")?.toString().trim();

  // 4. Basic validation
  if (!name || !description) {
    throw new Error("Business name and description are required");
  }

  // 5. Generate slug from business name
  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // 6. Create the business
  await db.insert(business).values({
    id: crypto.randomUUID(),
    name,
    slug,
    description,
    phone: phone || null,
    email: email || null,
    userId: session.user.id,
  });

  // 7. Send the user to the dashboard
  redirect("/dashboard");
}

