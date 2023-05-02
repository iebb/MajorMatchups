/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, { useEffect, useState } from 'react';
import ComplexNavbar from './components/Navbar';
import Routes from './router';

import { BrowserRouter as Router } from 'react-router-dom';
import GoogleAd from './components/GoogleAd';
import { SettingsCtx } from './libs/Context';

const Footer = () => (
  <div style={{ margin: 10, userSelect: 'text' }}>
    <p style={{ fontSize: 15, marginTop: 0 }}>
      by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2023 | Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
      <br/><a href="https://discord.gg/KYNbRYrZGe">
        <img src="https://i.postimg.cc/Fzj7T05w/discord.png" alt="discord" style={{ height: 50, display: "inline-block" }}/>
      </a>
    </p>
  </div>
)

const BaseAd = {
  banner: "",
  name: "",
  link: "",
};

export const ResponsiveContainer = ({ children }) => {
  const [ad, setAd] = useState(BaseAd);
  const [adType, setAdType] = useState(localStorage.adtype || "none");

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
          (adType === "google") && (localStorage.disableAds !== "true") && (
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
        (adType !== "custom") && (localStorage.disableAds === "true") ? (
          <Footer />
        ) : (
          <div className="bottom-desktop">
            <div className="dynamic-padding" />
            {
              adType === "custom" ? (
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name} />
                </a>
              ) : adType === "google" ? (
                <div className="adv-img google-adv-img">
                  <GoogleAd
                    style={{ display: 'block', width: 768 }}
                    googleAdId="ca-pub-3253159471656308"
                    format="horizontal"
                    slot="8397184946"
                  />
                </div>
              ) : null
            }
            <div style={{ flex: 1 }} className="hide-on-mobile">
              <Footer />
            </div>
            {
              adType === "custom" ? (
                <a href={ad.link} className="alt-ads adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name} />
                </a>
              ) : adType === "google" ? (
                <div className="alt-ads adv-img google-adv-img">
                  <GoogleAd
                    style={{ display: 'block' }}
                    googleAdId="ca-pub-3253159471656308"
                    format="horizontal"
                    slot="8397184946"
                  />
                </div>
              ) : null
            }
          </div>
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
