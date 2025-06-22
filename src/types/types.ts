import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  isStudent: z.boolean(),
  school: z.string().optional(),
  bio: z.string().min(1, "text area value is required"),
  mood: z.enum(["Happy", "Sad"]),
});
