"use client";

import type { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
  const [selectorOpen, setOpenSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setOpenSelectorOpen}>
      <WorkflowNode showToolbar={false}>
        <PlaceholderNode {...props} onClick={() => setOpenSelectorOpen(true)}>
          <div className="cursor-pointer flex items-center justify-center">
            <PlusIcon className="size-4 " />
          </div>
        </PlaceholderNode>
      </WorkflowNode>
    </NodeSelector>
  );
});
