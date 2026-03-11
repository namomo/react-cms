# React CMS Base Project (UI-Agnostic)

## 프로젝트 개요
본 프로젝트는 특정 디자인 시스템(MUI, Ant Design 등)에 종속되지 않는 순수한 기능 중심의 CMS(Content Management System) 기본 뼈대입니다. 추후 다양한 UI 프레임워크를 유연하게 얹어서 사용할 수 있도록, 핵심 비즈니스 로직과 레이아웃 구조만을 견고하게 설계했습니다.

## 기술 스택
- **Core**: React, Vite
- **Routing**: `react-router-dom`
- **State Management**: Zustand
- **Styling**: Vanilla CSS (Flexbox 기반 최소한의 레이아웃만 적용)

## 주요 아키텍처 및 특징

### 1. 확장 가능한 디렉토리 구조
유지보수와 확장을 고려하여 역할과 도메인별로 명확히 분리된 구조를 가집니다.
- **kebab-case** 파일/폴더명 및 **PascalCase** 컴포넌트명 규칙을 엄격히 준수합니다.
- `src/pages/`: 도메인별로 독립된 폴더를 가집니다. 특정 페이지에 필요한 자식 컴포넌트나 로컬 상태는 해당 디렉토리 내에 응집시킵니다. (예: `src/pages/dashboard/`, `src/pages/settings/profile/`)
- `src/components/`: 레이아웃(Header, Footer, Sidebar) 등 애플리케이션 전역에서 재사용 가능한 UI 컴포넌트가 위치합니다.
- `src/routes/`: 대메뉴 단위로 라우팅 객체를 분리(예: `settings-router.jsx`)하여 최상위 `app-router.jsx`에서 Spread Operator(`...`)로 병합합니다. 이를 통해 라우터 파일이 비대해지는 것을 방지합니다.

### 2. Service Layer & 의존성 역전(IoC) 컴포넌트 연동 패턴
화면(UI) 컴포넌트가 직접 API 클라이언트를 호출하지 않고 중간 유스케이스(Service)를 바라보게 구성했습니다. 통신 로직 및 Mock 제어를 프론트엔드 단에서 유연하게 다를 수 있습니다.

- **`api-client.js` 백엔드 클라이언트**: 순수하게 `fetch`를 수행하는 공통 `request` 함수와, 데이터를 외부에서 받아서 Promise 딜레이 후 반환하는 `dummyRequest` 함수만 존재합니다. 이 파일은 특정 주소나 더미 파일의 경로를 하드코딩하지 않아 의존성이 완벽히 분리되어 있습니다.
- **Service Modules (`src/services/`)**: 기능별(예: `auth-service.js`, `notice-service.js`)로 API 호출 계층을 마련했습니다.
- **개별 통신 제어 스위치 (`USE_MOCK`)**: 서비스 파일 내부에 이 스위치를 두어, 서버 개발 진척도에 따라 해당 API만 개별적으로 실서버(`request`)로 전환하거나 더미(`dummyRequest`)로 남겨둘 수 있습니다.
- **의존성 주입 (Dependency Injection)**: 더미를 반환해야 할 때, 필요한 JSON 데이터(`notice.json` 등)는 해당 도메인의 Service 모듈이 직접 Import한 뒤 `dummyRequest`의 매개변수로 주입합니다. 이를 통해 중앙 `api-client`를 거대해지지 않도록 방어합니다.

