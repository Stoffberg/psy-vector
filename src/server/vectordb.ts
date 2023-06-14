/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env.mjs";

type QueryResult = {
  results: {
    query: string;
    results: {
      id: string;
      text: string;
      score: number;
    }[];
  }[];
};

export default class VectorDB {
  public query = async (queryPrompt: string, searchTopK = 3) => {
    const url = "http://0.0.0.0:8000/query";
    const headers = {
      "Content-Type": "application/json",
      accept: "application/json",
      Authorization: `Bearer ${env.DATABASE_INTERFACE_BEARER_TOKEN}`,
    };

    const data = { queries: [{ query: queryPrompt, top_k: searchTopK }] };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      const result = (await response.json()) as QueryResult;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return result.results.at(0)!;
    } else {
      const responseText = await response.text();
      throw new Error(`Error: ${response.status} : ${responseText}`);
    }
  };

  public upsert = async (id: string, content: string) => {
    const url = "http://0.0.0.0:8000/upsert";
    const headers = {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DATABASE_INTERFACE_BEARER_TOKEN}`,
    };

    const data = {
      documents: [
        {
          id: id,
          text: content,
        },
      ],
    };

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.status === 200) {
      console.log("uploaded successfully.");
    } else {
      const responseText = await response.text();
      console.log(`Error: ${response.status} ${responseText}`);
    }
  };
}
