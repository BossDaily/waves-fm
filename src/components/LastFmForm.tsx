"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { LastFmFormValues, lastFmFormSchema } from "@/lib/schemas"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

export function LastFmForm() {
  const router = useRouter()
  const form = useForm<LastFmFormValues>({
    resolver: zodResolver(lastFmFormSchema),
    defaultValues: {
      apiKey: "",
      username: "",
      useOptimized: false,
    },
  })

  function onSubmit(data: LastFmFormValues) {
    const baseUrl = data.useOptimized ? "/optimized-waves" : "/waves"
    const url = new URL(baseUrl, window.location.origin)
    url.searchParams.set("apiKey", data.apiKey)
    url.searchParams.set("username", data.username)
    router.push(url.toString())
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="apiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LastFM API Key</FormLabel>
              <FormControl>
                <Input placeholder="Enter your LastFM API key" {...field} />
              </FormControl>
              <FormDescription>
                Your LastFM API key from last.fm/api
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LastFM Username</FormLabel>
              <FormControl>
                <Input placeholder="Your LastFM username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="useOptimized"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Use Optimized Version</FormLabel>
                <FormDescription>
                  Enable for enhanced performance visualization
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">View Visualizer</Button>
      </form>
    </Form>
  )
}
