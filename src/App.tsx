import { z } from "zod";

import { useSmartFormV2 } from "./core/useSmartForm-v2";
import { schema } from "./types/types";

export default function MyForm() {
  const { Form, Field, reset } = useSmartFormV2({
    schema,
    onSubmit: (values) => handleSubmit(values),
  });

  function handleSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    reset();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="shadow-xl rounded-xl p-8 w-full max-w-md">
        <Form>
          <Field name="name" label="Name" placeholder="Enter name" />
          <Field name="age" label="Age" type="number" placeholder="age" />
          <Field
            name="email"
            label="Email Address"
            type="email"
            placeholder="Enter Email Address"
          />
          <Field
            name="mood"
            label="Select your mood"
            type="select"
            options={["Happy", "Sad"]}
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
          <div className="flex justify-center mt-6">
            <button className="shadow-xs hover:bg-primary/90">Submit</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
