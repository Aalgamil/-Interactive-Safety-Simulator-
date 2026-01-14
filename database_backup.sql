-- MySQL dump 10.13  Distrib 9.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: safety_simulator
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accident_scenarios`
--

DROP TABLE IF EXISTS `accident_scenarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accident_scenarios` (
  `scenario_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scenario_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `question_text` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_a` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_b` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_c` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `option_d` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct_answer` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `explanation` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `difficulty_level` enum('easy','medium','hard') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `category` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`scenario_id`),
  KEY `idx_accident_active` (`is_active`),
  KEY `idx_accident_category` (`category`),
  KEY `idx_accident_difficulty` (`difficulty_level`),
  CONSTRAINT `accident_scenarios_chk_1` CHECK ((`correct_answer` in (_utf8mb4'A',_utf8mb4'B',_utf8mb4'C',_utf8mb4'D')))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accident_scenarios`
--

LOCK TABLES `accident_scenarios` WRITE;
/*!40000 ALTER TABLE `accident_scenarios` DISABLE KEYS */;
INSERT INTO `accident_scenarios` VALUES (1,'Two-Car Collision','You witness a two-car collision at an intersection. One driver appears injured and the other is standing outside their vehicle.','What should be your first priority?','Take photos of the damage','Ask the standing driver what happened','Call emergency services (999) for the injured person','Move the vehicles to clear traffic','C','Always prioritize human life. If someone is injured, call 999 immediately before doing anything else.','medium','traffic_accident',1,'2025-12-17 16:08:05'),(2,'Gasoline Leak','You notice a strong gasoline smell near a parked car with a visible fuel leak.','What should you do immediately?','Start the car to move it away','Call the owner of the vehicle','Move away from the area and call emergency services','Try to fix the leak yourself','C','Gasoline leaks create serious fire and explosion hazards. Your safety comes first.','easy','vehicle_hazard',1,'2025-12-17 16:08:05'),(3,'Minor Fender-Bender','A minor fender-bender occurs with no injuries and minimal damage. Both drivers are present.','What is the correct procedure?','Call 999 for emergency services','Call 901 for police non-emergency line','Don\'t call anyone, just exchange insurance information','Leave the scene immediately','B','For non-emergency accidents with no injuries, call 901 to report to police.','easy','traffic_accident',1,'2025-12-17 16:08:05');
/*!40000 ALTER TABLE `accident_scenarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cybercrime_messages`
--

DROP TABLE IF EXISTS `cybercrime_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cybercrime_messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `message_type` enum('email','sms','whatsapp','social_media','phone_call') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_scam` tinyint(1) NOT NULL,
  `red_flags` json DEFAULT NULL,
  `safety_tips` text COLLATE utf8mb4_unicode_ci,
  `legitimate_indicators` text COLLATE utf8mb4_unicode_ci,
  `sender_info` json DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`message_id`),
  KEY `idx_cyber_active` (`is_active`),
  KEY `idx_cyber_type` (`message_type`),
  KEY `idx_cyber_scam` (`is_scam`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cybercrime_messages`
--

