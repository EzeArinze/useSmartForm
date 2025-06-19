// src/core/useSmartForm.ts
import React from "react";
import { cn } from "../utils/cn";
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TypeOf, ZodTypeAny } from "zod";

type FieldType = "text" | "number" | "checkbox" | "select" | "textarea";

type FieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label?: string;
  type?: FieldType;
  options?: string[];
  showWhen?: (values: TFormValues) => boolean;
  className?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>,
  "name"
>;

export function useSmartForm<TSchema extends ZodTypeAny>(props: {
  schema: TSchema;
  onSubmit?: (values: TypeOf<TSchema>) => void;
}) {
  type FormValues = TypeOf<TSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(props.schema),
    mode: "onChange",
  });

  const Form = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(props.onSubmit || (() => {}))}
        className={cn("", className)}
      >
        {children}
      </form>
    </FormProvider>
  );

  const Field = ({
    name,
    label,
    type = "text",
    options,
    showWhen,
    className,
    ...rest
  }: FieldProps<FormValues>) => {
    const {
      register,
      control,
      formState: { errors },
    } = useFormContext<FormValues>();

    const values = useWatch({ control }) as FormValues;
    const shouldRender = showWhen ? showWhen(values) : true;
    if (!shouldRender) return null;

    const error = errors[name];
    const hasError = Boolean(error);

    return (
      <div className="mb-4">
        {label && (
          <label className="block mb-1 font-medium" htmlFor={name}>
            {label}
          </label>
        )}

        {type === "text" && (
          <input
            id={name}
            {...register(name)}
            {...rest}
            className={cn(
              "border px-2 py-1 w-full rounded",
              hasError && "border-red-500",
              className
            )}
          />
        )}

        {type === "number" && (
          <input
            id={name}
            type="number"
            {...register(name, { valueAsNumber: true })}
            {...rest}
            className={cn(
              "border px-2 py-1 w-full rounded",
              hasError && "border-red-500",
              className
            )}
          />
        )}

        {type === "checkbox" && (
          <input
            id={name}
            type="checkbox"
            {...register(name)}
            {...rest}
            className={cn("mr-2", hasError && "border-red-500", className)}
          />
        )}

        {type === "textarea" && (
          <textarea
            id={name}
            {...register(name)}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={cn(
              "border px-2 py-1 w-full rounded",
              hasError && "border-red-500",
              className
            )}
          />
        )}

        {type === "select" && options && (
          <select
            id={name}
            {...register(name)}
            {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
            className={cn(
              "border px-2 py-1 w-full rounded",
              hasError && "border-red-500",
              className
            )}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {hasError && (
          <p className="text-sm text-red-500 mt-1">
            {(error as { message?: string })?.message ??
              "This field is required"}
          </p>
        )}
      </div>
    );
  };

  const Submit = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <button
      type="submit"
      className={cn("px-4 py-2 bg-blue-600 text-white rounded", className)}
    >
      {children}
    </button>
  );

  return {
    ...methods,
    Form,
    Field,
    Submit,
  };
}
