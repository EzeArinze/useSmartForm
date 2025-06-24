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

type FieldType =
  | "text"
  | "number"
  | "checkbox"
  | "select"
  | "textarea"
  | "email";

type FieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label?: string;
  checkBoxLabel?: string;
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

const styles = {
  input:
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  error: "text-sm text-red-500 mt-1",
  label:
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-1",
  checkboxLabel:
    "flex items-center gap-2 text-sm leading-none font-medium select-none cursor-pointer group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  checkbox:
    "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  select:
    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  selectValue:
    "flex items-center gap-2 text-sm font-medium text-foreground data-[placeholder]:text-muted-foreground",
  textarea:
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
};

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
    checkBoxLabel,
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
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
        )}

        {type === "text" && (
          <input
            id={name}
            {...register(name)}
            {...rest}
            className={cn(
              styles.input,
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              hasError && "border-red-500",
              className
            )}
          />
        )}

        {type === "email" && (
          <input
            id={name}
            type="email"
            {...register(name)}
            {...rest}
            className={cn(
              styles.input,
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
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
              styles.input,
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
              hasError && "border-red-500",
              className
            )}
          />
        )}

        {type === "checkbox" && (
          <div className="flex items-center gap-2">
            <input
              id={name}
              type="checkbox"
              {...register(name)}
              {...rest}
              className={cn(
                styles.checkbox,
                hasError && "border-red-500",
                className
              )}
            />
            {checkBoxLabel && (
              <label htmlFor={name} className={styles.label}>
                {checkBoxLabel}
              </label>
            )}
          </div>
        )}

        {type === "textarea" && (
          <textarea
            id={name}
            {...register(name)}
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={cn(
              styles.textarea,
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
              styles.select,
              hasError && "border-red-500",
              className
            )}
          >
            <option value="" disabled hidden>
              {rest.placeholder ?? "Select an option"}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt} className={styles.selectValue}>
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

  return {
    ...methods,
    Form,
    Field,
  };
}