LOCK TABLES `cybercrime_messages` WRITE;
/*!40000 ALTER TABLE `cybercrime_messages` DISABLE KEYS */;
INSERT INTO `cybercrime_messages` VALUES (1,'Dubai Police Lottery','Congratulations! You have won AED 50,000 in Dubai Police lottery. Click this link to claim: bit.ly/dp-lottery-claim','email',1,'[\"Too good to be true\", \"Dubai Police doesn\'t run lotteries\", \"Suspicious shortened URL\", \"Asks for personal information\"]','Never click on suspicious links. Dubai Police never runs lotteries or asks for personal information via email.','Legitimate police communications come from official domains and never offer prizes.','{\"domain\": \"dp-lottery.fake\", \"sender\": \"noreply@dp-lottery.fake\"}',1,'2025-12-17 16:08:05'),(2,'Police OTP Request','This is Officer Ahmed from Dubai Police. We need your OTP to verify your identity for an ongoing investigation. Please send your 6-digit OTP immediately.','sms',1,'[\"Unsolicited message from unknown number\", \"Requests sensitive information (OTP)\", \"Creates false urgency\", \"Police never ask for OTPs\"]','Never share OTPs with anyone. Official police investigations never request such information via SMS.','Legitimate police contact will come through official channels and proper procedures.','{\"number\": \"unverified\", \"sender\": \"+971501234567\"}',1,'2025-12-17 16:08:05'),(3,'Bank Security Alert','Your account has been compromised. Verify your identity by clicking here: http://security-alerts-bank.com/verify','email',1,'[\"Misspelled domain\", \"Creates urgency and fear\", \"Suspicious URL\", \"Requests immediate action\"]','Banks never ask you to verify via external links sent through email. Always contact your bank directly.','Official bank emails come from verified domains and don\'t include suspicious links.','{\"domain\": \"alerts-bank.com\", \"sender\": \"security@alerts-bank.com\"}',1,'2025-12-17 16:08:05');
/*!40000 ALTER TABLE `cybercrime_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emergency_scenarios`
--

DROP TABLE IF EXISTS `emergency_scenarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emergency_scenarios` (
  `scenario_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scenario_description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `emergency_type` enum('medical','fire','crime','accident','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `correct_action` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `wrong_action_1` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `wrong_action_2` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `priority_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci DEFAULT 'medium',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`scenario_id`),
  KEY `idx_emergency_active` (`is_active`),
  KEY `idx_emergency_type` (`emergency_type`),
  KEY `idx_emergency_priority` (`priority_level`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emergency_scenarios`
--

LOCK TABLES `emergency_scenarios` WRITE;
/*!40000 ALTER TABLE `emergency_scenarios` DISABLE KEYS */;
INSERT INTO `emergency_scenarios` VALUES (1,'Heart Attack Symptoms','An elderly person suddenly clutches their chest and says they feel severe chest pain and shortness of breath.','medical','Call 999 immediately and stay with the person','Give them water to drink','Tell them to walk around to feel better','999','critical',1,'2025-12-17 16:08:05'),(2,'Kitchen Fire','A small fire starts in your kitchen while cooking. The fire is contained to the pot on the stove.','fire','Turn off the heat source and use a lid to smother the fire','Pour water on the fire','Use flour to put out the fire','997','high',1,'2025-12-17 16:08:05'),(3,'Traffic Violation','You witness a traffic violation you witnessed yesterday and want to report it.','crime','Call 901 to report non-urgent police matters','Call 999 as it\'s an emergency','Ignore it as it happened yesterday','901','low',1,'2025-12-17 16:08:05');
/*!40000 ALTER TABLE `emergency_scenarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_responses`
--

DROP TABLE IF EXISTS `user_responses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_responses` (
  `response_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `scenario_id` int NOT NULL,
  `module_type` enum('accident','emergency','cybercrime') COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_answer` text COLLATE utf8mb4_unicode_ci,
  `is_correct` tinyint(1) DEFAULT NULL,
  `response_time` int DEFAULT '0',
  `answered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`response_id`),
  KEY `idx_responses_session_id` (`session_id`),
  KEY `idx_responses_scenario` (`scenario_id`),
  KEY `idx_responses_module` (`module_type`),
  KEY `idx_responses_correct` (`is_correct`),
  CONSTRAINT `user_responses_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `user_sessions` (`session_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_responses`
--

LOCK TABLES `user_responses` WRITE;
/*!40000 ALTER TABLE `user_responses` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_responses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_score_summary`
--

DROP TABLE IF EXISTS `user_score_summary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_score_summary` (
  `summary_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `accident_best_score` int DEFAULT '0',
  `accident_total_attempts` int DEFAULT '0',
  `accident_average_score` decimal(5,2) DEFAULT '0.00',
  `emergency_best_score` int DEFAULT '0',
  `emergency_total_attempts` int DEFAULT '0',
  `emergency_average_score` decimal(5,2) DEFAULT '0.00',
  `cybercrime_best_score` int DEFAULT '0',
  `cybercrime_total_attempts` int DEFAULT '0',
  `cybercrime_average_score` decimal(5,2) DEFAULT '0.00',
  `overall_best_score` int DEFAULT '0',
  `total_sessions` int DEFAULT '0',
  `last_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`summary_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `idx_summary_user_id` (`user_id`),
  KEY `idx_summary_last_activity` (`last_activity`),
  CONSTRAINT `user_score_summary_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_score_summary`
--

LOCK TABLES `user_score_summary` WRITE;
/*!40000 ALTER TABLE `user_score_summary` DISABLE KEYS */;
INSERT INTO `user_score_summary` VALUES (1,1,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-17 16:08:05'),(2,3,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:26'),(3,4,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27'),(4,5,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27'),(5,6,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27'),(6,7,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27'),(7,8,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27'),(8,9,0,0,0.00,0,0,0.00,0,0,0.00,0,0,'2025-12-25 06:54:27');
/*!40000 ALTER TABLE `user_score_summary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_sessions`
--

DROP TABLE IF EXISTS `user_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `module_type` enum('accident','emergency','cybercrime') COLLATE utf8mb4_unicode_ci NOT NULL,
  `scenario_id` int DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `score` int DEFAULT '0',
  `correct_answers` int DEFAULT '0',
  `total_questions` int DEFAULT '0',
  `time_taken` int DEFAULT '0',
  `completed` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`session_id`),
  KEY `idx_sessions_user_id` (`user_id`),
  KEY `idx_sessions_module_type` (`module_type`),
  KEY `idx_sessions_completed` (`completed`),
  KEY `idx_sessions_start_time` (`start_time`),
  CONSTRAINT `user_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_sessions_chk_1` CHECK (((`score` >= 0) and (`score` <= 100)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_sessions`
--

LOCK TABLES `user_sessions` WRITE;
/*!40000 ALTER TABLE `user_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_users_email` (`email`),
  KEY `idx_users_username` (`username`),
  KEY `idx_users_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@safetysimulator.com','$2b$10$rOK6I8vW8V6Y8Z8Z8Z8Z8uN8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8','System Administrator','2025-12-17 16:08:05','2025-12-17 16:08:05',1,NULL),(3,'johndoe','john.doe@example.com','$2a$10$TMdZ3KUKcq4TlmIG.S2PauMWe/tcx3ZSoPDJVc4eu.PBF.7jTgU8.','John Doe','2025-12-25 06:54:26','2025-12-25 06:54:26',1,NULL),(4,'sarahsmith','sarah.smith@example.com','$2a$10$IM3WqYe.DzP.T2Y3tc3Sve8s09OSpwgN0jSYWBNWHSLsQP6.2f2oy','Sarah Smith','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL),(5,'mohammedali','mohammed.ali@example.com','$2a$10$/eQPeHwYaSYv8n79nPW.4uLjG6J9hdeRFYly/37.Oi4oGoJiHNCii','Mohammed Ali','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL),(6,'fatimahassan','fatima.hassan@example.com','$2a$10$4UNvzT11k1WvuhbBrB0vguAE1mqzGHta9nBVlOwUnp9WXjAZLFOgC','Fatima Hassan','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL),(7,'ahmedkhalid','ahmed.khalid@example.com','$2a$10$ILI1hjc4apksUrO53Lbo5Or3mcJY7cUEtWkkDSnNk9lZrKA6gSaJS','Ahmed Khalid','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL),(8,'mariamal','mariam.al@example.com','$2a$10$gM9NOijVj27jcT5D6HVwNOyq6xxSbEVejPQIbA74.hctzSGfYfAG.','Mariam Al','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL),(9,'omarsaeed','omar.saeed@example.com','$2a$10$nldXELDmISf34qNKAZGgf.Qyka..XhqPlxaQOdMSeKF.O/Xu/0QZS','Omar Saeed','2025-12-25 06:54:27','2025-12-25 06:54:27',1,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-13  9:10:45
