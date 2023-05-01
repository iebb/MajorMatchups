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
  BookOpenIcon,
  ChatBubbleBottomCenterIcon,
  ChevronDownIcon,
  CogIcon,
  CurrencyDollarIcon,
  FolderArrowDownIcon,
  GlobeEuropeAfricaIcon,
  InboxIcon,
  NewspaperIcon,
  RocketLaunchIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

const Editions = [
  {
    edition: "About",
    icon: InboxIcon,
    items: [
      {
        title: 'Major Rulebook',
        subtitle: 'The Valve Rulebook',
        icon: BookOpenIcon,
        path: "https://counter-strike.net/csgo_major_supplemental_rulebook/#Final-Rankings-Major",
      },
      {
        title: 'Discord',
        subtitle: 'Feedbacks, or just random chat',
        icon: ChatBubbleBottomCenterIcon,
        path: "https://discord.gg/KYNbRYrZGe",
      },
      {
        title: 'Ko-fi Page',
        subtitle: 'Donate to this site :D',
        icon: CurrencyDollarIcon,
        path: "https://ko-fi.com/ieb233",
      },
      {
        title: 'Tutorial',
        subtitle: 'A simple guide on how to use this site',
        icon: NewspaperIcon,
        path: "https://iebb.medium.com/how-to-use-the-matchup-site-in-2022-18366c9e60da",
      },
      {
        title: 'Steam Profile',
        subtitle: 'Comment / Give Profile Awards',
        icon: CogIcon,
        path: "https://steamcommunity.com/id/iebbbb",
      },
    ]
  },
  {
    edition: "2023",
    icon: RocketLaunchIcon,
    items: [
      {
        title: '2023 Paris',
        subtitle: 'BLAST.tv Paris Major 2023',
        img: require("../images/logos/blast23.png"),
        description: '2023.05.08 - 2023.05.21',
        path: '/23paris',
      },
      {
        title: '2023 Paris RMR',
        subtitle: '',
        img: require("../images/logos/blast.png"),
        description: '2023.04.06 - 2023.04.15',
        path: '/23rmr_paris',
      },
      {
        title: '2023 Paris RMR Closed Qualifier',
        subtitle: 'Europe A/B and Americas',
        img: require("../images/logos/blast.png"),
        description: '2023.02.16 - 2023.02.20',
        path: '/23qual_paris',
      },
      {
        title: '2023 R6 BLAST Major Copenhagen',
        subtitle: '',
        img: require("../images/logos/r6.png"),
        description: '2023.04.24 - 2023.05.07',
        path: '/r6_23majorcph',
      },
    ]
  },
  {
    edition: "2022",
    icon: StarIcon,
    items: [
      {
        title: '2022 Rio',
        subtitle: 'IEM Rio Major 2022',
        img: require("../images/logos/iemrio22.png"),
        description: '2022.10.31 - 2022.11.13',
        path: '/22rio',
      },
      {
        title: '2022 Rio RMR',
        subtitle: '',
        img: require("../images/logos/iem22_generic.png"),
        description: '2022.10.04 - 2022.10.09',
        path: '/22rmr_rio',
      },
      {
        title: '2022 Antwerp',
        subtitle: 'PGL Major Antwerp 2022',
        img: require("../images/logos/pgl22.png"),
        description: '2022.10.31 - 2022.11.13',
        path: '/22antwerp',
      },
      {
        title: '2022 Antwerp RMR',
        subtitle: '',
        img: require("../images/logos/pgl.png"),
        description: '2022.10.31 - 2022.11.13',
        path: '/22rmr_antwerp',
      },
    ]
  },
  {
    edition: "2021",
    icon: GlobeEuropeAfricaIcon,
    items: [
      {
        title: '2021 Stockholm',
        subtitle: 'PGL Major Stockholm 2021',
        img: require("../images/logos/pgl21.png"),
        description: '2023.05.08 - 2023.05.21',
        path: '/21stockholm',
      },
    ]
  },
  {
    edition: "2019",
    icon: FolderArrowDownIcon,
    items: [
      {
        title: '2019 Berlin',
        img: require("../images/logos/sl.png"),
        subtitle: 'StarLadder Berlin Major 2019',
        description: '2023.05.08 - 2023.05.21',
        path: '/19berlin',
      },
      {
        title: '2019 Katowice',
        img: require("../images/logos/iem.png"),
        subtitle: 'IEM Season 13 - Katowice Major',
        description: '2019.02.13 - 2019.03.03',
        path: '/19katowice',
      },
    ]
  },
]

function NavListMenu({ edition }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const triggers = {
    onMouseEnter: () => setIsMenuOpen(true),
    onMouseLeave: () => setIsMenuOpen(false),
  };

  const { items } = edition;
  const EditionIcon = edition.icon;

  const renderItems = items.map(({title, description, path, subtitle, icon: ItemIcon, img}) => (
    <a href={path} key={title}>
      <MenuItem>
        <div className="h-[32px] w-[32px] inline-block mr-3 content-center">
          {
            ItemIcon ? (
              <ItemIcon className="w-[32px]" />
            ) : (
              <img className="w-[32px]" src={img} alt={title} />
            )
          }
        </div>
        <div className="inline-block">
          <Typography variant="h6" color="blue-gray" className="mb-1">
            {title}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {subtitle}
          </Typography>
          <Typography variant="small" color="gray" className="font-normal">
            {description}
          </Typography>
        </div>
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
              <EditionIcon className="h-[18px] w-[18px]" /> {edition.edition}{" "}
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
          className="hidden w-[28rem] grid-cols-4 gap-3 overflow-visible md:grid"
        >
          <ul className="col-span-4 flex w-full flex-col gap-1 !outline-none">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-blue-gray-900 md:hidden">
        <EditionIcon className="h-[18px] w-[18px]" /> {edition.edition}{" "}
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
    <Navbar className="md:sticky inset-0 z-10 h-max max-w-full rounded-none p-2 md:pl-6">
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
      <MobileNav open={isNavOpen}>
        <NavList />
      </MobileNav>
    </Navbar>
  );
}
