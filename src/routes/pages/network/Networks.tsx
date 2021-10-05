import { Container } from "@mui/material";
import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { NetworkCreate } from "./NetworkCreate";
import { NetworkDetails } from "./NetworkDetails";
import { useTranslation } from "react-i18next";
import { NetworkTable } from "./NetworkTable";
import { useLinkBreadcrumb } from "../../../components/PathBreadcrumbs";

export const Networks: React.FC = () => {
  const { path } = useRouteMatch();
  const { t } = useTranslation();

  useLinkBreadcrumb({
    title: t("Networks")
  })

  return (
    <Container>
      <Switch>
        <Route exact path={path}>
          <h2>{t("Networks")}</h2>
          <NetworkTable />
        </Route>
        <Route path={`${path}/create`}>
          <NetworkCreate />
        </Route>
        <Route path={`${path}/:networkId`}>
          <NetworkDetails />
        </Route>
      </Switch>
    </Container>
  );
};
