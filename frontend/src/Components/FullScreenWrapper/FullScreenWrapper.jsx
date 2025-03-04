import { useEffect, useState } from "react";
import Warning from "../Warning/Warning";

// eslint-disable-next-line react/prop-types
const FullScreenWrapper = ({ children }) => {
  const [isWarning, setWarning] = useState(false);

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error(
          "Error attempting to enable full-screen mode:",
          err.message
        );
      });
    }
  };

  // Blur fucntion perform
  let timeoutId = null;

  const handleViolation = () => {
    timeoutId = setTimeout(() => {
      setWarning(true); // Show warning after 3 seconds
    }, 3000);
  };

  const handleReturn = () => {
    clearTimeout(timeoutId); // Clear timer if user returns
    setWarning(false);
  };

  useEffect(() => {
    const handleBlur = () => handleViolation();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleViolation();
      } else {
        handleReturn();
      }
    };

    window.addEventListener("blur", handleBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  ////////////////////
  const preventKeys = (event) => {
    const blockedKeys = [
      "Escape",
      "F11",
      "Alt",
      "Tab",
      "Ctrl",
      "Shift",
      "Backspace",
      "F5",
      "F12",
    ];
    // console.log(event.key);

    if (blockedKeys.includes(event.key)) {
      event.preventDefault();
    }
  };

  // Disable right-click and text selection
  const disableRightClick = (event) => {
    event.preventDefault();
  };

  useEffect(() => {
    // Enter fullscreen mode as soon as the component mounts
    enterFullScreen();

    // Disable right-click and text selection
    document.addEventListener("contextmenu", disableRightClick);
    document.body.style.userSelect = "none"; // Disable text selection

    // Block keyboard shortcuts
    document.addEventListener("keydown", preventKeys);
    document.addEventListener("keypress", preventKeys);

    const preventWindowClose = (event) => {
      if (event) {
        event.preventDefault();
        event.returnValue = ""; // This triggers a browser prompt
      }
    };
    window.addEventListener("beforeunload", preventWindowClose);
    const checkFullscreen = setInterval(() => {
      if (!document.fullscreenElement) {
        enterFullScreen(); // Force fullscreen mode if exited
      }
    }, 1000); // Check every second

    return () => {
      // Cleanup: remove event listeners when component unmounts
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", preventKeys);
      document.removeEventListener("keypress", preventKeys);
      window.removeEventListener("beforeunload", preventWindowClose);

      // Clear the interval
      clearInterval(checkFullscreen);
    };
  }, []);

  return (
    <>
     {isWarning && <Warning onClose={()=>setWarning(false)}/>}
      <div id="full_screen">{children}</div>
    </>
  );
};

export default FullScreenWrapper;
