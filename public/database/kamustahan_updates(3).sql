-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 22, 2026 at 09:49 AM
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
  `health_condition` varchar(50) DEFAULT NULL,
  `pet_weight` decimal(5,2) DEFAULT NULL,
  `appetite` varchar(50) DEFAULT NULL,
  `behavior_notes` text DEFAULT NULL,
  `vet_visit_date` date DEFAULT NULL,
  `vet_name` varchar(150) DEFAULT NULL,
  `org_reply` text DEFAULT NULL,
  `org_reply_date` datetime DEFAULT NULL,
  `next_schedule_date` date DEFAULT NULL,
  `scheduled_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `checklist_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`checklist_data`)),
  `checklist_notes` text DEFAULT NULL,
  `vet_diagnosis` text DEFAULT NULL,
  `weight_kg` decimal(5,2) DEFAULT NULL,
  `risk_level` enum('low','medium','high') DEFAULT 'low',
  `consultation_status` enum('open','awaiting_org','resolved') DEFAULT 'awaiting_org',
  `org_response` text DEFAULT NULL,
  `org_responded_at` datetime DEFAULT NULL,
  `org_responded_by` int(11) DEFAULT NULL,
  `health_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`health_checklist`)),
  `behavior_checklist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`behavior_checklist`)),
  `concerns` text DEFAULT NULL,
  `vet_visit` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamustahan_updates`
--

INSERT INTO `kamustahan_updates` (`update_id`, `animal_id`, `adopter_id`, `organization_id`, `update_date`, `update_text`, `photos`, `is_archived`, `status`, `consultation_type`, `health_condition`, `pet_weight`, `appetite`, `behavior_notes`, `vet_visit_date`, `vet_name`, `org_reply`, `org_reply_date`, `next_schedule_date`, `scheduled_date`, `created_at`, `checklist_data`, `checklist_notes`, `vet_diagnosis`, `weight_kg`, `risk_level`, `consultation_status`, `org_response`, `org_responded_at`, `org_responded_by`, `health_checklist`, `behavior_checklist`, `concerns`, `vet_visit`) VALUES
(35, 91, 1, 2, '2026-10-22', 'None', '/uploads/kamustahan/kamustahan-1792607132782.png', 0, 'For Update', 'Routine Check-up', NULL, NULL, NULL, NULL, '2026-10-22', NULL, NULL, NULL, NULL, '2026-10-23', '2026-10-21 18:25:32', NULL, NULL, 'None', NULL, 'medium', 'awaiting_org', NULL, NULL, NULL, '{\"appetite\":\"normal\",\"water\":\"normal\",\"litter\":\"diarrhea\",\"activity\":\"playful\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\"}', 'None', 1),
(36, 89, 1, 2, '2026-10-22', 'jnskdw', '/uploads/kamustahan/kamustahan-1792647499561.jpg', 1, 'Archived', 'Routine Check-up', 'Excellent', 7.30, 'Normal', 'iygcqihbxkiqhbdkuxhqbukdhbq3u3dh', '2026-10-09', 'hbjhbcejq', 'greet to know', '2026-10-20 01:28:13', '2026-10-21', '2026-10-23', '2026-10-22 05:38:19', NULL, NULL, 'None', NULL, 'low', 'resolved', 'janzaqsnjqjaja', '2026-10-22 13:39:49', NULL, '{\"appetite\":\"reduced\",\"water\":\"normal\",\"litter\":\"normal\",\"activity\":\"playful\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\"}', 'jnskdw', 1),
(37, 58, 1, 1, '2026-10-10', 'nrdyh5eh5vy', '/uploads/kamustahan/kamustahan-1791618372225.jpg', 1, 'Archived', 'Routine Check-up', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-10', '2026-10-10 07:46:12', NULL, NULL, NULL, NULL, 'low', 'awaiting_org', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(39, 89, 1, 2, '2026-10-22', 'Updated via Health & Behavior Checklist.', '/uploads/kamustahan/kamustahan-1792647654094.png', 0, 'Pending', 'Routine Check-up', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-12-22', '2026-10-22 05:40:54', NULL, NULL, NULL, NULL, 'high', 'resolved', 'okay', '2026-10-22 13:41:22', NULL, '{\"appetite\":\"refusing\",\"water\":\"reduced\",\"litter\":\"diarrhea\",\"activity\":\"playful\"}', '{\"socialization\":\"friendly\",\"hiding\":\"rarely\",\"anxiety\":\"none\"}', NULL, 0),
(40, 27, 9, 1, '0000-00-00', '', '', 0, 'For Update', 'Routine Check-up', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-10-22 07:15:40', NULL, NULL, NULL, NULL, 'low', 'awaiting_org', NULL, NULL, NULL, NULL, NULL, NULL, 0);

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
  MODIFY `update_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

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
