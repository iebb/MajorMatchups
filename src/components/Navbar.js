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
  FilmIcon,
  Bars2Icon,
  BookOpenIcon,
  ChatBubbleBottomCenterIcon, CheckBadgeIcon,
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
    edition: "2024",
    icon: FilmIcon,
    items: [
      {
        title: '2024 Shanghai RMR',
        subtitle: 'Europe and Americas',
        img: ("https://img.majors.im/images/logos/pglrmr24.png"),
        description: '2024.11', //  '2024.02.14 - 2024.03.04',
        path: '/24rmr_shanghai',
      },
      {
        title: '2024 Shanghai RMR Closed Qualifier',
        subtitle: 'Europe and Americas',
        img: ("https://img.majors.im/images/logos/pglrmr24.png"),
        description: '2024.09', // '2024.01.12 - 2024.01.22',
        path: '/24qual_shanghai',
      },
      {
        title: '2024 Copenhagen',
        subtitle: 'PGL Major Copenhagen 2024',
        img: ("https://img.majors.im/images/logos/pgl24.png"),
        description: '2024.03.17 - 2024.03.31',
        path: '/24copenhagen',
      },
      {
        title: '2024 Copenhagen RMR',
        subtitle: 'Europe and Americas',
        img: ("https://img.majors.im/images/logos/pglrmr24.png"),
        description: '2024.02.14 - 2024.03.04',
        path: '/24rmr_copenhagen',
      },
      {
        title: '2024 Copenhagen RMR Closed Qualifier',
        subtitle: 'Europe and Americas',
        img: ("https://img.majors.im/images/logos/pglrmr24.png"),
        description: '2024.01.12 - 2024.01.22',
        path: '/24qual_copenhagen',
      },
      {
        title: '2024 R6 BLAST Major Manchester',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/r6.png"),
        description: '2024.05',
        path: '/r6/24majorman',
      },
      {
        title: '2024 R6 BLAST Major Montreal',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/r6.png"),
        description: '2024.11',
        path: '/r6/24majormtl',
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
        img: ("https://img.majors.im/images/logos/blast23.png"),
        description: '2023.05.08 - 2023.05.21',
        path: '/23paris',
      },
      {
        title: '2023 Paris RMR',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/blast.png"),
        description: '2023.04.06 - 2023.04.15',
        path: '/23rmr_paris',
      },
      {
        title: '2023 Paris RMR Closed Qualifier',
        subtitle: 'Europe and Americas',
        img: ("https://img.majors.im/images/logos/blast.png"),
        description: '2023.02.16 - 2023.02.20',
        path: '/23qual_paris',
      },
      {
        title: '2023 R6 BLAST Major Copenhagen',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/r6.png"),
        description: '2023.04.24 - 2023.05.07',
        path: '/r6/23majorcph',
      },
      {
        title: '2023 R6 BLAST Major Atlanta',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/r6.png"),
        description: '2023.10.31 - 2023.11.12',
        path: '/r6/23majoratl',
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
        img: ("https://img.majors.im/images/logos/iemrio22.png"),
        description: '2022.10.31 - 2022.11.13',
        path: '/22rio',
      },
      {
        title: '2022 Rio RMR',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/iem22_generic.png"),
        description: '2022.10.04 - 2022.10.09',
        path: '/22rmr_rio',
      },
      {
        title: '2022 Antwerp',
        subtitle: 'PGL Major Antwerp 2022',
        img: ("https://img.majors.im/images/logos/pgl22.png"),
        description: '2022.05.09 - 2022.05.22',
        path: '/22antwerp',
      },
      {
        title: '2022 Antwerp RMR',
        subtitle: '',
        img: ("https://img.majors.im/images/logos/pglrmr.png"),
        description: '2022.04.17 - 2022.04.24',
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
        img: ("https://img.majors.im/images/logos/pgl21.png"),
        description: '2021.10.26 - 2021.11.07',
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
        img: ("https://img.majors.im/images/logos/sl.png"),
        subtitle: 'StarLadder Berlin Major 2019',
        description: '2019.08.23 - 2019.09.08',
        path: '/19berlin',
      },
      {
        title: '2019 Katowice',
        img: ("https://img.majors.im/images/logos/iem.png"),
        subtitle: 'IEM Season 13 - Katowice Major',
        description: '2019.02.13 - 2019.03.03',
        path: '/19katowice',
      },
    ]
  },
  {
    edition: "Pick'em",
    icon: CheckBadgeIcon,
    items: [
      {
        title: 'Place Pick\'em Online',
        icon: CheckBadgeIcon,
        description: 'at pick.majors.im',
        path: 'https://pick.majors.im/',
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
      <MenuItem className="hover:bg-nekoko-700 hover:border-nekoko-800 active:bg-nekoko-500 active:border-nekoko-600">
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
          <Typography variant="h6" className="mb-1 text-white">
            {title}
          </Typography>
          {
            subtitle && (
              <Typography variant="small" className="font-normal text-gray-400">
                {subtitle}
              </Typography>
            )
          }
          {
            description && (
              <Typography variant="small" className="font-normal text-gray-400">
                {description}
              </Typography>
            )
          }
        </div>
      </MenuItem>
    </a>
  ));

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen}>
        <MenuHandler>
          <Typography as="a" href="#" variant="small" className="font-normal">
            <MenuItem
              {...triggers}
              className="hidden items-center gap-2 text-white md:flex md:rounded-full"
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
          className="hidden w-[28rem] grid-cols-4 gap-3 overflow-visible md:grid bg-nekoko-900 border-nekoko-950"
        >
          <ul className="col-span-4 flex w-full flex-col gap-1 !outline-none text-white">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>
      <MenuItem className="flex items-center gap-2 text-white md:hidden">
        <EditionIcon className="h-[18px] w-[18px]" /> {edition.edition}{" "}
      </MenuItem>
      <ul className="ml-6 flex w-full flex-col gap-1 md:hidden bg-nekoko-900">
        {renderItems}
      </ul>
    </>
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
    <Navbar
      variant="gradient"
      color="blue-gray"
      className="md:sticky from-nekoko-900 to-nekoko-800 inset-0 z-40 h-max max-w-full rounded-none p-2 md:pl-6"
    >
      <div className="relative mx-auto flex items-center text-white">
        <Typography
          as="a"
          href="#"
          className="mr-4 ml-2 cursor-pointer py-1.5 font-medium text-white"
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
