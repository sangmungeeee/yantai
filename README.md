# I ♥ 烟台 — 여행 앱

옌타이 3박 4일(2026.11.21–11.24) 일정 앱. 홈 화면에 추가해서 쓰는 웹앱(PWA)이고, 한 번 열면 인터넷 없이도 열려.

## 파일
- `index.html` — 앱 화면
- `data.js` — 일정·장소·체크·짐·링크 데이터 (노션 기준). 내용 바꿀 땐 이 파일만 고치면 돼
- `sw.js` — 오프라인 저장. 데이터 바꾸면 맨 위 `VERSION` 숫자 올리기 (yt-v1 → yt-v2)
- `manifest.webmanifest`, `icons/` — 홈 화면 아이콘
- `fonts/` — Pretendard

## 배포 (GitHub → Vercel)
1. github.com 가입 → 오른쪽 위 ＋ → New repository → 이름 `yantai-trip` → Create
2. "uploading an existing file" 누르고 이 폴더 안의 파일·폴더를 전부 끌어다 놓기 → Commit changes
3. vercel.com → Sign up → Continue with GitHub
4. Add New → Project → `yantai-trip` Import → Framework Preset: Other → Deploy
5. 나온 주소(…vercel.app)를 아이폰 사파리로 열기 → 공유 → 홈 화면에 추가

이후엔 GitHub에서 `data.js`만 고쳐서 저장하면 Vercel이 1분 안에 자동으로 다시 배포해.

## 앱에서 수정 (모든 기기 동기화)
- 오른쪽 위 ✏️ 편집 → 일정·장소·체크·짐·링크 추가/수정/삭제
- 고친 내용은 `api/data.js`가 Vercel Storage(Upstash Redis)에 저장해서 모든 기기에 똑같이 보여
- 처음 한 번: Vercel 프로젝트 → Storage → Create Database → Upstash(Redis) → 프로젝트에 Connect → Redeploy
- `data.js`의 `TRIP_REV`를 올리면(노션 기준으로 다시 맞출 때) 앱에서 고친 내용 대신 data.js 내용이 적용돼
