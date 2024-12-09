import React, { useRef, useState, useCallback } from "react";

// Importing components
import Places from "./components/Places.jsx";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import AvailablePlaces from "./components/AvailablePlaces.jsx";
import Error from "./components/Error.jsx";

// Importing assets
import logoImg from "./assets/logo.png";

// Importing utility functions
import { fetchUserPlaces, updateUserPlaces } from "./http.js";

// Importing custom hooks
import { useFetch } from "./hooks/useFetch.js";

function App() {
  const selectedPlace = useRef();

  const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const {
    isFetching,
    error,
    fetchedData: userPlaces,
    setFetchedData: setUserPlaces,
  } = useFetch(fetchUserPlaces, []);

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

  const handleSelectPlace = useCallback(
    async (selectedPlace) => {
      const updatedPlaces = [selectedPlace, ...(userPlaces || [])].filter(
        (place, index, self) =>
          index === self.findIndex((p) => p.id === place.id)
      );

      try {
        setUserPlaces(updatedPlaces);
        await updateUserPlaces(updatedPlaces);
      } catch (error) {
        setUserPlaces(userPlaces);
        setErrorUpdatingPlaces({
          message: error.message || "Failed to update places.",
        });
      }
    },
    [userPlaces, setUserPlaces]
  );

  const handleRemovePlace = useCallback(async () => {
    const updatedPlaces = userPlaces.filter(
      (place) => place.id !== selectedPlace.current.id
    );

    try {
      setUserPlaces(updatedPlaces);
      await updateUserPlaces(updatedPlaces);
    } catch (error) {
      setUserPlaces(userPlaces);
      setErrorUpdatingPlaces({
        message: error.message || "Failed to delete place.",
      });
    }

    setModalIsOpen(false);
  }, [userPlaces, setUserPlaces]);

  function handleError() {
    setErrorUpdatingPlaces(null);
  }

  return (
    <>
      <Modal open={errorUpdatingPlaces} onClose={handleError}>
        {errorUpdatingPlaces && (
          <Error
            title="An error occurred!"
            message={errorUpdatingPlaces.message}
            onConfirm={handleError}
          />
        )}
      </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <Error title="An error occurred!" message={error.message} />}
        {!error && (
          <Places
            title="I'd like to visit ..."
            fallbackText="Select the places you would like to visit below."
            isLoading={isFetching}
            loadingText="Fetching your places..."
            places={userPlaces}
            onSelectPlace={handleStartRemovePlace}
          />
        )}

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
