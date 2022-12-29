import React from "react";
import PropagateLoader from "react-spinners/PropagateLoader";

const Spinner = () => {
  return (
    <div className="w-full h-[100vh] flex justify-center items-center">
      <PropagateLoader
        color="#474973"
        loading={true}
        aria-label="Loading Spinner"
        data-testid="loader"
        speedMultiplier={2}
      />
    </div>
  );
};

export default Spinner;
