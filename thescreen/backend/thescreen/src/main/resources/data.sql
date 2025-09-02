-- 공지사항 가데이터 (제목과 내용 업그레이드, 날짜 2025년 8월 10일 이후로 조정)
INSERT IGNORE INTO notice (noticenum, noticetype, noticesub, noticedate, noticecontents, writer) VALUES
  (1, '공지', '서비스 안정화를 위한 시스템 점검 안내', '2025-08-10 09:00:00', '고객 여러분의 원활한 서비스 이용을 위해 시스템 안정화 점검을 진행합니다. 점검 시간 동안 일부 기능이 제한될 수 있습니다. (예정 시간: 2025년 8월 10일 09:00 ~ 12:00)', 'admin'),
  (2, '공지', '이용약관 및 개인정보 처리방침 개정 안내', '2025-08-11 10:00:00', '보다 나은 서비스 제공을 위해 이용약관과 개인정보 처리방침이 2025년 8월 11일자로 개정됩니다. 자세한 내용은 홈페이지에서 확인 부탁드립니다.', 'admin'),
  (3, '이벤트', '2025 여름 시즌 특별 할인 프로모션', '2025-08-12 14:00:00', '여름을 맞아 최대 30% 할인된 영화 티켓과 팝콘 세트 증정 이벤트를 진행합니다! 이벤트 기간: 2025년 8월 12일 ~ 8월 31일', 'event_manager'),
  (4, '이벤트', '신규 회원 가입 환영 이벤트', '2025-08-13 15:00:00', '신규 회원 가입 시 5,000원 할인 쿠폰과 첫 예매 무료 음료 쿠폰을 드립니다! 지금 가입하고 혜택을 누리세요.', 'event_manager'),
  (5, '문의', '예매 취소 절차 관련 문의', '2025-08-14 11:00:00', '예매 취소가 원활히 진행되지 않는 경우, 고객센터로 문의 주시면 빠르게 처리해드리겠습니다.', 'admin'),
  (6, '문의', '포인트 적립 및 사용 방법 문의', '2025-08-14 13:30:00', '포인트 적립 내역 확인 및 사용 방법에 대해 궁금하신 점이 있으시면 마이페이지에서 확인 가능합니다.', 'admin'),
  (7, '문의', '좌석 선택 오류 해결 요청', '2025-08-15 16:00:00', '좌석 선택 시 발생하는 오류로 불편을 겪으셨다면, 고객센터로 연락 주시면 즉시 지원드리겠습니다.', 'admin'),
  (8, '문의', '결제 시스템 오류 관련 문의', '2025-08-15 17:30:00', '결제 시 발생한 오류에 대해 신속히 점검 후 해결 방안을 안내드리겠습니다.', 'admin'),
  (9, '문의', '로그인 장애 문의', '2025-08-16 09:00:00', '로그인에 문제가 있으시다면, 계정 복구 절차를 안내드립니다. 고객센터로 문의해 주세요.', 'admin'),
  (10, '점검', '정기 시스템 유지보수 안내', '2025-08-17 00:00:00', '서비스 품질 향상을 위한 정기 유지보수가 진행됩니다. 점검 시간: 2025년 8월 17일 00:00 ~ 03:00', 'admin'),
  (11, '점검', '긴급 서버 업그레이드 안내', '2025-08-17 02:00:00', '더 나은 서비스 제공을 위해 긴급 서버 업그레이드를 실시합니다. 점검 시간: 2025년 8월 17일 02:00 ~ 04:00', 'admin'),
  (12, '공지', '영화 상영 일정 변경 안내', '2025-08-18 10:00:00', '일부 영화의 상영 시간이 조정되었습니다. 정확한 시간은 홈페이지 상영 시간표에서 확인해 주세요.', 'admin'),
  (13, '공지', '서비스 이용 정책 개정 안내', '2025-08-18 11:00:00', '보다 공정한 서비스 이용을 위해 일부 정책이 개정되었습니다. 자세한 내용은 공지사항을 확인해 주세요.', 'admin'),
  (14, '공지', 'VIP 회원 혜택 프로그램 안내', '2025-08-19 09:30:00', 'VIP 회원을 위한 특별 혜택 프로그램이 새롭게 도입되었습니다. 등급별 혜택을 확인해 보세요!', 'admin'),
  (15, '공지', '모바일 앱 최신 버전 업데이트 안내', '2025-08-19 14:00:00', '더 나은 사용자 경험을 위해 모바일 앱이 업데이트되었습니다. 최신 버전으로 업그레이드해 주세요.', 'admin');

