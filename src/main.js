/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container, Icon, Menu, Segment, Sidebar, Visibility } from 'semantic-ui-react';
import Routes from './router';

import './main.css';
import { BrowserRouter as Router, NavLink } from 'react-router-dom';
import KofiButton from "kofi-button";

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const Footer = () => (
  <div style={{ margin: 50, userSelect: 'text' }}>
    <KofiButton kofiID='A0A8ERCTF' title="Support Me on Ko-fi" color='#29abe0' style={{ display: "none" }} />
    <p style={{ margin: "2em" }}>
      by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-22 &middot; Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a> &middot; Email: ieb &lt;at&gt; outlook.my | Discord: ieb#4368
    </p>
  </div>
)

const Editions = [
  ['22 Rio', '/22rio'],
  ['22 Rio RMR', '/22rmr_rio'],
  ['22 Antwerp', '/22antwerp'],
  ['22 Antwerp RMR', '/22rmr_antwerp'],
  ['21 Stockholm', '/21stockholm'],
  ['19 Berlin', '/19berlin'],
  ['19 Katowice', '/19katowice'],
];

class DesktopContainer extends Component {
  state = {};

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });

  render() {
    const { children } = this.props;
    const { fixed } = this.state;

    return (
      <Media greaterThan="mobile">
        <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
          <Segment inverted textAlign="center" vertical>
            <Menu fixed={fixed ? 'top' : null} inverted pointing={!fixed} secondary={!fixed} size="large">
              <Container>
                <Menu.Item header style={{ fontSize: "150%", padding: 5, paddingRight: 20, fontFamily: 'Inter', fontWeight: 600 }}>
                  MajorS.im
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
        <Footer />
      </Media>
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
