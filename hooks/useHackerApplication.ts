"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { HackerApplicationsSelectData } from "@/lib/db/schema";
import {
  HackerApplicationDraftSchema,
  HackerApplicationSubmissionSchema,
  THackerApplicationSubmission,
} from "@/lib/validations/application";

import { DEFAULT_FORM_VALUES } from "../config/application-form";

function getDefaultValues(
  existingApplication: HackerApplicationsSelectData | null,
): THackerApplicationSubmission {
  if (!existingApplication) {
    return DEFAULT_FORM_VALUES;
  }

  return {
    firstName: existingApplication.firstName || "",
    lastName: existingApplication.lastName || "",
    age: existingApplication.age?.toString() || "",
    pronouns: {
      value: existingApplication.pronouns || "",
      customValue: "",
    },
    email: existingApplication.email || "",
    phoneNumber: existingApplication.phoneNumber || "",
    github: existingApplication.github || "",
    linkedin: existingApplication.linkedin || "",
    personalWebsite: existingApplication.personalWebsite || "",
    school: {
      value: existingApplication.school || "",
      customValue: "",
    },
    major: {
      value: existingApplication.major || "",
      customValue: "",
    },
    graduationYear: existingApplication.graduationYear?.toString() || "",
    levelOfStudy: existingApplication.levelOfStudy || "",
    technicalInterests: existingApplication.technicalInterests || "",
    hackathonsAttended: existingApplication.hackathonsAttended || "",
    gender: existingApplication.gender || "",
    race: existingApplication.race || "",
    country: existingApplication.country || "",
    shortAnswer1: existingApplication.shortAnswer1 || "",
    shortAnswer2: existingApplication.shortAnswer2 || "",
    shortAnswer3: existingApplication.shortAnswer3 || "",
    mlhCheckbox1: existingApplication.mlhCheckbox1 ? true : false,
    mlhCheckbox2: existingApplication.mlhCheckbox2 ? true : false,
    mlhCheckbox3: existingApplication.mlhCheckbox3 ? true : false,
    resumeUrl: existingApplication.resumeUrl || "",
    shareResume: existingApplication.shareResume ? true : false,
    isTeam: existingApplication.isTeam ? true : false,
  };
}

export function useHackerApplication(
  existingApplication: HackerApplicationsSelectData | null,
) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    [string, { message: string }][]
  >([]);
  const defaultValues = getDefaultValues(existingApplication);
  const form = useForm<THackerApplicationSubmission>({
    resolver: zodResolver(HackerApplicationSubmissionSchema),
    defaultValues,
  });
  const formErrors = Object.entries(form.formState.errors);

  const onSave = async () => {
    const values = form.getValues();
    const isModified = JSON.stringify(values) !== JSON.stringify(defaultValues);

    if (!isModified) {
      toast.error("No changes to save");
      return;
    }

    const validatedFields = HackerApplicationDraftSchema.safeParse(values);

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors as Record<
        string,
        string[] | undefined
      >;
      const errors = Object.entries(fieldErrors).map(([field, messages]) => [
        field,
        { message: messages?.join(", ") || "" },
      ]) as [string, { message: string }][];
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);

    setIsSaving(true);
    try {
      const response = await fetch("/api/application/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to save application");
      }

      toast.success("Application draft saved");
      router.push("/");
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save application";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const onSubmit = async (values: THackerApplicationSubmission) => {
    if (currentStep !== 3) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/application/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to submit application");
      }

      toast.success("Application submitted successfully!");
      router.replace("/applications/hacker/submitted");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit application";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    currentStep,
    setCurrentStep,
    isSaving,
    isSubmitting,
    validationErrors,
    formErrors,
    onSave,
    onSubmit,
  };
}
