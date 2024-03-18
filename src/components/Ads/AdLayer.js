import React from "react";
import GoogleAd from "./GoogleAd";

export const BottomAdLayer = () => {
  const ad = localStorage.ads || window.config;

  //
  // if (ad.adtype === "google") {
  //   return (
  //     <div className="bottom-desktop" style={{ maxHeight: 93 }}>
  //       <GoogleAd
  //         style={{display: 'block'}}
  //         googleAdId="ca-pub-3253159471656308"
  //         format="autorelaxed"
  //         slot="1398483557"
  //       />
  //     </div>
  //   )
  // }


  if (ad.adtype === "custom") {
    return (
      <div className="bottom-desktop">
        <a href={ad.link}>
          <div className="adv-container majorsim-ac overflow-hidden min-w-full" style={{
            backgroundImage: `url(${ad.banner})`
          }}>
          </div>
        </a>
      </div>
    )

  }

  return null;
}
