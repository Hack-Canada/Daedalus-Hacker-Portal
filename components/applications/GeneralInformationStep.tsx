"use client";

import { Control, ControllerRenderProps, UseFormWatch } from "react-hook-form";
import { E164Number } from "libphonenumber-js/core";

import { pronouns as pronounsList } from "@/lib/data/pronouns";
import { THackerApplicationSubmission } from "@/lib/validations/application";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";
import { Switch } from "@/components/ui/switch";

import { ethnicities } from "../../lib/data/ethnicities";
import { genders } from "../../lib/data/genders";
import { AdvancedSelect } from "../ui/advanced-select";
import { CountrySelector } from "./CountrySelector";

interface GeneralInformationStepProps {
  control: Control<THackerApplicationSubmission>;
  watch: UseFormWatch<THackerApplicationSubmission>;
  userEmail: string;
}

export function GeneralInformationStep({
  control,
  watch,
  userEmail,
}: GeneralInformationStepProps) {
  const pronouns = watch("pronouns");

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="firstName"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "firstName"
            >;
          }) => (
            <FormItem>
              <FormLabel>
                First Name<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="lastName"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "lastName"
            >;
          }) => (
            <FormItem>
              <FormLabel>
                Last Name<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="age"
          render={({
            field,
          }: {
            field: ControllerRenderProps<THackerApplicationSubmission, "age">;
          }) => (
            <FormItem>
              <FormLabel>
                Age<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input type="number" placeholder="21" min="1" max="123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="pronouns.value"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "pronouns.value"
            >;
          }) => {
            const loadOptions = (inputValue: string) => {
              return Promise.resolve(
                pronounsList
                  .filter((pronoun) =>
                    pronoun.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((pronoun) => ({ value: pronoun, label: pronoun })),
              );
            };

            return (
              <FormItem>
                <FormLabel>
                  Pronouns<span className="text-error">*</span>
                </FormLabel>
                <FormControl>
                  <AdvancedSelect
                    name="pronouns"
                    value={
                      field.value
                        ? {
                            value: field.value,
                            label: field.value,
                          }
                        : null
                    }
                    onChange={field.onChange}
                    loadOptions={loadOptions}
                    placeholder="Select your pronouns"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      {pronouns.value === "Other (please specify)" && (
        <FormField
          control={control}
          name="pronouns.customValue"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "pronouns.customValue"
            >;
          }) => (
            <FormItem>
              <FormLabel>
                Pronouns (Other)<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value || ""}
                  placeholder="Cat/Kitten"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="email"
          render={({
            field,
          }: {
            field: ControllerRenderProps<THackerApplicationSubmission, "email">;
          }) => (
            <FormItem>
              <FormLabel>
                Email<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled
                  className="cursor-not-allowed lowercase opacity-60"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="phoneNumber"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "phoneNumber"
            >;
          }) => (
            <FormItem>
              <FormLabel>
                Phone Number<span className="text-error">*</span>
              </FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  defaultCountry="CA"
                  placeholder="Enter phone number"
                  onChange={(value) => {
                    field.onChange(value || "");
                  }}
                  value={field.value as E164Number}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="gender"
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              THackerApplicationSubmission,
              "gender"
            >;
          }) => {
            const loadOptions = (inputValue: string) => {
              return Promise.resolve(
                genders
                  .filter((gender) =>
                    gender.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((gender) => ({ value: gender, label: gender })),
              );
            };

            return (
              <FormItem>
                <FormLabel>
                  Gender<span className="text-error">*</span>
                </FormLabel>
                <FormControl>
                  <AdvancedSelect
                    name="gender"
                    value={
                      field.value
                        ? { value: field.value, label: field.value }
                        : null
                    }
                    onChange={field.onChange}
                    loadOptions={loadOptions}
                    placeholder="Select your gender"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name="race"
          render={({
            field,
          }: {
            field: ControllerRenderProps<THackerApplicationSubmission, "race">;
          }) => {
            const loadOptions = (inputValue: string) => {
              return Promise.resolve(
                ethnicities
                  .filter((ethnicity) =>
                    ethnicity.toLowerCase().includes(inputValue.toLowerCase()),
                  )
                  .map((ethnicity) => ({ value: ethnicity, label: ethnicity })),
              );
            };

            return (
              <FormItem>
                <FormLabel>
                  Race/Ethnicity<span className="text-error">*</span>
                </FormLabel>
                <FormControl>
                  <AdvancedSelect
                    name="race"
                    value={
                      field.value
                        ? { value: field.value, label: field.value }
                        : null
                    }
                    onChange={field.onChange}
                    loadOptions={loadOptions}
                    placeholder="Select your race/ethnicity"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <CountrySelector control={control} name="country" label="Country" />
      </div>

      <FormField
        control={control}
        name="isTeam"
        render={({
          field,
        }: {
          field: ControllerRenderProps<THackerApplicationSubmission, "isTeam">;
        }) => (
          <FormItem className="flex items-center justify-between gap-4">
            <FormLabel className="mb-0">Are you applying as a team?</FormLabel>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
