
# 소개
해당 프로젝트를 만들게 된 이유는
저는 평소 축구를 즐겨하고 친구들과 팀을 만들어 팀 운영도 하고있습니다.

팀 운영중에
팀 소개와 팀내 게시글은 인스타그램에 업로드하고
매칭글은 네이버카페에서 찾아봐야 하고
경기장은 주소를 복사해서 지도어플로 이동해서 위치를 찾아가야하는 번거로움이 있었습니다.

팀 운영을 여러 곳에서 진행하는게 약간 번거롭다고 생각되어
하나의 사이트에서 
팀 소개 및 팀 내 게시글 공유, 
매칭글을 올릴 수 있는 게시판, 
구장 위치 확인과 바로 길찾기까지 가능하도록 하면
편할 것 같다고 생각되어 만들어보았습니다.

깃허브 : <a href="https://github.com/jae-hoon-jae-hoon/plab1" target="_blank">https://github.com/jae-hoon-jae-hoon/plab1</a>
도메인 : 추가예정

---

# 사용 기술
- 프론트엔드
	- React
	- CSS
	- Bootstrap
	- Axios
	- Slick
	- Redux

- 백엔드
	- Node.js
	- Express.js
    
- 데이터베이스
	- MySQL
	- MySQL Workbench
    
- 버전 관리
	- git
	- github
    
- 클라우드 스토리지
	- AWS S3
    
- 배포
	- AWS Elastic Beanstalk
	- AWS RDS

---

# 구현 기능
내용이 길어질 것 같아 이 글에서는 큰 목차만 작성하고 개발 상세 내용은 분리해서 작성하겠습니다

### 회원 기능 
<a href="https://velog.io/@jeongjh159/%EC%B6%95%EA%B5%AC%ED%8C%80%EC%9A%B4%EC%98%81-%ED%9A%8C%EC%9B%90%EA%B8%B0%EB%8A%A5" target="_blank">[회원기능 상세내용 보기]</a>
 - 회원가입
 - 로그인 
 	: jsonWebToken을 사용하여 사용자 인증 절차를 구현했습니다.
 - 마이페이지

### 게시판
<a href="https://velog.io/@jeongjh159/%EC%B6%95%EA%B5%AC%ED%8C%80%EC%9A%B4%EC%98%81-%EA%B2%8C%EC%8B%9C%ED%8C%90" target="_blank">[게시판 상세내용 보기]</a>
 - 게시글 CRUD
 - 검색
 - 페이지네이션

### 팀 관리
<a href="https://velog.io/@jeongjh159/%EC%B6%95%EA%B5%AC%ED%8C%80%EC%9A%B4%EC%98%81-%ED%8C%80%EA%B4%80%EB%A6%AC" target="_blank">[팀관리 상세내용 보기]</a>
 - 팀 CRUD
 - 팀 가입
 - My Team : 팀에 가입하고 팀을 관리할 수 있습니다.

### 구장 찾기
<a href="https://velog.io/@jeongjh159/%EC%B6%95%EA%B5%AC%ED%8C%80%EC%9A%B4%EC%98%81-%EA%B5%AC%EC%9E%A5%EC%B0%BE%EA%B8%B0" target="_blank">[구장찾기 상세내용 보기]</a>
 - 구장 리스트 
 	: 카카오 지도 API를 이용해 근처 구장들의 위치와 구장 정보를 확인할 수 있습니다.
 - 구장 즐겨찾기 
 	: 즐겨찾기로 등록된 구장들의 정보를 한 눈에 확인할 수 있습니다.
  
---

# 데이터베이스 ERD
![](https://velog.velcdn.com/images/jeongjh159/post/b455b290-69b6-4747-8cd1-7c4565e60e3d/image.png)


---

# 글 마무리
리액트와 노드를 공부하면서 해당 작품을 만들어보았습니다.
강의를 보며 언어 사용법을 공부하고나서 
직접 프로젝트를 만들어보니 복습도 되고, 배우는 재미도 있었습니다.

회원기능의 경우, oAuth를 사용해 github나 kakao을 통해 구현하는 방법도 있었지만
그 원리를 익혀보기위해 jsonWebToken으로 직접 짜보기도 하면서 더 넓고 깊게 공부할 수 있었습니다.

파일업로드 시 S3를 사용하고 , 배포 시 Elastic Beanstalk를 사용하며
AWS의 서비스도 공부할 수 있는 기회가 되어 좋았습니다.

앞으로 코드 리팩토링작업과 추가하고 싶은 기능을 추가하며 더 완성도있는 프로젝트로 만들어보겠습니다.


