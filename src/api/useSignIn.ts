import { useCallback } from 'react';
import { normalizeAuthToken, useApiMutation } from '../services';

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
  user?: SignInUser;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  tokens?: { accessToken?: string; refreshToken?: string };
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data?: SignInResponseData;
  accessToken?: string;
  refreshToken?: string;
  token?: string;
  user?: SignInUser;
}

interface SignInMutationPayload {
  body: SignInRequestBody;
}

export const extractAuthTokens = (response?: SignInResponse) => {
  const data = response?.data;

  const accessToken = normalizeAuthToken(
    data?.accessToken ||
      data?.tokens?.accessToken ||
      data?.token ||
      response?.accessToken ||
      response?.token,
  );

  const refreshToken = normalizeAuthToken(
    data?.refreshToken || data?.tokens?.refreshToken || response?.refreshToken,
  );

  const user = data?.user ?? response?.user;

  return { accessToken, refreshToken, user };
};


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