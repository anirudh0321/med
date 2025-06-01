"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, Clock, PlusCircle, Trash2, Pill } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)");

const medicationFormSchema = z.object({
  name: z.string().min(2, "Medication name must be at least 2 characters."),
  dosage: z.string().min(1, "Dosage is required."),
  frequency: z.enum(["once_daily", "twice_daily", "thrice_daily", "every_other_day", "as_needed"]),
  times: z.array(timeSchema).min(1, "At least one time is required, unless frequency is 'as_needed'."),
  startDate: z.date({ required_error: "Start date is required."}),
  endDate: z.date().optional(),
  instructions: z.string().optional(),
}).refine(data => {
  if (data.frequency === "as_needed") return true;
  return data.times.length > 0;
}, {
  message: "Please specify medication times or select 'as needed'.",
  path: ["times"],
});


type MedicationFormValues = z.infer<typeof medicationFormSchema>;

export default function AddMedicationPage() {
  const router = useRouter();
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      times: ["08:00"],
      instructions: "",
      frequency: "once_daily",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "times",
  });

  function onSubmit(data: MedicationFormValues) {
    console.log("Medication data:", data);
    // Mock submission: In a real app, save to backend/local state
    // For now, navigate to a list page or dashboard
    router.push("/medications/list"); 
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-8 h-8 text-primary" />
            <CardTitle className="text-3xl font-headline">Add New Medication</CardTitle>
          </div>
          <CardDescription>Fill in the details of your medication. Accurate information helps Pill Pal remind you effectively.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Medication Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Amoxicillin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dosage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dosage</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 250mg, 1 tablet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frequency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frequency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="once_daily">Once daily</SelectItem>
                        <SelectItem value="twice_daily">Twice daily</SelectItem>
                        <SelectItem value="thrice_daily">Thrice daily</SelectItem>
                        <SelectItem value="every_other_day">Every other day</SelectItem>
                        <SelectItem value="as_needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("frequency") !== "as_needed" && (
                <FormItem>
                  <FormLabel>Times</FormLabel>
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`times.${index}`}
                      render={({ field: timeField }) => (
                        <FormItem className="flex items-center gap-2">
                           <Clock className="h-5 w-5 text-muted-foreground" />
                          <FormControl>
                            <Input type="time" {...timeField} className="w-full" />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append("09:00")}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Time
                  </Button>
                   <FormMessage>{form.formState.errors.times?.message}</FormMessage>
                </FormItem>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setDate(new Date().getDate() -1)) // allow today
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date (Optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              (form.getValues("startDate") && date < form.getValues("startDate")) ||
                              date < new Date(new Date().setDate(new Date().getDate() -1))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="instructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Instructions (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Take with food, Avoid grapefruit juice"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>Any special notes for this medication.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" asChild>
                    <Link href="/dashboard">Cancel</Link>
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  <PlusCircle className="mr-2 h-5 w-5" /> Add Medication
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
