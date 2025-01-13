export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
  console.error('환경 변수 로드 실패: .env 파일을 확인하세요.');
}
