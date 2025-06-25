import { z } from "zod";

export const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  isStudent: z.boolean(),
  bio: z.string().min(1, "text area value is required"),
  mood: z.enum(["Happy", "Sad"]),
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 1024 * 1024 * 5, {
      message: "File size must be 5MB or less",
    })
    .refine(
      (f) =>
        ["image/jpeg", "image/png", "image/gif", "application/pdf"].includes(
          f.type
        ),
      { message: "Invalid file type" }
    ),
});

// school: z.string().optional(),
//   bio: z.string().min(1, "text area value is required"),
//   mood: z.enum(["Happy", "Sad"]),
//   range: z.number().min(1, "Range must be greater than or equal to 0"),
//   date: z.string().refine((val) => !isNaN(Date.parse(val)), {
//     message: "Please enter a valid date",
//   }),
