import { createApi } from "unsplash-js";
import { fetchData } from "./fetch-data";

// on your node server
const unsplashAPi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

async function getCoffeeStorePhotos(qty) {
  const res = await unsplashAPi.search.getPhotos({
    query: "coffee shop",
    perPage: qty,
  });

  const results = res.response.results;
  return results.map((result) => result.urls.small);
}

export async function getCoffeeStores(latLng, limit) {
  try {
    const data = await fetchData(`https://api.foursquare.com/v3/places/search?ll=${latLng}&radius=100000&categories=13037&limit=${limit}`, "GET", {
      Accept: "application/json",
      Authorization: process.env.NEXT_PUBLIC_FQ_ACCESS_KEY,
    });

    const photos = await getCoffeeStorePhotos(limit);

    const stores =
      data?.results?.map((venue, idx) => {
        // <------
        const neighbourhood = venue.location.neighborhood;

        return {
          id: venue.fsq_id, // <------
          address: venue.location.address || "",
          name: venue.name,
          neighbourhood: (neighbourhood && neighbourhood.length > 0 && neighbourhood[0]) || venue.location.cross_street || "",
          imgUrl: photos[idx],
        };
      }) || [];

    return stores;
  } catch (error) {
    throw error;
  }
}

// return
