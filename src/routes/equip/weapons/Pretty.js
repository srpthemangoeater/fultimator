import React, { useEffect, createRef } from "react";
import {
  Card,
  Grid,
  Stack,
  Typography,
  useTheme,
  ThemeProvider,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowDownward from "@mui/icons-material/ArrowDownward";
import ReactMarkdown from "react-markdown";
import attributes from "../../../libs/attributes";
import types from "../../../libs/types";
import { OpenBracket, CloseBracket } from "../../../components/Bracket";
import Diamond from "../../../components/Diamond";

import { createFileName, useScreenshot } from "use-react-screenshot";
import { Download, Code } from "@mui/icons-material";
import EditableImage from "../../../components/EditableImage";

function Pretty({ base, custom }) {
  const theme = useTheme();
  console.debug("base", base);
  console.debug("custom", custom);
  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <PrettySingle weapon={base} />
        <Typography textAlign="center">
          <ArrowDownward />
        </Typography>
        <PrettySingle weapon={custom} showActions />
      </div>
    </ThemeProvider>
  );
}

function PrettySingle({ weapon, showActions }) {
  const ref = createRef(null);
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;
  const ternary = theme.palette.ternary.main;

  const [image, takeScreenShot] = useScreenshot();

  function downloadFile(content, fileName, contentType) {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  const getJSON = () => {
    const jsonData = JSON.stringify(weapon);
    const fileName = `${weapon.name.replace(/\s/g, "_").toLowerCase()}.json`;
    downloadFile(jsonData, fileName, "text/plain");
  };

  const download = (image, { name = "img", extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();
  };

  const getImage = () => {
    takeScreenShot(ref.current);
  };

  useEffect(() => {
    if (image) {
      download(image, { name: weapon.name, extension: "png" });
    }
  }, [image, weapon.name]);

  return (
    <>
      <Card>
        <div
          ref={ref}
          style={{ backgroundColor: "white", background: "white" }}
        >
          <Stack>
            <Grid
              container
              justifyContent="space-between"
              alignItems="center"
              sx={{
                p: 1,
                background: `${primary}`,
                color: "#ffffff",
                "& .MuiTypography-root": {
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                },
              }}
            >
              <Grid item xs={1}></Grid>
              <Grid item xs={3}>
                <Typography variant="h4" textAlign="left">
                  Weapon
                </Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography variant="h4" textAlign="center">
                  Cost
                </Typography>
              </Grid>
              <Grid item xs={3}>
                <Typography variant="h4" textAlign="center">
                  Accuracy
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="h4" textAlign="center">
                  Damage
                </Typography>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item
                    sx={{
                      flex: "0 0 70px",
                      minWidth: "70px",
                      minHeight: "70px",
                      background: `white`,
                    }}>
                <EditableImage size={70}/>
              </Grid>
              
              
              <Grid container direction="column" item xs>
                {/* First Row */}
                <Grid
                  container
                  justifyContent="space-between"
                  item
                  sx={{
                    background: `linear-gradient(to right, ${ternary}, transparent)`,
                    borderBottom: `1px solid ${secondary}`,
                    padding: "5px",
                  }}
                >
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">{weapon.name}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Typography textAlign="center">{`${weapon.cost}z`}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontWeight="bold" textAlign="center">
                      <OpenBracket />
                      {`${attributes[weapon.att1].shortcaps} + ${
                        attributes[weapon.att2].shortcaps
                      }`}
                      <CloseBracket />
                      {weapon.prec !== 0 ? `+${weapon.prec}` : ""}
                    </Typography>
                  </Grid>

                  <Grid item xs={4}>
                    <Typography fontWeight="bold" textAlign="center">
                      <OpenBracket />
                      HR + {weapon.damage}
                      <CloseBracket />
                      {types[weapon.type].long}
                    </Typography>
                  </Grid>
                </Grid>

                {/* Second Row */}
                <Grid
                  container
                  justifyContent="flex-end"
                  sx={{
                    background: "transparent",
                    borderBottom: `1px solid ${secondary}`,
                    padding: "5px",
                  }}
                >
                  <Grid item xs={3}>
                    <Typography fontWeight="bold">{weapon.category}</Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Diamond color={primary} />
                  </Grid>
                  <Grid item xs={4}>
                    <Typography textAlign="center">
                      {weapon.hands === 1 && "One-handed"}
                      {weapon.hands === 2 && "Two-handed"}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <Diamond color="{primary}" />
                  </Grid>
                  <Grid item xs={3}>
                    <Typography textAlign="center">
                      {weapon.melee && "Melee"}
                      {weapon.ranged && "Ranged"}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Typography
              sx={{
                background: "transparent",
                borderBottom: `1px solid ${secondary}`,
                px: 1,
                py: 1,
              }}
            >
              {!weapon.quality && "No Qualities"}{" "}
              <ReactMarkdown
                allowedElements={["strong"]}
                unwrapDisallowed={true}
              >
                {weapon.quality}
              </ReactMarkdown>
            </Typography>
          </Stack>
        </div>
      </Card>
      {showActions && (
        <div style={{ display: "flex" }}>
          <Tooltip title="Download">
            <IconButton onClick={getImage}>
              <Download />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export JSON">
            <IconButton onClick={getJSON}>
              <Code />
            </IconButton>
          </Tooltip>
        </div>
      )}
    </>
  );
}

export default Pretty;
