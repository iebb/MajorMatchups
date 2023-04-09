/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import React, {useEffect, useState} from 'react';
import {Container, Dropdown, Icon, Menu, Segment, Sidebar, Visibility} from 'semantic-ui-react';
import Routes from './router';

import './main.css';
import {BrowserRouter as Router, NavLink} from 'react-router-dom';
import GoogleAd from "./libs/GoogleAd";
import {SettingsCtx} from "./libs/Context";


const Editions = [
  ['23 Paris', [
    ['23 Paris [Provisional]', '/23paris'],
    ['23 Paris RMR', '/23rmr_paris'],
    ['23 Paris RMR Closed Qualifier', '/23qual_paris'],
  ]],
  ['22 Rio', [
    ['22 Rio Major', '/22rio'],
    ['22 Rio RMR', '/22rmr_rio'],
  ]],
  ['22 Antwerp', [
    ['22 Antwerp Major', '/22antwerp'],
    ['22 Antwerp RMR', '/22rmr_antwerp'],
  ]],
  ['21 Stockholm', [
    ['21 Stockholm Major', '/21stockholm'],
  ]],
  ['Legacy', [
    ['19 Berlin', '/19berlin'],
    ['19 Katowice', '/19katowice'],
  ]],
];

const Footer = () => (
  <div style={{ margin: 10, userSelect: 'text' }}>
    <p style={{ fontSize: 15, marginTop: 0 }}>
      <a href="https://discord.gg/KYNbRYrZGe">
        feedback(discord)
      </a>
      <span style={{ margin: 10 }}>·</span>
      <a href="https://twitter.com/CyberHono">
        twitter
      </a>
      <br/>
      by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2024 | Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
      <br/>Email: ieb &lt;at&gt; outlook.my | Discord: ieb#4368
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
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const [fixed, setFixed] = useState(false);

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
      <div className="mobile-menu">
        <Sidebar.Pushable>
          <Sidebar
            as={Menu}
            animation="overlay"
            inverted
            onHide={() => setSidebarOpened(false)}
            vertical
            visible={sidebarOpened}
          >
            {Editions.map((edition) => (
              <Dropdown
                className='link item'
                pointing='right'
                direction='left'
                item key={edition[0]} text={edition[0]}>
                <Dropdown.Menu>
                  {
                    edition[1].map(e => (
                      <Dropdown.Item key={e[1]}>
                        <NavLink as="a" className="item" to={e[1]} onClick={() => setSidebarOpened(false)}>
                          {e[0]}
                        </NavLink>
                      </Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            ))}
          </Sidebar>
          <Sidebar.Pusher dimmed={sidebarOpened}>
            <Segment inverted textAlign="center" vertical>
              <Menu inverted pointing secondary size="large">
                <Menu.Item onClick={() => setSidebarOpened(true)}>
                  <Icon name="sidebar" />
                </Menu.Item>
              </Menu>
            </Segment>
            {children}
            <Footer />
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
      <div className="desktop-menu">
        <Visibility once={false} onBottomPassed={() => setFixed(true)} onBottomPassedReverse={() => setFixed(false)}>
          <Segment inverted textAlign="center" vertical>
            <Menu fixed={fixed ? 'top' : null} inverted pointing={!fixed} secondary={!fixed} size="large">
              <Container>
                <Menu.Item header style={{ fontSize: "130%", padding: 5, paddingRight: 20, fontFamily: 'Inter', fontWeight: 600 }}>
                  MajorS.im
                </Menu.Item>
                {Editions.map((edition) => (
                  <Dropdown item key={edition[0]} text={edition[0]}>
                    <Dropdown.Menu>
                      {
                        edition[1].map(e => (
                          <NavLink as="a" className="item" key={e[1]} to={e[1]}>
                            {e[0]}
                          </NavLink>
                        ))
                      }
                    </Dropdown.Menu>
                  </Dropdown>
                ))}

              </Container>
            </Menu>
          </Segment>
        </Visibility>
        {children}
      </div>
      <div dangerouslySetInnerHTML={{ __html: `<script defer data-domain="majors.im" src="/js/script.js"></script>` }} />
      <div className="dynamic-padding" />
      <div className="bottom-desktop">
        {
          adType === "custom" ? (
            <a href={ad.link} className="adv-img">
              <img className="adv-img-img" src={ad.banner} alt={ad.name} />
            </a>
          ) : adType === "google" ? (
            <div className="adv-img">
              <GoogleAd
                style={{ display: 'block', width: 768 }}
                googleAdId="ca-pub-3253159471656308"
                format="horizontal"
                slot="8397184946"
              />
            </div>
          ) : null
        }
        <div style={{ flex: 1 }}>
          <Footer />
        </div>
        {
          adType === "custom" ? (
            <a href={ad.link} className="alt-ads adv-img">
              <img className="adv-img-img" src={ad.banner} alt={ad.name} />
            </a>
          ) : adType === "google" ? (
            <div className="alt-ads adv-img">
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
