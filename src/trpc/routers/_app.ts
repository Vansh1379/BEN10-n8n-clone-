import prisma from "@/lib/db";
import { createTRPCRouter, protectedprocedure } from "../init";
import { inngest } from "@/inngest/client";

export const appRouter = createTRPCRouter({
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
