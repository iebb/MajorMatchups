/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import {createMedia} from '@artsy/fresnel';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {Container, Dropdown, Icon, Menu, Segment, Sidebar, Visibility} from 'semantic-ui-react';
import Routes from './router';

import './main.css';
import {BrowserRouter as Router, NavLink} from 'react-router-dom';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});


const Editions = [
  ['23 Paris', [
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


class ResponsiveContainer extends Component {
  state = {};

  handleSidebarHide = () => this.setState({ sidebarOpened: false });

  handleToggle = () => this.setState({ sidebarOpened: true });

  hideFixedMenu = () => this.setState({ fixed: false });
  showFixedMenu = () => this.setState({ fixed: true });


  componentDidMount() {

    this.setState({
      banner: "https://meta.badasstemple.eu/uploads/upload_1677858127.jpg",
      country: "BR",
      link: "",
      regions: "",
      adtype: "custom",
    });

    // fetch('/config')
    //   .then((resp) => resp.json())
    //   .then((resp) => {
    //     this.setState({
    //       banner: resp.banner,
    //       country: resp.country,
    //       link: resp.link,
    //       regions: resp.regions,
    //       adtype: resp.adtype,
    //     })
    //   });
  }



  Footer = () => (
    <div style={{ margin: 10, userSelect: 'text' }}>
      <p style={{ fontSize: 15, marginTop: 0 }}>
        <a href="https://discord.gg/KYNbRYrZGe">
          feedback(discord)
        </a>
        <span style={{ margin: 10 }}>·</span>
        <a href="https://twitter.com/CyberHono">
          twitter
        </a>
        {
          this.state.adtype === "google" && (
            <>
              <span style={{ margin: 10 }}>·</span>
              <a onClick={() => {
                if (localStorage.dontDisplayAds) {
                  delete localStorage.dontDisplayAds
                } else {
                  alert("feel free to turn it back on when you are feeling good and wants to support this site. refresh to see the changes.")
                  localStorage.dontDisplayAds = "1"
                }
              }}>
                { localStorage.dontDisplayAds ? "enable" : "disable" } ads
              </a>
            </>
          )
        }
        <br/>
        by ieb (<a href="https://twitter.com/CyberHono">@CyberHono</a>) © 2019-2024 | Give <a href="https://steamcommunity.com/id/iebbbb/">Steam award</a>
        <br/>Email: ieb &lt;at&gt; outlook.my | Discord: ieb#4368
      </p>
    </div>
  )

  render() {
    const { children } = this.props;
    const { sidebarOpened, fixed, country } = this.state;

    const Footer = this.Footer;
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
                <Dropdown
                  className='link item'
                  pointing='right'
                  direction='left'
                  item key={edition[0]} text={edition[0]}>
                  <Dropdown.Menu>
                    {
                      edition[1].map(e => (
                        <Dropdown.Item key={e[1]}>
                          <NavLink as="a" className="item" to={e[1]} onClick={this.handleSidebarHide}>
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
        <Media greaterThan="mobile">
          <Visibility once={false} onBottomPassed={this.showFixedMenu} onBottomPassedReverse={this.hideFixedMenu}>
            <Segment inverted textAlign="center" vertical>
              <Menu fixed={fixed ? 'top' : null} inverted pointing={!fixed} secondary={!fixed} size="large">
                <Container>
                  <Menu.Item header style={{ fontSize: "150%", padding: 5, paddingRight: 20, fontFamily: 'Inter', fontWeight: 600 }}>
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
        </Media>
        <div dangerouslySetInnerHTML={{ __html: `<script defer data-domain="majors.im" src="/js/script.js"></script>` }} />
        <div className="dynamic-padding" />
        <div className="bottom-desktop">
          {
            this.state.adtype === "custom" ? (
              <a href={this.state.link} className="ads-img">
                <img src={this.state.banner} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 150 }}/>
              </a>
            ) : this.state.adtype === "google" && (localStorage.dontDisplayAds !== "1") ? (
              <div className="ads-img">
                <GoogleAds
                  client="ca-pub-3253159471656308"
                  slot="8397184946"
                  style={{ display: 'inline-block', width: '100%', }}
                />
              </div>
            ) : null
          }
          <div style={{ flex: 1 }}>
            <Footer />
          </div>
          {
            this.state.adtype === "custom" ? (
              <a href={this.state.link} className="alt-ads ads-img">
                <img src={this.state.banner} alt="Sportsbet.io" style={{ maxWidth: "100%", maxHeight: 150 }}/>
              </a>
            ) : this.state.adtype === "google" && (localStorage.dontDisplayAds !== "1") ? (
              <div className="alt-ads ads-img">
                <GoogleAds
                  client="ca-pub-3253159471656308"
                  slot="8186529436"
                  style={{ display: 'inline-block', width: '100%', }}
                />
              </div>
            ) : null
          }
        </div>
      </div>
    );
  }
}

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
};

const HomepageLayout = () => (
  <Router>
    <MediaContextProvider>
      <ResponsiveContainer>
        <Routes />
      </ResponsiveContainer>
    </MediaContextProvider>
  </Router>
);

export default HomepageLayout;
