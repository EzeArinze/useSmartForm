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
  | "password";

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
    mode: "onChange",
    defaultValues: props.defaultValues || ({} as DefaultValues<FormValues>),
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

    const allValues = useWatch({ control });
    const rangeValue = useWatch({ control, name });

    if (showWhen && !showWhen(allValues)) return null;

    const error = errors[name];
    const hasError = Boolean(error);

    const renderMap: Record<FieldType, () => React.ReactNode> = {
      text: () => (
        <input
          id={name}
          type="text"
          {...register(name)}
          {...rest}
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      number: () => (
        <input
          id={name}
          type="number"
          {...register(name, { valueAsNumber: true })}
          {...rest}
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      email: () => (
        <input
          id={name}
          type="email"
          {...register(name)}
          {...rest}
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      password: () => (
        <input
          id={name}
          type="password"
          {...register(name)}
          {...rest}
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      date: () => (
        <input
          id={name}
          type="date"
          {...register(name)}
          {...rest}
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      checkbox: () => (
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
            <label htmlFor={name} className={styles.checkboxLabel}>
              {checkBoxLabel}
            </label>
          )}
        </div>
      ),
      textarea: () => (
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
      ),
      file: () => (
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
          className={cn(styles.input, hasError && "border-red-500", className)}
        />
      ),
      select: () =>
        options ? (
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
        ) : null,
      range: () => (
        <div>
          <input
            id={name}
            type="range"
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
              {rangeValue}
            </div>
          )}
        </div>
      ),
      radio: () =>
        options ? (
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
        ) : null,
    };

    const inputElement = renderMap[type]?.();

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
    Field: React.memo(Field),
  };
}
