import { anthropic } from "@ai-sdk/anthropic";
import { streamText, tool } from "ai";
import { auth } from "@/server/auth";
import { tools } from "@/server/ai/tools";
import { systemPrompt } from "@/server/ai/system-prompt";
import type { z } from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await req.headers,
  });

  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { messages } = await req.json();

  const aiTools: Record<string, any> = {};

  for (const [name, toolDef] of Object.entries(tools)) {
    const definition = toolDef as {
      description: string;
      parameters: z.ZodType;
      execute: (params: unknown, userId: string) => Promise<unknown>;
    };

    aiTools[name] = tool({
      description: definition.description,
      inputSchema: definition.parameters,
      execute: async (params: unknown) => {
        return await definition.execute(params, session.user.id);
      },
    });
  }

  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20241022"),
    system: systemPrompt,
    messages,
    tools: aiTools,
    stopWhen: ({ steps }) => steps.length >= 5,
  });

  return result.toTextStreamResponse();
}
