/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { ThemeProvider } from '@material-tailwind/react';
import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';
import { BottomAdLayer } from './components/Ads/AdLayer';
import { SiderAd } from './components/Ads/SiderAd';
import ComplexNavbar from './components/Navbar';
import Routes from './router';


export const ResponsiveContainer = ({ children }) => {

  const Footer = () => (
    <div className="m-2">
      <p className="text-lg pt-2">
        by ieb (<a className="hyperlink" href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2024 &middot; Give <a className="hyperlink" href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
      </p>
    </div>
  )
  const ad = localStorage.ads || window.config || {}

  return (
    <div>
      <ComplexNavbar/>

      <div className="outer">
        <SiderAd slot={1} />
        <div className={`content-container ${ad.siders ? "with-sider" : "with-sider"}`}>
          {children}
        </div>
        <SiderAd slot={2} />
        <div dangerouslySetInnerHTML={{__html: `<script defer data-domain="majors.im" src="https://analytics.nekoko.it/js/script.js"></script>`}}/>
      </div>
      <div>
        <Footer />
        <div className="dynamic-padding"/>
      </div>
      <BottomAdLayer />
    </div>
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
