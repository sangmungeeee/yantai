# 일정표 출력 양식
- `print_ipad_all.js`: 아이패드 11인치 가로(1180x820 CSS, 4배 = 4720x3280 PNG + 벡터 PDF) 한 장에 1~4일차 4칸. 중국어 주소는 숨김(상호명·메모만).
- `print_a4.js`: A4 세로 2장 (1-2일차 / 3-4일차, 좌우 2칸), 주소 포함, 글자 크기 자동 맞춤.
- 실행: `node tools/print_ipad_all.js` (playwright 필요, 결과는 /mnt/user-data/outputs)
