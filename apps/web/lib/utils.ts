import { AxiosError, AxiosResponse } from 'axios';
import { clsx, type ClassValue } from 'clsx';
import { toast } from 'react-toastify';
import { twMerge } from 'tailwind-merge';
import { ZodError, ZodIssue } from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function handleNetworkError(e: AxiosError) {
  const { response } = e as AxiosError;
  const { request } = e as AxiosError;
  if (response?.data) {
    const { data } = response as AxiosResponse;

    if (data.error as ZodError) {
      if (data.error.issues) {
        data.error.issues.map((issue: ZodIssue) => {
          toast.error(`${issue.path[0]} - ${issue.message}`);
        });
      }
    } else if (data.error) {
      toast.error(data.error);
    } else {
      toast.error(data.message);
    }
  }
  if (request) {
    const { response, statusText } = request as XMLHttpRequest;
    const responseParsed = JSON.parse(response as string);
    toast.error(`${statusText} - ${responseParsed.error}`);
  }
  console.error(e);
}
