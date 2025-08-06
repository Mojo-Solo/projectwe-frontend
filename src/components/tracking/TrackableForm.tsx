"use client";

import React, { useCallback } from "react";
import { useTracking } from "@/components/providers/tracking-provider";

interface TrackableFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  formId: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export function TrackableForm({
  formId,
  children,
  onSubmit,
  ...props
}: TrackableFormProps) {
  const { trackFormSubmit } = useTracking();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Extract form data
      const formData = new FormData(e.currentTarget);
      const formValues: Record<string, any> = {};

      formData.forEach((value, key) => {
        if (formValues[key]) {
          // Handle multiple values for same key (e.g., checkboxes)
          if (Array.isArray(formValues[key])) {
            formValues[key].push(value);
          } else {
            formValues[key] = [formValues[key], value];
          }
        } else {
          formValues[key] = value;
        }
      });

      // Track form submission
      await trackFormSubmit(formId, formValues);

      // Call original onSubmit if provided
      if (onSubmit) {
        onSubmit(e);
      }
    },
    [trackFormSubmit, formId, onSubmit],
  );

  return (
    <form {...(props || {})} onSubmit={handleSubmit}>
      {children}
    </form>
  );
}

// Field tracking for individual form fields
interface TrackableFieldProps {
  fieldId: string;
  children: React.ReactElement;
}

export function TrackableField({ fieldId, children }: TrackableFieldProps) {
  const { trackTimeSpent } = useTracking();
  const fieldRef = React.useRef<number | null>(null);

  const handleFocus = useCallback(() => {
    fieldRef.current = Date.now();
  }, [fieldRef, current, Date, now]);

  const handleBlur = useCallback(async () => {
    if (fieldRef.current) {
      const timeSpent = Date.now() - fieldRef.current;
      await trackTimeSpent(`field_${fieldId}`, timeSpent);
      fieldRef.current = null;
    }
  }, [trackTimeSpent, fieldId]);

  return React.cloneElement(children, {
    onFocus: (e: React.FocusEvent) => {
      handleFocus();
      if (children.props.onFocus) {
        children.props.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      handleBlur();
      if (children.props.onBlur) {
        children.props.onBlur(e);
      }
    },
  });
}