-- FAQ 가데이터 (제목과 내용 업그레이드, 날짜 2025년 8월 10일 이후로 조정)
INSERT IGNORE INTO faq (faqnum, faqsub, faqdate, faqcontents) VALUES
  (1, '회원가입 절차는 어떻게 되나요?', '2025-08-10 09:00:00', '홈페이지 상단의 "회원가입" 버튼을 클릭하여 간단한 정보 입력 후 가입할 수 있습니다. 자세한 가이드는 도움말 페이지에서 확인하세요.'),
  (2, '비밀번호를 분실했을 경우 어떻게 해야 하나요?', '2025-08-10 10:00:00', '로그인 화면의 "비밀번호 찾기"를 클릭하여 이메일 또는 전화번호로 인증 후 새 비밀번호를 설정할 수 있습니다.'),
  (3, '예매한 영화 티켓은 어디서 확인할 수 있나요?', '2025-08-11 11:00:00', '마이페이지의 "예매 내역" 메뉴에서 예매한 티켓의 상세 정보를 확인하실 수 있습니다.'),
  (4, '예매 취소는 어떻게 진행하나요?', '2025-08-11 12:30:00', '마이페이지 > 예매 내역에서 취소하고자 하는 티켓을 선택하여 취소할 수 있습니다. 취소 기한은 상영 2시간 전까지입니다.'),
  (5, '포인트는 어떻게 적립되고 사용하나요?', '2025-08-12 13:00:00', '영화 예매 시 결제 금액의 5%가 포인트로 적립되며, 결제 시 포인트를 사용하여 할인받을 수 있습니다.'),
  (6, '쿠폰은 어디서 사용 가능한가요?', '2025-08-12 14:00:00', '결제 페이지에서 "쿠폰 적용" 옵션을 선택하여 등록된 쿠폰을 사용할 수 있습니다.'),
  (7, '좌석 변경은 가능한가요?', '2025-08-13 15:30:00', '좌석 변경은 불가하며, 원하는 좌석으로 예매를 원하실 경우 기존 예매를 취소한 후 재예매해 주세요.'),
  (8, '문의사항은 어디로 접수하나요?', '2025-08-13 16:30:00', '고객센터 페이지 또는 1:1 문의 메뉴를 통해 문의사항을 접수하실 수 있습니다.'),
  (9, '모바일 티켓은 어떻게 발급받나요?', '2025-08-14 17:00:00', '예매 완료 후 SMS 또는 모바일 앱을 통해 QR 코드 형태의 모바일 티켓이 자동 발급됩니다.'),
  (10, '영화 관람 등급은 어디서 확인하나요?', '2025-08-14 18:00:00', '영화 상세 페이지 또는 예매 페이지에서 해당 영화의 관람 등급을 확인할 수 있습니다.');
-- 결제(payment) 가데이터 15개 생성
DROP TEMPORARY TABLE IF EXISTS temp_numbers;
CREATE TEMPORARY TABLE temp_numbers (n INT);
INSERT INTO temp_numbers (n)
SELECT a.N + 1
FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
      SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION
      SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14) a;

INSERT IGNORE INTO payment (
    paymentcd,
    paymentmethod,
    paymenttime,
    amount,
    paymentstatus
)
SELECT
    CONCAT('PAY', LPAD(n, 3, '0')),
    ELT(FLOOR(1 + (RAND() * 4)), '카카오 뱅크', '농협', '토스페이', '네이버 페이'),
    DATE_ADD('2025-07-01', INTERVAL FLOOR(RAND()*7) DAY) + INTERVAL FLOOR(RAND()*24) HOUR + INTERVAL FLOOR(RAND()*60) MINUTE,
    ELT(FLOOR(1 + (RAND() * 3)), 10000, 20000, 30000),
    '결제 완료'
