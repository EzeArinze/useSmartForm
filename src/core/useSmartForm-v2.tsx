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
  | "email"
  | "file"
  | "date"
  | "range"
  | "radio";

type FieldProps<TFormValues extends FieldValues> = {
  name: Path<TFormValues>;
  label?: string;
  checkBoxLabel?: string;
  type?: FieldType;
  options?: string[];
  showWhen?: (values: TFormValues) => boolean;
  className?: string;
  displayValue?: boolean;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement> &
    React.SelectHTMLAttributes<HTMLSelectElement>,
  "name"
>;

const styles = {
  input:
    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  error: "text-sm text-red-500 h-2",
  label:
    "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 mb-1",
  checkboxLabel:
    "flex items-center gap-2 text-sm leading-none font-medium select-none cursor-pointer group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
  checkbox:
    "peer border-input dark:bg-input/30 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] border shadow-xs transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
  select:
    "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-Visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  selectValue:
    "flex items-center gap-2 text-sm font-medium text-foreground data-[placeholder]:text-muted-foreground",
  textarea:
    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  range:
    "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
  radio:
    "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
};

export function useSmartFormV2<TSchema extends ZodTypeAny>(props: {
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
    displayValue,
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

    let inputElement: React.ReactNode;

    switch (type) {
      case "email":
      case "text":
      case "date":
        inputElement = (
          <input
            id={name}
            type={type}
            {...register(name)}
            {...rest}
            className={cn(
              styles.input,
              hasError && "border-red-500",
              className
            )}
          />
        );
        break;

      case "number":
        inputElement = (
          <input
            id={name}
            type={type}
            {...register(name, { valueAsNumber: true })}
            {...rest}
            className={cn(
              styles.input,
              hasError && "border-red-500",
              className
            )}
          />
        );
        break;

      case "checkbox":
        inputElement = (
          <div className="flex items-center gap-2">
            <input
              id={name}
              type={type}
              {...register(name)}
              {...rest}
              className={cn(
                styles.checkbox,
                hasError && "border-red-500",
                className
              )}
            />
            {checkBoxLabel && (
              <label htmlFor={name} className={styles.checkboxLabel}>
                {checkBoxLabel}
              </label>
            )}
          </div>
        );
        break;

      case "textarea":
        inputElement = (
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
        );
        break;

      case "file":
        inputElement = (
          <input
            id={name}
            type={type}
            accept={rest.accept}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const file = e.target.files?.[0];
              if (file) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                methods.setValue?.(name, file as any);
              }
            }}
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            className={cn(
              styles.input,
              hasError && "border-red-500",
              className
            )}
          />
        );
        break;

      case "select":
        inputElement = options ? (
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
        ) : null;
        break;

      case "range":
        inputElement = (
          <div>
            <input
              id={name}
              type={type}
              {...register(name, { valueAsNumber: true })}
              {...rest}
              className={cn(
                styles.range,
                hasError && "border-red-500",
                className
              )}
            />
            {displayValue && (
              <div className="text-sm text-muted-foreground mt-1">
                {values[name]}
              </div>
            )}
          </div>
        );
        break;

      case "radio":
        inputElement = options ? (
          <div className="flex flex-col gap-2">
            {options.map((opt) => (
              <label
                key={opt}
                className="inline-flex items-center gap-2 text-sm"
              >
                <input
                  type="radio"
                  value={opt}
                  {...register(name)}
                  className={cn(
                    styles.radio,
                    hasError && "border-red-500",
                    className
                  )}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ) : null;
        break;

      default:
        inputElement = null;
    }

    return (
      <div className="mb-4">
        {label && type !== "checkbox" && (
          <label className={styles.label} htmlFor={name}>
            {label}
          </label>
        )}
        {inputElement}
        {hasError && (
          <p className={styles.error}>
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
