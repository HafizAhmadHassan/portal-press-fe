import React from "react";
import { NotificationTester } from "@root/components/NotificationTester/NotificationTester";

const NotificationDebug: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Debug Notifications</h1>
      <NotificationTester />
    </div>
  );
};

export default NotificationDebug;