### 3. 상태 관리 및 세션 유지 (Token Verification)
- **Zustand 스토어 (`src/stores/auth-store.js`)**: 로그인한 사용자 정보, 인증 토큰 등 렌더링에 관여하는 동적 전역 상태를 관리합니다. 로그인/로그아웃 시점마다 `localStorage`와 연동하여 토큰의 영속성을 보장합니다.
- **새로고침 세션 방어 (Flicker Prevention)**: 브라우저가 새로고침되어 앱이 재구동될 때, `App.jsx`에서 가장 먼저 스토리지의 토큰을 읽어와 유효성 검사(`verifyAuth`) 로직을 수행합니다. 토큰 검증이 실패(만료 등)하면 스토어를 초기화하여 로그아웃 처리하고 로그인 뷰로 이동시킵니다. 또한 데이터 로딩 대기 시간 동안 빈 로딩 텍스트를 노출시켜 하위 라우트로 인해 발생하는 화면 번쩍임(Flicker)을 방어합니다.
- **정적 환경 설정 (`src/config/app-config.js`)**: 런타임에 자주 변경되지 않는 UI 옵션(예: Footer 노출 유무, 시스템 버전 등)은 스토어가 아닌 불변 객체(Constants)로 관리하여 메모리와 렌더링 성능을 최적화했습니다.

### 4. 공통 기능 및 전역 에러 제어 (Global Error Handling)
- **API 인터셉터**: `api-client.js` 내부에서 `fetch` 통신의 HTTP 상태 코드를 파싱하고, 서버 오류(500)나 권한 없음(401) 등의 예측 가능한 에러 플래그를 추출합니다.
- **`GlobalErrorToast` UI**: `ui-store`의 에러 상태를 구독하는 최상단 단위 컴포넌트입니다. `api-client`에서 던진 에러 메시지를 화면상에 일시적으로 띄워 사용자에게 노출하며, 일정 시간 후 스스로 닫힙니다.
- **다목적 공용 Modal (`useModal` & `<Modal>`)**: 인라인 스타일에 의존하지 않고 페이지 어디서든 동일한 규격으로 팝업을 렌더링하기 위한 공통 인프라입니다. `isOpen`, `openModal`, `closeModal` 상태/액션을 훅이 관리하고, 자식 요소(`children`) 및 풋터 구성을 유연하게 주입할 수 있습니다.

### 5. 동적 권한 제어 코어 시스템 (Dynamic RBAC)
프론트엔드 코드에 문자열(역할)을 하드코딩하지 않고, 서버-주도 모델을 채택한 엔터프라이즈급 권한 제어 방식입니다.
- **메뉴별 상세 액션 맵핑**: 프론트는 로그인 시 응답 데이터로부터 `permissions: [{ path: '/settings', actions: ['READ', 'CREATE'] }, ...]` 와 같은 라우팅별 허용 리스트 구조를 내려받아 인증 스토어(`auth-store`)에 탑재합니다.
- **라우터 가드 (`RequirePermission`)**: 애플리케이션 진입 전 최상단 라우터 컴포넌트(HOC)에서 현재 주소(`location.pathname`)가 사용자의 허가된 `permissions.path` 배열 안에 존재하는지 1차로 검증합니다. 통과하지 못하면 대시보드나 접근 거부 화면으로 강제 이동(Redirect)시킵니다.
- **화면(UI) 단위 액션 방어 (`usePermission` Hook)**: 성공적으로 허가된 도메인에 들어왔더라도, 페이지 내부 구성요소의 조작 권한(예: 단건 수정, 계정 삭제 버튼 렌더링 등)은 현재 페이지와 일치하는 권한 배열 속 `actions` 필드에 포함되어 있는지를 실시간으로 비교(`hasPermission('DELETE')`)해 안전하게 동작합니다.

## 개발 서버 실행 방법

1. 패키지 설치
   ```bash
   npm install
   ```

2. 개발 서버 구동 (실행 후 출력되는 로컬호스트 엔드포인트에 브라우저로 접속)
   ```bash
   npm run dev
   ```

3. 배포물(Production) 빌드 검증:
   ```bash
   npm run build
   ```

4. 로그인
* 인증 방식: 패스워드 검증 생략 (Any-string 입력 허용)
* 계정별 접근 제어:
    * admin: Full Access (전체 메뉴)
    * user: Restricted Access (일부 메뉴 진입 차단)

