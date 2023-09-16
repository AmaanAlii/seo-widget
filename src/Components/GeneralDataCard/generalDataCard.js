import React from "react";
import "./generalDataCard.css";

function GeneralDataCard({ heading, score }) {
  return (
    <div className="general-data-card">
      <div className="general-data-score">
        <strong>{score}</strong>
      </div>
      <div className="general-data-heading">
        <strong>{heading}</strong>
      </div>
    </div>
  );
}

export default GeneralDataCard;
