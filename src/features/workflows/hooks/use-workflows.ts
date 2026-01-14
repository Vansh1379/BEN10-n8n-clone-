import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

//hook to fetch all the workflows using susspense
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

// hook to create a new workflow
export const useCreateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow created successfully ${data.name}`);

        queryClient.invalidateQueries();
        trpc.workflows.getMany.queryOptions({});
      },
      onError: (err) => {
        toast.error(`Error creating workflow: ${err.message}`);
      },
    })
  );
};

// hook to remove a workflow

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow removed successfully ${data.name}`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id })
        );
      },
    })
  );
};

//hook to fetch  the workflow using susspense
export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();

  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

// hook to update a  workflow name
export const useUpdateWorkflowName = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow updated successfully ${data.name}`);

        queryClient.invalidateQueries();
        trpc.workflows.getMany.queryOptions({});
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (err) => {
        toast.error(`failed to update workflow: ${err.message}`);
      },
    })
  );
};

// hook to update a workflow
export const useUpdateWorkflow = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow saved successfully ${data.name}`);

        queryClient.invalidateQueries();
        trpc.workflows.getMany.queryOptions({});
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id })
        );
      },
      onError: (err) => {
        toast.error(`failed to save workflow: ${err.message}`);
      },
    })
  );
};

// hook to execute a workflow
export const useExecuteWorkflow = () => {
  const trpc = useTRPC();

  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow Executes successfully ${data.name}`);
      },
      onError: (err) => {
        toast.error(`failed to execute workflow: ${err.message}`);
      },
    })
  );
};
