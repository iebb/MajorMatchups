import React, {useContext} from 'react';
import sponsorLogo from "../images/sponsor/rio_sb.svg";
import {SettingsCtx} from "./Context";

function Title({ title, classNames }) {
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
        <h3 style={{color: 'yellow'}}>
          {/* eslint-disable-next-line */}
          Place and Track Pick'ems: <a href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
        </h3>
      </div>
      <p>
        <a href="https://counter-strike.net/csgo_major_supplemental_rulebook/#Final-Rankings-Major">
          rulebook
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
      </p>
    </div>
  );
}

Title.defaultProps = {
  classNames: '',
  timeout: 200,
};
export default Title;
