import { HttpError } from "./http-error.js";
import { HTTP_STATUS } from "../config/http.js";

export const getRouteParam = (value: string | string[] | undefined, name: string) => {
  if (!value || Array.isArray(value)) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, `A valid route parameter is required: ${name}.`);
  }

  return value;
};
