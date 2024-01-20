import {Popover, PopoverContent, PopoverHandler,} from "@material-tailwind/react";
import React from "react";

export default function HoverPopover({
  children, popup, placement="bottom"
}) {
  const [openPopover, setOpenPopover] = React.useState(false);
  const triggers = {
    onMouseEnter: () => setOpenPopover(true),
    onMouseLeave: () => setOpenPopover(false),
  };

  return (
    <Popover open={openPopover} handler={setOpenPopover} placement={placement}>
      <PopoverHandler {...triggers}>
        {children}
      </PopoverHandler>
      <PopoverContent {...triggers}>
        {popup}
      </PopoverContent>
    </Popover>
  );
}
