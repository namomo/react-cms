# 개발 가이드 (Development Guide)

이 문서는 React CMS 프로젝트를 개발하면서 자주 수행하는 작업들에 대한 표준 절차를 안내합니다.

## 코딩 컨벤션 및 네이밍 규칙

새로운 파일을 생성하거나 코드를 작성할 때, 프로젝트의 일관성 유지 및 운영체제-Git 간의 호환성 확보를 위해 다음의 규칙을 **반드시** 준수해야 합니다.

### 1. 디렉토리 및 파일 네이밍
단어와 단어 사이는 하이픈(`-`)으로 연결하는 **kebab-case** 를 사용하며, 모든 글자는 **소문자** 로 작성합니다. (대소문자 혼용 금지)
- **예시**: `/components/interface-write/interface-write.jsx`

### 2. 컴포넌트 명칭
React UI 컴포넌트의 함수명은 단어의 첫 글자를 대문자로 표기하는 **PascalCase** 를 사용합니다.
- **예시**: `const InterfaceWrite = () => { ... };`

### 3. 상태 관리(Zustand) 모듈
Zustand 스토어 파일명은 `[기능]-store.js` 형태로 통일하며, 스토어 생성 함수명은 `create[기능]Store` 형태로 작성합니다. 디렉토리는 `/stores/` 내부 혹은 특정 컴포넌트에 강하게 종속되는 경우 하위에 바로 위치시킵니다.
- **예시 파일명**: `interface-write-store.js`
- **예시 선언부**: `const useInterfaceWriteStore = create((set) => ({ ... }));`

### 4. 커스텀 훅 (Custom Hooks)
- 파일명: `use[기능].js`, `use[기능]Effect.js` 등 카멜케이스 사용 **금지**. 반드시 `kebab-case` 로 파일을 분리하거나 소문자화하여 생성하되, 가독성을 위해 **기존 파일 네이밍을 준수**합니다. 함수명 스펙은 **camelCase**를 사용하며 반드시 `use`로 시작해야 합니다.
- **예시 함수명**: `useSaveHandler`, `useInterfaceWriteEffect`

### 5. 기본 코딩 규칙
- **원칙**: KISS (Keep It Simple, Stupid), YAGNI (You Aren't Gonna Need It), DRY (Don't Repeat Yourself) 원칙을 따릅니다.
- **SRP (단일 책임 원칙)**: 함수나 컴포넌트는 단 1개의 책임만을 가집니다. 특정 기능이 비대해지면 여러 작은 함수/훅으로 분리하세요.
- 매직 넘버 사용을 피하고, 상수로 정의하여 의미 있는 변수명을 부여하세요. 로직이 복잡해질 경우 주석을 필수로 작성합니다.

---

## 신규 페이지 추가 및 연동 가이드

새로운 페이지 컴포넌트를 만들고, 이를 라우터와 네비게이션 메뉴에 연결한 뒤 권한(RBAC)을 설정하는 일련의 과정입니다. 반드시 아래의 순서와 규칙을 준수하여 작업해주세요.

### 1. 페이지 컴포넌트 생성
- **위치**: `src/pages/` 하위의 도메인(상위 메뉴/하위 메뉴) 디렉토리
- 도메인과 기능에 맞게 폴더를 세분화하고, `kebab-case` 네이밍 규칙을 엄격히 적용하여 파일을 생성합니다.
- **예시**: `src/pages/content/items/items-detail-page.jsx`

### 2. 라우터 파일에 경로 등록
- **위치**: `src/routes/` 내의 해당 도메인 라우터 (예: `content-router.jsx`)
- 신규 페이지의 컴포넌트를 `import` 한 후, 라우트 객체 배열에 새로운 경로(`path`)와 컴포넌트(`element`)를 매핑합니다.
- **예시**:
  ```jsx
  {
    path: 'items/:id',
    element: <ItemsDetailPage />
  }
  ```

### 3. 사이드바(네비게이션) 메뉴 추가
- **위치**: `src/components/layout/sidebar/` 내의 사이드바 구성 파일 (`sidebar.jsx` 또는 관련 설정 파일)
- 관리자가 클릭하여 이동할 수 있도록 UI에 노출되는 상위/하위 메뉴 목록에 새로운 경로(link)와 메뉴명을 추가합니다.

### 4. 접근 권한(RBAC) 항목 추가
- **위치**: (더미 데이터 기준) `src/api/dummy/login.json` 및 `verify.json`
- 동적 권한 제어 시스템에 의해 접근이 차단되지 않도록, 사용자 계정의 `permissions` 배열에 신규 페이지의 `path`와 허용할 `actions`(예: `["READ", "CREATE"]`)를 추가해야 합니다.
- **예시**:
  ```json
  {
    "path": "/content/items/:id",
    "actions": ["READ", "UPDATE"]
  }
  ```

## API 연동 및 Mock(더미) 데이터 활용 가이드

백엔드 API가 아직 완성되지 않았거나, 화면 UI부터 병렬로 개발해야 할 때 유용한 Mock 데이터 활용 방법입니다.

### 1. 전역/지역 Mock 스위치 제어
프로젝트의 서비스 레이어(`src/services/`) 모듈들은 실 API 통신과 Mock 데이터를 쉽게 스위칭할 수 있도록 구성되어 있습니다.

