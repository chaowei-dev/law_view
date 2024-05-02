import React, { useState, useCallback } from "react";
import { AlertList } from "react-bs-notifier";

const AlertBox = () => {
  const [alerts, setAlerts] = useState([]);
  const [newMessage, setNewMessage] = useState(
    "This is a test of the Emergency Broadcast System. This is only a test."
  );

  const generate = useCallback(
    (type) => {
      setAlerts((alerts) => [
        ...alerts,
        {
          id: new Date().getTime(),
          type: type,
          headline: `Whoa, ${type}!`,
          message: newMessage,
        },
      ]);
    },
    [newMessage]
  );

  const onDismissed = useCallback((alert) => {
    setAlerts((alerts) => {
      const idx = alerts.indexOf(alert);
      if (idx < 0) return alerts;
      return [...alerts.slice(0, idx), ...alerts.slice(idx + 1)];
    });
  }, []);

  const clearAlerts = useCallback(() => setAlerts([]), []);

  const clearAllButton = alerts.length ? (
    <button className="btn btn-link" onClick={clearAlerts}>
      Clear all alerts
    </button>
  ) : null;

  return (
    <>
      <AlertList
        position={"bottom-right"}
        alerts={alerts}
        timeout={1000}
        dismissTitle="Begone!"
        onDismiss={onDismissed}
      />

      <div className="form-group text-right">
        {clearAllButton}
        <div className="btn-group">
          {["info", "success", "warning", "danger"].map((type) => (
            <button
              key={type}
              type="button"
              className={`btn btn-${type}`}
              onClick={() => generate(type)}
            >
              generate {type}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default AlertBox;
