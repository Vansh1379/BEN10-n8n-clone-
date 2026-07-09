import { NodeType } from "@/generated/prisma/enums";
import type { NodeExecutor } from "./types";

const passthroughExecutor: NodeExecutor = ({ context }) => context;

export const executorRegistry = {
  [NodeType.MANUAL_TRIGGER]: passthroughExecutor,
  [NodeType.INITIAL]: passthroughExecutor,
  [NodeType.HTTP_REQUEST]: passthroughExecutor,
} satisfies Record<NodeType, NodeExecutor>;

export const getExecutor = (type: NodeType): NodeExecutor => {
  const executor = executorRegistry[type];
  if (!executor) {
    throw new Error(`No executor found for type ${type}`);
  }

  return executor;
};
