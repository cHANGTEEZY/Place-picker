import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  const getImages = async () => {
    setIsFetching(true);
    try {
      const response = await fetch("http://localhost:3000/places");
      const data = await response.json();

      if (!response.ok) {
        throw new Error("Failed to fetch places");
      }
      setAvailablePlaces(data.places);
    } catch (error) {
      setError({
        message:
          error.message || "Couldn't fetch places, please try again later.",
      });
    }

    setIsFetching(false);
  };

  useEffect(() => {
    getImages();
  }, []);

  if (error) {
    return <Error title="An error occured!" message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching Place data..."
      fallbackText="No places available"
      onSelectPlace={onSelectPlace}
    />
  );
}
