import { IncomingMessage, ServerResponse } from "http";
import { validate } from "uuid";

export function getParams(url: string): string {
  const urlPath = url!.split("/");
  const params = urlPath?.length > 2 ? urlPath[3] : "";
  return params ?? "";
}

export type typeUUIDFromURL = {
  thereIsParams: boolean;
  thereIsUUD: boolean;
  uuid: string;
};

export function getUUIDFromURL(url: string): typeUUIDFromURL {
  const result = {
    thereIsParams: false,
    thereIsUUD: false,
    uuid: "",
  };
  const urlPath = url!.split("/");
  if (urlPath.length < 4) return result;
  result.thereIsParams = true;
  result.uuid = `${urlPath[3]}`;
  result.thereIsUUD = validate(result.uuid);
  return result;
}

export function getBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    const chunks: string[] = [];
    request.on("data", (chunk: string) => {
      chunks.push(chunk);
    });
    request.on("end", () => {
      resolve(chunks.join(""));
    });
  });
}

export function setRes(
  res: ServerResponse,
  response: {
    code: number;
    body: string;
  },
) {
  res.statusCode = response.code;
  if (response.body) {
    res.setHeader("Content-Type", "application/json");
    res.end(response.body);
  } else res.end();
}

export const resErrors = {
  ENF: () => {
    return {
      code: 404,
      body: JSON.stringify({ error: "Endpoint not found" }),
    };
  },
  UIdI: () => {
    return {
      code: 400,
      body: JSON.stringify({ error: "UserId is invalid (not uuid)" }),
    };
  },
  UNF: () => {
    return {
      code: 404,
      body: JSON.stringify({
        error: "Record with id === userId doesn't exist",
      }),
    };
  },
};

export const resOk = {
  Ok: (body: object | string) => {
    return {
      code: 200,
      body: typeof body === "object" ? JSON.stringify(body) : body,
    };
  },
};
