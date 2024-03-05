export async function postData(
  url: string,
  { arg }: { arg: any },
): Promise<any> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(arg),
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw responseData;
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
