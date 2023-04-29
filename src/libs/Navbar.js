import React from 'react';
import {
  IconButton,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  MobileNav,
  Navbar,
  Typography,
} from '@material-tailwind/react';
import {
  Bars2Icon,
  ChevronDownIcon, FolderArrowDownIcon,
  GlobeEuropeAfricaIcon,
  RocketLaunchIcon,
  StarIcon,
} from '@heroicons/react/24/outline';


const Editions = [
  {
    edition: "2023",
    icon: RocketLaunchIcon,
    items: [
      ['2023 Paris Major [Provisional]', '/23paris'],
      ['2023 Paris RMR', '/23rmr_paris'],
      ['2023 Paris RMR Closed Qualifier', '/23qual_paris'],
    ]
  },
  {
    edition: "2022",
    icon: StarIcon,
    items: [
      ['2022 Rio Major', '/22rio'],
      ['2022 Rio RMR', '/22rmr_rio'],
      ['2022 Antwerp Major', '/22antwerp'],
      ['2022 Antwerp RMR', '/22rmr_antwerp'],
    ]
  },
  {
    edition: "2021",
    icon: GlobeEuropeAfricaIcon,
    items: [
      ['2021 Stockholm Major', '/21stockholm'],
    ]
  },
  {
    edition: "2019",
    icon: FolderArrowDownIcon,
    items: [
      ['2019 Berlin', '/19berlin'],
      ['2019 Katowice', '/19katowice'],
    ]
  },
]

function NavListMenu({ edition }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };

  const { icon, items } = edition;
  const Icon = icon;

  const renderItems = items.map(([title, path]) => (
    <a href={path} key={title}>
      <MenuItem>
        <Typography variant="h6" color="blue-gray" className="mb-1">
          {title}
        </Typography>
        <Typography variant="small" color="gray" className="font-normal">
          {path}
        </Typography>
      </MenuItem>
    </a>
  ));

  return (
    <React.Fragment>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-blue-gray-900 md:flex md:rounded-full"
            >
              <Icon className="h-[18px] w-[18px]" /> {edition.edition}{" "}
              <ChevronDownIcon
                strokeWidth={2}
                className={`h-3 w-3 transition-transform ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </MenuItem>
          </Typography>
        </MenuHandler>
        <MenuList
          {...triggers}
          className="hidden w-[18rem] grid-cols-4 gap-3 overflow-visible md:grid"
        >
          <ul className="col-span-4 flex w-full flex-col gap-1">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 md:hidden">
        <Icon className="h-[18px] w-[18px]" /> {edition.edition}{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 md:hidden">
        {renderItems}
      </ul>
    </React.Fragment>
  );
}

function NavList() {
  return (
    <ul className="mb-4 mt-2 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center">
      {Editions.map((edition) => (
        <NavListMenu
          key={edition.edition}
          edition={edition}
        />
      ))}
    </ul>
  );
}


export default function ComplexNavbar() {
  const [isNavOpen, setIsNavOpen] = React.useState(false);
  const toggleIsNavOpen = () => setIsNavOpen((cur) => !cur);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 720 && setIsNavOpen(false)
    );
  }, []);

  return (
    <Navbar className="sticky inset-0 z-10 h-max max-w-full rounded-none p-2 md:pl-6">
      <div className="relative mx-auto flex items-center text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium"
        >
          Majors.im
        </Typography>
        <div className="absolute top-2/4 left-2/4 hidden -translate-x-2/4 -translate-y-2/4 md:block">
          <NavList />
        </div>
        <IconButton
          size="sm"
          color="blue-gray"
          variant="text"
          onClick={toggleIsNavOpen}
          className="ml-auto mr-2 md:hidden"
        >
          <Bars2Icon className="h-6 w-6" />
        </IconButton>
      </div>
      <MobileNav open={isNavOpen} className="overflow-scroll">
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
