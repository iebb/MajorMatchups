/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, {useEffect, useState} from 'react';

import {BrowserRouter as Router} from 'react-router-dom';
import GoogleAd from './components/GoogleAd';
import ComplexNavbar from './components/Navbar';
import {fetchPrefix} from "./libs/common/common";
import {SettingsCtx} from './libs/Context';
import Routes from './router';
import { ThemeProvider } from "@material-tailwind/react";

const BaseAd = {
  banner: "",
  name: "",
  comment: "",
  link: "",
};

export const ResponsiveContainer = ({ children }) => {
  const [ad, setAd] = useState(BaseAd);
  const [adType, setAdType] = useState(localStorage.adtype || "none");

  // const adType = "google";

  const Footer = () => (
    <div className="m-2">
      <p className="text-lg pt-2">
        by ieb (<a className="hyperlink" href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2024 &middot; Give <a className="hyperlink" href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
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

    if (process.env.NODE_ENV !== "development") {
      fetch(fetchPrefix + '/config')
        .then((resp) => resp.json())
        .then((resp) => {
          setAdType(resp.adtype);
          setAd(resp);
          localStorage.config = JSON.stringify(resp);
          localStorage.adtype = resp.adtype;
        });
    }
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
          <div>
            <Footer />
            <div className="dynamic-padding" />
            <div className="bottom-desktop">
              <div className="adv-container flex overflow-hidden min-w-full">
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
                <a href={ad.link} className="adv-img">
                  <img className="adv-img-img" src={ad.banner} alt={ad.name}/>
                </a>
              </div>
            </div>
          </div>
        )
      }
    </SettingsCtx.Provider>
  );
}


const customTheme = {
  tabsHeader: {
    defaultProps: {
      className: "",
    },
    styles: {
      base: {
        bg: "bg-nekoko-700",
      },
    },
  },
  tab: {
    defaultProps: {
      className: "",
      activeClassName: "",
      disabled: false,
    },
    styles: {
      base: {
        tab: {
          initial: {
            color: "text-nekoko-100",
          },
        },
        indicator: {
          bg: "bg-nekoko-950",
        },
      },
    },
  },
  popover: {
    styles: {
      base: {
        bg: "bg-nekoko-950",
        border: "border border-nekoko-950",
      }
    }
  },
  select: {
    styles: {
      base: {
        select: {
          color: "text-nekoko-200",
        },
        option: {
          initial: {
            background: "hover:bg-nekoko-950 focus:bg-nekoko-950",
            opacity: "hover:bg-opacity-80 focus:bg-opacity-80",
            color: "hover:text-nekoko-100 focus:text-nekoko-100",
          },
          active: {
            bg: "bg-nekoko-950 bg-opacity-80",
            color: "text-nekoko-100",
          },
          disabled: {
            opacity: "opacity-50",
            cursor: "cursor-not-allowed",
            userSelect: "select-none",
            pointerEvents: "pointer-events-none",
          },
        },
        menu: {
          border: "border border-nekoko-950",
          bg: "bg-nekoko-900",
          color: "text-nekoko-200",
        }
      }
    }
  }
}
const HomepageLayout = () => (

  <Router>
    <ThemeProvider value={customTheme}>
    <ResponsiveContainer>
      <Routes />
    </ResponsiveContainer>
    </ThemeProvider>
  </Router>
);

export default HomepageLayout;
