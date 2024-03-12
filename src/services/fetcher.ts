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
