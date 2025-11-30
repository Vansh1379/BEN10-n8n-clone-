import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

//hook to fetch all the workflows using susspense
export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
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
        trpc.workflows.getMany.queryOptions();
      },
      onError: (err) => {
        toast.error(`Error creating workflow: ${err.message}`);
      },
    })
  );
};
