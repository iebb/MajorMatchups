import React from "react";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Avatar,
  Typography,
} from "@material-tailwind/react";
import { MapPinIcon, BuildingOffice2Icon } from "@heroicons/react/24/outline";

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
