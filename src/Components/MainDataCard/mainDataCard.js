import React from "react";
import "./mainDataCard.css";

function MainDataCard({ heading, score }) {
  return (
    <div className="main-data-card">
      <div className="main-data-score">
        <strong>{score}</strong>
      </div>
      <div className="main-data-heading">
        <strong>{heading}</strong>
      </div>
    </div>
  );
}

export default MainDataCard;
