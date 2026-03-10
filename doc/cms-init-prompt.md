# React CMS Base Project 생성 프롬프트

> 다음 프롬프트 전체 복사하여 AI (또는 LLM 에이전트)에게 전달하면, 현재 구성된 UI-Agnostic CMS 기본 프로젝트를 똑같이 초기화하여 구성할 수 있습니다.

---

## 프롬프트 내용

당신은 프론트엔드 아키텍트입니다. 다음 요구사항에 맞추어 React 기반의 CMS(Content Management System) 프로젝트의 초기 뼈대를 생성해주세요.
이 프로젝트는 특정 디자인 시스템(MUI, Ant Design 등)에 종속되지 않은(UI-Agnostic) 순수한 기능 중심의 Base 앱입니다.

### [필수 기술 스택]
- 라이브러리: React (Vite 빌드)
- 모듈: react-router-dom (라우팅), Zustand (전역 상태 관리)
- 스타일링: Vanilla CSS (순수 Flexbox 기반의 최소 레이아웃 뼈대)

### [코딩 및 네이밍 컨벤션]
1. 모든 파일 및 폴더명은 **kebab-case** (소문자 하이픈)를 사용합니다. 대소문자 혼용은 금지합니다.
2. 컴포넌트 함수명 및 React Export 변수명은 **PascalCase**를 사용합니다.
3. Hook은 `camelCase`로 `use`를 접두사로 사용합니다. Zustand 스토어는 `use[도메인]Store`로 명명합니다.
4. 페이지 컴포넌트는 단일 파일이 아닌, 목적에 맞게 `src/pages/[대분류]/[소분류]/[page-name].jsx` 형태의 독립된 디렉토리를 최소 단위로 가져야 합니다.

### [요구 사항]

**1. 글로벌 레이아웃 구조 (`src/layouts/`)**
- `MainLayout`: 상단 `Header`, 좌측 `Sidebar`, 우측 본문 `Outlet`, 본문 하단 `Footer`의 형태를 갖는 수직/수평 Flexbox 레이아웃을 작성하세요.
- `Header`: 좌측 로고, 우측 사용자 정보 및 로그아웃 버튼 노출.
- `Sidebar`: 메뉴 목록을 렌더링합니다. 단순 `<ul>`, `<li>` 태그를 활용해 계층을 분리하세요.
- `Footer`: 정적 환경설정 파일 객체(`src/config/app-config.js`)의 옵션값에 따라 렌더링 노출 여부를 제어하세요.
- 비로그인 사용자를 위한 `AuthLayout`을 별도로 만드세요.

**2. 라우팅 시스템 (`src/routes/`)**
- 라우터 정의가 길어지는 것을 방지하기 위해 대메뉴(도메인) 기준으로 라우터 파일을 분리하세요 (예: `settings-router.jsx`, `content-router.jsx`).
- 분리된 자식 라우터들을 최상위 라우터(`app-router.jsx`)에 Spread 기법(`...`)으로 병합하세요.
- 인증 상태가 없는 진입은 `/login` 뷰로 강제 리다이렉트하고, 권한에 맞지 않는 접근을 차단하는 라우터 가드(예: `require-permission.jsx`)를 구현하세요.

**3. API 통신 아키텍처 (Service Layer & IoC 패턴)**
이 프로젝트의 가장 핵심 구조입니다. 특정 API가 실서버와 더미(Mock)를 오고 갈 수 있도록 서비스 계층에서 의존성을 주입합니다.
- Base Client (`src/api/api-client.js`): 실제 서버와 통신하는 `request(fetch)` 함수와, 데이터를 주입받아 1초 뒤에 그대로 반환하는 순수 지연 함수 `dummyRequest(data, delay)`만을 구현하세요. (내부에서 특정 JSON을 동적 Import 하지 않습니다)
- Service Module (`src/services/`): 각 도메인별 서비스 계층 클래스(오브젝트)를 구축하세요 (예: `auth-service.js`, `notice-service.js`).
- Switch 로직: 각 서비스 파일 내부 상단에 `USE_MOCK` 상수(boolean)를 두어, 이 값에 따라서만 실서버 `request` 또는 `dummyRequest`를 분기 호출하게 하세요.
- 더미 주입: `USE_MOCK`이 `true`일 경우, 서비스 모듈이 해당 도메인의 더미 JSON 파일(`src/api/dummy/admin.json` 등)을 직접 Import한 뒤, 이를 `api-client`의 `dummyRequest` 인자로 던져주는 '의존성 역전(IoC)' 구조를 만드세요.
- **토큰 검증 (Verify)**: 로그인 응답으로 넘어온 토큰을 검증하는 `verifyToken(token)` 함수를 구현하고, 토큰값이 올바를 경우 재차 사용자 계정정보와 권한배열 더미 JSON을 불러오도록 구성하세요.

