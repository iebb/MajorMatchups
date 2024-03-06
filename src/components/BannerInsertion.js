import React, {useContext} from 'react';
import {Helmet} from "react-helmet";
import {SettingsCtx} from "../libs/Context";

function Title({ title, subtitle ="", isMajor = false, sponsorLess=false, classNames = "", extras=[] }) {
  const ctx = useContext(SettingsCtx);
  // const sponsorLess = true;

  const sponsorLogo = ctx.ad?.branding;
  const defaultSponsorLogo = "https://img.majors.im/sponsors/rio_sb.svg";
  const defaultSponsorLink = "https://redirect.badasstemple.eu/br7lju";

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

            (sponsorLogo) ? (
              <div className="adv-logo-inline">
                <div className="adv-logo-inline-left">
                  <a className="hyperlink" href={ctx.ad.sponsorLink}>
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
                <p className="text-xl mt-2 text-nekoko-700">
                  Sponsored by <a className="hyperlink" href={defaultSponsorLink}>
                  <img src={defaultSponsorLogo} alt={ctx.adProvider}
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
              Place and Track Pick'ems: <a className="hyperlink" href="https://pick.majors.im/" target="_blank">pick.majors.im</a>
            </p>
          )
        }
        {/*{*/}
        {/*  isMajor && (*/}
        {/*    <p className="text-yellow-500 text-xl my-2">*/}
        {/*      /!* eslint-disable-next-line *!/*/}
        {/*      Wanna know how fucked up everyone's pickems are, and how much chance you have left? <a href="https://pick.majors.im/leaderboard" target="_blank">leaderboard</a>*/}
        {/*    </p>*/}
        {/*  )*/}
        {/*}*/}
        {
          subtitle && (
            <p className="text-light-green-500 text-xl my-2">
              {subtitle}
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
            <a className="hyperlink" href={x.link} key={_idx + "@"}>{x.title}</a>
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
