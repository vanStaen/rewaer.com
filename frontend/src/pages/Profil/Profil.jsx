import React from "react";
import { observer } from "mobx-react";
import { Typography } from "antd";

import { MenuBar } from "../../components/MenuBar/MenuBar";
import { userStore } from "../../stores/userStore/userStore";

import "./Profil.css";

const { Title, Paragraph } = Typography;

export const Profil = observer(() => {
  return (
    <div className="profil__main">
      <MenuBar />
      <div className="profil__container">
        <Title level={4}>
          Hello, {userStore.user ? userStore.user.name : "there"}
        </Title>
        <Paragraph copyable>
          <b>User ID:</b> {userStore.userId}
        </Paragraph>
      </div>
    </div>
  );
});
