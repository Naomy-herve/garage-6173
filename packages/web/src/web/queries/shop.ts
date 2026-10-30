import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export const useProducts = () => useQuery(orpc.products.list.queryOptions({ staleTime: 15_000 }));
export const useComments = () => useQuery(orpc.comments.list.queryOptions({ staleTime: 15_000 }));

export function useCreateOrder() {
  return useMutation(orpc.orders.create.mutationOptions());
}

export function useCreateComment() {
  const qc = useQueryClient();
  return useMutation(
    orpc.comments.create.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.comments.key() }),
    }),
  );
}

// ---- admin ----
export const useAdminCheck = () =>
  useQuery(orpc.admin.check.queryOptions({ staleTime: 0, retry: false }));
export const useAdminOrders = () => useQuery(orpc.orders.list.queryOptions({ retry: false }));

export function useAdminLogin() {
  return useMutation(orpc.admin.login.mutationOptions());
}

export function useSaveProduct() {
  const qc = useQueryClient();
  const done = { onSuccess: () => qc.invalidateQueries({ queryKey: orpc.products.key() }) };
  return {
    create: useMutation(orpc.products.create.mutationOptions(done)),
    update: useMutation(orpc.products.update.mutationOptions(done)),
    remove: useMutation(orpc.products.remove.mutationOptions({
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: orpc.products.key() });
        qc.invalidateQueries({ queryKey: orpc.comments.key() });
      },
    })),
  };
}

export function useOrderActions() {
  const qc = useQueryClient();
  const done = { onSuccess: () => qc.invalidateQueries({ queryKey: orpc.orders.key() }) };
  return {
    setStatus: useMutation(orpc.orders.setStatus.mutationOptions(done)),
    remove: useMutation(orpc.orders.remove.mutationOptions(done)),
  };
}

export function useRemoveComment() {
  const qc = useQueryClient();
  return useMutation(
    orpc.comments.remove.mutationOptions({
      onSuccess: () => qc.invalidateQueries({ queryKey: orpc.comments.key() }),
    }),
  );
}
