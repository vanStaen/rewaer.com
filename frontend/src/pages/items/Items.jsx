import React, { useEffect, useState, useRef, useCallback } from "react";
import { observer } from "mobx-react";
import { Col, Row, Spin } from "antd";
import { useTranslation } from "react-i18next";
import { MehOutlined } from "@ant-design/icons";

import { itemsStore } from "./itemsStore";
import { userStore } from "../../stores/userStore/userStore"
import { ItemCard } from "./ItemCard/ItemCard";
import { ItemForm } from "./ItemForm/ItemForm";
import { Banner } from "../../components/Banner/Banner";
import { ToolBar } from "../../components/ToolBar/ToolBar";
import { GhostCard } from "../../components/GhostCard/GhostCard";
import { ItemDetail } from "./ItemDetail/ItemDetail";

import "./Items.css";

export const Items = observer(() => {
  const containerElement = useRef(null);
  const [missingCardForFullRow, setMissingCardForFullRow] = useState(0);
  const [quickEdit, setQuickEdit] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    itemsStore.loadItems();
    userStore.profilSettings && setShowPrivate(userStore.profilSettings.displayPrivate);
  }, [
    itemsStore.isOutOfDate,
    userStore.profilSettings
  ]);

  useEffect(() => {
    calculateMissingCardsForFullRow();
    window.addEventListener("resize", calculateMissingCardsForFullRow);
    return () => {
      window.removeEventListener("resize", calculateMissingCardsForFullRow);
    };
  }, [
    containerElement.current,
    missingCardForFullRow,
    calculateMissingCardsForFullRow,
    itemsStore.numberOfPrivateItem,
    itemsStore.numberOfArchivedItem,
    userStore.profilSettings,
    showPrivate
  ]);

  const numberOfPrivateItems = itemsStore.items.filter(item => item.private).length;

  const calculateMissingCardsForFullRow = useCallback(() => {
    const displayArchived = userStore.profilSettings ? userStore.profilSettings.displayArchived : false;
    const containerWidth =
      containerElement.current === null
        ? 0
        : containerElement.current.offsetWidth;
    const cardWidth = 240;
    const numberPerRow = Math.floor(containerWidth / cardWidth, 1);
    const numberItems =
      showPrivate ?
        displayArchived ?
          itemsStore.items.length + 1
          :
          itemsStore.items.length + 1 - itemsStore.numberOfArchivedItem
        :
        displayArchived ?
          itemsStore.items.length + 1 - itemsStore.numberOfPrivateItem
          :
          itemsStore.items.length + 1 - itemsStore.numberOfPrivateItem - itemsStore.numberOfArchivedItem
    const numberFullRow = Math.floor(numberItems / numberPerRow);
    const missingCards =
      numberPerRow - (numberItems - numberFullRow * numberPerRow);
    setMissingCardForFullRow(missingCards === numberPerRow ? 0 : missingCards);
  }, [containerElement.current, showPrivate, userStore.profilSettings]);

  const itemList = itemsStore.items.map((item) => {
    if (!item.private || showPrivate) {
      if (!item.active && !userStore.profilSettings?.displayArchived) {
        return null;
      } else {
        return (
          <Col key={item._id}>
            <ItemCard
              item={item}
              setSelectedItem={setSelectedItem} />
          </Col>
        );
      }
    }
    return null;
  });

  const totalItems = () => {
    if (userStore.profilSettings.displayArchived) {
      if (showPrivate) {
        return itemsStore.items.length;
      } else {
        return itemsStore.items.length - itemsStore.numberOfPrivateItem;
      }
    } else {
      if (showPrivate) {
        return itemsStore.items.length - itemsStore.numberOfArchivedItem;
      } else {
        return itemsStore.items.length - itemsStore.numberOfArchivedItem - itemsStore.numberOfPrivateItem;
      }
    }
  }

  return (
    <div className="items__main">
      {itemsStore.error !== null ? (
        <div className="spinner">
          {itemsStore.error}
          <br />
          <br />
          <MehOutlined style={{ fontSize: "120px", color: "#b6c8bf" }} />
        </div>
      ) : itemsStore.isLoading || userStore.isLoading ? (
        <div className="spinner">
          <Spin size="large" />
        </div>
      ) : selectedItem ? (
        <div className="looks__container">
          <ItemDetail
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
        </div>
      ) : (
              <>
                <Banner
                  id="missingTag"
                  desc={t("items.missingTagsAlert")}
                  show={true}
                />
                <div ref={containerElement} className="items__container">
                  <div className="items__toolbar">
                    <div className="items__toolbarLeft">
                      {totalItems()}&nbsp; {t("menu.items")}
                      {numberOfPrivateItems > 0 && (
                        <>  |
                      <span
                            className="link"
                            onClick={() => {
                              setShowPrivate(!showPrivate);
                            }}
                          >&nbsp;
                        {showPrivate ? t("items.hidePrivateItems") : t("items.showPrivateItems")}
                          </span>
                        </>)}
                    </div>
                    <div className="items__toolbarRight">
                      <ToolBar
                        quickEdit={quickEdit}
                        setQuickEdit={setQuickEdit}
                        showFilter={showFilter}
                        setShowFilter={setShowFilter}
                      />
                    </div>
                  </div>
                  <Row justify={"space-around"}>
                    <Col>
                      <ItemForm />
                    </Col>
                    {itemList}
                    <GhostCard numberOfCards={missingCardForFullRow} width="240px" height="385px" />
                  </Row>
                </div>
              </>
            )}
    </div>
  );
});