- **위치**: `src/services/[도메인]-service.js` 파일 내부 최상단
- **방법**: `USE_MOCK` 상수값을 이용하여 제어합니다.
  - `const USE_MOCK = true;` : 백엔드 통신 없이 서버 역할을 클라이언트가 대신하여 더미 JSON 파일 반환
  - `const USE_MOCK = false;` : 실제 `request` 함수를 통해 백엔드 엔드포인트와 통신

### 2. 더미 JSON 데이터 작성
API 연동 전 화면을 구성해야 할 때 더미 데이터를 직접 작성합니다.
- **위치**: `src/api/dummy/` 디렉토리
- 필요한 도메인별 JSON 파일(예: `admin.json`, `notice.json`)을 생성하고 응답받을 예상 스펙에 맞춰 JSON을 작성합니다.

### 3. Service Layer 패턴
화면(UI) 컴포넌트는 직접 `fetch`를 호출하거나 더미 데이터를 `import`하지 않습니다. 반드시 `services/` 하위의 레이어를 통해서만 통신 로직을 호출하세요.

- **예시 (`auth-service.js` 참고)**:
  ```javascript
  import { request, dummyRequest } from '../api/api-client';
  import dummyData from '../api/dummy/user.json';

  const USE_MOCK = true;

  export const authService = {
    login: async (username, password) => {
      // 1. 개발 진행 중: Dummy Data Delay 반환 (ms 설정 가능)
      if (USE_MOCK) {
        return dummyRequest(dummyData, 1000);
      }

      // 2. 서버 연동 후: 실제 Fetch 요청 수행
      return request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
    }
  };
  ```
- 위 구조를 통해 화면 컴포넌트 개발자는 통신 성공/오류 분기 로직(try-catch) 작성에만 집중할 수 있습니다. 스위치가 변경되더라도 컴포넌트 코드는 전혀 수정할 필요가 없습니다.

## 공통 UI 컴포넌트 활용 가이드

본 프로젝트는 일관된 사용자 경험(UX)을 위해 팝업(Modal)과 에러 알림(Toast) 기능을 공용으로 제공합니다. 개별 페이지에서 직접 만들지 말고 아래의 가이드에 따라 제공된 훅(Hook)을 사용해 구현하세요.

### 1. 전역 에러 알림 (`GlobalErrorToast`)
API 통신 중 서버 에러(500, 403, 404 등)가 발생하거나, 프론트엔드에서 사용권한이 거부된 경우 등 치명적인 오류가 발생할 때 화면의 우측 하단(또는 상단)에 시스템 알림 메시지를 표출합니다.

- **자동 표출 처리**: `src/api/api-client.js` 파일 내의 `request`(실제 연동) 및 `dummyRequest`(더미 테스트) 로직에 인터셉터가 구현되어 있어, HTTP 에러 코드를 감지하면 자동으로 에러 메시지를 노출시킵니다.
- **수동 표출 제어**: 특정 화면 이벤트(예: 유효성 검사 실패 시 경고창 목적 등)에 의해 임의로 에러 알림을 발생시키고 싶다면 `ui-store`를 활용합니다.
  ```jsx
  import useUiStore from '../../stores/ui-store';

  const CustomComponent = () => {
    const showError = useUiStore((state) => state.showError);

    const handleFormSubmit = () => {
        if (!isValid) {
            showError('입력된 값이 올바르지 않습니다.');
            return;
        }
    };
  };
  ```
  *(발생한 에러 토스트는 컴포넌트에 구현된 시간(`AUTO_CLOSE_DURATION`) 설정값에 따라 자동으로 닫힙니다.)*

### 2. 다목적 공용 Modal (`useModal` & `<Modal>`)
`display: block` 같은 인라인 스타일에 의존하지 않고, 어떤 페이지에서든 동일한 레이아웃 구조와 스타일로 모달을 띄우기 위해 제공되는 공용 인프라입니다. 커스텀 훅을 통해 상태와 액션을 제어합니다.

- **사용 방식**: 모달이 필요한 컴포넌트 내부에서 `useModal`을 호출하여 상태(`isOpen`)와 제어 함수(`openModal`, `closeModal`)를 얻은 뒤, UI 컴포넌트인 `<Modal>`을 렌더링합니다.
- **예시**:
  ```jsx
  import React from 'react';
  import useModal from '../../../hooks/useModal';
  import Modal from '../../common/modal/modal';

  const DeleteButtonPanel = () => {
    // 1. 모달 훅 호출
    const { isOpen, openModal, closeModal } = useModal();

    // 2. 모달 내 동작 제어 핸들러
    const confirmDelete = () => {
      // 삭제 처리 로직...
      closeModal(); // 완료 후 닫기
    };

    return (
      <div>
        <button onClick={openModal}>삭제하기</button>

        {/* 3. 모달 컴포넌트 렌더링 */}
        <Modal
          isOpen={isOpen}
          onClose={closeModal}
          title="항목 삭제"
          footer={
            <>
              <button className="btn btn-secondary" onClick={closeModal}>취소</button>
              <button className="btn btn-danger" onClick={confirmDelete}>삭제</button>
            </>
          }
        >
          <p>정말로 이 항목을 삭제하시겠습니까? 복구할 수 없습니다.</p>
        </Modal>
      </div>
    );
  };

  export default DeleteButtonPanel;
  ```
- 이처럼 모달 안의 본문 요소(`children`)나 하단 버튼 영역(`footer`)을 페이지의 맥락에 맞게 유연하게 구성할 수 있습니다.
