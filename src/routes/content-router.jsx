import ItemsPage from '../pages/content/items/items-page';

// 콘텐츠(Content) 메뉴에 속하는 라우트 정의
export const contentRouter = [
  {
    path: 'content/items',
    element: <ItemsPage />,
  },
];
