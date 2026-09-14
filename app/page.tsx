import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Globe2,
  MessageSquare,
  Sparkles,
  Upload,
} from "lucide-react";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const features = [
  {
    icon: MessageSquare,
    title: "AI customer support",
    description:
      "Let customers ask questions and get instant answers based on your business information.",
  },
  {
    icon: BookOpen,
    title: "Knows your business",
    description:
      "Upload your menus, services, policies, documents, and other business knowledge.",
  },
  {
    icon: Globe2,
    title: "Somali + English",
    description:
      "Give your customers support in the languages they already use every day.",
  },
  {
    icon: BarChart3,
    title: "Business analytics",
    description:
      "Understand what your customers are asking and discover gaps in your information.",
  },
];




const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Add your knowledge",
    description:
      "Upload your business documents, information, menus, services, FAQs, and more.",
  },
  {
    number: "02",
    icon: Sparkles,
    title: "Kaabe learns",
    description:
      "Kaabe turns your business knowledge into an AI assistant that understands your information.",
  },
  {
    number: "03",
    icon: MessageSquare,
    title: "Customers ask",
    description:
      "Share your assistant with customers and let it answer their questions automatically.",
  },
];

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const isLoggedIn = !!session?.user;





  return (
    <main className='min-h-screen bg-neutral-50 text-neutral-950'>
      {/* Navbar */}
      <nav className='border-b border-neutral-200 bg-white/80 backdrop-blur-md'>
        <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10'>
          <Link href='/dashboard' className='flex items-center gap-2'>
            <span className='flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground'>
              k
            </span>
            <span className='text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden'>
              kaabe
            </span>
          </Link>

          <div className='hidden items-center gap-8 md:flex'>
            <a
              href='#features'
              className='text-sm text-neutral-600 transition hover:text-neutral-950'
            >
              Features
            </a>

            <a
              href='#how-it-works'
              className='text-sm text-neutral-600 transition hover:text-neutral-950'
            >
              How it works
            </a>

            <a
              href='#assistant'
              className='text-sm text-neutral-600 transition hover:text-neutral-950'
            >
              Assistant
            </a>
          </div>

          <div className='flex items-center gap-3'>
            {isLoggedIn ? (
              <>
                <Link href='/dashboard'>Dashboard</Link>

                <Link
                  className='rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-accent/90'
                  href='/dashboard/chat'
                >
                  Test assistant
                </Link>
              </>
            ) : (
              <>
                <Link href='/sign-in'>Sign in</Link>

                <Link href='/sign-up'>Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className='overflow-hidden bg-white'>
        <div className='mx-auto grid max-w-7xl items-center gap-16 px-6 py-20 md:px-10 md:py-28 lg:grid-cols-2'>
          <div>
            <div className='mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600'>
              <span className='h-2 w-2 rounded-full bg-green-500' />
              AI customer support for your business
            </div>

            <h1 className='max-w-3xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl'>
              Your business,
              <br />
              <span className='text-accent'>always ready.</span>
            </h1>

            <p className='mt-6 max-w-xl text-lg leading-8 text-neutral-600'>
              An AI employee that knows your business. Upload your business
              knowledge and let Kaabe answer your customers instantly.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/sign-up'
                className='inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-white transition hover:bg-accent/90'
              >
                Get started
                <ArrowRight size={18} />
              </Link>

              <Link
                href='/chat/sahal-restaurant'
                className='inline-flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white px-6 py-3.5 font-medium text-neutral-900 transition hover:bg-neutral-50'
              >
                Try the assistant
              </Link>
            </div>

            <div className='mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-neutral-500'>
              <div className='flex items-center gap-2'>
                <Check size={16} className='text-green-600' />
                Built for businesses
              </div>

              <div className='flex items-center gap-2'>
                <Check size={16} className='text-green-600' />
                Somali + English
              </div>

              <div className='flex items-center gap-2'>
                <Check size={16} className='text-green-600' />
                No technical setup
              </div>
            </div>
          </div>

          {/* Hero assistant preview */}
          <div className='relative'>
            <div className='absolute -inset-10 -z-10 rounded-full bg-accent/10 blur-3xl' />

            <div className='rounded-3xl border border-neutral-200 bg-neutral-50 p-4 shadow-2xl shadow-neutral-200/50'>
              <div className='rounded-2xl border border-neutral-200 bg-white'>
                {/* Chat header */}
                <div className='flex items-center justify-between border-b border-neutral-100 px-5 py-4'>
                  <div>
                    <p className='font-semibold'>Sahal Restaurant</p>
                    <div className='mt-1 flex items-center gap-1.5 text-xs text-neutral-500'>
                      <span className='h-1.5 w-1.5 rounded-full bg-green-500' />
                      AI assistant
                    </div>
                  </div>

                  <div className='rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent'>
                    Kaabe
                  </div>
                </div>

                {/* Chat messages */}
                <div className='space-y-5 p-5'>
                  <div className='flex justify-end'>
                    <div className='max-w-xs rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm text-white'>
                      Ma furan tihiin maanta?
                    </div>
                  </div>

                  <div className='flex justify-start'>
                    <div className='max-w-xs rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3 text-sm leading-6 text-neutral-700'>
                      Haa! Sahal Restaurant maanta wuu furan yahay.
                      <br />
                      <br />
                      Waxaan furnahay 10:00 AM ilaa 10:00 PM.
                    </div>
                  </div>

                  <div className='flex justify-end'>
                    <div className='max-w-xs rounded-2xl rounded-br-md bg-accent px-4 py-3 text-sm text-white'>
                      Maxaad haysaan maanta?
                    </div>
                  </div>

                  <div className='flex justify-start'>
                    <div className='flex items-center gap-2 rounded-2xl rounded-bl-md bg-neutral-100 px-4 py-3 text-sm text-neutral-500'>
                      <span className='h-1.5 w-1.5 animate-pulse rounded-full bg-accent' />
                      Kaabe is thinking...
                    </div>
                  </div>
                </div>

                {/* Fake input */}
                <div className='border-t border-neutral-100 p-4'>
                  <div className='flex items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-400'>
                    Ask anything about the business...
                    <ArrowRight className='ml-auto' size={16} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id='how-it-works'
        className='bg-neutral-50 px-6 py-20 md:px-10 md:py-28'
      >
        <div className='mx-auto max-w-7xl'>
          <div className='mx-auto max-w-2xl text-center'>
            <p className='text-sm font-semibold uppercase tracking-wider text-accent'>
              How it works
            </p>

            <h2 className='mt-3 text-3xl font-bold tracking-tight md:text-4xl'>
              Give your business an AI employee in three steps.
            </h2>

            <p className='mt-4 text-neutral-600'>
              No complicated AI setup. Give Kaabe your business knowledge and
              let it handle the questions.
            </p>
          </div>

          <div className='mt-14 grid gap-6 md:grid-cols-3'>
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className='rounded-2xl border border-neutral-200 bg-white p-7'
                >
                  <div className='flex items-center justify-between'>
                    <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent'>
                      <Icon size={21} />
                    </div>

                    <span className='text-sm font-semibold text-neutral-300'>
                      {step.number}
                    </span>
                  </div>

                  <h3 className='mt-7 text-xl font-semibold'>{step.title}</h3>

                  <p className='mt-3 leading-7 text-neutral-600'>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id='features' className='bg-white px-6 py-20 md:px-10 md:py-28'>
        <div className='mx-auto max-w-7xl'>
          <div className='grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-end'>
            <div>
              <p className='text-sm font-semibold uppercase tracking-wider text-accent'>
                Everything you need
              </p>

              <h2 className='mt-3 text-3xl font-bold tracking-tight md:text-4xl'>
                More than a chatbot.
              </h2>

              <p className='mt-5 max-w-lg leading-7 text-neutral-600'>
                Kaabe connects your business knowledge, AI customer support, and
                analytics in one simple workspace.
              </p>
            </div>

            <div className='grid gap-5 sm:grid-cols-2'>
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.title}
                    className='rounded-2xl border border-neutral-200 bg-neutral-50 p-6'
                  >
                    <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-sm'>
                      <Icon size={20} />
                    </div>

                    <h3 className='mt-5 font-semibold'>{feature.title}</h3>

                    <p className='mt-2 text-sm leading-6 text-neutral-600'>
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Assistant preview */}
      <section
        id='assistant'
        className='bg-neutral-50 px-6 py-20 md:px-10 md:py-28'
      >
        <div className='mx-auto max-w-7xl'>
          <div className='overflow-hidden rounded-3xl border border-neutral-200 bg-white'>
            <div className='grid lg:grid-cols-2'>
              <div className='flex flex-col justify-center p-8 md:p-12 lg:p-16'>
                <p className='text-sm font-semibold uppercase tracking-wider text-accent'>
                  Your AI employee
                </p>

                <h2 className='mt-3 text-3xl font-bold tracking-tight md:text-4xl'>
                  Your customers can ask questions while you focus on the
                  business.
                </h2>

                <p className='mt-5 max-w-xl leading-7 text-neutral-600'>
                  Kaabe uses the information you provide to answer customer
                  questions. It does not need to guess what your business does.
                </p>

                <div className='mt-8 space-y-4'>
                  {[
                    "Answers from your business knowledge",
                    "Available whenever your customers need it",
                    "Works in Somali and English",
                    "Every conversation becomes useful business data",
                  ].map((item) => (
                    <div key={item} className='flex items-center gap-3'>
                      <div className='flex h-6 w-6 items-center justify-center rounded-full bg-green-50 text-green-600'>
                        <Check size={14} />
                      </div>

                      <span className='text-sm text-neutral-700'>{item}</span>
                    </div>
                  ))}
                </div>

                <div className='mt-9'>
                  <Link
                    href='/sign-up'
                    className='inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 font-medium text-white transition hover:bg-accent/90'
                  >
                    Build your assistant
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>

              {/* Dashboard-style visual */}
              <div className='border-t border-neutral-200 bg-neutral-50 p-6 lg:border-l lg:border-t-0 md:p-10'>
                <div className='rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm'>
                  <div className='flex items-center justify-between border-b border-neutral-100 pb-5'>
                    <div>
                      <p className='text-sm font-semibold'>
                        AI Assistant Overview
                      </p>
                      <p className='mt-1 text-xs text-neutral-500'>
                        Sahal Restaurant
                      </p>
                    </div>

                    <div className='rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700'>
                      Active
                    </div>
                  </div>

                  <div className='grid grid-cols-2 gap-4 py-6'>
                    <div className='rounded-xl bg-neutral-50 p-4'>
                      <p className='text-xs text-neutral-500'>Conversations</p>
                      <p className='mt-2 text-2xl font-bold'>248</p>
                    </div>

                    <div className='rounded-xl bg-neutral-50 p-4'>
                      <p className='text-xs text-neutral-500'>
                        Questions answered
                      </p>
                      <p className='mt-2 text-2xl font-bold'>731</p>
                    </div>
                  </div>

                  <div className='rounded-xl border border-neutral-100 p-4'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-medium'>Customer activity</p>
                      <span className='text-xs text-neutral-400'>
                        Last 14 days
                      </span>
                    </div>

                    <div className='mt-6 flex h-32 items-end gap-2'>
                      {[
                        30, 45, 38, 55, 48, 70, 62, 76, 58, 82, 70, 90, 78, 96,
                      ].map((height, index) => (
                        <div
                          key={index}
                          className='flex-1 rounded-t-md bg-accent/80'
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className='bg-white px-6 py-20 md:px-10 md:py-28'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent'>
            <Sparkles size={25} />
          </div>

          <h2 className='mt-7 text-4xl font-bold tracking-tight md:text-5xl'>
            Give your business an AI employee.
          </h2>

          <p className='mx-auto mt-5 max-w-2xl text-lg leading-8 text-neutral-600'>
            Let Kaabe handle repetitive customer questions while you focus on
            growing your business.
          </p>

          <div className='mt-8'>
            <Link
              href='/sign-up'
              className='inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 font-medium text-white transition hover:bg-accent/90'
            >
              Get started with Kaabe
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className='border-t border-neutral-200 bg-neutral-50 px-6 py-8 md:px-10'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <Link href='/dashboard' className='flex items-center gap-2'>
              <span className='flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-xs font-semibold text-sidebar-primary-foreground'>
                k
              </span>
              <span className='text-lg font-semibold tracking-tight group-data-[collapsible=icon]:hidden'>
                kaabe
              </span>
            </Link>
            <p className='mt-1 text-sm text-neutral-500'>
              AI customer support for modern businesses.
            </p>
          </div>

          <div className='flex items-center gap-6 text-sm text-neutral-500'>
            <Link href='/sign-in' className='transition hover:text-neutral-950'>
              Sign in
            </Link>

            <Link href='/sign-up' className='transition hover:text-neutral-950'>
              Get started
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
