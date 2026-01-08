"use client";

import type { Node, NodeProps } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo } from "react";
import { BaseExecutionNode } from "../base-execution-node";

type HttpRequestNodeData = {
  endPoint?: string;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const nodeData = props.data as HttpRequestNodeData;
  const description = nodeData?.endPoint
    ? `${nodeData.method || "GET"}
    : ${nodeData.endPoint}`
    : "Not Configured";

  return (
    <>
      <BaseExecutionNode
        {...props}
        id={props.id}
        name="HTTP Request"
        icon={GlobeIcon}
        description={description}
      />
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
