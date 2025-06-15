interface HamburgerMenuProps {
  onClick?: () => void;
  onTouchEnd?: () => void;
  ariaLabel?: string;
  className?: string;
}

export function HamburgerMenu({
  onClick,
  // _onTouchEnd,
  ariaLabel = "Open sidebar menu",
  className = "menu-icon-button",
}: HamburgerMenuProps) {
  return (
    <button className={className} aria-label={ariaLabel} type="button" onPointerUp={onClick}>
      <div className="hamburger-icon">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </button>
  );
}
