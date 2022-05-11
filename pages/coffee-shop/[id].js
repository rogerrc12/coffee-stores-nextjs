import cls from "classnames";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSWR, { SWRConfig } from "swr";
import { getCoffeeStores } from "../../lib/coffee-store";
import { StoreContext } from "../../store/store-context";
import styles from "../../styles/coffee-shop.module.css";
import { isEmptyObject } from "../../utils";

const fetcher = (url) => fetch(url).then((res) => res.json());

export async function getStaticProps({ params }) {
  const stores = await getCoffeeStores("28.34,-81.58", 6),
    store = stores.find((store) => store.id.toString() === params.id);

  return {
    props: {
      store: store || {},
      fallback: {
        "/api/coffee-store-by-id": store || {},
      },
    },
  };
}

export async function getStaticPaths() {
  const stores = await getCoffeeStores("28.34,-81.58", 6);

  const paths = stores.map((store) => ({
    params: {
      id: store.id.toString(),
    },
  }));

  return {
    paths,
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter(),
    [store, setStore] = useState(props.store || {}),
    [votingCount, setVotingCount] = useState(1),
    { id } = router.query,
    {
      state: { storesNear },
    } = useContext(StoreContext),
    { data, error } = useSWR(`/api/coffee-store-by-id?id=${id}`, fetcher);

  const handleCreateCoffeeStore = async (store) => {
    try {
      await fetch("/api/create-coffee-store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...store,
          neighbourhood: store?.neighbourhood || "",
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpVote = async () => {
    try {
      const res = await fetch(`/api/vote-coffee-store-by-id?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data?.length > 0) {
        let count = data[0].voting;
        setVotingCount(count);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (isEmptyObject(props.store)) {
        if (storesNear.length > 0) {
          const storeNear = storesNear.find((store) => store.id === id);

          if (storeNear) {
            await handleCreateCoffeeStore(storeNear);
            setStore(storeNear);
          }
        }
      } else {
        setStore(props.store);
        await handleCreateCoffeeStore(props.store);
      }
    })();
  }, [props.store, storesNear, id]);

  if (router.isFallback) return <div>Cargando...</div>;
  if (error) return <div>Ha ocurrido un error obteniendo el coffee store.</div>;

  return (
    <SWRConfig value={{ fallback: props.fallback }}>
      <div className={styles.layout}>
        <Head>
          <title>{store.name}</title>
        </Head>
        <div className={styles.container}>
          <div className={styles.header}>
            <Link href="/">
              <a className={styles.backLink}>&larr; Ir a inicio</a>
            </Link>
            <h1>{store.name}</h1>
            <div className={styles.ImgWrapper}>
              <Image
                src={
                  store.imgUrl ||
                  "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                }
                alt={store.name}
                layout="fill"
                objectFit="cover"
                className={styles.storeImg}
              />
            </div>
          </div>

          <div className={cls("glass", styles.contentWrapper)}>
            <div className={styles.iconWrapper}>
              <span className="material-icons-outlined">location_on</span>
              <p>{store.address}</p>
            </div>
            {store.neighbourhood && (
              <div className={styles.iconWrapper}>
                <span className="material-icons-outlined">near_me</span>
                <p>{store.neighbourhood}</p>
              </div>
            )}

            <div className={styles.iconWrapper}>
              <span className="material-icons-outlined">star_rate</span>
              <p>{votingCount}</p>
            </div>

            <button className={styles.upvoteButton} onClick={handleUpVote}>
              Up vote
            </button>
          </div>
        </div>
      </div>
    </SWRConfig>
  );
};

export default CoffeeStore;
