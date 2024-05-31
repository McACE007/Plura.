"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { createMedia, saveActivityLogsNotification } from "@/lib/queries"
import { toast } from "../ui/use-toast"
import { Input } from "../ui/input"
import FileUpload from "../global/FileUpload"
import { Button } from "../ui/button"
import Loading from "../global/Loading"
import { LoaderCircle } from "lucide-react"

type Props = {
  subaccountId: string
}

const formSchema = z.object({
  link: z.string().min(1, { message: "Media File is required" }),
  name: z.string().min(1, { message: "Name is required" }),
})

export default function UploadMediaForm({ subaccountId }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: '',
      name: '',
    },
  });

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await createMedia(subaccountId, values);
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a media file | ${response.name}`,
        subAccountId: subaccountId,
      })
      router.refresh()
      toast({ title: "Success", description: "Uploaded media" })
    } catch (error) {
      toast({ title: "Failure", description: "Could not upload media" })
      console.log("ERROR: while media submit")
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>Please enter the details for your file</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={
                ({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>File Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name of the file"  {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }
            />

            <FormField
              disabled={isLoading}
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="subaccountLogo"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              {isLoading ? (<>< LoaderCircle className="animate-spin mr-2" /> Uploading...</>) : "Upload Media"}
            </Button>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
