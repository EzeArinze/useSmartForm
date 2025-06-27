import { useSmartForm } from "./core/useSmartForm-new";
import { schema } from "./types/types";

export default function MyForm() {
  const { Form, Field } = useSmartForm({
    schema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
    },
    defaultValues: {
      name: "",
      email: "",
      age: 0,
      password: "",
      isStudent: false,
      bio: "",
      mood: "Happy" as const,
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="shadow-xl rounded-xl p-8 w-full max-w-md bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Smart Form</h1>
        <Form>
          <Field name="name" label="Name" placeholder="Enter your name" />
          
          <Field 
            name="email" 
            label="Email Address" 
            type="email" 
            placeholder="Enter your email" 
          />
          
          <Field 
            name="password" 
            label="Password" 
            type="password" 
            placeholder="Enter password" 
          />
          
          <Field 
            name="age" 
            label="Age" 
            type="number" 
            placeholder="Enter your age" 
            min="1"
          />
          
          <Field
            name="mood"
            label="Select your mood"
            type="select"
            options={["Happy", "Sad"]}
            placeholder="Choose your mood"
          />
          
          <Field
            name="bio"
            label="Bio"
            type="textarea"
            placeholder="Tell us about yourself"
            rows={3}
          />
          
          <Field
            name="isStudent"
            type="checkbox"
            checkBoxLabel="Are you a student?"
          />
          
          <Field 
            name="file" 
            label="Upload File"
            type="file" 
            accept="image/*,application/pdf" 
          />
          
          <div className="flex justify-center mt-6">
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
