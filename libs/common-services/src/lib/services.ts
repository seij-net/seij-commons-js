import { Problem, toProblem } from "@seij/common-types";
import { isEmpty } from "lodash-es";

function normalizeUrl(base: string, relative: string): string {
  const rel = relative.startsWith("/") ? relative.substring(1) : relative;
  return base + "/" + rel;
}

export type ConnectionConfig = {
  apiBaseUrl: string;
  getApiAccessToken: () => string | null;
};

export class Connection {
  constructor(
    private apiBase: string,
    private getApiAccessToken: () => string | null,
  ) {}

  reconfigure(config: ConnectionConfig) {
    this.apiBase = config.apiBaseUrl;
    this.getApiAccessToken = config.getApiAccessToken;
  }

  /**
   * Create standard headers for api calls. Defaults the content type to "application/json"
   * and add "Authorization: Bearer <access_token>" if the configuration returns
   * an access token
   * @returns list of headers
   */
  createHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.getApiAccessToken) {
      const accessToken = this.getApiAccessToken();
      if (accessToken) {
        headers["Authorization"] = "Bearer " + accessToken;
      }
    }
    return headers;
  }

  async get<T>(url: string): Promise<T> {
    let resp: Response | null = null;
    try {
      resp = await fetch(normalizeUrl(this.apiBase, url), {
        method: "GET",
        headers: this.createHeaders(),
      });
    } catch (fetchError) {
      throw toProblem(fetchError);
    }

    if (!resp.ok) {
      let json: any = null;
      try {
        json = await resp.json();
      } catch (notJsonError) {
        throw createProblem(resp);
      }

      if (json.title) throw new Problem(json);
      throw createProblem(resp);
    }

    try {
      const content = await resp.text();
      if (isEmpty(content)) return content as T;
      return JSON.parse(content);
    } catch (parseResponseError) {
      throw createProblemUnreadableJson();
    }
  }

  async post<T>(url: string, data: Record<string, any>): Promise<T> {
    let resp: Response | null = null;
    try {
      resp = await fetch(normalizeUrl(this.apiBase, url), {
        method: "POST",
        headers: this.createHeaders(),
        body: JSON.stringify(data),
      });
    } catch (fetchError) {
      throw toProblem(fetchError);
    }

    if (!resp.ok) {
      let json: any = null;
      try {
        json = await resp.json();
      } catch (notJsonError) {
        throw createProblem(resp);
      }

      if (json.title) throw new Problem(json);
      throw createProblem(resp);
    }

    try {
      const content = await resp.text();
      if (isEmpty(content)) return content as T;
      return JSON.parse(content);
    } catch (parseResponseError) {
      throw createProblemUnreadableJson();
    }
  }

  async delete<T>(url: string): Promise<T> {
    let resp: Response | null = null;
    try {
      resp = await fetch(normalizeUrl(this.apiBase, url), {
        method: "DELETE",
        headers: this.createHeaders(),
      });
    } catch (fetchError) {
      throw toProblem(fetchError);
    }

    if (!resp.ok) {
      let json: any = null;
      try {
        json = await resp.json();
      } catch (notJsonError) {
        throw createProblem(resp);
      }

      if (json.title) throw new Problem(json);
      throw createProblem(resp);
    }

    try {
      const content = await resp.text();
      if (isEmpty(content)) return content as T;
      return JSON.parse(content);
    } catch (parseResponseError) {
      throw createProblemUnreadableJson();
    }
  }
}

export function createConnection(apiBase: string, getApiAccessToken: () => string | null): Connection {
  return new Connection(apiBase, getApiAccessToken);
}
export function createServices(apiBase: string): Services {
  const apiGetText = async (url: string): Promise<string> => {
    return (await fetch(`${apiBase}${url}`)).text();
  };
  const services: Services = {
    hello: async () => {
      return apiGetText("/hello");
    },
  };
  return services;
}

export interface Services {
  hello(): Promise<string>;
}

export interface DossierResp {
  id: string;
  personnes: DossierRespPersonne[];
}
export interface DossierRespPersonne {
  id: string;
  prenom: string;
  nom: string;
  dateNaissance: string;
}

function createProblemUnreadableJson() {
  return new Problem({
    type: "about:blank",
    title: "La réponse du serveur n'a pas pu être interprétée en Json",
  });
}
function createProblem(resp: Response) {
  return new Problem({
    type: "about:blank",
    status: resp.status,
    title: resp.statusText,
  });
}

/**
 * Singleton d'acces aux API par défaut.
 *
 * Le singleton est reconfigurable par les applications qui souhaitent
 * l'utiliser en utilisant defaultConnection.reconfigure(apiConfig);
 */
export const defaultConnection = createConnection("", () => null);
