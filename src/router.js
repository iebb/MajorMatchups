import React from 'react';
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Antwerp2022 from "./container/CSGO/Antwerp2022";
import Antwerp2022RMR from "./container/CSGO/Antwerp2022RMR";
import Berlin2019 from './container/CSGO/Berlin2019';
import Katowice2019 from './container/CSGO/Katowice2019';
import Paris2023 from "./container/CSGO/Paris2023";
import Paris2023Qual from "./container/CSGO/Paris2023Qual";
import Paris2023RMR from "./container/CSGO/Paris2023RMR";
import Rio2022 from "./container/CSGO/Rio2022";
import Rio2022RMR from "./container/CSGO/Rio2022RMR";
import Stockholm2021 from './container/CSGO/Stockholm2021';
import R6CPH23 from "./container/RainbowSix/R6CPH23";

export default function Routes() {
  const h = useHistory();
  return (
    <Switch>
      <Route path="/19katowice">
        <Katowice2019 history={h} />
      </Route>
      <Route path="/19berlin">
        <Berlin2019 history={h} />
      </Route>
      <Route path="/21stockholm">
        <Stockholm2021 history={h} />
      </Route>
      <Route path="/22rmr_antwerp">
        <Antwerp2022RMR history={h} />
      </Route>
      <Route path="/22antwerp">
        <Antwerp2022 history={h} />
      </Route>
      <Route path="/22rmr_rio">
        <Rio2022RMR history={h} />
      </Route>
      <Route path="/22rio">
        <Rio2022 history={h} />
      </Route>
      <Route path="/23qual_paris">
        <Paris2023Qual history={h} />
      </Route>
      <Route path="/23rmr_paris">
        <Paris2023RMR history={h} />
      </Route>
      <Route path="/23paris">
        <Paris2023 history={h} />
      </Route>
      <Route path="/r6_23majorcph">
        <R6CPH23 history={h} />
      </Route>
      <Route path="/">
        <Redirect to="/23paris" />
      </Route>
    </Switch>
  );
}
