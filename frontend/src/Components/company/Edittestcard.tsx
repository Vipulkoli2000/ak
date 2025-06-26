import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { MoveLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";
import { usePutData } from "@/Components/HTTP/PUT";
import { useGetData } from "@/Components/HTTP/GET";
import { toast } from "sonner";
import { useNavigate, useParams } from "@tanstack/react-router";

const profileFormSchema = z
  .object({
    company_name: z.string().nonempty("Company Name is Required"),
    street_address: z.string().nonempty("Street Address is Required"),
    area: z.any().optional(),
    city: z.any().optional(),
    state: z.string().nonempty("State is Required"),
    pincode: z.string().nonempty("Pincode is Required"),
    country: z.string().nonempty("Country is Required"),
    type_of_company: z.string().nonempty("Type of Company is Required"),
    other_type_of_company: z.string().optional(),
    contact_person: z.string().nonempty("Contact Person is Required"),
    contact_email: z
      .string()
      .email({ message: "Invalid email address" })
      .or(z.literal(""))
      .optional(),
    contact_mobile: z.string().nonempty("Contact Mobile is Required"),
  })
  .refine(
    (data) => {
      if (data.type_of_company === "Other") {
        return !!data.other_type_of_company && data.other_type_of_company.length > 0;
      }
      return true;
    },
    {
      message: "Please specify the other type of company",
      path: ["other_type_of_company"],
    }
  );

type ProfileFormValues = z.infer<typeof profileFormSchema> & {
  name?: string;
};

// This can come from your database or API.

function ProfileForm({ formData, id }: { formData: any; id?: string }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      company_name: "",
      street_address: "",
      area: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      type_of_company: "",
      other_type_of_company: "",
      contact_person: "",
      contact_email: "",
      contact_mobile: "",
    },
    mode: "onChange",
  });
  const navigate = useNavigate();
    const typeOfCompany = form.watch("type_of_company");

  useEffect(() => {
    if (typeOfCompany !== "Other") {
      form.setValue("other_type_of_company", "");
    }
  }, [typeOfCompany, form]);

  // Populate form when new data arrives
  useEffect(() => {
    if (formData && Object.keys(formData).length) {
      const sanitizedData = {
        company_name: formData.company_name || "",
        street_address: formData.street_address || "",
        area: formData.area || "",
        city: formData.city || "",
        state: formData.state || "",
        pincode: formData.pincode || "",
        country: formData.country || "",
        type_of_company: formData.type_of_company || "",
        other_type_of_company: formData.other_type_of_company || "",
        contact_person: formData.contact_person || "",
        contact_email: formData.contact_email || "",
        contact_mobile: formData.contact_mobile || "",
      };
      form.reset(sanitizedData);
    }
  }, [formData, form]);

  // Setup mutation for updating staff
  const updateCompanyMutation = usePutData({
    endpoint: `/api/companies/${id}`,
    params: {
      queryKey: ["companies"],

      onSuccess: () => {
        toast.success("Company Updated Successfully");
        navigate({ to: "/company" });
      },
      onError: (error: AxiosError | any) => {
        if (error.response) {
          const { errors, message } = error.response.data;
          if (errors) {
            Object.keys(errors).forEach((key) => {
              form.setError(key as keyof ProfileFormValues, {
                type: "server",
                message: errors[key][0],
              });
              toast.error(errors[key][0]);
            });
          } else {
            toast.error(message || "Something went wrong, please try again.");
          }
        } else {
          toast.error("Something went wrong, please try again.");
        }
      },
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    // Send JSON payload directly (no multipart/form-data)
    updateCompanyMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 pb-[2rem]"
      >
        <div className="max-w-full p-4 space-y-6">
          {/* Company Information Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-2 ">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel>Company Name<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Company Name..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type_of_company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type of Company<span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type of company" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Merchant Exporter">Merchant Exporter</SelectItem>
                          <SelectItem value="Merchant cum Manufacturer Exporter">Merchant cum Manufacturer Exporter</SelectItem>
                          <SelectItem value="Manufacturer Exporter">Manufacturer Exporter</SelectItem>
                          <SelectItem value="Service Provider">Service Provider</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {typeOfCompany === "Other" && (
                  <FormField
                    control={form.control}
                    name="other_type_of_company"
                    render={({ field }) => (
                      <FormItem className="lg:col-span-2">
                        <FormLabel>Other Type of Company<span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Please specify" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company Address Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Company Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3 ">
                <FormField
                  control={form.control}
                  name="street_address"
                  render={({ field }) => (
                    <FormItem >
                      <FormLabel >Street Address<span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Street Address..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter Area..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter City..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State<span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="Enter State..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pincode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pincode<span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="Enter Pincode..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country<span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="Enter Country..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information Card */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3 ">
                <FormField
                  control={form.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person<span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="Enter Contact Person..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <Input
                        placeholder="Enter Contact Email..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contact_mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Mobile<span className="text-red-500">*</span></FormLabel>
                      <Input
                        placeholder="Enter Contact Mobile..."
                        {...field}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex justify-end w-full gap-3 ">
          <Button
            onClick={() => navigate({ to: "/company" })}
            className="self-center"
            type="button"
          >
            Cancel
          </Button>
          <Button className="self-center mr-8" type="submit">
            Update Company
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function SettingsProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: "/company/edit/$id" });
  const [formData, setFormData] = useState<any>({});

  // Fetch staff details
  useGetData({
    endpoint: `/api/companies/${id}`,
    params: {
      queryKey: ["companies", id],
      enabled: !!id,

      onSuccess: (res: any) => {
        setFormData(res.data.Company);
      },
      onError: (error: AxiosError) => {
        toast.error(error.message);
      },
    },
  });
  return (
    <div>
          <div className="relative flex justify-center items-center p-4">
            <Button
              onClick={() => window.history.back()}
              className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2"
            >
              <MoveLeft className="w-5 text-white" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-bold tracking-tight">Company Master</h1>
              <h2 className="text-sm text-muted-foreground">Edit Company Form</h2>
            </div>
          </div>
            <div className="space-y-3 ">
            <ProfileForm formData={formData} id={id} />
            </div>
         </div>
   );
}
