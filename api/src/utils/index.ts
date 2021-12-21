import { FastifyRequest } from "fastify";
import { File } from "fastify-multer/lib/interfaces";
import { RouteGenericInterface } from "fastify/types/route";
import { getUnixTime } from "date-fns";

export type doneFn = (err?: Error) => void;

export const getUnixTimestamp = () => {
  return getUnixTime(new Date());
};

export interface TimestampAttrs {
  createdAt: number;
  updatedAt: number;
}

export interface AdminSessionJWT {
  session: string;
}

export interface RequestWithFile<T = RouteGenericInterface>
  extends FastifyRequest<T> {
  file?: File;
}

export interface GetByIdQueryRoute extends RouteGenericInterface {
  Params: {
    id: string;
  };
}

export interface RouteWithBody<T> extends RouteGenericInterface {
  Body: T;
}

export interface RouteWithParams<T> extends RouteGenericInterface {
  Params: T;
}

export interface RouteWithAPIHeaders extends RouteGenericInterface {
  Headers: {
    "sync-private": string;
    "sync-public": string;
  };
}
