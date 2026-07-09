import { useCallback } from 'react';
import { useApiMutation } from '../services';

export interface SignInRequestBody {
  email?: string;
  password: string;
}

export interface SignInUser {
  _id: string;
  username: string;
  email: string;
  password: string;
}

export interface SignInResponseData {
  user: SignInUser;
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data: SignInResponseData;
}

interface SignInMutationPayload {
  body: SignInRequestBody;
}


export const useSignIn = () => {
  const mutation = useApiMutation<SignInResponse, SignInRequestBody>({
    method: 'POST',
    endPoint: 'auth/login',
  });

  const signIn = useCallback(({ body }: SignInMutationPayload) =>
      mutation.mutateAsync({body}),
    [mutation],
  );

  return {...mutation, signIn};
};