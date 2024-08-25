-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: my_db
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `board`
--

DROP TABLE IF EXISTS `board`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `board` (
  `boardNo` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `regDate` datetime NOT NULL,
  `userNo` int DEFAULT NULL,
  `userName` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`boardNo`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `board`
--

LOCK TABLES `board` WRITE;
/*!40000 ALTER TABLE `board` DISABLE KEYS */;
INSERT INTO `board` VALUES (11,'게시글 등록!','안녕','2024-06-26 02:29:57',1,'첫번째회원'),(12,'게시글 등록ㅎㅇ','ㅎㅇㅎㅇㅎㅇㅎㅎㅇ','2024-06-26 02:31:28',2,'사용자2'),(13,'ㅇㅇㅇ','ㅇㅇㅇ','2024-06-28 14:17:16',1,'첫번째회원'),(17,'test','test222333','2024-07-19 02:53:13',4,'aa'),(18,'test2','test','2024-07-19 19:08:58',4,'aa'),(19,'test3','test','2024-07-19 19:09:04',4,'aa'),(20,'test4','testaaaa','2024-07-19 19:09:08',4,'aa'),(21,'test5','test','2024-07-22 00:50:02',4,'aa'),(22,'test6','test','2024-07-22 00:50:06',4,'aa'),(23,'test7','test','2024-07-22 00:50:23',4,'aa'),(27,'aa12','zz','2024-08-21 23:27:10',4,'aa'),(28,'bb','bb-1','2024-08-22 23:27:38',5,'bb'),(29,'test','test','2024-08-26 02:10:33',4,'aa-1');
/*!40000 ALTER TABLE `board` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `commentNo` int NOT NULL AUTO_INCREMENT,
  `boardNo` int NOT NULL,
  `userNo` int NOT NULL,
  `userName` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `comment` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `regDate` datetime DEFAULT NULL,
  PRIMARY KEY (`commentNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (1,13,1,'첫번째회원','댓글 테스트','2024-06-28 17:40:17'),(2,13,1,'첫번째회원','두번째 댓글','2024-06-28 17:55:33'),(3,13,1,'첫번째회원','세번째 댓글','2024-06-28 17:58:10');
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `member` (
  `userNo` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `userPw` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `userName` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `regDate` datetime DEFAULT NULL,
  PRIMARY KEY (`userNo`),
  UNIQUE KEY `userId_UNIQUE` (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'test','1234','첫번째회원','2024-01-01 10:30:00'),(2,'test2','1234','사용자2','2024-06-23 23:20:10'),(3,'test3','1234','사용자3','2024-06-23 23:22:50'),(4,'aa','$2b$10$El1kTDKs5s3EZkAgeZ/pseYCzezpVFbGVeg1GMPJmS2kwlmluuBsi','aa-1','2024-07-15 00:05:44'),(5,'bb','$2b$10$2GJVJFhyuu0gbqI2UhKHEumUeibcZIp667GPKSQW5aM4BoC3RekZ.','bb','2024-08-22 23:27:26');
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `my_stadium`
--

DROP TABLE IF EXISTS `my_stadium`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `my_stadium` (
  `myStadiumNo` int NOT NULL AUTO_INCREMENT,
  `userNo` int NOT NULL,
  `mapId` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `place_name` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `road_address_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `address_name` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `x` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `y` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  PRIMARY KEY (`myStadiumNo`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `my_stadium`
--

LOCK TABLES `my_stadium` WRITE;
/*!40000 ALTER TABLE `my_stadium` DISABLE KEYS */;
INSERT INTO `my_stadium` VALUES (55,4,'247981013','푸마타운 풋살장','경기 수원시 팔달구 덕영대로 924','경기 수원시 팔달구 매산로1가 18','126.999594133163','37.2673635262554'),(56,4,'59783337','수원롯데몰 컬러디움 야외풋살장','경기 수원시 권선구 세화로 134','경기 수원시 권선구 서둔동 381','126.997294335048','37.2641783129118'),(57,4,'1849449239','HK풋살파크','경기 수원시 권선구 매송고색로 903','경기 수원시 권선구 평동 130-1','126.99910717046296','37.26079853040919'),(58,4,'240765639','팩토리풋살파크','경기 수원시 권선구 수인로 163-1','경기 수원시 권선구 서둔동 235-2','126.980953944661','37.2748334275445'),(59,5,'73012062','누누풋살장 오목천점','','경기 수원시 권선구 오목천동 559','126.966516969259','37.2396724214764'),(60,5,'1507490918','피닉스풋살파크','경기 수원시 권선구 오목천로 36-1','경기 수원시 권선구 오목천동 559-7','126.966519344002','37.2393994052515'),(61,5,'816428541','수원시티FC축구센터','경기 화성시 매송면 매송고색로503번길 219-7','경기 화성시 매송면 천천리 35-46','126.95234369953','37.2506936531024'),(62,5,'118311244','칠보인조잔디구장','','경기 수원시 권선구 금곡동 1071','126.94923856257006','37.27561068488066');
/*!40000 ALTER TABLE `my_stadium` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stadium`
--

DROP TABLE IF EXISTS `stadium`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stadium` (
  `stadiumNo` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `address` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `latitude` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `longitude` varchar(45) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`stadiumNo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stadium`
--

LOCK TABLES `stadium` WRITE;
/*!40000 ALTER TABLE `stadium` DISABLE KEYS */;
INSERT INTO `stadium` VALUES (1,'HK 풋살파크','경기도 수원시 권선구 매송고색로 903','37.26079943138349','126.99909815197205','2024-07-22 16:00:00'),(2,'컬러디움 야외풋살장','경기도 수원시 권선구 세화로 134 5층','37.26397557932112','126.99733379980867','2024-07-22 16:00:00'),(3,'푸마타운 풋살장','경기도 수원시 팔달구 덕영대로 924 AK&(신축건물) 7층 옥상공원','37.267381547154564','126.99961386270915','2024-07-22 16:00:00');
/*!40000 ALTER TABLE `stadium` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `teamNo` int NOT NULL AUTO_INCREMENT,
  `teamName` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `teamDesc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `teamImgKey` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `teamImgPath` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`teamNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES (1,'하한마FS','안녕하세요. 수원에서 활동하는 하한마FS입니다. 즐겁게 운동해요~ 안녕하세요. 수원에서 활동하는 하한마FS입니다. 즐겁게 운동해요!','1724088266523_myteam_img.png','https://jh-img-upload.s3.ap-northeast-2.amazonaws.com/1724088266523_myteam_img.png','2024-08-01 22:48:26'),(2,'test2','aaaaa','','','2024-08-01 23:04:31'),(3,'test3','aaa','','','2024-08-01 23:07:35'),(4,'test4','aa','','','2024-08-01 23:07:55'),(5,'test5','asd','','','2024-08-01 23:43:24'),(6,'test6','asd','','','2024-08-01 23:43:36'),(7,'test7','asd','','','2024-08-01 23:43:41'),(8,'aaa','zzz','','','2024-08-01 23:44:29'),(9,'ww','zz','','','2024-08-01 23:47:07'),(10,'ㅁㅁㅁ','ㅋㅌㅊ','1724087801459_%C3%AB%C2%A6%C2%AC%C3%AC%C2%95%C2%A1%C3%AD%C2%8A%C2%B8%20%C3%AB%C2%A0%C2%8C%C3%AB%C2%8D%C2%94%C3%AB%C2%A7%C2%81%C3%AC%C2%88%C2%9C%C3%AC%C2%84%C2%9C.png','https://jh-img-upload.s3.ap-northeast-2.amazonaws.com/1724087801459_%25C3%25AB%25C2%25A6%25C2%25AC%25C3%25AC%25C2%2595%25C2%25A1%25C3%25AD%25C2%258A%25C2%25B8%2520%25C3%25AB%25C2%25A0%25C2%258C%25C3%25AB%25C2%258D%25C2%2594%25C3%25AB%25C2%25A7%25C2%2581%25C3%25AC%25C2%2588%25C2%259C%25C3%25AC%25C2%2584%25C2%259C.png','2024-08-20 02:16:41');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_join`
--

DROP TABLE IF EXISTS `team_join`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_join` (
  `teamJoinNo` int NOT NULL AUTO_INCREMENT,
  `teamNo` int NOT NULL,
  `userNo` int NOT NULL,
  `level` tinyint NOT NULL COMMENT '1: 팀 생성자\\n2: 팀 관리자\\n3: 팀 일반회원',
  `status` tinyint NOT NULL COMMENT '1: 가입승인\\\\n2: 가입거절\\\\n3: 가입대기',
  `backnumber` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci DEFAULT NULL,
  `etc` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci,
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`teamJoinNo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_join`
--

LOCK TABLES `team_join` WRITE;
/*!40000 ALTER TABLE `team_join` DISABLE KEYS */;
INSERT INTO `team_join` VALUES (3,1,4,2,1,'10','30득점 30어시스트 ~~','2024-08-02 18:31:47'),(4,1,3,3,1,'21','gddgg','2024-08-02 18:31:47'),(5,1,2,3,1,'1','','2024-08-02 18:31:47'),(6,1,5,3,3,'',NULL,'2024-08-22 23:27:59');
/*!40000 ALTER TABLE `team_join` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team_record`
--

DROP TABLE IF EXISTS `team_record`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_record` (
  `teamRecordNo` int NOT NULL AUTO_INCREMENT,
  `teamNo` int NOT NULL,
  `myScore` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `opponentScore` varchar(4) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `opponentName` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`teamRecordNo`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_record`
--

LOCK TABLES `team_record` WRITE;
/*!40000 ALTER TABLE `team_record` DISABLE KEYS */;
INSERT INTO `team_record` VALUES (1,1,'5','3','맨시티','2024-08-22 18:00:47'),(4,1,'1','0','test','2024-08-22 17:09:08'),(6,1,'1','2','late','2024-08-22 17:18:53');
/*!40000 ALTER TABLE `team_record` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `token`
--

DROP TABLE IF EXISTS `token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `token` (
  `tokenNo` int NOT NULL AUTO_INCREMENT,
  `refreshToken` varchar(200) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
  `regDate` datetime NOT NULL,
  PRIMARY KEY (`tokenNo`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `token`
--

LOCK TABLES `token` WRITE;
/*!40000 ALTER TABLE `token` DISABLE KEYS */;
INSERT INTO `token` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTm8iOjQsImlhdCI6MTcyNDYwNTkyOSwiZXhwIjoxNzI0NjQ5MTI5fQ.FyfFdzPKoaHmDjI8iIslbdxTsoYB4REWypR26GxcHH4','2024-08-26 02:12:09');
/*!40000 ALTER TABLE `token` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-08-26  2:15:54
