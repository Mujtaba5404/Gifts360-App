import { useCallback } from 'react';
import { useApiMutation } from '../services';

export interface ChangePasswordRequestBody {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

interface ChangePasswordMutationPayload {
  body: ChangePasswordRequestBody;
}

// ---------- POST /auth/change-password ----------

export const useChangePassword = () => {
  const mutation = useApiMutation<ChangePasswordResponse, ChangePasswordRequestBody>({
    method: 'POST',
    endPoint: 'auth/change-password',
  });

  const changePassword = useCallback(
    ({ body }: ChangePasswordMutationPayload) => mutation.mutateAsync({ body }),
    [mutation],
  );

  return { ...mutation, changePassword };
};
