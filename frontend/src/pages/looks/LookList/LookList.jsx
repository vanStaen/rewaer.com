import React, { useEffect, useState, useRef, useCallback } from "react";
import { observer } from "mobx-react";
import { Col, Row } from "antd";
import { useTranslation } from "react-i18next";

import { looksStore } from "../looksStore";
import { userStore } from "../../../stores/userStore/userStore";
import { LookCard } from "../LookCard/LookCard";
import { LookForm } from "../LookForm/LookForm";
import { ToolBar } from "../../../components/ToolBar/ToolBar";
import { GhostCard } from "../../../components/GhostCard/GhostCard";

export const LookList = observer(() => {
  const containerElement = useRef(null);
  const [missingCardForFullRow, setMissingCardForFullRow] = useState(0);
  const [quickEdit, setQuickEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    looksStore.loadLooks();
    userStore.setMenuSelected("looks");
    userStore.profilSettings &&
      looksStore.setShowPrivate(userStore.profilSettings.displayPrivate);
  }, [looksStore.isOutOfDate, userStore.profilSettings]);

  useEffect(() => {
    calculateMissingCardsForFullRow();
  }, [
    containerElement.current,
    missingCardForFullRow,
    calculateMissingCardsForFullRow,
    looksStore.numberOfPrivateLook,
    looksStore.numberOfArchivedLook,
    looksStore.showPrivate,
    looksStore.looks,
    userStore.profilSettings,
  ]);

  useEffect(() => {
    window.addEventListener("resize", calculateMissingCardsForFullRow);
    window.addEventListener("scroll", scrollEventHandler);
    return () => {
      window.removeEventListener("resize", calculateMissingCardsForFullRow);
      window.removeEventListener("scroll", scrollEventHandler);
    };
  }, []);

  const scrollEventHandler = () => {
    looksStore.setLastKnownScrollPosition(window.scrollY);
  };

  const calculateMissingCardsForFullRow = useCallback(() => {
    const displayArchived = userStore.profilSettings
      ? userStore.profilSettings.displayArchived
      : false;
    const containerWidth =
      containerElement.current === null
        ? 0
        : containerElement.current.offsetWidth;
    const cardWidth = 240;
    const numberPerRow = Math.floor(containerWidth / cardWidth, 1);
    const numberLooks = looksStore.showPrivate
      ? displayArchived
        ? looksStore.looks.length + 1
        : looksStore.looks.length + 1 - looksStore.numberOfArchivedLook
      : displayArchived
      ? looksStore.looks.length + 1 - looksStore.numberOfPrivateLook
      : looksStore.looks.length +
        1 -
        looksStore.numberOfPrivateLook -
        looksStore.numberOfArchivedLook;
    const numberFullRow = Math.floor(numberLooks / numberPerRow);
    const missingCards =
      numberPerRow - (numberLooks - numberFullRow * numberPerRow);
    setMissingCardForFullRow(missingCards === numberPerRow ? 0 : missingCards);
  }, [
    containerElement.current,
    looksStore.showPrivate,
    userStore.profilSettings,
  ]);

  const showDetailView = (look) => {
    looksStore.setSelectedLook(look);
    looksStore.setOriginalScrollPosition(looksStore.lastKnownScrollPosition);
  };

  const lookList = looksStore.looks.map((look) => {
    if (!look.private || looksStore.showPrivate) {
      if (!look.active && !userStore.profilSettings?.displayArchived) {
        return null;
      } else {
        return (
          <Col key={look._id}>
            <LookCard look={look} showDetailView={showDetailView} />
          </Col>
        );
      }
    }
    return null;
  });

  const totalLooks = () => {
    if (userStore.profilSettings.displayArchived) {
      if (looksStore.showPrivate) {
        return looksStore.looks.length;
      } else {
        return looksStore.looks.length - looksStore.numberOfPrivateLook;
      }
    } else {
      if (looksStore.showPrivate) {
        return looksStore.looks.length - looksStore.numberOfArchivedLook;
      } else {
        return (
          looksStore.looks.length -
          looksStore.numberOfArchivedLook -
          looksStore.numberOfPrivateLook
        );
      }
    }
  };

  return (
    <div ref={containerElement} className="looks__container">
      <div className="looks__toolbar">
        <div className="looks__toolbarLeft">
          {totalLooks()}&nbsp;
          {t("menu.looks")}
          {looksStore.numberOfPrivateLook > 0 && (
            <>
              {" "}
              | &nbsp;
              <span
                className="link"
                onClick={() => {
                  looksStore.setShowPrivate(!looksStore.showPrivate);
                }}
              >
                {looksStore.showPrivate
                  ? t("looks.hidePrivateLooks")
                  : t("looks.showPrivateLooks")}
              </span>
            </>
          )}
        </div>
        <div className="looks__toolbarRight">
          <ToolBar
            quickEdit={quickEdit}
            setQuickEdit={setQuickEdit}
            showFilter={showFilter}
            setShowFilter={setShowFilter}
            allowEdit={true}
          />
        </div>
      </div>
      <Row justify={"space-around"}>
        <Col>
          <LookForm />
        </Col>
        {lookList}
        <GhostCard
          numberOfCards={missingCardForFullRow}
          width="240px"
          height="385px"
        />
      </Row>
    </div>
  );
});
