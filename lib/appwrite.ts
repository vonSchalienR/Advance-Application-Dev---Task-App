import { Account, Client, Databases, ID, Query } from 'appwrite';

// 🔧 Täytä omilla Appwrite-arvoillasi
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject('YOUR_PROJECT_ID');

export const account = new Account(client);
export const databases = new Databases(client);

export const DATABASE_ID = 'YOUR_DATABASE_ID';
export const TASKS_COLLECTION_ID = 'YOUR_TASKS_COLLECTION_ID';
export const COMPLETIONS_COLLECTION_ID = 'YOUR_COMPLETIONS_COLLECTION_ID';

export const createTask = async (payload: {
  title: string;
  dueDate: string;
  priority: number;
  userId: string;
}) => {
  return databases.createDocument(DATABASE_ID, TASKS_COLLECTION_ID, ID.unique(), payload);
};

export const listTodayTasks = async (userId: string, startISO: string, endISO: string) => {
  return databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID, [
    Query.equal('userId', userId),
    Query.greaterThanEqual('dueDate', startISO),
    Query.lessThan('dueDate', endISO),
    Query.orderAsc('dueDate'),
  ]);
};

export const deleteTask = async (id: string) => {
  return databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, id);
};

export const completeTask = async (payload: {
  taskId: string;
  userId: string;
  completedAt: string;
}) => {
  return databases.createDocument(DATABASE_ID, COMPLETIONS_COLLECTION_ID, ID.unique(), payload);
};
