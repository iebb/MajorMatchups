/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import {createMedia} from '@artsy/fresnel';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Container, Icon, Menu, Segment, Sidebar, Visibility} from 'semantic-ui-react';
import Routes from './router';

import './main.css';
import {BrowserRouter as Router, NavLink} from 'react-router-dom';
import advertisement3 from "./images/sponsor/banner-pt-3.png";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const Footer = () => (
  <div style={{ margin: 10, userSelect: 'text' }}>
    <p style={{ fontSize: 15, marginTop: 24 }}>
      <br/>
      <a href="https://discord.gg/KYNbRYrZGe">
        feedback(discord)
      </a>
      <span style={{ margin: 10 }}>·</span>
      <a href="https://twitter.com/CyberHono">
        twitter
      </a>
      <br/>
      by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2022 | Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
      <br/>Email: ieb &lt;at&gt; outlook.my | Discord: ieb#4368
    </p>
    <div className="dynamic-padding" />
  </div>
)

const Editions = [
  ['23 Paris RMR Qual', '/23qual_paris'],
  ['22 Rio', '/22rio'],
  ['22 Rio RMR', '/22rmr_rio'],
  ['22 Antwerp', '/22antwerp'],
  ['22 Antwerp RMR', '/22rmr_antwerp'],
  ['21 Stockholm', '/21stockholm'],
  ['19 Berlin', '/19berlin'],
  ['19 Katowice', '/19katowice'],
];

const redirectLink = "https://cutt.ly/eBejmLo";



class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <div>
        <Media greaterThan="mobile">
          <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
            <Segment inverted textAlign="center" vertical>
              <Menu fixed={fixed ? 'top' : null} inverted pointing={!fixed} secondary={!fixed} size="large">
                <Container>
                  <Menu.Item header style={{ fontSize: "150%", padding: 5, paddingRight: 20, fontFamily: 'Inter', fontWeight: 600 }}>
                    MajorS.im <sub style={{ color: '#33ff33', margin: 3 }}>BR</sub>
                  </Menu.Item>
                  {Editions.map((edition) => (
                    <NavLink as="a" className="item" key={edition[1]} to={edition[1]}>
                      {edition[0]}
                    </NavLink>
                  ))}
                </Container>
              </Menu>
            </Segment>
          </Visibility>
          {children}
          <div style={{ padding: 80 }} />
        </Media>
        <div className="bottom-desktop">
          <div style={{ margin: "0 auto", flexDirection: "row", width: "100%", flexWrap: "nowrap", display: "flex" }}>
            <a href={redirectLink} className="ads-img">
              <img src={advertisement3} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 150 }}/>
            </a>
            <div style={{ flex: 1 }}>
              <Footer />
            </div>
            <a href={redirectLink} className="alt-ads ads-img">
              <img src={advertisement3} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 150 }}/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

class MobileContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  render() {
    const { children } = this.props;
    const { sidebarOpened } = this.state;

    return (
      <div>
        <Media as={Sidebar.Pushable} at="mobile">
          <Sidebar.Pushable>
            <Sidebar
              as={Menu}
              animation="overlay"
              inverted
              onHide={this.handleSidebarHide}
              vertical
              visible={sidebarOpened}
            >

              {Editions.map((edition) => (
                <NavLink as="a" className="item" key={edition[1]} to={edition[1]}>
                  {edition[0]}
                </NavLink>
              ))}
            </Sidebar>

            <Sidebar.Pusher dimmed={sidebarOpened}>
              <Segment inverted textAlign="center" vertical>
                <Container>
                  <Menu inverted pointing secondary size="large">
                    <Menu.Item onClick={this.handleToggle}>
                      <Icon name="sidebar" />
                    </Menu.Item>
                  </Menu>
                </Container>
              </Segment>

              {children}
              <Footer />

            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </Media>
        <div className="bottom-mobile">
          <div style={{ margin: "0 auto", flexDirection: "row", width: "100%", flexWrap: "nowrap", display: "flex" }}>
            <a href={redirectLink} style={{ flex: 1, display: "inline-block" }}>
              <img src={advertisement3} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 150 }}/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const ResponsiveContainer = ({ children }) => (
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
);

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const HomepageLayout = () => (
  <Router>
    <ResponsiveContainer>
      <Routes />
    </ResponsiveContainer>
  </Router>
);

export default HomepageLayout;
