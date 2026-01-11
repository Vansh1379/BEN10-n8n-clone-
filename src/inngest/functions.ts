import { inngest } from "./client";

export const execute = inngest.createFunction(
  { id: "execute-ai" },
  { event: "execute/ai" }
  async ({event, step}) => {

  } 
);
