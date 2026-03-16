import ItemsPage from '../../pages/content/items/items-page';

export const contentMenu = {
  title: '콘텐츠',
  children: [
    {
      path: '/content/items',
      title: '아이템 관리',
      element: <ItemsPage />,
    },
  ],
};
