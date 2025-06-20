import { z } from "zod";
// import { useSmartForm } from "./core/useSmartForm";
import { useSmartFormV2 } from "./core/useSmartForm-v2";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  age: z.number().min(1, "Age must be greater than 0"),
  isStudent: z.boolean(),
  school: z.string().optional(),
  bio: z.string().min(1, "text area value is required"),
  mood: z.enum(["Happy", "Sad"]),
});

export default function MyForm() {
  const { Form, Field, reset } = useSmartFormV2({
    schema,
    onSubmit: (data) => handleSubmit(data),
  });

  function handleSubmit(data: z.infer<typeof schema>) {
    console.log(data);
    reset();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="shadow-xl rounded-xl p-8 w-full max-w-md">
        <Form>
          <Field name="name" label="Name" placeholder="Enter name" />
          <Field name="age" label="Age" type="number" placeholder="age" />
          <Field
            name="mood"
            label="Select your mood"
            type="select"
            options={["Happy", "Sad"]}
            className="w-full"
          />
          <Field
            name="bio"
            label="Bio"
            type="textarea"
            placeholder="Tell us about yourself"
            rows={1}
          />
          <div>
            <Field
              name="isStudent"
              type="checkbox"
              checkBoxLabel="Are you a student"
            />
          </div>
          <Field
            name="school"
            label="School"
            type="text"
            showWhen={(values) => values.isStudent}
          />
          <Field
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
          />
          <div className="flex justify-center mt-6">
            <button className="bg-primary text-primary-foreground shadow-xs hover:bg-primary/90">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
