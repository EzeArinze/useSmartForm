import { schema } from "./types/types";
import useSmartForm from "use-smart-form";

export default function MyForm() {
  const { Form, Field } = useSmartForm({
    schema,
    onSubmit: (values) => console.log(values),
  });

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

          <Field
            name="isStudent"
            type="checkbox"
            checkBoxLabel="Are you a student"
          />

          <Field type="file" name="file" accept="image/*, video/*" />
          <div className="flex justify-center mt-6">
            <button className="shadow-xs hover:bg-primary/90">Submit</button>
          </div>
        </Form>
      </div>
    </div>
  );
}
