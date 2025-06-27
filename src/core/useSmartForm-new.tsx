import React, { useCallback } from "react";
import { cn } from "../utils/cn";
import {
  useForm,
  FormProvider,
  useFormContext,
  useWatch,
  type FieldValues,
  type Path,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TypeOf, ZodTypeAny } from "zod";
import { styles } from "./styles";

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
  | "radio"
  | "password"
  | "tel"; // Added 'tel' for telephone input

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

export function useSmartForm<TSchema extends ZodTypeAny>(props: {
  schema: TSchema;
  onSubmit?: (values: TypeOf<TSchema>) => void;
  defaultValues?: DefaultValues<TypeOf<TSchema>>;
}) {
  type FormValues = TypeOf<TSchema>;

  const methods = useForm<FormValues>({
    resolver: zodResolver(props.schema),
    mode: "onSubmit", // Only validate on submit initially
    reValidateMode: "onBlur", // Re-validate on blur after first submission
    defaultValues: props.defaultValues || ({} as DefaultValues<FormValues>),
    criteriaMode: "firstError", // Only show first error, not all errors
  });

  const Form = useCallback(
    ({
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
    ),
    [methods, props.onSubmit]
  );

  const Field = React.memo(
    ({
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
        formState: { errors, touchedFields, isSubmitted },
        // setValue,
      } = useFormContext<FormValues>();

      const allValues = useWatch({ control });
      const fieldValue = useWatch({ control, name });

      // Don't render field if showWhen condition is not met
      if (showWhen && !showWhen(allValues)) return null;

      const error = errors[name];
      const isTouched = touchedFields[name as keyof typeof touchedFields];
      // Only show errors after form has been submitted OR field has been touched and blurred
      const hasError = Boolean(error && (isSubmitted || isTouched));

      const renderInput = () => {
        const baseProps = {
          id: name,
          ...rest,
          className: cn(styles.input, hasError && "border-red-500", className),
        };

        switch (type) {
          case "text":
            return <input type="text" {...register(name)} {...baseProps} />;

          case "tel":
            return <input type="tel" {...register(name)} {...baseProps} />;

          case "email":
            return <input type="email" {...register(name)} {...baseProps} />;

          case "password":
            return <input type="password" {...register(name)} {...baseProps} />;

          case "number":
            return (
              <input
                type="number"
                {...register(name, { valueAsNumber: true })}
                {...baseProps}
              />
            );

          case "date":
            return <input type="date" {...register(name)} {...baseProps} />;

          case "checkbox":
            return (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register(name)}
                  {...rest}
                  id={name}
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

          case "textarea":
            return (
              <textarea
                {...register(name)}
                {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
                id={name}
                className={cn(
                  styles.textarea,
                  hasError && "border-red-500",
                  className
                )}
              />
            );

          case "file":
            return (
              <input
                id={name}
                type="file"
                accept={rest.accept}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const file = e.target.files?.[0];
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  if (file) methods.setValue?.(name, file as any);
                }}
                {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
                className={cn(
                  styles.input,
                  hasError && "border-red-500",
                  className
                )}
              />
            );

          case "select":
            return options ? (
              <select
                {...register(name)}
                {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
                id={name}
                className={cn(
                  styles.select,
                  hasError && "border-red-500",
                  className
                )}
              >
                <option value="" disabled>
                  {rest.placeholder ?? "Select an option"}
                </option>
                {options.map((opt) => (
                  <option key={opt} value={opt} className={styles.selectValue}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : null;

          case "range":
            return (
              <div>
                <input
                  type="range"
                  {...register(name, { valueAsNumber: true })}
                  {...rest}
                  id={name}
                  className={cn(
                    styles.range,
                    hasError && "border-red-500",
                    className
                  )}
                />
                {displayValue && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {fieldValue}
                  </div>
                )}
              </div>
            );

          case "radio":
            return options ? (
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

          default:
            return <input type="text" {...register(name)} {...baseProps} />;
        }
      };

      return (
        <div className="mb-4">
          {label && type !== "checkbox" && (
            <label className={styles.label} htmlFor={name}>
              {label}
            </label>
          )}
          {renderInput()}
          {hasError && (
            <p className={styles.error}>
              {(error as { message?: string })?.message ||
                "This field is required"}
            </p>
          )}
        </div>
      );
    }
  );

  return {
    ...methods,
    Form,
    Field,
  };
}
