import { useRef, useEffect, useState } from "react";
import "./App.css";
import "./Filler.css";
import { HamburgerMenu } from "./HamburgerMenu";
import { ColorfulGrid } from "./ColorfulGrid";
import { FakeSidebarContent } from "./FakeSidebarContent";

type SnappedComponent = "none" | "sidebar" | "main";

type DetailView = null | number;

let sidebarWidth = 300;

function App() {
  let containerRef = useRef<HTMLDivElement>(null);
  let mainContentRef = useRef<HTMLDivElement>(null);
  let sidebarRef = useRef<HTMLDivElement>(null);

  let [detailView, setDetailView] = useState<DetailView>(null);

  let [snappedComponent, setSnappedComponent] = useState<SnappedComponent>("main");

  // when we first load the page, we want the container scrolled to the main content
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollIntoView({ behavior: "instant" });
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
  function onGridItemClick(value: number) {
    setDetailView(value);
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
        inert={detailView !== null}
      >
        <div className={`section sidebar ${sidebarSnapped ? "snapped" : ""}`} ref={sidebarRef}>
          <Sidebar />
        </div>

        <div className={`section main ${mainSnapped ? "snapped" : ""}`} ref={mainContentRef} inert={!mainSnapped}>
          <MainContent>
            <div className="grid-container">
              <div className="grid-header">
                <HamburgerMenu onClick={scrollToSidebar} onTouchEnd={scrollToSidebar} />
              </div>
              <ColorfulGrid onItemClick={onGridItemClick} />
            </div>
          </MainContent>
        </div>
      </div>

      <StackedContent detailView={detailView} setDetailView={setDetailView}>
        <div className="stacked-header">
          <h1>Detail View {detailView}</h1>
        </div>
      </StackedContent>
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
  detailView: DetailView;
  setDetailView: (detailView: DetailView) => void;
  children: React.ReactNode;
};

function StackedContent({ detailView, setDetailView, children }: StackedContentProps) {
  let stackedContentRef = useRef<HTMLDivElement>(null);

  // when we first load the page, we want the container scrolled to the main content
  useEffect(() => {
    if (stackedContentRef.current) {
      stackedContentRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [detailView]);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    let scrollLeft = (e.target as HTMLDivElement).scrollLeft;
    console.log("scrollLeft", scrollLeft);
    if (scrollLeft < 30) {
      e.preventDefault();
      setDetailView(null);
    }
  }

  if (detailView === null) {
    return null;
  }

  return (
    <div className="stacked-view-container" onScroll={onScroll}>
      <div className="stacked-content-before"></div>
      <div className="stacked-content" ref={stackedContentRef}>
        <div className="stacked-header">{children}</div>
      </div>
    </div>
  );
}

export default App;
