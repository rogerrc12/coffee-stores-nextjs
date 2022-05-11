import { useState, useContext } from "react";

import { ACTION_TYPES, StoreContext } from "../store/store-context";

export const useGelocation = () => {
  const [locationError, setLocationError] = useState(""),
    [isLoading, setIsLoading] = useState(false),
    { dispatch } = useContext(StoreContext);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocationError("");
    dispatch({ type: ACTION_TYPES.SET_LAT_LONG, payload: { latLong: `${latitude},${longitude}` } });
    setIsLoading(false);
  };

  const error = () => {
    setLocationError("Ha ocurrido un error intentando obtener tu ubicación.");
    setIsLoading(false);
  };

  const handleGeolocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      setLocationError("Tu navegador no soporta encontrar mi ubicación.");
      dispatch({ type: ACTION_TYPES.SET_LAT_LONG, payload: { latLong: "" } });
      setIsLoading(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleGeolocation,
    locationError,
    isLoading,
  };
};
