import React from "react";

export function useWindowSize() {
  const [size, setSize] = React.useState({
    width: null as number | null,
    height: null as number | null,
  });

  React.useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
