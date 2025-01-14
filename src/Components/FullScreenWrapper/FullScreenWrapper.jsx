import { useEffect } from "react";

// eslint-disable-next-line react/prop-types
const FullScreenWrapper = ({ children }) => {
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err.message);
      });
    }
  };

//   const exitFullScreen = () => {
//     if (document.exitFullscreen) {
//       document.exitFullscreen().catch((err) => {
//         console.error("Error attempting to exit full-screen mode:", err.message);
//       });
//     }
//   };

  // Block specific keys (Escape, F11, Ctrl, Alt, etc.)
  const preventKeys = (event) => {
    const blockedKeys = [
      "Escape", "F11", "Alt", "Tab", "Ctrl", "Shift", "Backspace", "F5", "F12"
    ];
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
        event.returnValue = ''; // This triggers a browser prompt
      }
    };
    window.addEventListener("beforeunload", preventWindowClose);

    // **Continuously check if fullscreen is still active (optional):**
    // This can be helpful if the user accidentally exits fullscreen
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
    <div style={{ width: "100vw", height: "100vh", margin: 0 }}>
      {children}
    </div>
  );
};

export default FullScreenWrapper;