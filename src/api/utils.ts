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
  MNA: () => {
    return {
      code: 404,
      body: JSON.stringify({ error: "Method not allowed" }),
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
        error: "The record with the requested ID does not exist",
      }),
    };
  },
  NCRF: (errorList: string[]) => {
    return {
      code: 400,
      body: JSON.stringify({
        error:
          errorList.length > 0
            ? errorList
            : "Request body does not contain required fields",
      }),
    };
  },
  EJSON: () => {
    return {
      code: 400,
      body: JSON.stringify({
        error: "Filed to parse JSON",
      }),
    };
  },
  ISE: () => {
    return {
      code: 500,
      body: JSON.stringify({
        error: "Internal server error",
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
  create: (body: object | string) => {
    return {
      code: 201,
      body: typeof body === "object" ? JSON.stringify(body) : body,
    };
  },
  delete: () => {
    return {
      code: 204,
      body: "",
    };
  },
};

export const validateUser = (
  username: string,
  age: number,
  hobbies: string[],
) => {
  const errors: string[] = [];
  if (!username) errors.push("Username required");
  else if (typeof username !== "string")
    errors.push("Username must be a string");

  if (!age) errors.push("Age required");
  else if (typeof age !== "number") errors.push("Age must be a number");

  if (!hobbies) errors.push("Hobbies required");
  else if (
    !Array.isArray(hobbies) ||
    !hobbies.every((e) => typeof e === "string")
  )
    errors.push("Hobbies must be an array of strings");

  return errors;
};

export const validateUpdateUser = (
  username: string,
  age: number,
  hobbies: string[],
) => {
  const errors: string[] = [];
  if (!username && !age && !hobbies)
    errors.push("Username or age or hobbies required");

  if (username && typeof username !== "string")
    errors.push("Username must be a string");

  if (age && typeof age !== "number") errors.push("Age must be a number");

  if (hobbies)
    if (!Array.isArray(hobbies) || !hobbies.every((e) => typeof e === "string"))
      errors.push("Hobbies must be an array of strings");

  return errors;
};
