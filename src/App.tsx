import { z } from "zod";
import { useSmartForm } from "./core/useSmartForm";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  age: z.number(),
  isStudent: z.boolean(),
  school: z.string().optional(),
  bio: z.string().min(1, "text area value is required"),
  mood: z.enum(["happy", "sad"]),
});

export default function MyForm() {
  const { Form, Field, Submit, reset } = useSmartForm({
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
          <Field
            name="name"
            label="Name"
            placeholder="Enter name"
            className="focus:ring-2 focus:ring-blue-400"
          />
          <Field
            name="age"
            label="Age"
            type="number"
            className="focus:ring-2 focus:ring-blue-400"
          />
          <Field
            name="mood"
            label="Select your mood"
            type="select"
            options={["happy", "sad"]}
            className="border rounded px-3 py-2 w-full"
          />
          <Field
            name="bio"
            label="Bio"
            type="textarea"
            className="h-24 p-2 border focus:ring-2 focus:ring-blue-400"
            rows={2}
          />
          <div className="flex items-center gap-2 mb-4">
            <Field
              name="isStudent"
              label="Student"
              type="checkbox"
              className="w-5 h-5 accent-blue-600"
            />
            <label htmlFor="isStudent" className="text-gray-700 font-medium">
              Are you a student?
            </label>
          </div>
          <Field
            name="school"
            label="School"
            type="text"
            showWhen={(values) => values.isStudent}
            className="focus:ring-2 focus:ring-blue-400"
          />
          <div className="flex justify-center mt-6">
            <Submit className="px-6 py-2 bg-blue-600 hover:bg-blue-700 transition text-white font-semibold rounded shadow">
              Submit
            </Submit>
          </div>
        </Form>
      </div>
    </div>
  );
}
