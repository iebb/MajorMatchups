/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, {useEffect, useState} from 'react';

import {BrowserRouter as Router} from 'react-router-dom';
import GoogleAd from './components/GoogleAd';
import ComplexNavbar from './components/Navbar';
import {SettingsCtx} from './libs/Context';
import Routes from './router';

const BaseAd = {
  banner: "",
  name: "",
  comment: "",
  link: "",
};

export const ResponsiveContainer = ({ children }) => {
  const [ad, setAd] = useState(BaseAd);
  const [adType_, setAdType] = useState(localStorage.adtype || "none");

  const adType = "google";

  const Footer = () => (
    <div className="m-2">
      <p className="text-lg pt-2">
        by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2023 &middot; Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
      </p>
      {ad.comment ? <p>{ad.comment}</p> : ""}
    </div>
  )

  useEffect(() => {
    try {
      setAd({
        ...BaseAd,
        ...JSON.parse(localStorage.config)
      });
    } catch {
    }
    fetch('/config')
      .then((resp) => resp.json())
      .then((resp) => {
        setAdType(resp.adtype);
        setAd(resp);
        localStorage.config = JSON.stringify(resp);
        localStorage.adtype = resp.adtype;
      });
  }, []);
  return (
    <SettingsCtx.Provider value={{
      adType, ad, adProvider: ad.name || "",
    }}>
      <ComplexNavbar />
      <div className="outer">
        {children}
        <div dangerouslySetInnerHTML={{ __html: `<script defer data-domain="majors.im" src="/js/script.js"></script>` }} />
        {
          /*(localStorage.disableAds !== "true") && */(adType === "google") && (
            <GoogleAd
              style={{ display: 'block' }}
              googleAdId="ca-pub-3253159471656308"
              format="autorelaxed"
              slot="1398483557"
            />
          )
        }
      </div>
      {
        (adType !== "custom") ? (
          <Footer />
        ) : (
          <>
            <div className="dynamic-padding" />
            <div className="bottom-desktop">
              <a href={ad.link} className="adv-img">
                <img className="adv-img-img" src={ad.banner} alt={ad.name} />
              </a>
              <div style={{ flex: 1 }} className="hide-on-mobile">
                <Footer />
              </div>
              <a href={ad.link} className="alt-ads adv-img">
                <img className="adv-img-img" src={ad.banner} alt={ad.name} />
              </a>
            </div>
          </>
        )
      }
    </SettingsCtx.Provider>
  );
}

const HomepageLayout = () => (

  <Router>
    <ResponsiveContainer>
      <Routes />
    </ResponsiveContainer>
  </Router>
);

export default HomepageLayout;
