import { JWT_KEY, getFromLocalStorage } from "../helpers/localStorage";

export async function getData<Data, Key extends string>(
  url: Key,
): Promise<Data> {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getFromLocalStorage(JWT_KEY)}`,
      },
    });

    if (!response.ok) {
      throw await response.json();
    }

    if (response.status === 204) {
      return {} as Data;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function postData<Data, Key extends string, ExtraArgs>(
  url: Key,
  { arg }: { arg: ExtraArgs },
): Promise<Data> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    if (!response.ok) {
      throw await response.json();
    }

    if (response.status === 204) {
      return {} as Data;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
