"use server";
import { db } from "@/lib/db";
import { company, CompanyData } from "@/db/schema";

export async function createCompany(data: CompanyData) {
  await db.insert(company).values(data);
}

export async function getCompanies() {
  return await db.select().from(company);
}
