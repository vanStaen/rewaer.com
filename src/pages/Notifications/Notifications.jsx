import React, { useEffect } from "react";
import { observer } from "mobx-react";

import { pageStore } from "../../stores/pageStore/pageStore";
import { postNotificationsSeen } from "./postNotificationsSeen";

import "./Notifications.less";

export const Notifications = observer(() => {
  useEffect(() => {
    postNotificationsSeen();
    pageStore.setUnseenNotificationsCount(0);
  }, []);

  const notificationsFormated = pageStore.notifications.map((notification) => {
    const { type, seen, title, createdAt, media_url } = notification;
    return (
      <div className={`notifications__notification ${seen ? "seen" : "new"}`}>
        <div
          className="notifications__leftSide"
          style={{
            width: "50px",
            height: "50px",
            background: `url(${media_url})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
        <div className="notifications__rightSide">
          {type === 1 && <div>{title} sent you a friend request!</div>}
          {type === 2 && <div>{title} started following you!</div>}
          {type === 3 && <div>You got mail from {title}!</div>}
          {type === 4 && <div>{title} added a new item to the garderobe.</div>}
          {type === 5 && <div>{title} added a new look to the garderobe.</div>}
          <div className="notifications__date"> {createdAt}</div>
        </div>
      </div>
    );
  });

  return (
    <div className="notifications__container">
      {pageStore.notifications.length === 0
        ? "nothing here yet"
        : notificationsFormated}
    </div>
  );
});
