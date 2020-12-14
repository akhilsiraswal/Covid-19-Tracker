import React from "react";
import { Typography, Card, CardContent } from "@material-ui/core";
function InfoBox({ title, cases, total }) {
  return (
    <Card>
      <CardContent>
        <Typography color="textSecondary" className="infoBox__title">
          {title}
        </Typography>
        <h2 className="infoBox__cases"> {cases}</h2>

        <Typography color="textSecondary" className="infoBox__total">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
