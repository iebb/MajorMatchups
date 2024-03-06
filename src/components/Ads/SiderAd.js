import React from "react";

export const SiderAd = ({ slot = 1 }) => {
  const ad = window.config;


  if (ad?.sider?.[slot]) {
    return (
      <div className="siderad-container">
        <div className="sider-fsc-container adv-vert flex overflow-hidden min-w-full">
          <a href={ad.sider[slot].link} className="adv-img">
            <img className="adv-img-vert" src={ad.sider[slot].img} alt={ad.sider[slot].name}/>
          </a>
        </div>
      </div>
    );
  }

  return null;
}
