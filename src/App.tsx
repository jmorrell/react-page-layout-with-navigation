import { useRef, useEffect, useState } from "react";
import { Route, Switch, useLocation } from "wouter";

import { HamburgerMenu } from "./HamburgerMenu";
import { ColorfulGrid } from "./ColorfulGrid";
import { FakeSidebarContent } from "./FakeSidebarContent";
import { CapybaraArticle } from "./CapybaraArticle";

import "./App.css";
import "./Filler.css";

type SnappedComponent = "none" | "sidebar" | "main";

let sidebarWidth = 300;

function App() {
  let containerRef = useRef<HTMLDivElement>(null);
  let mainContentRef = useRef<HTMLDivElement>(null);
  let sidebarRef = useRef<HTMLDivElement>(null);

  let [scrolledToMain, setScrolledToMain] = useState<boolean>(false);
  let [snappedComponent, setSnappedComponent] = useState<SnappedComponent>("main");
  let [location, _navigate] = useLocation();

  // when we first load the page, we want the container scrolled to the main content
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "instant" });
      setScrolledToMain(true);
    }
  }, []);

  useEffect(() => {
    let handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && snappedComponent === "sidebar") {
        mainContentRef.current?.scrollIntoView({ behavior: "instant" });
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [snappedComponent]);

  function scrollToSidebar() {
    // I ran into issues with sidebarRef.scrollIntoView on mobile, so
    // we're using the absolute scroll position to scroll to the sidebar
    containerRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function scrollToMain() {
    containerRef.current?.scrollTo({ left: sidebarWidth, behavior: "smooth" });
  }

  // There's no cross-browser way to detect which element is currently snapped,
  // though Chrome has a proposed API for this. There's no polyfill yet, so
  // we're going to use a hacky heuristic
  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    let scrollLeft = (e.target as HTMLDivElement).scrollLeft;

    // If we've snapped to the sidebar, add snapped
    if (Math.abs(scrollLeft) <= 30) {
      setSnappedComponent("sidebar");
    } else if (Math.abs(scrollLeft - sidebarWidth) <= 30) {
      setSnappedComponent("main");
    } else {
      setSnappedComponent("none");
    }
  }

  function onContainerClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!sidebarRef.current?.contains(e.target as Node) && snappedComponent !== "main") {
      scrollToMain();
    }
  }

  let mainSnapped = snappedComponent === "main";
  let sidebarSnapped = snappedComponent === "sidebar";

  return (
    <div className="stack-base">
      <div
        className="container"
        onScroll={onScroll}
        onClick={onContainerClick}
        ref={containerRef}
        inert={location !== "/"}
      >
        <div className={`section sidebar ${sidebarSnapped ? "snapped" : ""}`} ref={sidebarRef}>
          {scrolledToMain ? <Sidebar /> : null}
        </div>

        <div className={`section main ${mainSnapped ? "snapped" : ""}`} ref={mainContentRef} inert={!mainSnapped}>
          <MainContent>
            {scrolledToMain ? (
              <div className="grid-container">
                <div className="grid-header">
                  <HamburgerMenu onClick={scrollToSidebar} onTouchEnd={scrollToSidebar} />
                </div>
                <ColorfulGrid />
              </div>
            ) : null}
          </MainContent>
        </div>
      </div>

      <Switch>
        <Route path="/detail/:id">
          {(params) => (
            <StackedContent>
              {(props) => <CapybaraArticle popStackedContent={props.popStackedContent} id={params.id.toString()} />}
            </StackedContent>
          )}
        </Route>
      </Switch>
    </div>
  );
}

const Sidebar = function () {
  return <FakeSidebarContent />;
};

Sidebar.displayName = "Sidebar";

type MainContentProps = {
  children: React.ReactNode;
};

const MainContent = function (props: MainContentProps) {
  return <div className="main-content">{props.children}</div>;
};

MainContent.displayName = "MainContent";

type StackedContentProps = {
  children: (props: { popStackedContent: () => void }) => React.ReactNode;
};

function StackedContent({ children }: StackedContentProps) {
  let stackedViewContainerRef = useRef<HTMLDivElement>(null);
  let stackedContentBeforeRef = useRef<HTMLDivElement>(null);
  let stackedContentRef = useRef<HTMLDivElement>(null);
  let stackedContentAnimationRef = useRef<HTMLDivElement>(null);
  let [_location, navigate] = useLocation();

  function scrollToStackedContent() {
    if (stackedContentRef.current) {
      stackedContentRef.current?.scrollIntoView({ behavior: "instant" });
    }
  }

  // when we first load the page, we want the container scrolled to the main content
  useEffect(() => {
    scrollToStackedContent();
  }, [stackedContentRef]);

  // Since this view relies on having a correct scroll position, resizing the window
  // will cause issues since the scroll position will be incorrect. We can work around
  // this by listening for resize events and then scrolling to the correct position.
  useEffect(() => {
    window.addEventListener("resize", scrollToStackedContent);
    return () => {
      window.removeEventListener("resize", scrollToStackedContent);
    };
  }, []);

  // We only want to animate if we are coming from the main content
  // otherwise we want an immediate transition. However this option
  // will stay in the browser history, so we read it in, and then
  // quietly replace it after the animation is done.
  //
  // This is a bit of a hack. In a real app you could use TanStack
  // Router's masked routes. In the future the navigation API will
  // likely be a cleaner way to handle this, but this is experimental
  // in Chrome only for now.
  let animate = history.state?.animate ?? false;

  function onAnimationEnd() {
    if (animate) {
      animate = false;
      history.replaceState({ animate: false }, "");
    }
    if (stackedContentAnimationRef.current?.classList.contains("animate-out")) {
      navigate("/");
    }
  }

  // The horizontal scroll is going to either snap to stacked-content, or
  // stacked-content-before. If onscrollsnapchange was supported cross-browser,
  // we could use that. Since it's not, we can work around it by debouncing a
  // timeout on scroll and then checking the scroll position.
  let timeout = 0;

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => onScrollEnd(e), 30);
  }

  function onScrollEnd(e: React.UIEvent<HTMLDivElement>) {
    let scrollLeft = (e.target as HTMLDivElement).scrollLeft;
    if (scrollLeft < 100) {
      navigate("/");
    }
  }

  function popStackedContent() {
    stackedContentAnimationRef.current?.classList.add("animate-out");
  }

  return (
    <div className="stacked-view-container" onScroll={onScroll} ref={stackedViewContainerRef}>
      <div className="stacked-content-before" ref={stackedContentBeforeRef}></div>
      <div className="stacked-content" ref={stackedContentRef}>
        <div
          className={`stacked-content-animation ${animate ? "animate" : ""}`}
          onAnimationEnd={onAnimationEnd}
          ref={stackedContentAnimationRef}
        >
          {children({ popStackedContent })}
        </div>
      </div>
    </div>
  );
}

export default App;
