import {
  and,
  count,
  desc,
  eq,
  gte,
  sql,
} from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db/drizzle";
import { business, conversation, message } from "@/db/schema";
import { auth } from "@/lib/auth";

const DAYS = 14;

const page = async () => {


  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/sign-in");
  }


  const businessResult = await db
    .select()
    .from(business)
    .where(eq(business.userId, session.user.id))
    .limit(1);

  if (businessResult.length === 0) {
    redirect("/dashboard/business");
  }

  const currentBusiness = businessResult[0];


  const conversationCount = await db
    .select({ count: count() })
    .from(conversation)
    .where(eq(conversation.businessId, currentBusiness.id));


  const messageCount = await db
    .select({ count: count() })
    .from(message)
    .innerJoin(
      conversation,
      eq(message.conversationId, conversation.id),
    )
    .where(eq(conversation.businessId, currentBusiness.id));


  const averageMessages =
    conversationCount[0].count > 0
      ? (
          Number(messageCount[0].count) /
          Number(conversationCount[0].count)
        ).toFixed(1)
      : "0";

  
  const customerQuestions = await db
    .select({ count: count() })
    .from(message)
    .innerJoin(
      conversation,
      eq(message.conversationId, conversation.id),
    )
    .where(
      and(
        eq(conversation.businessId, currentBusiness.id),
        eq(message.role, "user"),
      ),
    );


  const since = new Date();

  since.setDate(since.getDate() - (DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const rawActivity = await db
    .select({
      day: sql<string>`
        date_trunc('day', ${message.createdAt})::date
      `.as("day"),
      count: count(),
    })
    .from(message)
    .innerJoin(
      conversation,
      eq(message.conversationId, conversation.id),
    )
    .where(
      and(
        eq(conversation.businessId, currentBusiness.id),
        eq(message.role, "user"),
        gte(message.createdAt, since),
      ),
    )
    .groupBy(
      sql`date_trunc('day', ${message.createdAt})`,
    )
    .orderBy(
      sql`date_trunc('day', ${message.createdAt})`,
    );

  const activityMap = new Map(
    rawActivity.map((row) => [
      new Date(row.day).toDateString(),
      Number(row.count),
    ]),
  );

  const customerActivity = Array.from(
    { length: DAYS },
    (_, i) => {
      const date = new Date(since);

      date.setDate(date.getDate() + i);

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count:
          activityMap.get(date.toDateString()) ?? 0,
      };
    },
  );


  const recentConversations = await db
    .select()
    .from(conversation)
    .where(eq(conversation.businessId, currentBusiness.id))
    .orderBy(desc(conversation.updatedAt))
    .limit(8);

    
  const maxActivity = Math.max(
    ...customerActivity.map((day) => day.count),
    1,
  );

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* HEADER */}

        <div>
          <p className="text-sm font-medium text-accent">
            Analytics
          </p>

          <h1 className="mt-1 text-3xl font-bold">
            Customer insights
          </h1>

          <p className="mt-2 text-gray-500">
            Understand what customers are asking
            and how they interact with your AI assistant.
          </p>
        </div>

        {/* STAT CARDS */}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Conversations
            </p>

            <p className="mt-2 text-3xl font-bold">
              {conversationCount[0].count}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Total conversations
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Customer questions
            </p>

            <p className="mt-2 text-3xl font-bold">
              {customerQuestions[0].count}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Questions asked by customers
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Total messages
            </p>

            <p className="mt-2 text-3xl font-bold">
              {messageCount[0].count}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Customer + AI messages
            </p>
          </div>

          <div className="rounded-xl border bg-white p-5">
            <p className="text-sm text-gray-500">
              Avg. messages
            </p>

            <p className="mt-2 text-3xl font-bold">
              {averageMessages}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              Messages per conversation
            </p>
          </div>

        </div>

        {/* CUSTOMER ACTIVITY */}

        <div className="rounded-xl border bg-white p-6">

          <div className="mb-6">
            <h2 className="text-lg font-semibold">
              Customer activity
            </h2>

            <p className="text-sm text-gray-500">
              Customer questions over the last 14 days
            </p>
          </div>

          <div className="flex h-64 items-end gap-2">

            {customerActivity.map((day) => (
              <div
                key={day.date}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="text-xs text-gray-400">
                  {day.count > 0 ? day.count : ""}
                </div>

                <div
                  className="w-full rounded-t-md bg-accent/80 transition-all"
                  style={{
                    height:
                      day.count === 0
                        ? "4px"
                        : `${Math.max(
                            (day.count / maxActivity) * 85,
                            8,
                          )}%`,
                  }}
                />

                <span className="text-[10px] text-gray-400">
                  {day.date}
                </span>
              </div>
            ))}

          </div>
        </div>

        {/* LOWER SECTION */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* RECENT CONVERSATIONS */}

          <div className="rounded-xl border bg-white p-6">

            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Recent conversations
              </h2>

              <p className="text-sm text-gray-500">
                Latest customer activity
              </p>
            </div>

            <div className="space-y-3">

              {recentConversations.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-400">
                  No conversations yet.
                </p>
              ) : (
                recentConversations.map((chat) => (
                  <div
                    key={chat.id}
                    className="rounded-lg border p-4"
                  >
                    <p className="truncate font-medium">
                      {chat.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {chat.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}

            </div>
          </div>

          {/* INSIGHTS */}

          <div className="rounded-xl border bg-white p-6">

            <div className="mb-5">
              <h2 className="text-lg font-semibold">
                Business insights
              </h2>

              <p className="text-sm text-gray-500">
                Quick overview of your assistant
              </p>
            </div>

            <div className="space-y-4">

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium">
                  Customer engagement
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Customers send an average of{" "}
                  <span className="font-semibold text-gray-700">
                    {averageMessages}
                  </span>{" "}
                  messages per conversation.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium">
                  Questions answered
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your AI assistant has processed{" "}
                  <span className="font-semibold text-gray-700">
                    {customerQuestions[0].count}
                  </span>{" "}
                  customer questions.
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm font-medium">
                  Knowledge-powered assistant
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Customer conversations are connected
                  to your business knowledge base through
                  RAG.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default page;

