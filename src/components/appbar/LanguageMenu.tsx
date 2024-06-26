import React, { useRef, useState } from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { languageOptions, useTranslate } from "../../translation/translate";

const LanguageMenu = () => {
  const { t } = useTranslate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const selectedLanguage =
    useRef(localStorage.getItem("selectedLanguage")).current ?? "en";

  const handleLanguageChange = async (languageCode: string) => {
    await localStorage.setItem("selectedLanguage", languageCode);

    if (window.location.href.includes("npc-gallery")) {
      if (
        window.confirm(
          t(
            "Switching language will clear out all your unsaved progress, would you like to continue?"
          )
        )
      ) {
        window.location.reload();
      } else return;
    } else {
      window.location.reload();
    }
  };

  return (
    <>
      <MenuItem
        onClick={handleClick}
        aria-label={`${t("Change Language to:", true)} ${getLanguageName(
          selectedLanguage
        )}`}
      >
        <ListItemIcon>
          <LanguageIcon />
        </ListItemIcon>
        <ListItemText
          primary={`${t("Language:", true)} ${getLanguageName(
            selectedLanguage
          )}`}
        />
      </MenuItem>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {languageOptions.map((option) => (
          <MenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const getLanguageName = (languageCode: string): string => {
  switch (languageCode) {
    case "en":
      return "English";
    case "it":
      return "Italiano (Italian)";
    case "es":
      return "Español (Spanish)";
    case "de":
      return "Deutsch (German)";
    case "pl":
      return "Polski (Polish)";
    case "fr":
      return "Française (French)";
    case "pt-BR":
      return "Português (Brasil)";
    default:
      return languageCode;
  }
};

export default LanguageMenu;
