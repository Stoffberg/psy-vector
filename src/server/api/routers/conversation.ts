import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const conversationRouter = createTRPCRouter({
  askQuestion: protectedProcedure
    .input(
      z.object({ conversationId: z.string().optional(), question: z.string() })
    )
    .mutation(async ({ input, ctx }) => {
      // TODO - Heinrich: Implement stuff here and change the inputs to answer
      const answer = `The answer to ${input.question} is 42.`;

      const table = await ctx.lanceClient.createTable("my_table", [
        { id: 1, vector: [3.1, 4.1], item: "foo", price: 10.0 },
        { id: 2, vector: [5.9, 26.5], item: "bar", price: 20.0 },
      ]);
      const results = await table.search([100, 100]).limit(2).execute();
      return results;

      return await ctx.prisma.conversationEntry.create({
        data: {
          answer: answer,
          question: input.question,
          conversation: {
            connectOrCreate: {
              where: {
                id: input.conversationId,
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
