# React CMS Base Project - Product Requirements Document (PRD)

## 1. 개요 (Overview)
본 프로젝트는 특정 뷰(UI) 라이브러리에 종속되지 않는(UI-Agnostic) 순수 기능 중심의 CMS(Content Management System) 기본 뼈대(Boilerplate)입니다. 향후 어떠한 디자인 시스템(Tailwind, MUI, Ant Design 등)을 도입하더라도 쉽게 얹어서 사용할 수 있도록, **라우팅, 상태 관리, 통신 모듈 커플링 방지, 에러 제어, 동적 권한 제어 코어 등 애플리케이션의 뼈대 논리**를 매우 견고하게 설계하는 것을 목표로 합니다.

## 2. 기술 스택 (Tech Stack)
- **Framework**: React 18+ (Vite 빌드 환경)
- **Routing**: `react-router-dom` v6+
- **State Management**: `zustand` (가벼운 전역 상태 관리)
- **Styling**: Vanilla CSS (최소한의 Flexbox 기반 구조 레이아웃만 적용)

## 3. 핵심 아키텍처 및 요구사항 (Core Architecture & Requirements)

### 3.1. 모듈화된 디렉토리 및 라우터 구조
- **확장성**: `src/pages/` 하위에 도메인 단위로 디렉토리를 분리하며, 각 페이지에 종속된 지역 상태 및 하위 컴포넌트를 응집시킵니다.
- **라우터 분리**: 라우터 설정 파일(`app-router.jsx`)의 비대화를 방지하기 위해, 대메뉴 단위로 분리된 하위 라우터 객체(예: `settings-router.jsx`)를 구성하여 최상단에서 Spread 연산자로 조립합니다.

### 3.2. 의존성 역전(IoC) 기반 API 연동 및 더미 제어망
- **UI 종속성 제거**: 어떤 화면 컴포넌트도 `fetch` 로직이나 백엔드 URL을 직접 갖지 않으며, 반드시 도메인별 서비스 스크립트(예: `auth-service.js`)를 통해 중간 유스케이스를 바라봅니다.
- **`api-client.js` 백엔드 클라이언트**: `request` (실서버 통신) 함수와 `dummyRequest` (더미 반환을 위한 지연된 Promise 동작) 함수만을 수행하며, 특정 JSON을 임포트하지 않은 순수 형태를 유지합니다.
- **유연한 더미 모드 전환 (`USE_MOCK`)**: 각 Service 파일(예: `notice-service.js`)에 위치한 스위치 값을 통해, 프론트엔드가 실서버 데이터를 요청할지 더미 JSON을 불러올지 판단하여 클라이언트 함수(`api-client`)에 의존성을 주입해 호출합니다. 개별 도메인별 진척도에 따른 모의 데이터 관리가 가능합니다.

### 3.3. 영속성 캐싱 및 인증 상태 감시 (Session Management)
- **새로고침 방어 컴포넌트**: `Zustand` 스토어와 `App.jsx`를 엮어, 앱 실행(새로고침) 시 무조건 스토리지 상의 `auth_token` 유효성 검증을 1순위로 실행(`verifyAuth`)하고 그 전에는 로딩 UI를 렌더링함으로써 하위 컴포넌트들의 화면 깜빡임과 빈 데이터 에러를 막습니다. (Flicker Prevention)
- **토큰 탈락 로직**: 통신 과정 중 만료되거나 훼손된 토큰 응답(401 등)이 확인되면 스토어 데이터를 즉시 초기화(`logout`)하고 로그인 화면으로 리다이렉트 시킵니다.

