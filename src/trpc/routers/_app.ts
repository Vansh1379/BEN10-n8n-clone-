import prisma from "@/lib/db";
import { createTRPCRouter, protectedprocedure } from "../init";
import { inngest } from "@/inngest/client";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const appRouter = createTRPCRouter({
  testAi: protectedprocedure.mutation(async () => {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: "What is the meaning of life?",
    });
    return text;
  }),

  getWorkflows: protectedprocedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkFlows: protectedprocedure.mutation(async () => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: "hlo@yopmail.com",
      },
    });

    return prisma.workflow.create({
      data: {
        name: "test-workflow",
      },
    });
  }),
});

//export type defination of the API
export type AppRouter = typeof appRouter;
