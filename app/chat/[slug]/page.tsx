import { db } from "@/db/drizzle";
import { business } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Chat from "@/components/chat";

export default async function CustomerChatPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const result = await db
    .select()
    .from(business)
    .where(eq(business.slug, slug))
    .limit(1);

  if (result.length === 0) {
    notFound();
  }

  const currentBusiness = result[0];

 const conversationId = crypto.randomUUID();

 return (
   <Chat
     conversationId={conversationId}
     initialMessages={[]}
     api='/api/public/chat'
     body={{ slug: currentBusiness.slug }}
   />
 );
}
