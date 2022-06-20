import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect } from "react";
import { useGelocation } from "../hooks/use-geolocation.hook";
import { getCoffeeStores } from "../lib/coffee-store";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

import { Banner } from "../components/banner.component";
import Card from "../components/card.component";

import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  let coffeeStoresData = [];

  try {
    const stores = await getCoffeeStores("28.34,-81.58", 6);
    coffeeStoresData = stores;
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
}

export default function Home({ coffeeStores }) {
  const { handleGeolocation, locationError, isLoading } = useGelocation(),
    {
      dispatch,
      state: { storesNear, latLong },
    } = useContext(StoreContext);

  useEffect(() => {
    (async () => {
      if (latLong) {
        try {
          const response = await fetch(`/api/coffee-stores-by-location?latLong=${latLong}&limit=20`);
          const storesNear = await response.json();

          dispatch({ type: ACTION_TYPES.SET_STORES_NEAR, payload: { storesNear } });
        } catch (error) {
          console.log("Fetched stores error: ", { error });
        }
      }
    })();
  }, [latLong, dispatch]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Discover coffee shops</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico"></link>
      </Head>

      <main className={styles.main}>
        <div className={styles.heroImage}>
          <Image src="/static/hero-banner.webp" alt="Discover coffee shops" objectFit="contain" width={500} height={500} />
        </div>
        <Banner onFind={handleGeolocation} findText={isLoading ? "Buscando..." : "Encontrar tiendas cerca"} />
        {locationError && <p>Ha ocurrido un error inesperado: {locationError}</p>}

        {(coffeeStores.length > 0 || storesNear.length > 0) && (
          <section className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>{storesNear.length > 0 ? "Cefeterias cercanas" : "Cafeterías en Toronto"}</h2>
            <div className={styles.cardLayout}>
              {storesNear.length > 0
                ? storesNear.map((store) => <Card key={store.id} name={store.name} imgUrl={store.imgUrl} href={`/coffee-shop/${store.id}`} className={styles.card} />)
                : coffeeStores.map((store) => <Card key={store.id} name={store.name} imgUrl={store.imgUrl} href={`/coffee-shop/${store.id}`} className={styles.card} />)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
