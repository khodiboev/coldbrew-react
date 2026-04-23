import React from "react";

export default function Advertisement() {
  return (
    <div className="ads-restaurant-frame">
      <div className="ads-overlay" />
      <video
        className="ads-video"
        autoPlay={true}
        loop
        muted
        playsInline
      >
        <source type="video/mp4" src="/video/coffee.mp4" />
      </video>
      <div className="ads-content">
        <div className="ads-tag">☕ Experience</div>
        <div className="ads-title">Life's Too Short<br />for Bad Coffee</div>
        <div className="ads-subtitle">Watch how we craft every cup with passion</div>
      </div>
    </div>
  );
}