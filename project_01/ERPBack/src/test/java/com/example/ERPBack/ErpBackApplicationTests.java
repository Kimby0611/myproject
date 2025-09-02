package com.example.ERPBack;

import com.example.ERPBack.entity.Department_table;
import com.example.ERPBack.entity.User_table;
import com.example.ERPBack.entity.Asset_table;
import com.example.ERPBack.entity.Status;
import com.example.ERPBack.entity.FreeBoard_table;
import com.example.ERPBack.entity.Notice_table;
import com.example.ERPBack.repository.AssetRepository;
import com.example.ERPBack.repository.DepartmentRepository;
import com.example.ERPBack.repository.UserRepository;
import com.example.ERPBack.repository.FreeBoardRepository;
import com.example.ERPBack.repository.NoticeRepository;
import com.example.ERPBack.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ErpBackApplicationTests {

	@Autowired
	private UserRepository userRepository;
	@Autowired
	private DepartmentRepository departmentRepository;
	@Autowired
	private AssetRepository assetRepository;
	@Autowired
	private FreeBoardRepository freeBoardRepository;
	@Autowired
	private NoticeRepository noticeRepository;
	@Autowired
	private UserService userService;
	@Autowired
	private BCryptPasswordEncoder passwordEncoder;

	@BeforeEach
	void setUp() {
		userRepository.deleteAll();
		departmentRepository.deleteAll();
		assetRepository.deleteAll();
		freeBoardRepository.deleteAll();
		noticeRepository.deleteAll();
		assertEquals(0, userRepository.count(), "사용자 데이터 초기화 확인");
		assertEquals(0, departmentRepository.count(), "부서 데이터 초기화 확인");
		assertEquals(0, assetRepository.count(), "자산 데이터 초기화 확인");
		assertEquals(0, freeBoardRepository.count(), "자유게시판 데이터 초기화 확인");
		assertEquals(0, noticeRepository.count(), "공지사항 데이터 초기화 확인");
	}

	@Test
	void testJpa() {
		// 부서 데이터 삽입 (10개)
		String[] departmentNames = {
				"기획부", "사업부", "개발부", "보안부", "디자인부",
				"품질관리부", "운영부", "인사부", "총무부", "마케팅부"
		};
		for (int i = 0; i < 10; i++) {
			Department_table dept = new Department_table();
			dept.setDepartment_code(String.format("%03d", i + 1)); // 001~010
			dept.setDepartment_name(departmentNames[i]);
			departmentRepository.save(dept);
		}
		assertEquals(10, departmentRepository.count(), "부서 데이터 10개가 삽입되어야 합니다.");

		// 사용자 데이터 삽입 (100명)
		String[] names = {
				"김민수", "이서연", "박지훈", "최유진", "정하늘",
				"강태오", "윤소희", "한지민", "오세훈", "신아름",
				"문재영", "배수지", "조민재", "류현우", "서지안",
				"홍석천", "임나연", "장도연", "곽민준", "송혜린",
				"김태현", "이민정", "박소영", "최지우", "정민호",
				"강지훈", "윤지영", "한수민", "오지훈", "신혜진",
				"문수영", "배지민", "조하영", "류지훈", "서민재",
				"홍지영", "임지훈", "장민수", "곽지영", "송민정"
		};
		String[] ranks = {"사장", "이사", "부장", "차장", "과장", "대리", "사원", "인턴"};
		int[] rankCounts = {1, 1, 3, 5, 10, 20, 50, 10}; // 각 직급별 인원 수
		int[] currentRankCounts = new int[ranks.length]; // 현재 직급별 카운트

		for (int i = 1; i <= 100; i++) {
			User_table user = new User_table();
			String idSuffix = String.format("%03d", i);

			user.setUserid("user" + idSuffix);
			user.setUserpw("password" + idSuffix); // 평문 비밀번호 설정
			user.setUsername(names[new Random().nextInt(names.length)]);
			// rrnfront를 6자리(YYMMDD)로 생성
			int year = 70 + new Random().nextInt(30); // 1970~1999 (70~99)
			int month = 1 + new Random().nextInt(12); // 01~12
			int day = 1 + new Random().nextInt(28); // 01~28
			user.setRrnfront(String.format("%02d%02d%02d", year, month, day));
			user.setRrnback(String.format("%d%06d", 1 + new Random().nextInt(4), 100000 + i));
			user.setEmail("user" + idSuffix + "@example.com");
			user.setPhone("0101234" + String.format("%04d", i));
			int deptIndex = new Random().nextInt(10); // 0~9
			user.setDepartmentcode(String.format("%03d", deptIndex + 1));
			user.setDepartmentname(departmentNames[deptIndex]);

			// 직급 할당
			int rankIndex;
			do {
				rankIndex = new Random().nextInt(ranks.length);
			} while (currentRankCounts[rankIndex] >= rankCounts[rankIndex]);
			user.setRank(ranks[rankIndex]);
			currentRankCounts[rankIndex]++;

			// 권한 설정
			switch (user.getRank()) {
				case "사장":
				case "이사":
					user.setRole("관리자");
					break;
				case "부장":
				case "차장":
				case "과장":
					user.setRole("매니저");
					break;
				case "인턴":
					user.setRole("임시");
					break;
				default: // 대리, 사원
					user.setRole("사용자");
			}

			// UserService를 통해 저장하여 비밀번호 암호화
			userService.saveUser(user);
		}
		assertEquals(100, userRepository.count(), "사용자 데이터 100개가 삽입되어야 합니다.");
		// 직급 분포 검증
		assertEquals(1, userRepository.findAll().stream().filter(u -> u.getRank().equals("사장")).count(), "사장은 1명이어야 합니다.");
		assertEquals(1, userRepository.findAll().stream().filter(u -> u.getRank().equals("이사")).count(), "이사는 1명이어야 합니다.");
		assertEquals(3, userRepository.findAll().stream().filter(u -> u.getRank().equals("부장")).count(), "부장은 3명이어야 합니다.");
		assertEquals(5, userRepository.findAll().stream().filter(u -> u.getRank().equals("차장")).count(), "차장은 5명이어야 합니다.");
		assertEquals(10, userRepository.findAll().stream().filter(u -> u.getRank().equals("과장")).count(), "과장은 10명이어야 합니다.");
		assertEquals(20, userRepository.findAll().stream().filter(u -> u.getRank().equals("대리")).count(), "대리는 20명이어야 합니다.");
		assertEquals(50, userRepository.findAll().stream().filter(u -> u.getRank().equals("사원")).count(), "사원은 50명이어야 합니다.");
		assertEquals(10, userRepository.findAll().stream().filter(u -> u.getRank().equals("인턴")).count(), "인턴은 10명이어야 합니다.");
		// 권한 분포 검증
		assertEquals(2, userRepository.findAll().stream().filter(u -> u.getRole().equals("관리자")).count(), "admin은 2명이어야 합니다.");
		assertEquals(18, userRepository.findAll().stream().filter(u -> u.getRole().equals("매니저")).count(), "manager는 18명이어야 합니다.");
		assertEquals(70, userRepository.findAll().stream().filter(u -> u.getRole().equals("사용자")).count(), "user는 70명이어야 합니다.");
		assertEquals(10, userRepository.findAll().stream().filter(u -> u.getRole().equals("임시")).count(), "intern은 10명이어야 합니다.");
		// rrnfront 6자리 검증
		userRepository.findAll().forEach(user ->
				assertEquals(6, user.getRrnfront().length(), "rrnfront는 6자리여야 합니다: " + user.getUserid() + ", rrnfront: " + user.getRrnfront()));

		// 자산 데이터 삽입 (200개)
		String[] assetNames = {
				"노트북", "데스크톱", "모니터", "프린터", "서버",
				"키보드", "마우스", "스캐너", "프로젝터", "태블릿",
				"스마트폰", "스피커", "헤드셋", "웹캠", "라우터",
				"스위치", "NAS", "외장하드", "USB드라이브", "마이크",
				"모뎀", "프린터토너", "스마트보드", "디지털카메라", "VR헤드셋",
				"드론", "3D프린터", "스마트워치", "포스단말기", "바코드스캐너"
		};
		String[] companies = {"삼성", "LG", "HP", "Dell", "Apple", "Lenovo", "Asus", "Microsoft"};
		for (int i = 1; i <= 200; i++) {
			Asset_table asset = new Asset_table();
			String assetNumber = String.format("A%03d", i);
			asset.setAsset_number(assetNumber);
			asset.setAsset_name(assetNames[new Random().nextInt(assetNames.length)]);
			asset.setAsset_price(500000 + new Random().nextInt(2500000)); // 50만~300만
			asset.setCreate_company(companies[new Random().nextInt(companies.length)]);
			asset.setCreate_year(LocalDate.of(2015 + new Random().nextInt(11), 1 + new Random().nextInt(12), 1 + new Random().nextInt(28))); // 2015~2025
			int deptIndex = new Random().nextInt(10); // 0~9
			asset.setCharge_department(departmentNames[deptIndex]);
			asset.setStatus(new Random().nextBoolean() ? Status.사용 : Status.폐기);

			assetRepository.save(asset);
		}
		assertEquals(200, assetRepository.count(), "자산 데이터 200개가 삽입되어야 합니다.");

		// 자유게시판 데이터 삽입 (30개)
		String[] freeBoardTitles = {
				"팀 빌딩 활동 제안", "ERP 시스템 개선 의견", "신규 프로젝트 공유", "부서 간 소통 활성화 방법",
				"업무 효율화 툴 추천", "최근 IT 트렌드 공유", "사내 이벤트 아이디어", "휴가 일정 조율",
				"오피스 환경 개선 제안", "신입 교육 자료 공유"
		};
		String[] freeBoardContents = {
				"안녕하세요, 팀 빌딩을 위한 새로운 활동을 제안합니다. 야외 워크숍은 어떨까요?",
				"ERP 시스템의 UI가 조금 불편합니다. 개선할 부분을 논의하고 싶습니다.",
				"새로운 프로젝트의 진행 상황을 공유합니다. 의견 부탁드립니다!",
				"부서 간 소통을 위해 정기적인 미팅을 제안합니다.",
				"업무 효율화를 위해 사용 중인 툴을 추천드립니다.",
				"최근 IT 트렌드에 대한 자료를 공유합니다. 관심 있으신 분들 확인 부탁드려요.",
				"사내 이벤트를 기획 중입니다. 아이디어 있으시면 공유 부탁드립니다!",
				"휴가 일정 조율을 위해 의견을 모아봅니다.",
				"사무실 환경 개선을 위한 제안입니다. 조명 개선은 어떨까요?",
				"신입 사원 교육을 위한 자료를 공유합니다."
		};
		List<User_table> users = userRepository.findAll();
		for (int i = 1; i <= 30; i++) {
			FreeBoard_table freeBoard = new FreeBoard_table();
			freeBoard.setIndex(i);
			freeBoard.setTitle(freeBoardTitles[new Random().nextInt(freeBoardTitles.length)] + " " + i);
			freeBoard.setWriter(users.get(new Random().nextInt(users.size())).getUserid());
			freeBoard.setDate(LocalDate.of(2023 + new Random().nextInt(3), 1 + new Random().nextInt(12), 1 + new Random().nextInt(28))); // 2023~2025
			freeBoard.setContent(freeBoardContents[new Random().nextInt(freeBoardContents.length)]);
			freeBoardRepository.save(freeBoard);
		}
		assertEquals(30, freeBoardRepository.count(), "자유게시판 데이터 30개가 삽입되어야 합니다.");

		// 공지사항 데이터 삽입 (12개)
		String[] noticeTitles = {
				"사내 시스템 점검 안내", "연말 정산 교육", "보안 정책 업데이트", "신규 정책 안내",
				"사내 워크숍 일정", "복리후생 변경 안내", "ERP 시스템 패치 안내", "휴일 근무 안내",
				"사내 행사 안내", "인사 발령 공지", "보안 교육 일정", "시스템 사용 가이드 배포"
		};
		String[] noticeContents = {
				"사내 시스템 점검으로 인해 특정 시간 동안 접속이 제한됩니다.",
				"연말 정산을 위한 교육 세션이 진행됩니다. 참여 부탁드립니다.",
				"최신 보안 정책이 업데이트되었습니다. 확인 부탁드립니다.",
				"신규 정책이 시행됩니다. 자세한 내용은 첨부 파일을 확인하세요.",
				"사내 워크숍 일정이 확정되었습니다. 참석 부탁드립니다.",
				"복리후생 정책이 일부 변경되었습니다. 확인 부탁드립니다.",
				"ERP 시스템 패치가 예정되어 있습니다. 점검 시간을 확인하세요.",
				"휴일 근무 일정이 공지되었습니다. 대상자는 확인 부탁드립니다.",
				"사내 행사 일정이 확정되었습니다. 많은 참여 부탁드립니다.",
				"인사 발령이 있었습니다. 자세한 내용은 공지사항을 확인하세요.",
				"보안 교육 일정이 확정되었습니다. 필수 참여입니다.",
				"ERP 시스템 사용 가이드가 배포되었습니다. 참고 부탁드립니다."
		};
		for (int i = 1; i <= 12; i++) {
			Notice_table notice = new Notice_table();
			notice.setIndex(i);
			notice.setTitle(noticeTitles[new Random().nextInt(noticeTitles.length)] + " " + i);
			// 공지사항은 관리자 또는 매니저가 작성한다고 가정
			List<User_table> adminsAndManagers = userRepository.findAll().stream()
					.filter(u -> u.getRole().equals("관리자") || u.getRole().equals("매니저"))
					.toList();
			notice.setWriter(adminsAndManagers.get(new Random().nextInt(adminsAndManagers.size())).getUserid());
			notice.setDate(LocalDate.of(2023 + new Random().nextInt(3), 1 + new Random().nextInt(12), 1 + new Random().nextInt(28))); // 2023~2025
			notice.setContent(noticeContents[new Random().nextInt(noticeContents.length)]);
			noticeRepository.save(notice);
		}
		assertEquals(12, noticeRepository.count(), "공지사항 데이터 12개가 삽입되어야 합니다.");

		// 샘플 데이터 검증
		User_table sampleUser = userRepository.findById("user001").orElse(null);
		assertNotNull(sampleUser, "user001이 존재해야 합니다.");
		assertEquals("user001", sampleUser.getUserid());
		assertTrue(sampleUser.getUserpw().startsWith("$2a$"), "userpw는 BCrypt 형식이어야 합니다.");
		assertNotNull(sampleUser.getUsername(), "username은 null이 아니어야 합니다.");
		assertNotNull(sampleUser.getRrnback(), "rrn_back은 null이 아니어야 합니다.");
		assertNotNull(sampleUser.getRole(), "role은 null이 아니어야 합니다.");
		assertEquals(6, sampleUser.getRrnfront().length(), "user001의 rrnfront는 6자리여야 합니다.");

		Department_table sampleDept = departmentRepository.findById("001").orElse(null);
		assertNotNull(sampleDept, "부서 001이 존재해야 합니다.");
		assertEquals("기획부", sampleDept.getDepartment_name());

		Asset_table sampleAsset = assetRepository.findById("A001").orElse(null);
		assertNotNull(sampleAsset, "자산 A001이 존재해야 합니다.");
		assertNotNull(sampleAsset.getAsset_name(), "asset_name은 null이 아니어야 합니다.");
		assertTrue(sampleAsset.getAsset_price() >= 500000, "asset_price는 50만 이상이어야 합니다.");

		FreeBoard_table sampleFreeBoard = freeBoardRepository.findById(1).orElse(null);
		assertNotNull(sampleFreeBoard, "자유게시판 첫 번째 게시물이 존재해야 합니다.");
		assertNotNull(sampleFreeBoard.getTitle(), "자유게시판 제목은 null이 아니어야 합니다.");
		assertNotNull(sampleFreeBoard.getWriter(), "자유게시판 작성자는 null이 아니어야 합니다.");
		assertNotNull(sampleFreeBoard.getContent(), "자유게시판 내용은 null이 아니어야 합니다.");

		Notice_table sampleNotice = noticeRepository.findById(1).orElse(null);
		assertNotNull(sampleNotice, "공지사항 첫 번째 게시물이 존재해야 합니다.");
		assertNotNull(sampleNotice.getTitle(), "공지사항 제목은 null이 아니어야 합니다.");
		assertNotNull(sampleNotice.getWriter(), "공지사항 작성자는 null이 아니어야 합니다.");
		assertNotNull(sampleNotice.getContent(), "공지사항 내용은 null이 아니어야 합니다.");
	}
}