### 3.4. 글로벌 에러 핸들링 (Global Error Handling)
- **API 인터셉터 파싱**: `api-client.js` 내부에서 수행되는 `fetch` 결과의 HTTP 상태 코드를 가로채어, 서버 오류(500)나 권한 없음(401), 인증 만료 등 발생 가능성이 있는 예측 에러를 파싱하여 전역 `ui-store`에 전달합니다.
- **전역 알림 계층 (`GlobalErrorToast`)**: 최상단 라우터 범위를 감싸는 에러 알림 UI를 마운트하여, 단일 컴포넌트 및 페이지 이동에 종속되지 않고 앱 전역 어디서나 중앙 에러 알림을 노출시키며 일정 시간 후 자동으로 닫힐 수 있는(`clearError`) 동작을 수행합니다.

### 3.5. 다목적 공용 오버레이 모달 (Common Modal System)
- **디자인 제어권 분리**: 각 화면(`dashboard-page.jsx` 등) 단에서 하드코딩된 인라인 스타일, 또는 로컬 `useState`로 모달 열림을 관리하던 불필요한 행위를 완전히 걷어냈습니다.
- **훅 기반 상태 관리 (`useModal`)**: 상태 관리와 랜더링 처리를 분리하여 `isOpen`, `openModal()`, `closeModal()`만을 호출하도록 개선했습니다.
- **기본 레이아웃 및 동작 보장 (`<Modal>`)**: `footer` 프로퍼티 전달이 없을 시 기본 닫기 버튼을 자동 제공하며, 외부 Dim(dimmed 영역) 클릭 차단 기능 및 단축키(ESC) 반응 닫기 기능을 지원합니다.

### 3.6. 동적 권한 제어 핵심 시스템 (Enterprise Dynamic RBAC)
단순한 형태의 `ADMIN`/`USER` 역할 문자열이나 정적 배열 비교 로직의 한계를 개선한, 서버 설정 주도형 권한 맵핑 아키텍처입니다.

- **데이터 기반 제어 배열**: 로그인 또는 세션 갱신 성공 시 데이터베이스(서버)로부터 접근 가능한 메뉴 정보 및 상세 액션 권한을 담은 형태의 배열 `permissions: [{ path: '/settings', actions: ['READ', 'UPDATE'] }]` 을 획득해 스토어에 보존합니다.
- **1차 진입 차단 가드 (`RequirePermission` Route Guard)**: URL 상의 경로(`location.pathname`)와 인증 스토어 안의 경로(`path`) 배열 값을 대조하여, 허가받은 경로인지 검증합니다. 통과하지 못한 URL 직접 입력 시나리오는 대시보드 강제 이동 등으로 방어합니다.
- **2차 세부 기능 차단 훅 (`usePermission` UI Guard)**: 해당 화면에 무사히 진입했다 하더라도, 그 화면 안에서 수행할 특정 동작(저장, 등록, 삭제)에 대응되는 버튼, 입력 폼 등은 이 훅을 통해 `actions` 배열값으로 판별(`hasPermission('DELETE')`)해 렌더링을 DOM에서 아예 배제시키거나 비활성화(disabled) 상태로 만듭니다.
- **관리자/유저 교차 데이터 제어 시뮬레이션**: 로그인 시 입력되는 `username === 'admin'` 분기 처리를 통해, `admin.json`(전역 통제 가능 권한 모음) 또는 `user.json`(제한된 액션만 가지는 에디터 권한 모음) 데이터를 동적으로 `dummyRequest`에 주입해 테스트 가능성을 지원합니다.

## 4. 추후 개발 계획 및 잠재 모듈 (Roadmap)
- API 통신의 성공 및 정보를 알리는 공통 토스트(Success/Info Toast) 시스템 확장
- 공통 '확인(Confirm)' 및 '취소'를 묻는 프롬프트 다이얼로그 모듈화
- 표준화된 그리드 표시 및 페이지네이션(Pagination)용 공통 `Table` 컴포넌트 추가
- 로딩 중 사용자 조작을 방어하고 인지시키는 `Global Loading Spinner` 구현
- 앱 렌더링 치명타(Crash) 방어를 위한 `React Error Boundary` 적용
