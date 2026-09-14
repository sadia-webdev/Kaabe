import { db } from "@/db/drizzle";
import { business, conversation, message } from "@/db/schema";
import { searchDocuments } from "@/lib/search";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { google } from "@ai-sdk/google";

import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const {
    messages,
    slug,
    conversationId,
  }: {
    messages: UIMessage[];
    slug: string;
    conversationId?: string;
  } = await request.json();

  const latestMessage = messages[messages.length - 1];

  const textPart = latestMessage?.parts.find((part) => part.type === "text");

  if (!textPart || latestMessage.role !== "user") {
    return new Response("Invalid user message", { status: 400 });
  }

  if (!slug || !textPart.text) {
    return new Response("Slug and message are required", {
      status: 400,
    });
  }

  // 1. Find the business using its public slug
  const businessResult = await db
    .select()
    .from(business)
    .where(eq(business.slug, slug))
    .limit(1);

  if (businessResult.length === 0) {
    return new Response("Business not found", {
      status: 404,
    });
  }

  const currentBusiness = businessResult[0];

  // 2. Find existing conversation
  let currentConversation;

  if (conversationId) {
    const conversationResult = await db
      .select()
      .from(conversation)
      .where(eq(conversation.id, conversationId))
      .limit(1);

    if (conversationResult.length > 0) {
      currentConversation = conversationResult[0];

      // Make sure this conversation belongs to this business
      if (currentConversation.businessId !== currentBusiness.id) {
        return new Response("Forbidden", {
          status: 403,
        });
      }
    }
  }

  // 3. Create anonymous conversation if needed
  if (!currentConversation) {
    const newConversation = await db
      .insert(conversation)
      .values({
        id: conversationId ?? crypto.randomUUID(),
        title: textPart.text.slice(0, 50),
        userId: null,
        businessId: currentBusiness.id,
      })
      .returning();

    currentConversation = newConversation[0];
  }

  await db.insert(message).values({
    id: crypto.randomUUID(),
    content: textPart.text,
    role: "user",
    conversationId: currentConversation.id,
    userId: null,
  });

  const results = await searchDocuments(textPart.text, currentBusiness.id);

  const context = results
    .map((result) => result.metadata?.text)
    .filter(Boolean)
    .join("\n\n");


    const modelMessages = await convertToModelMessages(messages);


  const result = await streamText({
    model: google("gemini-2.5-flash"),

    system: `You are a helpful AI assistant for ${currentBusiness.name}.

Answer the customer's question using only the business information provided below.

If the answer is not contained in the business information, say you don't have that information. Do not make up facts.

Business information:

${context}`,

    messages: modelMessages,
  });

  const responseText = await result.text;

  await db.insert(message).values({
    id: crypto.randomUUID(),
    content: responseText,
    role: "assistant",
    conversationId: currentConversation.id,
    userId: null,
  });

  return result.toUIMessageStreamResponse();
}
