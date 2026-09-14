
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBusiness } from "./actions";

export default function BusinessPage() {
  return (
    <main className="min-h-[calc(100vh-2rem)] bg-neutral-50 px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl items-center justify-center">
        <Card className="w-full rounded-2xl border-neutral-200 shadow-sm">
          <CardHeader className="space-y-3 pb-6">
            <div>
              <p className="mb-2 text-sm font-medium text-accent">
                Business setup
              </p>

              <CardTitle className="text-2xl font-semibold tracking-tight">
                Set up your business
              </CardTitle>
            </div>

            <CardDescription className="max-w-md text-sm leading-6">
              Tell Kaabe about your business. This information helps your AI
              assistant understand who it represents.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form action={createBusiness} className="space-y-6">
              {/* Business name */}
              <div className="space-y-2">
                <Label htmlFor="name">Business name</Label>

                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Sahal Restaurant"
                  className="h-11"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  This will be displayed to your customers.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Business description</Label>

                <Textarea
                  id="description"
                  name="description"
                  placeholder="Tell us briefly about your business..."
                  rows={4}
                  className="resize-none"
                  required
                />

                <p className="text-xs text-muted-foreground">
                  Describe what your business does and what it offers.
                </p>
              </div>

              {/* Contact information */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Contact information</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Optional — you can add these details now or later.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>

                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+252 63 XXX XXXX"
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Business email</Label>

                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="hello@business.com"
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* Slug information */}
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                <p className="text-sm font-medium">Your customer assistant</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Kaabe will create a unique business link for your AI
                  assistant automatically using your business name.
                </p>
              </div>

              <Button
                type="submit"
                className="h-11 w-full cursor-pointer bg-accent hover:bg-accent/80"
              >
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

