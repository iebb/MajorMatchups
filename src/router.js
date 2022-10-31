import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Berlin2019 from './container/Berlin2019';
import Stockholm2021 from './container/Stockholm2021';
import Katowice2019 from './container/Katowice2019';
import Antwerp2022RMR from "./container/Antwerp2022RMR";
import Antwerp2022 from "./container/Antwerp2022";
import Rio2022RMR from "./container/Rio2022RMR";
import Rio2022Provisional from "./container/Rio2022Provisional";
import Rio2022 from "./container/Rio2022";

export default function Routes() {
  return (
    <Switch>
      <Route path="/19katowice">
        <Katowice2019 />
      </Route>
      <Route path="/19berlin">
        <Berlin2019 />
      </Route>
      <Route path="/21stockholm">
        <Stockholm2021 />
      </Route>
      <Route path="/22rmr_antwerp">
        <Antwerp2022RMR />
      </Route>
      <Route path="/22antwerp">
        <Antwerp2022 />
      </Route>
      <Route path="/22rmr_rio">
        <Rio2022RMR />
      </Route>
      <Route path="/22rio">
        <Rio2022 />
      </Route>
      <Route path="/">
        <Redirect to="/22rio" />
      </Route>
    </Switch>
  );
}
