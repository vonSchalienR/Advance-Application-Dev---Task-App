import { Client, Account, Databases } from "appwrite";

export const DB_ID = "692736420010c90e202c";          
export const TASK_COLLECTION = "tasks";              
export const COMPLETIONS_COLLECTION = "completions";

export const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account = new Account(client);
export const databases = new Databases(client);

