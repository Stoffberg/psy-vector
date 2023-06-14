/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  askQuestion: protectedProcedure
    .input(
      z.object({ conversationId: z.string().optional(), question: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      const conversationEntry = await ctx.prisma.conversationEntry.create({
        data: {
          question: input.question,
          conversation: {
            connectOrCreate: {
              where: {
                id: input.conversationId || "??",
              },
              create: {
                user: {
                  connect: {
                    id: ctx.session.user.id,
                  },
                },
              },
            },
          },
        },
      });

      const vectorResponse = await ctx.vectordb.query(input.question, 10);
      const context = vectorResponse.results
        .map((result) => result.text)
        .join("\n");

      const chatCompletion = await ctx.openai.createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: `You are a mental health buddy. Take the following pieces of information and condense it into a short recommendation. It is required of you to give 5 pointer based on only the following information: ${context}\n\n Make sure to give a short recommendation and 5 pointers and make sure to only refer to the information above.`,
          },
          {
            role: "user",
            content: input.question,
          },
        ],
      });

      console.log(
        `You are a mental health buddy. Take the following pieces of information and condense it into a short recommendation. It is required of you to give 5 pointer based on only the following information: ${context}\n\n Make sure to give a short recommendation and 5 pointers and make sure to only refer to the information above.`
      );

      const answer =
        chatCompletion.data.choices[0]?.message?.content ??
        "Sorry, I don't know.";
      console.log(JSON.stringify(answer, null, 2));

      return await ctx.prisma.conversationEntry.update({
        where: {
          id: conversationEntry.id,
        },
        data: {
          answer,
        },
      });
    }),

  getConversations: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.conversations.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
  }),

  getConversationEntries: protectedProcedure
    .input(z.object({ conversationId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.conversationEntry.findMany({
        where: {
          conversationId: input.conversationId,
        },
      });
    }),
});