FROM temp_numbers;

-- 예약(reservation) 가데이터 1000개 생성
DROP TEMPORARY TABLE IF EXISTS temp_numbers;
CREATE TEMPORARY TABLE temp_numbers (n INT);

INSERT INTO temp_numbers (n)
SELECT (a.N + b.N * 10 + c.N * 100 + 1) AS num
FROM (
         SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
         SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
     ) a,
     (
         SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
         SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9
     ) b,
     (
         SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5
         UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9

     ) c
WHERE (a.N + b.N * 10 + c.N * 100 + 1) <= 1000;

INSERT IGNORE INTO reservation (
    reservationcd,
    userid,
    schedulecd,
    reservationtime,
    reservationstatus,
    seatcd,
    paymentcd
)
SELECT
    CONCAT(LPAD(n, 12, '0')),
    CONCAT('user', LPAD(FLOOR(1 + (RAND() * 50)), 3, '0')),
    (SELECT schedulecd FROM schedule ORDER BY RAND() LIMIT 1),
    DATE_ADD('2025-07-31', INTERVAL FLOOR(RAND()*13) DAY)
      + INTERVAL FLOOR(RAND()*24) HOUR + INTERVAL FLOOR(RAND()*60) MINUTE,
    IF(RAND() < 0.5, '예약완료', '예약취소'),
    CONCAT(CHAR(65 + FLOOR(RAND()*10)), LPAD(FLOOR(1 + (RAND()*10)), 2, '0')),
    CONCAT('PAY', LPAD(FLOOR(1 + (RAND()*15)), 3, '0'))
FROM temp_numbers;

-- staff 가데이터 생성
DROP TEMPORARY TABLE IF EXISTS temp_numbers;
CREATE TEMPORARY TABLE temp_numbers (n INT);
INSERT INTO temp_numbers (n)
SELECT a.N + 1
FROM (SELECT 0 AS N UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION
      SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION
      SELECT 10 UNION SELECT 11 UNION SELECT 12 UNION SELECT 13 UNION SELECT 14
      UNION SELECT 15 UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
      UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23 UNION SELECT 24
      UNION SELECT 25 UNION SELECT 26 UNION SELECT 27 UNION SELECT 28 UNION SELECT 29
     ) a;

INSERT IGNORE INTO staff (
    staffid,
    staffname,
    dept,
    position,
    phone,
    email,
    theater,
    hiredate,
    shifttype,
    role,
    status
)
SELECT
    CONCAT('staff', LPAD(n, 3, '0')),
    CONCAT('직원', n, '번'),
    ELT(FLOOR(1 + (RAND() * 5)), '운영팀', '고객서비스', '매표팀', '상영관팀', '매점팀'),
    ELT(FLOOR(1 + (RAND() * 3)), '사원', '대리', '매니저'),
    CONCAT('010-', LPAD(FLOOR(RAND()*9000)+1000, 4, '0'), '-', LPAD(FLOOR(RAND()*9000)+1000, 4, '0')),
    CONCAT('staff', n, '@example.com'),
    ELT(FLOOR(1 + (RAND() * 8)), 'THR001', 'THR002', 'THR003', 'THR004', 'THR005', 'THR006', 'THR007', 'THR008'),
    DATE_ADD('2000-01-01', INTERVAL FLOOR(RAND()*9000) DAY),
    ELT(FLOOR(1 + (RAND() * 2)), '주간', '야간'),
    ELT(FLOOR(1 + (RAND() * 5)), '지점 관리', '고객 응대', '매표', '상영관 관리', '매점 판매'),
    ELT(FLOOR(1 + (RAND() * 2)), '근무중', '휴가')
FROM temp_numbers;
