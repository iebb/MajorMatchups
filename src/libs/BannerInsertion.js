import React, {useContext} from 'react';
import sponsorLogo from "../images/sponsor/rio_sb.svg";
import {SettingsCtx} from "./Context";

function Title({ title, isMajor = false, classNames = "", extras=[] }) {
  const ctx = useContext(SettingsCtx);

  return (
    <div className={classNames}>
      <div className="title-container">
        {
          ctx.adType === "custom" ? (
            <div className="adv-logo-inline">
              <div className="adv-logo-inline-left">
                <a href="https://redirect.badasstemple.eu/br7lju">
                  <img src={sponsorLogo} alt={ctx.adProvider} />
                </a>
              </div>
              <div className="adv-logo-inline-right">
                <h1 className="title">{title}</h1>
              </div>
            </div>
          ) : (
            <>
              <h1 className="title">{title}</h1>
              <p style={{fontSize: 18, marginTop: -16}}>
                Sponsored by <a href="https://redirect.badasstemple.eu/br7lju">
                <img src={sponsorLogo} alt={ctx.adProvider}
                     style={{maxHeight: 20, marginLeft: 10}}/>
              </a>
              </p>
            </>
          )
        }
        {
          isMajor && (
            <h3 style={{color: 'yellow'}}>
              {/* eslint-disable-next-line */}
              Place and Track Pick'ems: <a href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
            </h3>
          )
        }
      </div>
      <p>
        <a href="https://counter-strike.net/csgo_major_supplemental_rulebook/#Final-Rankings-Major">
          rulebook
        </a>
        <span style={{margin: 10}}>·</span>
        <a href="https://iebb.medium.com/how-to-use-the-matchup-site-in-2022-18366c9e60da">
          tutorial
        </a>
        <span style={{margin: 10}}>·</span>
        <a href="https://discord.gg/KYNbRYrZGe">
          feedback(discord)
        </a>
        <span style={{margin: 10}}>·</span>
        <a href="https://twitter.com/CyberHono">
          twitter
        </a>
        <span style={{margin: 10}}>·</span>
        <a href="https://steamcommunity.com/id/iebbbb">
          steam profile
        </a>
        {
          extras.map((x, _idx) => <>
            <span style={{margin: 10}} key={_idx}>·</span>
            <a href={x.link} key={_idx + "@"}>{x.title}</a>
          </>)
        }
      </p>
    </div>
  );
}

Title.defaultProps = {
  classNames: '',
  timeout: 200,
};
export default Title;
