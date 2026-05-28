const listings = [
  {id:1,title:'야마하 VX 크루저 HO 2022',category:'제트스키',brand:'Yamaha',model:'VX Cruiser HO',year:2022,price:2380,location:'경기 화성',marina:'전곡항',hours:68,length:'3.37m',engine:'제트 180마력',seller:'실소유 인증딜러',badges:['모두인증','모두진단','홈배송'],video:true,trailer:true,created:'2026-05-18',score:99,image:'https://images.unsplash.com/photo-1505867798796-639ec7e8cdf5?auto=format&fit=crop&w=900&q=80',market:'AI시세 2,480만원 · 4% 낮음',inspection:{선체:'A',엔진:'A',전장:'B+',추진계:'A',부식:'양호',시운전:'완료'},desc:'입문자와 가족 레저에 맞는 관리 상태 좋은 제트스키입니다.'},
  {id:2,title:'씨레이 210 SPX 데이보트',category:'모터보트',brand:'Sea Ray',model:'210 SPX',year:2020,price:6450,location:'부산 수영',marina:'수영만 요트경기장',hours:152,length:'6.55m',engine:'인보드 250마력',seller:'제휴 마리나',badges:['모두인증','영상'],video:true,trailer:false,created:'2026-05-17',score:96,image:'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?auto=format&fit=crop&w=900&q=80',market:'AI시세 6,420만원 · 적정',inspection:{선체:'A',엔진:'B+',전장:'A',추진계:'B+',부식:'경미',시운전:'완료'},desc:'가족용 데이보트로 적합하며 실내 보관 비중이 높습니다.'},
  {id:3,title:'퀵실버 605 필하우스 낚시보트',category:'낚시보트',brand:'Quicksilver',model:'605 Pilothouse',year:2019,price:4980,location:'충남 태안',marina:'안흥항',hours:214,length:'5.75m',engine:'아웃보드 150마력',seller:'실소유 개인',badges:['직거래','트레일러'],video:false,trailer:true,created:'2026-05-16',score:88,image:'https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?auto=format&fit=crop&w=900&q=80',market:'AI시세 5,100만원 · 2% 낮음',inspection:{선체:'B+',엔진:'B+',전장:'B',추진계:'A',부식:'양호',시운전:'예약 가능'},desc:'낚시 장비와 트레일러 포함 매물입니다.'},
  {id:4,title:'씨두 GTX Limited 300',category:'제트스키',brand:'Sea-Doo',model:'GTX Limited',year:2023,price:3150,location:'강원 강릉',marina:'강릉항',hours:41,length:'3.45m',engine:'제트 300마력',seller:'실소유 인증딜러',badges:['모두인증','모두진단','홈배송'],video:true,trailer:true,created:'2026-05-15',score:100,image:'https://images.unsplash.com/photo-1558961078-beebe6540096?auto=format&fit=crop&w=900&q=80',market:'AI시세 3,120만원 · 1% 높음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'고출력 투어링 제트스키, 보증 승계 가능.'},
  {id:5,title:'베네토 오션리스 30.1 세일요트',category:'요트',brand:'Beneteau',model:'Oceanis 30.1',year:2021,price:13200,location:'경남 창원',marina:'진해 마리나',hours:330,length:'9.53m',engine:'디젤 21마력',seller:'제휴 마리나',badges:['모두진단','홈배송'],video:true,trailer:false,created:'2026-05-14',score:92,image:'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?auto=format&fit=crop&w=900&q=80',market:'AI시세 1억3,100만원 · 적정',inspection:{선체:'A',엔진:'B+',전장:'A',추진계:'B+',부식:'양호',시운전:'완료'},desc:'주말 세일링과 연안 항해 입문에 좋은 요트입니다.'},
  {id:6,title:'브리그 이글 6 RIB',category:'RIB',brand:'Brig',model:'Eagle 6',year:2018,price:3840,location:'인천 중구',marina:'왕산마리나',hours:188,length:'5.95m',engine:'아웃보드 115마력',seller:'실소유 개인',badges:['트레일러'],video:false,trailer:true,created:'2026-05-13',score:84,image:'https://images.unsplash.com/photo-1635776033909-ffa6a9b19ab6?auto=format&fit=crop&w=900&q=80',market:'AI시세 4,080만원 · 6% 낮음',inspection:{선체:'B',엔진:'B+',전장:'B',추진계:'B+',부식:'튜브 점검 필요',시운전:'가능'},desc:'기동성이 좋은 RIB, 튜브 일부 점검 권장.'},
  {id:7,title:'야마하 AR195 웨이크 스포츠',category:'모터보트',brand:'Yamaha',model:'AR195',year:2021,price:7250,location:'서울 한강',marina:'반포',hours:96,length:'5.95m',engine:'제트 250마력',seller:'실소유 인증딜러',badges:['모두인증','영상','홈배송'],video:true,trailer:true,created:'2026-05-12',score:97,image:'https://images.unsplash.com/photo-1552160757-52790c6f4faf?auto=format&fit=crop&w=900&q=80',market:'AI시세 7,480만원 · 3% 낮음',inspection:{선체:'A',엔진:'A',전장:'B+',추진계:'A',부식:'양호',시운전:'완료'},desc:'웨이크 타워와 오디오 옵션 장착.'},
  {id:8,title:'바바리아 C38 크루징 요트',category:'요트',brand:'Bavaria',model:'C38',year:2020,price:18800,location:'제주 애월',marina:'도두항',hours:420,length:'11.31m',engine:'디젤 40마력',seller:'제휴 마리나',badges:['모두진단'],video:false,trailer:false,created:'2026-05-11',score:90,image:'https://images.unsplash.com/photo-1562281302-809108fd533c?auto=format&fit=crop&w=900&q=80',market:'AI시세 1억8,900만원 · 적정',inspection:{선체:'B+',엔진:'B+',전장:'A',추진계:'B',부식:'경미',시운전:'예약 가능'},desc:'장거리 크루징 세팅, 선실 관리 양호.'},
  {id:9,title:'파커 660 파일럿하우스',category:'낚시보트',brand:'Parker',model:'660 Pilothouse',year:2017,price:4350,location:'전남 여수',marina:'소호항',hours:366,length:'6.60m',engine:'아웃보드 200마력',seller:'실소유 개인',badges:['직거래'],video:false,trailer:false,created:'2026-05-10',score:82,image:'https://images.unsplash.com/photo-1507124441518-c9584b9dc520?auto=format&fit=crop&w=900&q=80',market:'AI시세 4,720만원 · 8% 낮음',inspection:{선체:'B',엔진:'B',전장:'B',추진계:'B+',부식:'해수 사용 흔적',시운전:'가능'},desc:'실사용 낚시 세팅, 어탐/GPS 포함.'},
  {id:10,title:'칸델라 C-8 전기 보트',category:'모터보트',brand:'Candela',model:'C-8',year:2024,price:24500,location:'경기 김포',marina:'아라마리나',hours:28,length:'8.50m',engine:'전기 75kW',seller:'실소유 인증딜러',badges:['모두인증','모두진단','영상','홈배송'],video:true,trailer:false,created:'2026-05-09',score:98,image:'https://images.unsplash.com/photo-1568476612160-787b6a1d5fb1?auto=format&fit=crop&w=900&q=80',market:'AI시세 산정중 · 희소매물',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'저소음 전기 하이드로포일 보트.'},
  {id:11,title:'혼다 아쿠아트랙스 F-15X',category:'제트스키',brand:'Honda',model:'AquaTrax F-15X',year:2016,price:1250,location:'경기 가평',marina:'가평 선착장',hours:312,length:'3.40m',engine:'제트 160마력',seller:'실소유 개인',badges:['직거래','트레일러'],video:false,trailer:true,created:'2026-05-08',score:80,image:'https://images.unsplash.com/photo-1524061508355-90afbf7fcf03?auto=format&fit=crop&w=900&q=80',market:'AI시세 1,380만원 · 9% 낮음',inspection:{선체:'B',엔진:'B',전장:'B',추진계:'B',부식:'양호',시운전:'가능'},desc:'호수용으로 관리된 제트스키, 트레일러 포함.'},
  {id:12,title:'폴라리스 프로 780',category:'제트스키',brand:'Polaris',model:'Pro 780',year:2015,price:890,location:'강원 춘천',marina:'의암 선착장',hours:445,length:'3.20m',engine:'제트 78마력',seller:'실소유 개인',badges:['직거래'],video:false,trailer:false,created:'2026-05-07',score:76,image:'https://images.unsplash.com/photo-1505867798796-639ec7e8cdf5?auto=format&fit=crop&w=900&q=80',market:'AI시세 980만원 · 9% 낮음',inspection:{선체:'B',엔진:'B',전장:'B',추진계:'B',부식:'경미',시운전:'가능'},desc:'입문용 저가 제트스키, 상태 양호.'},
  {id:13,title:'씨두 스파크 트릭스 90',category:'제트스키',brand:'Sea-Doo',model:'Spark Trixx 90',year:2023,price:1680,location:'인천 영종도',marina:'을왕리 해수욕장',hours:22,length:'3.09m',engine:'제트 90마력',seller:'실소유 인증딜러',badges:['모두인증','홈배송'],video:false,trailer:true,created:'2026-05-06',score:95,image:'https://images.unsplash.com/photo-1558961078-beebe6540096?auto=format&fit=crop&w=900&q=80',market:'AI시세 1,750만원 · 4% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'입문·레크리에이션용 경량 제트스키.'},
  {id:14,title:'선스트리머 220 데크보트',category:'모터보트',brand:'SunStreamer',model:'220 Deck',year:2019,price:5200,location:'경기 양평',marina:'양수리 선착장',hours:134,length:'6.70m',engine:'인보드 220마력',seller:'제휴 마리나',badges:['모두진단','영상'],video:true,trailer:false,created:'2026-05-05',score:89,image:'https://images.unsplash.com/photo-1543140313-318677635120?auto=format&fit=crop&w=900&q=80',market:'AI시세 5,400만원 · 4% 낮음',inspection:{선체:'A',엔진:'B+',전장:'B+',추진계:'A',부식:'양호',시운전:'완료'},desc:'가족 물놀이에 최적화된 데크보트.'},
  {id:15,title:'마스터크래프트 X22 웨이크',category:'모터보트',brand:'MasterCraft',model:'X22',year:2022,price:15800,location:'경기 가평',marina:'가평 마리나',hours:88,length:'6.71m',engine:'인보드 450마력',seller:'실소유 인증딜러',badges:['모두인증','모두진단','영상','홈배송'],video:true,trailer:false,created:'2026-05-04',score:98,image:'https://images.unsplash.com/photo-1593351415075-3bac9f45c877?auto=format&fit=crop&w=900&q=80',market:'AI시세 1억6,200만원 · 2% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'웨이크서핑·웨이크보드 프리미엄 보트.'},
  {id:16,title:'알루미늄 낚시보트 550 콘솔',category:'낚시보트',brand:'국산',model:'알루미늄 콘솔 550',year:2020,price:1650,location:'전북 군산',marina:'군산항',hours:98,length:'5.50m',engine:'아웃보드 100마력',seller:'실소유 개인',badges:['직거래','트레일러'],video:false,trailer:true,created:'2026-05-03',score:83,image:'https://images.unsplash.com/photo-1634675041632-2435d922ece3?auto=format&fit=crop&w=900&q=80',market:'AI시세 1,800만원 · 8% 낮음',inspection:{선체:'B+',엔진:'B+',전장:'B',추진계:'A',부식:'경미',시운전:'가능'},desc:'서해 바다낚시용, 어탐 포함.'},
  {id:17,title:'야마하 F115 콘솔 피싱',category:'낚시보트',brand:'Yamaha',model:'F115 Console',year:2021,price:3200,location:'경남 통영',marina:'통영항',hours:176,length:'6.10m',engine:'아웃보드 115마력',seller:'실소유 개인',badges:['모두진단'],video:false,trailer:true,created:'2026-05-02',score:87,image:'https://images.unsplash.com/photo-1598597285544-73cde918c78d?auto=format&fit=crop&w=900&q=80',market:'AI시세 3,400만원 · 6% 낮음',inspection:{선체:'A',엔진:'B+',전장:'B+',추진계:'A',부식:'양호',시운전:'예약 가능'},desc:'남해 낚시 전용, GPS어탐 장착.'},
  {id:18,title:'파커 830 인보드 낚시보트',category:'낚시보트',brand:'Parker',model:'830 Inboard',year:2018,price:6800,location:'강원 속초',marina:'속초항',hours:289,length:'8.30m',engine:'디젤 300마력',seller:'제휴 마리나',badges:['모두인증','홈배송'],video:false,trailer:false,created:'2026-05-01',score:91,image:'https://images.unsplash.com/photo-1655523539874-e6c9aa4b5edd?auto=format&fit=crop&w=900&q=80',market:'AI시세 7,200만원 · 6% 낮음',inspection:{선체:'A',엔진:'B+',전장:'A',추진계:'B+',부식:'양호',시운전:'완료'},desc:'동해 원정 낚시용 대형 보트.'},
  {id:19,title:'제네바 소렌토 22 요트',category:'요트',brand:'Jeanneau',model:'Sun Odyssey 22',year:2017,price:7800,location:'부산 수영',marina:'수영만 요트경기장',hours:510,length:'6.99m',engine:'디젤 15마력',seller:'실소유 개인',badges:['모두진단'],video:false,trailer:false,created:'2026-04-30',score:85,image:'https://images.unsplash.com/photo-1546214755-c5d22447b43b?auto=format&fit=crop&w=900&q=80',market:'AI시세 8,200만원 · 5% 낮음',inspection:{선체:'B+',엔진:'B+',전장:'B+',추진계:'B+',부식:'경미',시운전:'예약 가능'},desc:'연안 항해 입문용 소형 세일요트.'},
  {id:20,title:'한스 크리스티안 38 크루저',category:'요트',brand:'Hans Christian',model:'38T',year:2005,price:22000,location:'제주 서귀포',marina:'강정마리나',hours:1840,length:'11.58m',engine:'디젤 55마력',seller:'실소유 개인',badges:['직거래'],video:false,trailer:false,created:'2026-04-29',score:79,image:'https://images.unsplash.com/photo-1540946485063-a40da27545f8?auto=format&fit=crop&w=900&q=80',market:'AI시세 2억4,000만원 · 8% 낮음',inspection:{선체:'B',엔진:'B',전장:'B',추진계:'B',부식:'해수 이력 있음',시운전:'가능'},desc:'세계 일주 세팅 완비, 장거리 항해 경험 바람직.'},
  {id:21,title:'선웨이브 38 모터요트',category:'요트',brand:'Sunwave',model:'38 Motor',year:2022,price:38000,location:'경남 거제',marina:'거제 마리나',hours:160,length:'11.60m',engine:'디젤 400마력 쌍축',seller:'제휴 마리나',badges:['모두인증','모두진단','영상','홈배송'],video:true,trailer:false,created:'2026-04-28',score:97,image:'https://images.unsplash.com/photo-1559385301-0187cb6eff46?auto=format&fit=crop&w=900&q=80',market:'AI시세 4억원 · 5% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'선실 2개, 주방/화장실 완비 럭셔리 크루저.'},
  {id:22,title:'나다 스포츠 RIB 470',category:'RIB',brand:'Nada',model:'Sport RIB 470',year:2021,price:2200,location:'인천 옹진',marina:'대부도 방아머리',hours:55,length:'4.70m',engine:'아웃보드 90마력',seller:'실소유 개인',badges:['트레일러'],video:false,trailer:true,created:'2026-04-27',score:88,image:'https://images.unsplash.com/photo-1685720543696-a9df416824bb?auto=format&fit=crop&w=900&q=80',market:'AI시세 2,350만원 · 6% 낮음',inspection:{선체:'A',엔진:'A',전장:'B+',추진계:'A',부식:'양호',시운전:'가능'},desc:'레저·낚시 겸용 소형 RIB.'},
  {id:23,title:'리브 RIB 750 프로',category:'RIB',brand:'Ribeye',model:'750 Pro',year:2020,price:5500,location:'경기 화성',marina:'전곡항',hours:142,length:'7.50m',engine:'아웃보드 225마력',seller:'제휴 마리나',badges:['모두인증','모두진단','홈배송'],video:false,trailer:true,created:'2026-04-26',score:93,image:'https://images.unsplash.com/photo-1678972993082-44878925b46e?auto=format&fit=crop&w=900&q=80',market:'AI시세 5,800만원 · 5% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'고속 RIB, 구조·패트롤 용도로 사용.'},
  {id:24,title:'마린 파트너 RIB 580',category:'RIB',brand:'Marine Partner',model:'RIB 580',year:2017,price:2750,location:'전남 완도',marina:'완도항',hours:322,length:'5.80m',engine:'아웃보드 130마력',seller:'실소유 개인',badges:['직거래'],video:false,trailer:true,created:'2026-04-25',score:81,image:'https://images.unsplash.com/photo-1685720543627-a49e4754dd0a?auto=format&fit=crop&w=900&q=80',market:'AI시세 3,100만원 · 11% 낮음',inspection:{선체:'B+',엔진:'B',전장:'B',추진계:'B+',부식:'경미',시운전:'가능'},desc:'남해 섬 탐방용, 실사용 흔적 있음.'},
  {id:25,title:'씨두 챌린저 180',category:'모터보트',brand:'Sea-Doo',model:'Challenger 180',year:2018,price:3980,location:'강원 원주',marina:'원주 수변공원',hours:198,length:'5.49m',engine:'제트 215마력',seller:'실소유 개인',badges:['트레일러'],video:false,trailer:true,created:'2026-04-24',score:85,image:'https://images.unsplash.com/photo-1552160757-52790c6f4faf?auto=format&fit=crop&w=900&q=80',market:'AI시세 4,300만원 · 7% 낮음',inspection:{선체:'B+',엔진:'B+',전장:'B+',추진계:'B+',부식:'양호',시운전:'완료'},desc:'내수면 레저용 스포츠보트, 트레일러 포함.'},
  {id:26,title:'야마하 242X 리미티드',category:'모터보트',brand:'Yamaha',model:'242X Limited',year:2023,price:12500,location:'경기 화성',marina:'전곡항',hours:45,length:'7.37m',engine:'제트 360마력 쌍엔진',seller:'실소유 인증딜러',badges:['모두인증','모두진단','영상','홈배송'],video:true,trailer:false,created:'2026-04-23',score:99,image:'https://images.unsplash.com/photo-1543140313-318677635120?auto=format&fit=crop&w=900&q=80',market:'AI시세 1억3,000만원 · 4% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'쌍엔진 고성능 스포츠보트, 웨이크보드 최적.'},
  {id:27,title:'베네토 퍼스트 27 세일요트',category:'요트',brand:'Beneteau',model:'First 27',year:2019,price:9200,location:'인천 중구',marina:'왕산마리나',hours:280,length:'8.28m',engine:'디젤 18마력',seller:'제휴 마리나',badges:['모두인증','모두진단'],video:false,trailer:false,created:'2026-04-22',score:93,image:'https://images.unsplash.com/photo-1501771924607-209f42a6e7e4?auto=format&fit=crop&w=900&q=80',market:'AI시세 9,700만원 · 5% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'양호',시운전:'완료'},desc:'경주·연안 세일링 입문에 적합한 요트.'},
  {id:28,title:'알루미늄 워크보트 700',category:'낚시보트',brand:'국산',model:'알루미늄 워크보트',year:2016,price:2100,location:'경남 사천',marina:'삼천포항',hours:480,length:'7.00m',engine:'아웃보드 150마력',seller:'실소유 개인',badges:['직거래'],video:false,trailer:false,created:'2026-04-21',score:77,image:'https://images.unsplash.com/photo-1551131618-3f0a5cf594b4?auto=format&fit=crop&w=900&q=80',market:'AI시세 2,400만원 · 12% 낮음',inspection:{선체:'B',엔진:'B',전장:'B',추진계:'B+',부식:'해수 이력',시운전:'가능'},desc:'상업용으로 사용, 실사용 세팅 완비.'},
  {id:29,title:'씨두 웨이크 PRO 230',category:'모터보트',brand:'Sea-Doo',model:'Wake Pro 230',year:2022,price:8900,location:'경기 가평',marina:'가평 마리나',hours:72,length:'7.00m',engine:'제트 230마력',seller:'실소유 인증딜러',badges:['모두인증','영상','홈배송'],video:true,trailer:false,created:'2026-04-20',score:96,image:'https://images.unsplash.com/photo-1568476612160-787b6a1d5fb1?auto=format&fit=crop&w=900&q=80',market:'AI시세 9,400만원 · 5% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'매우 양호',시운전:'완료'},desc:'웨이크보드·웨이크서핑 전용, 타워 장착.'},
  {id:30,title:'스릴 시커 RIB 850',category:'RIB',brand:'Thrill Seeker',model:'RIB 850',year:2021,price:7200,location:'부산 기장',marina:'기장 마리나',hours:108,length:'8.50m',engine:'아웃보드 350마력 쌍엔진',seller:'제휴 마리나',badges:['모두인증','모두진단','홈배송'],video:false,trailer:false,created:'2026-04-19',score:94,image:'https://images.unsplash.com/photo-1601210596001-ae2676f7ef6b?auto=format&fit=crop&w=900&q=80',market:'AI시세 7,600만원 · 5% 낮음',inspection:{선체:'A',엔진:'A',전장:'A',추진계:'A',부식:'양호',시운전:'완료'},desc:'고속 대형 RIB, 해양레포츠 센터 운영용.'}
];

const DEALER = {
  name: '왕산마리나',
  region: '인천 중구',
  certified: true,
  rating: 4.8,
  reviewCount: 61,
  since: '2019',
  image: 'https://images.unsplash.com/photo-1520621853326-9c6d0cb72b78?auto=format&fit=crop&w=900&q=80',
  stats: { listed: 8, monthlyInquiries: 24, settlementPending: 340, completedDeals: 112 },
  myListings: [
    { id: 6,  status: '문의중',   inquiries: 3, views: 142 },
    { id: 2,  status: '상담예약', inquiries: 5, views: 287 },
    { id: 7,  status: '게시중',   inquiries: 1, views: 89  },
    { id: 10, status: '거래완료', inquiries: 0, views: 310 },
  ],
  inquiries: [
    { item: '야마하 AR195 웨이크 스포츠', type: '방문예약 요청', time: '30분 전',  read: false },
    { item: '씨레이 210 SPX 데이보트',    type: '가격 문의',    time: '2시간 전', read: false },
    { item: '브리그 이글 6 RIB',           type: '홈배송 가능?', time: '어제',     read: true  },
    { item: '칸델라 C-8 전기 보트',        type: '시운전 예약',  time: '이틀 전',  read: true  },
  ],
};

const state = {
  tab: 'home',
  listing: null,
  filters: { category: '전체', maxPrice: '', region: '전체', certified: false, delivery: false, sort: '추천순', q: '', service: '전체매물' },
  wished: new Set(),
  compared: new Set(),
  recent: [],
  sellStep: 0,
  sellMode: 'self',
  sellData: { type:'제트스키', brand:'', model:'', year:'', hin:'', price:'', region:'경기', marina:'', engine:'아웃보드', hours:'', length:'', hp:'', regStatus:'정상', inspStatus:'유효', insStatus:'가입', desc:'', photos:{} },
  sellRequests: []
};

const freshSellData = () => ({
  type:'제트스키',
  brand:'',
  model:'',
  year:'',
  hin:'',
  price:'',
  region:'경기',
  marina:'',
  engine:'아웃보드',
  hours:'',
  length:'',
  hp:'',
  regStatus:'정상',
  inspStatus:'유효',
  insStatus:'가입',
  desc:'',
  photos:{}
});

const app = document.querySelector('#app');
let qTimer = null;
const toast = document.querySelector('#toast');
const won = n => n >= 10000 ? `${Math.floor(n/10000)}억${n%10000 ? (n%10000).toLocaleString() : ''}만원` : `${n.toLocaleString()}만원`;
const byId = id => listings.find(x => x.id === Number(id));
const gradeOf = s => s >= 98 ? 'S' : s >= 93 ? 'A+' : s >= 88 ? 'A' : s >= 83 ? 'B+' : 'B';
function getPhotos(item) {
  if (item.photos) {
    const urls = Object.values(item.photos).filter(Boolean);
    if (urls.length) return urls;
  }
  return [item.image].filter(Boolean);
}
const showToast = msg => { toast.textContent = msg; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1600); };
const setTab = tab => { state.tab = tab; state.listing = null; render(); window.scrollTo(0, 0); };
const viewDetail = id => { state.listing = byId(id); state.tab = 'detail'; state.recent = [Number(id), ...state.recent.filter(x => x !== Number(id))].slice(0, 8); saveState(); render(); window.scrollTo(0, 0); };

function filteredListings() {
  let rows = listings.filter(item => {
    const f = state.filters;
    const matchQ = !f.q || `${item.title} ${item.brand} ${item.model} ${item.location} ${item.badges.join(' ')}`.toLowerCase().includes(f.q.toLowerCase());
    const matchCategory = f.category === '전체' || item.category === f.category;
    const matchPrice = !f.maxPrice || item.price <= Number(f.maxPrice);
    const matchRegion = f.region === '전체' || item.location.includes(f.region);
    const matchCertified = !f.certified || item.badges.includes('모두인증') || item.badges.includes('모두진단');
    const matchDelivery = !f.delivery || item.badges.includes('홈배송');
    const matchService = f.service === '전체매물' || item.badges.includes(f.service) || item.category === f.service;
    return matchQ && matchCategory && matchPrice && matchRegion && matchCertified && matchDelivery && matchService;
  });
  const s = state.filters.sort;
  if (s === '최신순') rows.sort((a, b) => b.created.localeCompare(a.created));
  if (s === '낮은 가격순') rows.sort((a, b) => a.price - b.price);
  if (s === '높은 가격순') rows.sort((a, b) => b.price - a.price);
  if (s === '운항시간순') rows.sort((a, b) => a.hours - b.hours);
  if (s === '추천순') rows.sort((a, b) => b.score - a.score);
  return rows;
}

function badgeHtml(item) {
  return item.badges.slice(0, 3).map(b =>
    `<span class="badge ${b === '모두인증' ? 'orange' : ''}">${b}</span>`
  ).join('');
}

function card(item, compact = false) {
  const wished = state.wished.has(item.id);
  const grade = gradeOf(item.score);
  const gradeCls = grade.replace('+', 'p');
  const mktPart = (item.market.split('·')[1] || '').trim();
  const hintCls = mktPart.includes('낮음') ? 'hint-good' : mktPart.includes('높음') ? 'hint-high' : 'hint-fair';
  return `
    <article class="listing-card ${compact ? 'compact' : ''}" data-detail="${item.id}">
      <div class="thumb" style="background-image:url('${item.image}')">
        <div class="badges">${badgeHtml(item)}</div>
        <button class="card-wish" data-wish="${item.id}" aria-label="${wished ? '찜 해제' : '찜하기'}">${wished ? '♥' : '♡'}</button>
        ${item.video ? '<span class="play">▶</span>' : ''}
        <div class="grade-dot grade-${gradeCls}">${grade}</div>
      </div>
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <div class="price">${won(item.price)}</div>
        <div class="specs">${item.year}년 · ${item.hours}h · ${item.location}</div>
        <div class="specs">${item.length} · ${item.engine}</div>
        ${mktPart ? `<div class="mkt-hint ${hintCls}">${mktPart}</div>` : ''}
        <div class="card-bottom-row">
          <div class="one-line">${item.seller}</div>
          <button class="card-cmp-btn${state.compared.has(item.id) ? ' on' : ''}" data-compare="${item.id}">⇄ ${state.compared.has(item.id) ? '비교중' : '비교'}</button>
        </div>
      </div>
    </article>`;
}

function home() {
  const star = listings.filter(x => x.badges.includes('모두인증') || x.badges.includes('모두진단')).slice(0, 4);
  const videos = listings.filter(x => x.video).slice(0, 5);
  const newest = listings.slice(0, 4);

  return `
    <section class="hero-search">
      <div class="home-mode">내마린사기</div>
      <div class="hero-count"><span class="hero-count-num">${listings.length}</span>개 매물 실시간 등록 중</div>
      <h1>찾고 있는 마린이<br>있으신가요?</h1>
      <div class="search-wrap">
        <input class="search-box" id="homeSearch" placeholder="제트스키, 요트, 모델명, 지역 검색"/>
        <button class="search-btn" data-do-search aria-label="검색">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L20 20"/></svg>
        </button>
      </div>
      <div class="home-icons">
        <button data-service="모두진단">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
          <span>모두진단</span>
        </button>
        <button data-service="모두인증">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>
          <span>모두인증</span>
        </button>
        <button data-service="홈배송">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          <span>홈배송</span>
        </button>
        <button data-tab="sell">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          <span>내마린팔기</span>
        </button>
      </div>
    </section>

    <div class="service-strip">
      <button data-service="전체매물">전체매물</button>
      <button data-service="모두진단">진단 매물</button>
      <button data-service="모두인증">인증 매물</button>
      <button data-service="홈배송">홈배송</button>
      <button data-open-ai>AI시세</button>
    </div>

    <div class="cat-strip">
      <button data-service="전체매물">전체</button>
      <button data-theme="제트스키">제트스키</button>
      <button data-theme="모터보트">모터보트</button>
      <button data-theme="낚시보트">낚시보트</button>
      <button data-theme="요트">요트</button>
      <button data-theme="RIB">RIB</button>
    </div>

    <section class="section">
      <div class="section-head"><h2>모두스타픽</h2><small data-service="모두인증">전체보기</small></div>
      <div class="star-grid">
        ${star.map(x => `
          <button class="star-card" data-detail="${x.id}">
            <div class="sc-img" style="background-image:url('${x.image}')">
              <div class="badges">${badgeHtml(x)}</div>
            </div>
            <div class="sc-body">
              <b>${x.badges[0]}</b>
              <strong>${x.title}</strong>
              <span>${x.year}년 · ${x.hours}시간<br>${won(x.price)}</span>
            </div>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>영상으로 생생하게</h2><small data-service="영상">전체보기</small></div>
      <div class="hscroll">
        ${videos.map(x => `
          <button class="vid-card" data-detail="${x.id}">
            <div class="vid-img" style="background-image:url('${x.image}')">
              <span class="play">▶ 영상</span>
            </div>
            <div class="vid-body">
              <div class="vid-price">${won(x.price)}</div>
              <div class="vid-title">${x.title}</div>
              <div class="vid-sub">${x.year}년 · ${x.hours}시간</div>
            </div>
          </button>
        `).join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>오늘의 테마픽</h2><small>더보기</small></div>
      <div class="theme-grid">
        <button data-theme="제트스키">입문용<br>제트스키</button>
        <button data-budget="5000">5천만원 이하<br>낚시보트</button>
        <button data-service="홈배송">바로 인도<br>가능 매물</button>
        <button data-theme="요트">주말 크루징<br>요트</button>
      </div>
    </section>

    <section class="section">
      <div class="budget-box">
        <h2>예산으로 마린 찾기</h2>
        <p>먼저 낼 수 있는 금액 <b>1,500만원</b> 기준,<br>48개월 동안 <b>월 80만원대</b> 납입 시</p>
        <button class="wide-btn primary" data-budget="8000">월 80만원대 매물 찾기</button>
      </div>
    </section>

    <section class="section">
      <div class="sell-banner">
        <div>
          <h2>최고가에 내 마린 팔기</h2>
          <p>사진 5장 Self, 전문가 방문 Pro,<br>검증 딜러 입찰</p>
        </div>
        <button class="wide-btn orange" data-tab="sell">내마린팔기</button>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><h2>신규 등록 매물</h2><small data-service="전체매물">전체보기</small></div>
      <div class="card-list">${newest.map(x => card(x)).join('')}</div>
    </section>

    <section class="section" style="padding-bottom:22px;">
      <div class="panel">
        <h2 style="margin:0 0 13px;font-size:17px;font-weight:950;color:var(--navy);letter-spacing:-.025em;">매거진</h2>
        <div class="summary-list">
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">첫 제트스키 구매 전 확인할 7가지</button>
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">중고 보트 엔진시간 보는 법</button>
          <button class="mini-btn" style="width:100%;text-align:left;height:40px;padding:0 14px;">선박검사와 보험 만료일 체크</button>
        </div>
      </div>
    </section>`;
}

function search() {
  const rows = filteredListings();
  const services = ['전체매물', '모두진단', '모두인증', '홈배송', '영상'];
  return `
    <div class="filter-panel">
      <div class="chips">
        ${services.map(s => `<button class="chip ${state.filters.service === s ? 'active' : ''}" data-service-filter="${s}">${s}</button>`).join('')}
      </div>
      <div class="field"><label>검색어</label><input id="q" value="${state.filters.q}" placeholder="모델, 제조사, 지역"/></div>
      <div class="filter-row">
        <div class="field"><label>선종</label>
          <select id="category">${['전체','제트스키','모터보트','낚시보트','요트','RIB'].map(x => `<option ${state.filters.category === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
        <div class="field"><label>최대 가격</label>
          <select id="maxPrice"><option value="">전체</option>${[3000,5000,8000,15000,25000].map(x => `<option value="${x}" ${state.filters.maxPrice == x ? 'selected' : ''}>${won(x)} 이하</option>`).join('')}</select>
        </div>
      </div>
      <div class="filter-row">
        <div class="field"><label>지역</label>
          <select id="region">${['전체','서울','경기','부산','인천','강원','충남','전남','경남','제주'].map(x => `<option ${state.filters.region === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
        <div class="field"><label>정렬</label>
          <select id="sort">${['추천순','최신순','낮은 가격순','높은 가격순','운항시간순'].map(x => `<option ${state.filters.sort === x ? 'selected' : ''}>${x}</option>`).join('')}</select>
        </div>
      </div>
    </div>
    <div class="section-head" style="padding:0 0 4px;">
      <h2 id="search-count" style="font-size:16px;font-weight:950;color:var(--navy);">매물 ${rows.length}대</h2>
      <small style="color:var(--muted);">${state.filters.sort}</small>
    </div>
    <div id="search-results" class="card-list">${rows.length ? rows.map(x => card(x)).join('') : '<div class="empty">조건에 맞는 매물이 없습니다.</div>'}</div>`;
}

function detail() {
  const item = state.listing || listings[0];
  const wished = state.wished.has(item.id);
  const grade = gradeOf(item.score);
  const gradeCls = grade.replace('+', 'p');
  return `
    <div class="detail-gallery">
      ${(() => {
        const photos = getPhotos(item);
        return `
      <div class="detail-main-img" style="background-image:url('${photos[0]}')">
        <div class="badges" style="left:14px;top:14px;">${badgeHtml(item)}</div>
        ${item.video ? '<button class="play big" data-action="영상 플레이어는 준비 중입니다">▶ 영상 보기</button>' : ''}
        <button class="detail-wish ${wished ? 'wished' : ''}" data-wish="${item.id}">${wished ? '♥' : '♡'}</button>
        <div class="detail-img-count">1 / ${photos.length}</div>
        <div class="grade-dot grade-${gradeCls}" style="bottom:14px;left:14px;">${grade}</div>
      </div>
      ${photos.length > 1 ? `<div class="detail-thumb-strip">
        ${photos.map((url, i) => `<div class="detail-thumb${i === 0 ? ' active' : ''}" data-src="${url}" data-idx="${i + 1}" style="background-image:url('${url}')"></div>`).join('')}
      </div>` : ''}`;
      })()}
    </div>

    <div class="detail-wrap">
      <div class="detail-price-row">
        <div>
          <h1 class="detail-title">${item.title}</h1>
          <div class="price" style="font-size:26px;">${won(item.price)}</div>
        </div>
      </div>
      <div class="market-box">
        <b>${item.market}</b>
        <span>실거래/등록가 기반 모두 AI시세</span>
      </div>

      <section class="section">
        <div class="section-head"><h2>기본 제원</h2></div>
        <div class="info-grid">
          ${[['선종',item.category],['제조사',item.brand],['모델',item.model],['연식',`${item.year}년`],['운항시간',`${item.hours}h`],['선체 길이',item.length],['엔진',item.engine],['계류지',item.marina],['트레일러',item.trailer?'포함':'별도'],['판매자',item.seller]].map(([a,b]) => `<div class="info"><span>${a}</span><strong>${b}</strong></div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>모두진단 리포트</h2></div>
        <div class="report">
          ${Object.entries(item.inspection).map(([k,v]) => {
            const good = ['A','A+','S','완료','양호','매우 양호','예약 가능'].includes(v);
            return `<div><strong>${k}</strong><span class="${good ? 'rep-good' : 'rep-warn'}">${v}</span></div>`;
          }).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>사고 / 침수 / 좌초 이력</h2></div>
        <div class="history-box">
          ${[['사고','이력 없음'],['침수','이력 없음'],['좌초','이력 없음'],['대수리','이력 없음']].map(([k,v]) =>
            `<div class="history-row"><span class="hist-label">${k}</span><strong class="hist-none">${v}</strong></div>`
          ).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>등록 / 검사 / 보험</h2></div>
        <div class="info-grid">
          ${[['선박 등록증','정상'],['선박 검사','유효'],['보험','가입'],['등록 연도',`${item.year}년`]].map(([a,b]) => `<div class="info"><span>${a}</span><strong>${b}</strong></div>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>포함 품목</h2></div>
        <div class="include-list">
          ${(item.trailer ? ['트레일러'] : []).concat(['구명조끼 2개','소화기','선박 서류 일체',(item.video?'영상 자료':'')]).filter(Boolean).map(t => `<span class="include-tag">${t}</span>`).join('')}
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>예상 추가 비용</h2></div>
        <div class="extra-cost-list">
          <div class="extra-cost"><span>육상 운송비</span><strong>거리에 따라 20~80만원</strong></div>
          <div class="extra-cost"><span>연간 계류비</span><strong>마리나별 상이 (80~300만원/년)</strong></div>
          <div class="extra-cost"><span>선박 보험료</span><strong>차량가액의 약 1~2% (연)</strong></div>
          <div class="extra-cost"><span>선박 검사비</span><strong>5~20만원 (유효 시 해당 없음)</strong></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head"><h2>판매자 정보</h2></div>
        <div class="seller-box">
          <div class="seller-info">
            <div class="seller-name">${item.seller}</div>
            <div class="seller-sub">${item.location} · ${item.marina}</div>
          </div>
          <button class="mini-btn" data-action="판매자 프로필은 준비 중입니다">프로필 보기</button>
        </div>
        <div class="notice" style="margin-top:12px;">실소유자, 선박 등록 정보, 계류/인도 장소를 반드시 확인하세요. 앱 밖 계약금 송금이나 제3자 명의 거래는 권장하지 않습니다.</div>
      </section>

      <section class="section" style="padding-bottom:22px;">
        <div class="section-head"><h2>비슷한 매물</h2><small>${item.category}</small></div>
        <div class="card-list">
          ${listings.filter(x => x.category === item.category && x.id !== item.id).slice(0, 2).map(x => card(x)).join('')}
        </div>
      </section>
    </div>

    <div class="sticky-cta">
      <button class="sticky-btn primary" style="grid-column:span 2" data-action="문의가 접수되었습니다">문의하기</button>
      <button class="sticky-btn${state.compared.has(item.id) ? ' cmp-on' : ' outline'}" data-compare="${item.id}">⇄ ${state.compared.has(item.id) ? '비교중' : '비교담기'}</button>
      <button class="sticky-btn orange" data-action="방문 예약 화면은 준비 중입니다">방문예약</button>
    </div>`;
}

function compare() {
  const items = [...state.compared].map(byId).filter(Boolean);
  if (items.length === 0) {
    return `
      <div class="panel">
        <h1 class="detail-title" style="margin-top:0;">비교함</h1>
        <div class="empty" style="padding:52px 0;text-align:center;">
          비교할 매물이 없습니다.<br>
          <small style="color:var(--muted);">매물 카드의 ⇄ 버튼으로 추가하세요.</small>
        </div>
        <button class="wide-btn primary" style="border-radius:var(--r-md);margin-top:8px;" data-tab="search">매물 검색하러 가기</button>
      </div>`;
  }

  const gradeRank = { 'S':5, 'A+':4, 'A':3, 'B+':2, 'B':1 };
  const minPrice  = Math.min(...items.map(x => x.price));
  const minHours  = Math.min(...items.map(x => x.hours));
  const maxYear   = Math.max(...items.map(x => x.year));
  const maxGrade  = Math.max(...items.map(x => gradeRank[gradeOf(x.score)]));

  const rows = [
    { label:'가격',     fn: x => won(x.price),                      best: x => x.price === minPrice },
    { label:'AI시세',   fn: x => (x.market.split('·')[1]||'').trim() || '-' },
    { label:'등급',     fn: x => gradeOf(x.score),                  best: x => gradeRank[gradeOf(x.score)] === maxGrade },
    { label:'연식',     fn: x => `${x.year}년`,                      best: x => x.year === maxYear },
    { label:'운항시간', fn: x => `${x.hours}h`,                      best: x => x.hours === minHours },
    { label:'선체 길이', fn: x => x.length },
    { label:'엔진',     fn: x => x.engine },
    { label:'지역',     fn: x => x.location },
  ];

  return `
    <div class="panel">
      <div class="cmp-page-header">
        <h1 class="detail-title" style="margin:0;">비교함 <span style="color:var(--blue)">${items.length}</span>대</h1>
        <button class="text-link" data-compare-clear>전체 초기화</button>
      </div>
      <p class="cmp-legend">녹색 ✓ 는 비교 항목 중 유리한 값입니다.</p>
      <div class="cmp-table">
        <div class="cmp-label-col">
          <div class="cmp-head-cell"></div>
          <div class="cmp-img-head"></div>
          ${rows.map(r => `<div class="cmp-label-cell">${r.label}</div>`).join('')}
          <div class="cmp-label-cell badge-row">배지</div>
          <div class="cmp-action-head"></div>
        </div>
        <div class="cmp-scroll">
          ${items.map(item => {
            const grade = gradeOf(item.score);
            const gradeCls = grade.replace('+', 'p');
            return `
              <div class="cmp-col">
                <div class="cmp-head-cell">
                  <button class="cmp-remove-btn" data-compare="${item.id}" aria-label="제거">×</button>
                </div>
                <div class="cmp-img-cell" data-detail="${item.id}">
                  <div class="cmp-thumb" style="background-image:url('${item.image}')">
                    <div class="grade-dot grade-${gradeCls}" style="bottom:5px;left:5px;font-size:10px;padding:2px 5px;">${grade}</div>
                  </div>
                  <div class="cmp-item-title">${item.title}</div>
                </div>
                ${rows.map(r => {
                  const isBest = r.best && items.length > 1 && r.best(item);
                  return `<div class="cmp-cell${isBest ? ' best' : ''}">${r.fn(item)}${isBest ? ' ✓' : ''}</div>`;
                }).join('')}
                <div class="cmp-cell cmp-badge-cell">
                  ${item.badges.slice(0,2).map(b => `<span class="badge ${b==='모두인증'?'orange':''}">${b}</span>`).join('')}
                </div>
                <div class="cmp-action-cell">
                  <button class="wide-btn primary" style="border-radius:var(--r-sm);font-size:12px;padding:8px 0;" data-detail="${item.id}">상세보기</button>
                </div>
              </div>`;
          }).join('')}
          ${items.length < 4 ? `
            <div class="cmp-col cmp-add-col">
              <div class="cmp-head-cell"></div>
              <div class="cmp-img-head cmp-add-slot" data-tab="search">
                <span style="font-size:26px;font-weight:300;color:var(--muted);">+</span>
                <span style="font-size:11px;color:var(--muted);">매물 추가</span>
              </div>
            </div>` : ''}
        </div>
      </div>
    </div>`;
}

function sell() {
  const s = state.sellStep;
  const steps = Array.from({length: 7}, (_, i) =>
    `<div class="step ${i <= s ? 'active' : ''}"></div>`
  ).join('');
  const stepFns = [sellStep0, sellStep1, sellStep2, sellStep3, sellStep4, sellStep5, sellStep6];
  return `
    <section>
      <h1 class="detail-title" style="margin-bottom:4px;">내마린팔기</h1>
      <div class="sell-stepper">${steps}</div>
      <div class="sell-step-label">단계 ${s + 1} / 7</div>
      ${stepFns[s]()}
    </section>`;
}

function sellStep0() {
  return `
    <div class="sell-card">
      <h2>판매 방식을 선택하세요</h2>
      <div class="mode-grid">
        <button class="mode ${state.sellMode === 'self' ? 'active' : ''}" data-mode="self">
          <strong>내마린팔기 Self</strong>
          <span>사진 직접 등록<br>72시간 검증 딜러 입찰</span>
          <em class="mode-fee">수수료 2.5%</em>
        </button>
        <button class="mode ${state.sellMode === 'pro' ? 'active' : ''}" data-mode="pro">
          <strong>내마린팔기 Pro</strong>
          <span>전문 평가사 방문 진단<br>48시간 입찰</span>
          <em class="mode-fee">수수료 3.5%</em>
        </button>
      </div>
      <button class="wide-btn primary" style="margin-top:16px;" data-next>다음</button>
    </div>`;
}

function sellStep1() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>선박 기본 정보</h2>
      <div class="field">
        <label>선종</label>
        <select data-sell-key="type">
          ${['제트스키','모터보트','낚시보트','요트','RIB'].map(t => `<option ${d.type===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field"><label>제조사</label><input data-sell-key="brand" value="${d.brand}" placeholder="예: Yamaha"/></div>
        <div class="field"><label>모델명</label><input data-sell-key="model" value="${d.model}" placeholder="예: VX Cruiser"/></div>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field"><label>연식</label><input type="number" data-sell-key="year" value="${d.year}" placeholder="2021"/></div>
        <div class="field"><label>등록번호 / HIN</label><input data-sell-key="hin" value="${d.hin}" placeholder="선택 입력"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

function sellStep2() {
  const d = state.sellData;
  const regions = ['서울','경기','부산','인천','강원','충남','전남','경남','제주'];
  return `
    <div class="sell-card">
      <h2>가격 및 위치</h2>
      <div class="field">
        <label>희망 판매 가격 (만원)</label>
        <input type="number" data-sell-key="price" value="${d.price}" placeholder="예: 2500"/>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field">
          <label>지역</label>
          <select data-sell-key="region">
            ${regions.map(r => `<option ${d.region===r?'selected':''}>${r}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>계류지 / 마리나</label><input data-sell-key="marina" value="${d.marina}" placeholder="예: 전곡항"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

function sellStep3() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>제원 정보</h2>
      <div class="filter-row">
        <div class="field"><label>운항시간 (h)</label><input type="number" data-sell-key="hours" value="${d.hours}" placeholder="68"/></div>
        <div class="field"><label>선체 길이</label><input data-sell-key="length" value="${d.length}" placeholder="3.5m"/></div>
      </div>
      <div class="filter-row" style="margin-top:10px;">
        <div class="field">
          <label>엔진 종류</label>
          <select data-sell-key="engine">
            ${['아웃보드','인보드','제트','디젤','전기'].map(t => `<option ${d.engine===t?'selected':''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="field"><label>마력 (HP)</label><input type="number" data-sell-key="hp" value="${d.hp}" placeholder="150"/></div>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

function sellStep4() {
  const d = state.sellData;
  return `
    <div class="sell-card">
      <h2>서류 및 안전 상태</h2>
      <div class="field">
        <label>선박 등록증</label>
        <select data-sell-key="regStatus">
          ${['정상','말소 예정','미등록'].map(s => `<option ${d.regStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-top:10px;">
        <label>선박 검사 (선박법)</label>
        <select data-sell-key="inspStatus">
          ${['유효','만료','해당 없음'].map(s => `<option ${d.inspStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-top:10px;">
        <label>보험 상태</label>
        <select data-sell-key="insStatus">
          ${['가입','만료','미가입'].map(s => `<option ${d.insStatus===s?'selected':''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>다음</button>
      </div>
    </div>`;
}

const PHOTO_SLOTS = [
  { key:'front',   label:'정면',     req:true,  hint:'선수 앞에서 선체 전체' },
  { key:'right',   label:'우측면',   req:true,  hint:'우현에서 선체 전체' },
  { key:'left',    label:'좌측면',   req:true,  hint:'좌현에서 선체 전체' },
  { key:'rear',    label:'후면',     req:true,  hint:'선미·엔진 포함' },
  { key:'deck',    label:'갑판',     req:false, hint:'갑판 위에서 내려다 본 뷰' },
  { key:'helm',    label:'조종석',   req:false, hint:'핸들·조종 공간 전체' },
  { key:'console', label:'계기판',   req:false, hint:'속도계·연료계 등' },
  { key:'engine',  label:'엔진룸',   req:false, hint:'엔진 외관 전체' },
  { key:'extra1',  label:'기타 1',   req:false, hint:'추가 외관 또는 특이사항' },
  { key:'extra2',  label:'기타 2',   req:false, hint:'추가 사진 자유 등록' },
];

function sellStep5() {
  const d = state.sellData;
  const uploaded = Object.values(d.photos).filter(Boolean).length;
  return `
    <div class="sell-card">
      <h2>사진 등록</h2>
      <p class="sell-hint"><b>필수(*) 4장</b>을 포함해 5장 이상 등록을 권장합니다. 각 슬롯의 가이드를 참고해 주세요.</p>
      <div class="photo-count-bar">
        <span class="photo-count-num">${uploaded}</span> / ${PHOTO_SLOTS.length}장 등록됨
      </div>
      <div class="photo-guide-grid">
        ${PHOTO_SLOTS.map(s => {
          const url = d.photos[s.key];
          return `
            <div class="pgslot${s.req ? ' req' : ''}${url ? ' filled' : ''}" data-open-photo="${s.key}">
              ${url
                ? `<div class="pgslot-preview" style="background-image:url('${url}')">
                    <button class="pgslot-remove" data-remove-photo="${s.key}" aria-label="삭제">×</button>
                  </div>`
                : `<div class="pgslot-empty">
                    <span class="pgslot-plus">+</span>
                    <span class="pgslot-label">${s.label}${s.req ? '<em>*</em>' : ''}</span>
                    <span class="pgslot-hint">${s.hint}</span>
                  </div>`
              }
              <input type="file" accept="image/*" class="photo-file-input" data-photo-key="${s.key}"
                style="${url ? 'display:none' : 'position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;'}">
            </div>`;
        }).join('')}
      </div>
      <div class="field" style="margin-top:16px;">
        <label>상태 설명</label>
        <textarea data-sell-key="desc" rows="4" placeholder="정비 이력, 보관 방식, 포함 품목, 특이사항 등">${d.desc}</textarea>
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" data-next>미리보기</button>
      </div>
    </div>`;
}

function sellStep6() {
  const d = state.sellData;
  const priceStr = d.price ? won(Number(d.price)) : '미입력';
  const titleStr = [d.brand, d.model, d.year ? d.year + '년' : ''].filter(Boolean).join(' ') || '선박 정보 미입력';
  const photoUrls = PHOTO_SLOTS.map(s => d.photos[s.key]).filter(Boolean);
  return `
    <div class="sell-card">
      <h2>접수 미리보기</h2>
      ${photoUrls.length
        ? `<div class="preview-photo-strip">
            <div class="preview-photo-main" style="background-image:url('${photoUrls[0]}')"></div>
            ${photoUrls.length > 1 ? `<div class="preview-photo-row">
              ${photoUrls.slice(1).map(u => `<div class="preview-photo-thumb" style="background-image:url('${u}')"></div>`).join('')}
            </div>` : ''}
          </div>`
        : `<div class="preview-photo-empty">📷 등록된 사진이 없습니다<br><small>사진을 등록하면 매물 노출 확률이 높아집니다</small></div>`
      }
      <div class="preview-card">
        <div class="preview-mode-badge ${state.sellMode === 'pro' ? 'orange' : ''}">${state.sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self'}</div>
        <div class="preview-title">${titleStr}</div>
        <div class="preview-price">${priceStr}</div>
        <div class="info-grid" style="margin-top:12px;">
          ${[['선종',d.type],['지역',d.region||'-'],['운항',d.hours?d.hours+'h':'-'],['엔진',d.engine],['등록증',d.regStatus],['보험',d.insStatus]].map(([k,v])=>`<div class="info"><span>${k}</span><strong>${v}</strong></div>`).join('')}
        </div>
      </div>
      <div class="notice" style="margin-top:14px;">
        ${state.sellMode === 'pro' ? '전문 평가사 방문 후 48시간 검증 딜러 입찰로 진행됩니다.' : '사진 기반 72시간 검증 딜러 입찰이 진행됩니다.'}
      </div>
      <div class="cta-row" style="margin-top:16px;">
        <button class="wide-btn" style="background:var(--soft);color:var(--navy);font-weight:900;" data-prev>이전</button>
        <button class="primary" style="border-radius:var(--r-md);font-weight:900;" id="submitSell">등록 요청</button>
      </div>
    </div>`;
}

function garage() {
  const wished = [...state.wished].map(byId).filter(Boolean);
  const recent = state.recent.map(byId).filter(Boolean);
  return `
    <div class="panel">
      <h1 class="detail-title" style="margin-top:0;">내마린고</h1>
      <div class="info-grid">
        <div class="info"><span>보유 장비</span><strong>Sea-Doo Spark</strong></div>
        <div class="info"><span>AI 예상 시세</span><strong>1,420만원</strong></div>
        <div class="info"><span>보험 만료</span><strong>2026-09-30</strong></div>
        <div class="info"><span>검사 알림</span><strong>120일 남음</strong></div>
      </div>
    </div>
    <section class="section">
      <div class="section-head"><h2>판매 진행</h2><small>${state.sellRequests.length}건</small></div>
      ${state.sellRequests.length
        ? `<div class="summary-list">${state.sellRequests.map(r => `
            <div class="sell-request">
              <div class="sr-left">
                <div class="sr-mode">${r.mode}</div>
                <div class="sr-title">${[r.brand, r.model, r.year ? r.year+'년' : ''].filter(Boolean).join(' ') || r.type || '선박명 미입력'}</div>
                <div class="sr-meta">${r.type || ''}${r.price ? ' · ' + won(Number(r.price)) : ''}${r.region ? ' · ' + r.region : ''}</div>
              </div>
              <span class="sr-status">${r.status}</span>
            </div>`).join('')}</div>`
        : '<div class="empty">진행 중인 판매가 없습니다.</div>'}
    </section>
    <section class="section">
      <div class="section-head"><h2>찜한 매물</h2><small>${wished.length}대</small></div>
      <div class="card-list">${wished.length ? wished.map(x => card(x)).join('') : '<div class="empty">찜한 매물이 없습니다.</div>'}</div>
    </section>
    <section class="section" style="padding-bottom:22px;">
      <div class="section-head"><h2>최근 본 매물</h2><small>${recent.length}대</small></div>
      <div class="card-list">${recent.length ? recent.map(x => card(x)).join('') : '<div class="empty">최근 본 매물이 없습니다.</div>'}</div>
    </section>`;
}

function more() {
  return `
    <div class="panel">
      <h1 class="detail-title" style="margin-top:0;">전체서비스</h1>
      <div class="service-menu">
        <button data-service="전체매물">내마린사기</button>
        <button data-service="모두인증">모두인증</button>
        <button data-service="모두진단">모두진단</button>
        <button data-service="홈배송">홈배송</button>
        <button data-open-ai>AI시세</button>
        <button data-tab="sell">내마린팔기</button>
        <button data-tab="garage">내마린고</button>
        <button data-action="마린론 상담 화면은 준비 중입니다">마린론</button>
        <button data-action="보험/정비 화면은 준비 중입니다">보험/정비</button>
        <button data-action="고객센터 연결 화면은 준비 중입니다">고객센터</button>
      </div>
    </div>
    <section class="section" style="padding-bottom:22px;">
      <button class="dealer-entry" data-tab="dealer">
        <div class="dealer-entry-left">
          <div class="dealer-entry-icon">⚓</div>
          <div>
            <div class="dealer-entry-title">딜러·마리나 센터</div>
            <div class="dealer-entry-sub">매물 관리, 문의 확인, 정산 현황</div>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
      </button>
    </section>`;
}

function dealer() {
  const unread = DEALER.inquiries.filter(q => !q.read).length;
  const statusColor = { '게시중': '#1469FF', '문의중': '#FF5F1F', '상담예약': '#00A8C6', '거래완료': '#8896A7' };
  const statusBg   = { '게시중': '#EEF5FF', '문의중': '#FFF4EE', '상담예약': '#E6F7FA', '거래완료': '#F4F7FB' };

  const myListingsHtml = DEALER.myListings.map(dl => {
    const item = byId(dl.id);
    if (!item) return '';
    const sc = statusColor[dl.status] || '#8896A7';
    const sb = statusBg[dl.status]   || '#F4F7FB';
    return `
      <div class="dlisting">
        <div class="dlisting-thumb" style="background-image:url('${item.image}')"></div>
        <div class="dlisting-body">
          <div class="dlisting-status" style="color:${sc};background:${sb};">${dl.status}</div>
          <div class="dlisting-title">${item.title}</div>
          <div class="dlisting-price">${won(item.price)}</div>
          <div class="dlisting-meta">조회 ${dl.views} · 문의 ${dl.inquiries}건</div>
        </div>
        <div class="dlisting-actions">
          <button class="mini-btn" data-detail="${item.id}">상세</button>
          <button class="mini-btn" data-action="매물 수정 화면은 준비 중입니다">수정</button>
        </div>
      </div>`;
  }).join('');

  const inquiriesHtml = DEALER.inquiries.map(q => `
    <div class="dinquiry ${q.read ? '' : 'dinquiry-unread'}">
      <div class="dinquiry-dot ${q.read ? '' : 'dot-active'}"></div>
      <div class="dinquiry-info">
        <div class="dinquiry-item">${q.item}</div>
        <div class="dinquiry-type">${q.type}</div>
      </div>
      <div class="dinquiry-meta">
        <div class="dinquiry-time">${q.time}</div>
        <button class="mini-btn" style="height:28px;font-size:11px;" data-action="문의 답변 화면은 준비 중입니다">${q.read ? '보기' : '답변'}</button>
      </div>
    </div>`).join('');

  return `
    <div class="dealer-header">
      <div class="dealer-thumb" style="background-image:url('${DEALER.image}')"></div>
      <div class="dealer-info">
        <div class="dealer-name">${DEALER.name}
          ${DEALER.certified ? '<span class="dealer-cert">모두인증</span>' : ''}
        </div>
        <div class="dealer-meta">${DEALER.region} · ${DEALER.since}년 개업</div>
        <div class="dealer-rating">★ ${DEALER.rating} <span>(후기 ${DEALER.reviewCount}건)</span></div>
      </div>
    </div>

    <section class="section">
      <div class="section-head"><h2>이번달 현황</h2></div>
      <div class="dstat-grid">
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.listed}</div>
          <div class="dstat-label">등록 매물</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.monthlyInquiries}</div>
          <div class="dstat-label">이달 문의</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.completedDeals}</div>
          <div class="dstat-label">누적 거래</div>
        </div>
        <div class="dstat">
          <div class="dstat-val">${DEALER.stats.settlementPending}만</div>
          <div class="dstat-label">정산 예정</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head">
        <h2>내 매물</h2>
        <button class="mini-btn primary" data-tab="sell" style="height:30px;font-size:12px;">+ 새 매물</button>
      </div>
      <div class="dlisting-list">${myListingsHtml}</div>
    </section>

    <section class="section" style="padding-bottom:22px;">
      <div class="section-head">
        <h2>최근 문의</h2>
        ${unread > 0 ? `<span class="unread-badge">${unread}건 미확인</span>` : '<small>모두 확인</small>'}
      </div>
      <div class="dinquiry-list">${inquiriesHtml}</div>
    </section>`;
}

function saveState() {
  try {
    localStorage.setItem('modu_wished', JSON.stringify([...state.wished]));
    localStorage.setItem('modu_compared', JSON.stringify([...state.compared]));
    localStorage.setItem('modu_recent', JSON.stringify(state.recent));
    localStorage.setItem('modu_sellRequests', JSON.stringify(state.sellRequests));
  } catch(e) {}
}

function loadState() {
  try {
    const w = localStorage.getItem('modu_wished');
    if (w) {
      const parsed = JSON.parse(w);
      state.wished = new Set(Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : []);
    }
    const c = localStorage.getItem('modu_compared');
    if (c) {
      const parsed = JSON.parse(c);
      state.compared = new Set(Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite) : []);
    }
    const r = localStorage.getItem('modu_recent');
    if (r) {
      const parsed = JSON.parse(r);
      state.recent = Array.isArray(parsed) ? parsed.map(Number).filter(Number.isFinite).slice(0, 8) : [];
    }
    const s = localStorage.getItem('modu_sellRequests');
    if (s) {
      const parsed = JSON.parse(s);
      state.sellRequests = Array.isArray(parsed) ? parsed.filter(x => x && typeof x === 'object') : [];
    }
  } catch(e) {
    state.wished = new Set();
    state.compared = new Set();
    state.recent = [];
    state.sellRequests = [];
  }
}

function renderResults() {
  const rows = filteredListings();
  const countEl = document.getElementById('search-count');
  const resultsEl = document.getElementById('search-results');
  if (countEl) countEl.textContent = `매물 ${rows.length}대`;
  if (resultsEl) resultsEl.innerHTML = rows.length ? rows.map(x => card(x)).join('') : '<div class="empty">조건에 맞는 매물이 없습니다.</div>';
}

function render() {
  document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.toggle('active', b.dataset.tab === state.tab));
  const isPadded = ['search','sell','garage','more','dealer','compare'].includes(state.tab);
  const isDetail = state.tab === 'detail';
  app.className = 'screen' + (isPadded ? ' padded' : '') + (isDetail ? ' detail-pad' : '');
  if (state.tab === 'home') app.innerHTML = home();
  else if (state.tab === 'search') app.innerHTML = search();
  else if (state.tab === 'detail') app.innerHTML = detail();
  else if (state.tab === 'compare') app.innerHTML = compare();
  else if (state.tab === 'sell') app.innerHTML = sell();
  else if (state.tab === 'garage') app.innerHTML = garage();
  else if (state.tab === 'dealer') app.innerHTML = dealer();
  else app.innerHTML = more();

  // 상단 비교 뱃지
  const badge = document.getElementById('cmpTopBadge');
  if (badge) {
    const n = state.compared.size;
    badge.textContent = n || '';
    badge.classList.toggle('visible', n > 0);
  }
  // 플로팅 비교 바 — 비교함·상세에서는 숨김
  const cmpBar = document.getElementById('cmpBar');
  const label = document.getElementById('cmpBarLabel');
  if (cmpBar && label) {
    const showBar = state.compared.size > 0 && !['compare', 'detail'].includes(state.tab);
    cmpBar.classList.toggle('hidden', !showBar);
    label.textContent = `비교함 ${state.compared.size}대`;
  }
}

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) return setTab(tab.dataset.tab);

  const wish = e.target.closest('[data-wish]');
  if (wish) {
    const id = Number(wish.dataset.wish);
    state.wished.has(id) ? state.wished.delete(id) : state.wished.add(id);
    showToast(state.wished.has(id) ? '찜했습니다' : '찜을 해제했습니다');
    saveState();
    return render();
  }

  const cmp = e.target.closest('[data-compare]');
  if (cmp) {
    const id = Number(cmp.dataset.compare);
    const adding = !state.compared.has(id);
    if (adding && state.compared.size >= 4) return showToast('비교함은 최대 4대까지 가능합니다');
    adding ? state.compared.add(id) : state.compared.delete(id);
    showToast(adding ? `비교함에 추가됐습니다 (${state.compared.size}대)` : '비교함에서 제거됐습니다');
    saveState();
    return render();
  }

  // Gallery thumb click — swap main image without full re-render
  const thumb = e.target.closest('.detail-thumb');
  if (thumb) {
    const url = thumb.dataset.src;
    const idx = thumb.dataset.idx;
    const mainImg = document.querySelector('.detail-main-img');
    if (mainImg && url) {
      mainImg.style.backgroundImage = `url('${url}')`;
      document.querySelectorAll('.detail-thumb').forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const countEl = document.querySelector('.detail-img-count');
      const total = document.querySelectorAll('.detail-thumb').length;
      if (countEl) countEl.textContent = `${idx} / ${total}`;
    }
    return;
  }

  // Photo slot remove button
  const removePhoto = e.target.closest('[data-remove-photo]');
  if (removePhoto) {
    e.stopPropagation();
    const key = removePhoto.dataset.removePhoto;
    if (state.sellData.photos[key]) URL.revokeObjectURL(state.sellData.photos[key]);
    delete state.sellData.photos[key];
    return render();
  }

  // Photo slot open file dialog (desktop fallback — mobile uses transparent input overlay)
  const photoSlot = e.target.closest('[data-open-photo]');
  if (photoSlot && e.target.type !== 'file') {
    const input = photoSlot.querySelector('input[type="file"]');
    if (input && input.style.display !== 'none') input.click();
    return;
  }
  if (e.target.type === 'file') return; // 인풋 직접 탭 — 브라우저가 처리

  const d = e.target.closest('[data-detail]');
  if (d) return viewDetail(d.dataset.detail);

  const service = e.target.closest('[data-service]');
  if (service) { state.filters.service = service.dataset.service; state.filters.q = ''; return setTab('search'); }

  const sf = e.target.closest('[data-service-filter]');
  if (sf) { state.filters.service = sf.dataset.serviceFilter; return render(); }

  const budget = e.target.closest('[data-budget]');
  if (budget) { state.filters.maxPrice = budget.dataset.budget; state.filters.category = '전체'; return setTab('search'); }

  const theme = e.target.closest('[data-theme]');
  if (theme) { state.filters.category = theme.dataset.theme; return setTab('search'); }

  if (e.target.closest('[data-open-ai]')) return showToast('AI시세 화면은 다음 단계에서 연결합니다');

  const action = e.target.closest('[data-action]');
  if (action) return showToast(action.dataset.action);

  const mode = e.target.closest('[data-mode]');
  if (mode) { state.sellMode = mode.dataset.mode; return render(); }

  if (e.target.closest('[data-next]')) {
    document.querySelectorAll('[data-sell-key]').forEach(el => {
      state.sellData[el.dataset.sellKey] = el.value;
    });
    state.sellStep = Math.min(6, state.sellStep + 1);
    return render();
  }
  if (e.target.closest('[data-prev]')) {
    state.sellStep = Math.max(0, state.sellStep - 1);
    return render();
  }

  if (e.target.id === 'submitSell') {
    document.querySelectorAll('[data-sell-key]').forEach(el => {
      state.sellData[el.dataset.sellKey] = el.value;
    });
    const d = state.sellData;
    const photoUrls = PHOTO_SLOTS.map(s => d.photos[s.key]).filter(Boolean);
    state.sellRequests.unshift({
      mode: state.sellMode === 'pro' ? '내마린팔기 Pro' : '내마린팔기 Self',
      status: '접수 완료',
      type: d.type, brand: d.brand, model: d.model,
      year: d.year, price: d.price, region: d.region,
      created: new Date().toLocaleDateString('ko-KR'),
      image: photoUrls[0] || '',
      photos: {...d.photos},
    });
    state.sellStep = 0;
    state.sellData = freshSellData();
    saveState();
    showToast('내마린팔기 접수 완료');
    return setTab('garage');
  }

  if (e.target.closest('[data-do-search]')) {
    state.filters.category = '전체';
    state.filters.service = '전체매물';
    return setTab('search');
  }

  if (e.target.closest('#cmpBarBtn')) return setTab('compare');
  if (e.target.closest('#homeBtn')) return setTab('home');
  if (e.target.closest('#backBtn')) {
    if (state.tab === 'detail') return setTab('search');
    if (state.tab === 'dealer') return setTab('more');
    return setTab('home');
  }
  if (e.target.closest('#wishBtn')) return setTab('garage');
  if (e.target.closest('#compareBtn')) return setTab('compare');

  if (e.target.closest('[data-compare-clear]')) {
    state.compared.clear();
    saveState();
    return render();
  }
});

document.addEventListener('input', e => {
  if (e.target.id === 'homeSearch') {
    state.filters.q = e.target.value;
  }
  if (e.target.id === 'q') {
    state.filters.q = e.target.value;
    clearTimeout(qTimer);
    qTimer = setTimeout(renderResults, 350);
  }
  if (['category', 'maxPrice', 'region', 'sort'].includes(e.target.id)) {
    state.filters[e.target.id] = e.target.value;
    render();
  }
});

document.addEventListener('change', e => {
  if (['category', 'maxPrice', 'region', 'sort'].includes(e.target.id)) {
    state.filters[e.target.id] = e.target.value;
    render();
    return;
  }
  if (e.target.classList.contains('photo-file-input')) {
    const key = e.target.dataset.photoKey;
    const file = e.target.files && e.target.files[0];
    if (file && key) {
      if (state.sellData.photos[key]) URL.revokeObjectURL(state.sellData.photos[key]);
      state.sellData.photos[key] = URL.createObjectURL(file);
      render();
    }
  }
});

loadState();
render();