**4. 루트 구동 및 샘플 페이지 기능 (`src/App.jsx`, `src/pages/`)**
- **루트 컴포넌트 (`App.jsx`)**: 앱이 구동될 때(새로고침 시) `useEffect`를 통해 Zustand 스토어의 토큰 검증 로직을 우선 실행시키고, 검증이 끝나기 전(`!isInitialized`)까지는 '인증 확인 중' 이라는 로딩 화면을 그려 라우터 깜빡임을 방어하세요.
- **상태 영속성 및 자동 로그아웃**: 인증 스토어(`auth-store.js`)는 `localStorage`를 사용하여 로그인/로그아웃 시 토큰을 관리하세요. 앱 구동 시 통신한 검증 결과가 유효하지 않으면, 스토어 상태를 모두 초기화(`logout`)하여 `/login` 뷰로 튕겨내도록 방어 로직을 작성하세요.
- **로그인 페이지** (`/login`): 아이디/패스워드 입력 폼 작성, `authService` 연동. 성공 시 사용자 정보와 '토큰'을 Zustand에 저장하고 대시보드 리다이렉트.
- **대시보드 페이지** (`/`): 컴포넌트 마운트(`useEffect`) 시 `noticeService`를 호출하여 맞춤형 공지사항 데이터를 더미로 불러온 뒤, 어떠한 외부 UI 라이브러리(Bootstrap 등)의 도움도 없는 순수 CSS 기반 팝업 모달(Overlay)로 내용을 출력하세요.
- **그 외 서브 페이지**: '사용자 데이터', '권한 관리', '콘텐츠 아이템 관리' 등의 더미 텍스트만 표시되는 페이지들을 메뉴 구조에 맞추어 생성하여 라우터의 렌더링 동작을 보장하세요.

**5. 공통 기능 및 전역 에러 제어 (Global Error Handling)**
- `api-client.js`: `fetch` 인터셉터 역할을 하여 상태 코드(ex: 401, 500)에 따른 공통 에러 객체를 `ui-store`에 전달하세요.
- `GlobalErrorToast`: 최상단 `App.jsx`에 마운트되어 컴포넌트 종속성 없이 앱 전역의 에러 알림 팝업을 렌더링하세요. 자동 닫힘 기능 및 `clearError` 로직을 포함하세요.
- 다목적 공용 Modal: 상태 제어용 `useModal` 훅과 UI용 `Modal` 컴포넌트를 분리 구축하여 다른 어떤 페이지에서도 공통 규격의 팝업을 호출할 수 있게 설계하세요. 모달 닫기 기본 버튼(`common-modal-btn`)도 내장하세요.

**6. 동적 권한 제어 코어 시스템 (Dynamic RBAC)**
- **권한 스토어**: 로그인 통신(`login`, `verifyToken`) 결과로 `user` 데이터와 함께 `permissions: [{ path: '/dashboard', actions: ['READ'] }]` 형태의 접근 규칙 배역 객체를 받아 `auth-store`에 저장하세요.
- **라우터 가드 (`require-permission.jsx`)**: `MainLayout`에 감싸서, 현재 사용자가 접속하려는 `location.pathname`이 권한 배열(permissions)에 포함되어 있는지 검증하고, 허락되지 않은 경로는 대시보드나 에러 화면으로 튕겨내게 작성하세요.
- **UI 가드 (`usePermission` 훅)**: 페이지 내부에서 버튼, 요소 노출을 결정할 때 현재 경로와 요구되는 상세 액션(예: `hasPermission('DELETE')`)을 판별해 true/false를 반환하는 커스텀 훅을 만드세요.
- **더미 스위칭 로직**: `auth-service.js`에서 로그인 아이디 값이 'admin'인지 판별하여, 관리자용 `admin.json` 또는 일반 사용자용 `user.json`을 동적으로 `dummyRequest`에 주입하게끔 분기하세요.

위의 상세 규칙들에 맞추어 빠짐없이 전체 프로젝트의 뼈대 코드를 작성 및 조립해주세요.
