import React, {useContext} from 'react';
import {Helmet} from "react-helmet";
import sponsorLogo from "../images/sponsor/rio_sb.svg";
import {SettingsCtx} from "../libs/Context";

function Title({ title, isMajor = false, _sponsorLess=false, classNames = "", extras=[] }) {
  const ctx = useContext(SettingsCtx);
  const sponsorLess = true;

  return (
    <div className={classNames + " title-outer-container"}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="title-container">
        {
          sponsorLess ? (
            <h1 className="title">{title}</h1>
          ) : (

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
                <p className="text-xl mt-2 text-blue-gray-300">
                  Sponsored by <a href="https://redirect.badasstemple.eu/br7lju">
                  <img src={sponsorLogo} alt={ctx.adProvider}
                       style={{maxHeight: 20, marginLeft: 10, display: "inline-block"}}/>
                </a>
                </p>
              </>
            )
          )
        }
        {
          isMajor && (
            <p className="text-yellow-300 text-xl mt-2">
              {/* eslint-disable-next-line */}
              Place and Track Pick'ems: <a href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
            </p>
          )
        }
        {
          isMajor && (
            <p className="text-yellow-500 text-xl my-2">
              {/* eslint-disable-next-line */}
              Wanna know how fucked up everyone's pickems are, and how much chance you have left? <a href="https://pick.majors.im/leaderboard" target="_blank">leaderboard</a>
            </p>
          )
        }
        {
          // (
          //   <h3>
          //     {/* eslint-disable-next-line */}
          //     <a href="/23paris" target="_blank" style={{color: 'yellow'}}>Provisional Paris Major Matchups Here</a>
          //   </h3>
          // )
        }
      </div>
      <p>
        {
          extras.map((x, _idx) => <>
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
