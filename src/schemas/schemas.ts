import { string, z } from 'zod';

export const createListSchema = z.object({
  title: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  description: z
    .string()
    .max(1024, { message: 'Maximum length is 500 characters.' })
    .trim(),
});

export const updateListDetailsSchema = z.object({
  id: z.string().trim(),
  title: z
    .string()
    .min(10, { message: 'Must be 10 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  description: z
    .string()
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
});

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(6, { message: 'Must be 6 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  isComplete: z.boolean().default(false),
  listId: z.string(),
  dueDate: z.date().nullable(),
  description: z
    .string()
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
  comment: z
    .string()
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
  attachments: z.string().trim(),
  suggestedAssignee: z
    .string()
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  claimed: z.boolean().default(false),
});

export const updateTaskSchema = z.object({
  id: z.string().trim(),
  title: z
    .string()
    .min(6, { message: 'Must be 6 or more characters.' })
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  isComplete: z.boolean().default(false),
  listId: z.string(),
  dueDate: z.date().nullable(),
  description: z
    .string()
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
  comment: z
    .string()
    .max(1024, { message: 'Maximum length is 1024 characters.' })
    .trim(),
  attachments: z.string().trim(),
  suggestedAssignee: z
    .string()
    .max(256, { message: 'Maximum length is 256 characters.' })
    .trim(),
  claimed: z.boolean().default(false),
});

// id         String   @id @default(auto()) @map("_id") @db.ObjectId
//   title      String
//   createdAt  DateTime @default(now())
//   updatedAt  DateTime @updatedAt
//   isComplete Boolean
//   list       List     @relation(fields: [listId], references: [id])
//   listId     String   @db.ObjectId
//   user       User     @relation(fields: [authorId], references: [id])
//   authorId   String
