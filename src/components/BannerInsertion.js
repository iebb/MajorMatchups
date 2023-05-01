import React, {useContext} from 'react';
import {Helmet} from "react-helmet";
import sponsorLogo from "../images/sponsor/rio_sb.svg";
import {SettingsCtx} from "../libs/Context";

function Title({ title, isMajor = false, sponsorLess=false, classNames = "", extras=[] }) {
  const ctx = useContext(SettingsCtx);

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
                <p style={{fontSize: 18, marginTop: 16}}>
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
            <h3 style={{color: 'yellow'}}>
              {/* eslint-disable-next-line */}
              Place and Track Pick'ems: <a href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
            </h3>
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
