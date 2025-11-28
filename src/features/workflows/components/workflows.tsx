"use client";
import { EntityContainer, Entityheader } from "@/components/entity-components";
import { useSuspenseWorkflows } from "../hooks/use-workflows";

export const WorkflowsList = () => {
  const workflows = useSuspenseWorkflows();

  return <p>{JSON.stringify(workflows.data, null, 2)}</p>;
};

export const WorkflowHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <>
      <Entityheader
        title="Workflows"
        description="Create and Manage your workflows"
        onNew={() => {}}
        newButtonLabel="New Workflow"
        disabled={disabled}
        isCreating={false}
      />
    </>
  );
};

export const WorkflowsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<WorkflowHeader />}
      search={<></>}
      pagination={<></>}
    >
      {children}
    </EntityContainer>
  );
};
