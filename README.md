# React CMS Base Project (UI-Agnostic)

본 프로젝트는 특정 디자인 시스템(MUI, Ant Design 등)에 종속되지 않는 순수한 기능 중심의 **CMS(Content Management System)** 기본 뼈대입니다. 핵심 비즈니스 로직과 확장 가능한 레이아웃 구조를 견고하게 설계하여, 추후 다양한 UI 프레임워크를 유연하게 적용할 수 있도록 제작되었습니다.

## 🚀 주요 특징

- **UI-Agnostic 설계**: 특정 UI 라이브러리에 의존하지 않고 Vanilla CSS와 공통 컴포넌트 구조만으로 핵심 기능을 구현했습니다.
- **Service Layer & IoC**: UI 컴포넌트와 API 통신 로직을 서비스 계층으로 분리하여 유지보수성을 높였습니다.
- **동적 권한 제어 (Dynamic RBAC)**: 서버 주도형 권한 시스템을 통해 메뉴 및 버튼 단위의 세밀한 접근 제어가 가능합니다.
- **개별 Mock 스위칭**: 백엔드 개발 진척도에 따라 개별 API별로 실서버/더미(Mock) 데이터를 자유롭게 전환할 수 있습니다.
- **전역 에러 핸들링**: API 인터셉터를 통한 중앙 집중식 에러 관리 및 Toast UI 알림 기능을 제공합니다.

## 🛠 기술 스택

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **State Management**: [Zustand 5](https://zustand-demo.pmnd.rs/)
- **Styling**: Vanilla CSS (Flexbox 기반 최소 레이아웃)

## 📂 프로젝트 구조

```text
src/
├── api/            # API 클라이언트 및 더미 데이터(dummy/)
├── components/     # 재사용 가능한 공통 컴포넌트 (common, layout)
├── config/         # 앱 환경 설정 및 상수
├── hooks/          # 커스텀 훅
├── layouts/        # 메인/인증 레이아웃 껍데기
├── pages/          # 도메인별 페이지 화면
├── routes/         # 라우팅 정의 (메뉴별 분리 및 병합)
├── services/       # 비즈니스 로직 및 API 호출 계층
└── stores/         # Zustand 전역 상태 저장소
```

## ⚙️ 시작하기

### 1. 패키지 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 빌드 및 미리보기
```bash
npm run build
npm run preview
```

## 🔒 로그인 테스트 안내

본 앱은 인증 로직 시뮬레이션을 위해 패스워드 검증을 생략합니다.

- **Admin 계정**: `admin` 입력 시 모든 메뉴 접근 가능
- **User 계정**: `user` 입력 시 일부 메뉴 접근 제한

## 📄 라이선스

이 프로젝트는 ISC 라이선스를 따릅니다.
