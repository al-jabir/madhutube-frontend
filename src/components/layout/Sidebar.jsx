
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  HomeIcon,
  PlayIcon,
  ClockIcon,
  UserGroupIcon,
  FireIcon,
  MusicalNoteIcon,
  PlayCircleIcon,
  TvIcon,
  NewspaperIcon,
  TrophyIcon,
  AcademicCapIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = ({ isOpen }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const mainMenuItems = [
    { name: 'Home', path: '/', icon: HomeIcon },
    { name: 'Shorts', path: '/shorts', icon: PlayIcon },
    { name: 'Subscriptions', path: '/subscriptions', icon: UserGroupIcon, authRequired: true },
  ];

  const libraryItems = [
    { name: 'Library', path: '/library', icon: PlayCircleIcon, authRequired: true },
    { name: 'History', path: '/history', icon: ClockIcon, authRequired: true },
    { name: 'Your videos', path: '/channel/' + user?.username, icon: PlayIcon, authRequired: true },
    { name: 'Watch later', path: '/playlist/watch-later', icon: ClockIcon, authRequired: true },
  ];

  const exploreItems = [
    { name: 'Trending', path: '/trending', icon: FireIcon },
    { name: 'Music', path: '/music', icon: MusicalNoteIcon },
    { name: 'Movies', path: '/movies', icon: TvIcon },
    { name: 'Live', path: '/live', icon: TvIcon },
    { name: 'Gaming', path: '/gaming', icon: PlayCircleIcon },
    { name: 'News', path: '/news', icon: NewspaperIcon },
    { name: 'Sports', path: '/sports', icon: TrophyIcon },
    { name: 'Learning', path: '/learning', icon: AcademicCapIcon },
  ];

  const moreItems = [
    { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
    { name: 'Report history', path: '/report', icon: ExclamationTriangleIcon },
    { name: 'Help', path: '/help', icon: QuestionMarkCircleIcon },
  ];

  const MenuSection = ({ title, items, showTitle = true }) => (
    <div className="py-2">
      {showTitle && title && (
        <h3 className="px-6 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item) => {
        if (item.authRequired && !isAuthenticated) return null;
        
        const IconComponent = item.icon;
        return (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-6 py-2 text-sm font-medium rounded-none hover:bg-gray-100 dark:hover:bg-gray-700 ${
              isActive(item.path)
                ? 'bg-gray-100 dark:bg-gray-700 text-youtube-red'
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <IconComponent className="h-5 w-5 mr-6" />
            {item.name}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-full bg-white dark:bg-youtube-dark border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } w-64 overflow-y-auto`}
      >
        <nav className="py-4">
          <MenuSection items={mainMenuItems} showTitle={false} />
          
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          
          {isAuthenticated && (
            <>
              <MenuSection title="Library" items={libraryItems} />
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
            </>
          )}
          
          <MenuSection title="Explore" items={exploreItems} />
          
          <hr className="my-4 border-gray-200 dark:border-gray-700" />
          
          <MenuSection title="More from YouTube" items={moreItems} />
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => {}} // Will be handled by parent component
        />
      )}
    </>
  );
};

export default Sidebar;