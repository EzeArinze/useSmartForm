import { z } from "zod";
import { useSmartForm } from "./core/useSmartForm";

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  age: z.number(),
  isStudent: z.boolean(),
  school: z.string().optional(),
  bio: z.string().min(1, "text area value is required"),
  mood: z.enum(["happy", "sad"]),
});

export default function MyForm() {
  const { Form, Field, reset } = useSmartForm({
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
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Registration Form
        </h2>
        <Form>
          <Field name="name" label="Name" placeholder="Enter name" />
          <Field name="age" label="Age" type="number" placeholder="age" />
          <Field
            name="mood"
            label="Select your mood"
            type="select"
            options={["happy", "sad"]}
          />
          <Field
            name="bio"
            label="Bio"
            type="textarea"
            placeholder="Tell us about yourself"
            rows={1}
          />
          <div className="flex items-center gap-2 mb-4">
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
            <button className="px-6 py-2 hover:bg-blue-700 transition text-white font-semibold rounded shadow">
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
