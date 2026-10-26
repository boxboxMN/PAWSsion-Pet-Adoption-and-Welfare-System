-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 26, 2026 at 08:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `pawpon_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `kamustahan_updates`
--

CREATE TABLE `kamustahan_updates` (
  `update_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `update_date` date NOT NULL,
  `update_text` text NOT NULL,
  `photos` text NOT NULL,
  `is_archived` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Pending',
  `consultation_type` varchar(50) DEFAULT 'Routine Check-up',
  `vet_visit_date` date DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `vet_diagnosis` text DEFAULT NULL,
  `consultation_status` enum('open','awaiting_org','resolved') DEFAULT 'awaiting_org',
  `org_response` text DEFAULT NULL,
  `org_responded_at` datetime DEFAULT NULL,
  `health_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`health_checklist`)),
  `behavior_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`behavior_checklist`)),
  `concerns` text DEFAULT NULL,
  `vet_visit` tinyint(1) DEFAULT 0,
  `org_evaluation_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`org_evaluation_checklist`)),
  `org_verdict` enum('approved','follow_up','urgent') DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamustahan_updates`
--

INSERT INTO `kamustahan_updates` (`update_id`, `animal_id`, `adopter_id`, `organization_id`, `update_date`, `update_text`, `photos`, `is_archived`, `status`, `consultation_type`, `vet_visit_date`, `scheduled_date`, `created_at`, `vet_diagnosis`, `consultation_status`, `org_response`, `org_responded_at`, `health_checklist`, `behavior_checklist`, `concerns`, `vet_visit`, `org_evaluation_checklist`, `org_verdict`, `follow_up_date`) VALUES
(55, 57, 1, 1, '2026-10-26', 'jxnjanxja', '[\"/uploads/kamustahan/kamustahan-1792993865199.jpg\"]', 1, 'Archived', 'Routine Check-up', '2026-10-26', '2026-10-26', '2026-10-26 05:51:05', 'None', 'resolved', 'follow up', '2026-10-26 13:52:22', '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"normal\",\"vomiting\":\"none\",\"activity\":\"playful\",\"respiratory\":\"normal\",\"grooming\":\"good\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\",\"destructive\":\"none\",\"vocalization\":\"normal\",\"sleep\":\"normal\"}', 'jxnjanxja', 1, '{\"photo_quality\":\"satisfied\",\"health_info\":\"satisfied\",\"behavior_info\":\"satisfied\",\"overall_wellbeing\":\"follow_up\"}', 'follow_up', '2026-10-27'),
(56, 27, 9, 1, '0000-00-00', '', '', 0, 'For Update', 'Routine Check-up', NULL, '2026-10-26', '2026-10-26 05:32:39', NULL, 'awaiting_org', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL),
(57, 32, 1, 1, '2026-10-26', 'Updated via Health & Behavior Checklist.', '[\"/uploads/kamustahan/kamustahan-1792994194982.jpg\"]', 1, 'Archived', 'Routine Check-up', NULL, '2026-10-27', '2026-10-26 05:56:35', NULL, 'resolved', 'oki', '2026-10-26 13:57:09', '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"normal\",\"vomiting\":\"none\",\"activity\":\"playful\",\"respiratory\":\"normal\",\"grooming\":\"good\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"destructive\":\"none\",\"anxiety\":\"none\",\"vocalization\":\"normal\",\"sleep\":\"normal\"}', NULL, 0, '{\"photo_quality\":\"satisfied\",\"health_info\":\"satisfied\",\"behavior_info\":\"satisfied\",\"overall_wellbeing\":\"satisfied\"}', 'approved', NULL),
(58, 57, 1, 1, '2026-10-26', 'Updated via Health & Behavior Checklist.', '[\"/uploads/kamustahan/kamustahan-1792994115263.jpg\"]', 1, 'Archived', 'Routine Check-up', NULL, '2026-10-27', '2026-10-26 05:55:15', NULL, 'resolved', 'oki na', '2026-10-26 13:55:41', '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"normal\",\"vomiting\":\"none\",\"activity\":\"playful\",\"respiratory\":\"normal\",\"grooming\":\"good\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"destructive\":\"none\",\"anxiety\":\"none\",\"vocalization\":\"normal\",\"sleep\":\"normal\"}', NULL, 0, '{\"photo_quality\":\"satisfied\",\"health_info\":\"satisfied\",\"behavior_info\":\"satisfied\",\"overall_wellbeing\":\"satisfied\"}', 'approved', NULL),
(59, 57, 1, 1, '2026-10-26', 'Updated via Health & Behavior Checklist.', '[\"/uploads/kamustahan/kamustahan-1792995753813.jpg\"]', 1, 'Archived', 'Routine Check-up', NULL, '2026-10-27', '2026-10-26 06:22:33', NULL, 'resolved', 'oki', '2026-10-26 14:23:12', '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"normal\",\"vomiting\":\"none\",\"activity\":\"playful\",\"respiratory\":\"normal\",\"grooming\":\"good\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\",\"destructive\":\"none\",\"vocalization\":\"normal\",\"sleep\":\"normal\"}', NULL, 0, '{\"photo_quality\":\"satisfied\",\"health_info\":\"satisfied\",\"behavior_info\":\"satisfied\",\"overall_wellbeing\":\"satisfied\"}', 'approved', NULL),
(60, 57, 1, 1, '2026-10-26', 'none', '[\"/uploads/kamustahan/kamustahan-1792997747010.png\"]', 0, 'Pending', 'Routine Check-up', '2026-10-20', '2026-10-27', '2026-10-26 06:55:47', 'None', 'resolved', 'none', '2026-10-26 14:56:48', '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"normal\",\"vomiting\":\"none\",\"activity\":\"playful\",\"respiratory\":\"normal\",\"grooming\":\"good\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\",\"destructive\":\"none\",\"vocalization\":\"normal\",\"sleep\":\"normal\"}', 'none', 1, '{\"photo_quality\":\"satisfied\",\"health_info\":\"satisfied\",\"behavior_info\":\"satisfied\",\"overall_wellbeing\":\"follow_up\"}', 'follow_up', '2026-10-28'),
(61, 57, 1, 1, '0000-00-00', '', '', 0, 'For Update', 'Routine Check-up', NULL, '2026-10-28', '2026-10-26 06:56:48', NULL, 'awaiting_org', NULL, NULL, NULL, NULL, NULL, 0, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  ADD PRIMARY KEY (`update_id`),
  ADD KEY `animal_id` (`animal_id`),
  ADD KEY `adopter_id` (`adopter_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  MODIFY `update_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  ADD CONSTRAINT `kamustahan_updates_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kamustahan_updates_ibfk_2` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kamustahan_updates_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
