import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Berlin2019 from './container/Berlin2019';
import Stockholm2021 from './container/Stockholm2021';
import Katowice2019 from './container/Katowice2019';
import Antwerp2022RMR from "./container/Antwerp2022RMR";
import Playground from './container/Playground';

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
      <Route path="/playground">
        <Playground />
      </Route>
      <Route path="/">
        <Redirect to="/22rmr_antwerp" />
      </Route>
    </Switch>
  );
}
