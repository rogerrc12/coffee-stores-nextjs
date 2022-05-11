export async function fetchData(url, method, headers = null) {
  const options = {
    method,
    headers,
  };

  try {
    const res = await fetch(url, options);
    const data = await res.json();

    return data;
  } catch (error) {
    throw error;
  }
}
