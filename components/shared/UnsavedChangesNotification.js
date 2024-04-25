import { useContext, useEffect } from "react";
import Router from 'next/router';
import AuthContext from "../../shared/contexts/AuthContext";

const UnsavedChangesNotification = ({ hasUnsavedChanges }) => {
  const { isSSR } = useContext(AuthContext);
  useEffect(() => {
    // For reloading.
    window.onbeforeunload = () => {
      if (hasUnsavedChanges) {
        return 'Thay đổi chưa được lưu, bạn có thực sự muốn thoát?';
      }
    };

    // For changing in-app route.
    if (hasUnsavedChanges) {
      const routeChangeStart = () => {
        const ok = confirm('Thay đổi chưa được lưu, bạn có thực sự muốn thoát?');
        if (!ok) {
          Router.events.emit('routeChangeError');
          throw 'Abort route change. Please ignore this error.';
        }
      };

      Router.events.on('routeChangeStart', routeChangeStart);
      return () => {
        Router.events.off('routeChangeStart', routeChangeStart);
      };
    }
  }, [isSSR, hasUnsavedChanges]);
};

export default UnsavedChangesNotification;