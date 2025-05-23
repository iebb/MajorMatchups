import React from 'react';
import { Helmet } from 'react-helmet';

function Title({ title, subtitle ="", isMajor = false, sponsorLess=false, classNames = "", extras=[] }) {

  const ad = localStorage.ads || window.config || {};
  const ctx = {adType: ad.adtype, ad, adProvider: ad.name || ""};

  const sponsorLogo = ad?.branding;
  const defaultSponsorLogo = "https://img.majors.im/sponsors/rio_sb.svg";
  const defaultSponsorLink = "https://redirect.badasstemple.eu/br7lju";

  return (
    <div className={classNames + " title-outer-container"}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <div className="title-container">
        {
          (sponsorLess || true) ? (
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
            <>
              <p className="text-yellow-300 text-xl mt-2">
                {/* eslint-disable-next-line */}
                Place and Track Pick'ems: <a className="hyperlink" href="https://pick.majors.im/"
                                             target="_blank">pick.majors.im</a>
              </p>
              {/*<p className="text-yellow-500 text-xl my-2">*/}
              {/*  /!* eslint-disable-next-line *!/*/}
              {/*  Compare yourself against others in <a className="hyperlink" href="https://pick.majors.im/leaderboard" target="_blank">Pick'em leaderboard</a>*/}
              {/*</p>*/}
            </>
          )
        }
        {
          subtitle && (
            <p className="text-light-green-500 text-xl my-2">
              {subtitle}
            </p>
          )
        }
      </div>
      <p>
        {
          extras.map((x, _idx) => <>
            <a className="hyperlink" href={x.link} key={_idx + "@"}>{x.title}</a>
          </>)
        }
      </p>
      <p className="text-blue-500 text-lg my-1">
        Global eSIM with +372 Phone Number: <a className="hyperlink" href="https://esim.gg/" target="_blank">esim.gg</a> - data package as low as €0.8/GB available in Europe, US and China.
      </p>
      <p className="text-blue-500 text-lg my-1">
        <a className='hyperlink' href='https://app.infini.money/signup?ref=PF189KQ' target='_blank'>Infini Crypto Card</a> - spending USDC/USDT as low as 0.1% fee.
      </p>
    </div>
  );
}

Title.defaultProps = {
  classNames: '',
  timeout: 200,
};
export default Title;
