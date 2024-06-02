'use client'
import { useEffect } from 'react'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useForm } from 'react-hook-form'
import { Funnel } from '@prisma/client'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

import { Button } from '../ui/button'
import Loading from '../global/Loading'
import { saveActivityLogsNotification, upsertFunnel } from '@/lib/queries'
import { v4 } from 'uuid'
import { toast } from '../ui/use-toast'
import { useModal } from '@/providers/ModalProvider'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import FileUpload from '../global/FileUpload'

type Props = {
  defaultData?: Funnel
  subAccountId: string
}

export const FunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
})

export default function FunnelForm({ defaultData, subAccountId }: Props) {
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof FunnelFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(FunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
      favicon: defaultData?.favicon || '',
      subDomainName: defaultData?.subDomainName || '',
    },
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description || '',
        favicon: defaultData.favicon || '',
        name: defaultData.name || '',
        subDomainName: defaultData.subDomainName || '',
      })
    }
  }, [defaultData, form])

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof FunnelFormSchema>) => {
    if (!subAccountId) return
    const response = await upsertFunnel(
      subAccountId,
      { ...values, liveProducts: defaultData?.liveProducts || '[]' },
      defaultData?.id || v4()
    )
    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel | ${response.name}`,
      subAccountId,
    })
    if (response)
      toast({
        title: 'Success',
        description: 'Saved funnel details',
      })
    else
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save funnel details',
      })
    setClose()
    router.refresh()
  }
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              disabled={isLoading}
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us a little bit more about this funnel."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="subDomainName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Sub domain for funnel"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name="favicon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
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
            <Button
              className="w-20 mt-4"
              disabled={isLoading}
              type="submit"
            >
              {form.formState.isSubmitting ? <Loading /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
