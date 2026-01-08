"use client";
import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { memo, useState } from "react";
import { NodeSelector } from "./node-selector";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setOpenSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setOpenSelectorOpen}>
      <Button
        onClick={() => {}}
        size="icon"
        variant="outline"
        className="bg-background"
      >
        <PlusIcon />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
