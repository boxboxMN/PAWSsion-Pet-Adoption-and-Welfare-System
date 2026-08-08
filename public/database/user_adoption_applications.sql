-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2026 at 05:57 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

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
-- Table structure for table `user_adoption_applications`
--

CREATE TABLE `user_adoption_applications` (
  `application_id` int(11) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `animal_id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_address` text NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `occupation` varchar(100) NOT NULL,
  `adoption_intent` text NOT NULL,
  `emergency_name` varchar(150) NOT NULL,
  `emergency_phone` varchar(15) NOT NULL,
  `emergency_relation` varchar(50) NOT NULL,
  `document_path` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Under Review',
  `decline_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `interview_date` date DEFAULT NULL,
  `interview_time` time DEFAULT NULL,
  `interview_method` varchar(50) DEFAULT NULL,
  `interview_location_link` text DEFAULT NULL,
  `requested_interview_date` date DEFAULT NULL,
  `requested_interview_time` time DEFAULT NULL,
  `reschedule_reason` text DEFAULT NULL,
  `resched_status` varchar(50) DEFAULT 'None'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_adoption_applications`
--

INSERT INTO `user_adoption_applications` (`application_id`, `organization_id`, `animal_id`, `adopter_id`, `full_name`, `contact_number`, `email`, `full_address`, `civil_status`, `age`, `occupation`, `adoption_intent`, `emergency_name`, `emergency_phone`, `emergency_relation`, `document_path`, `status`, `decline_reason`, `created_at`, `updated_at`, `interview_date`, `interview_time`, `interview_method`, `interview_location_link`, `requested_interview_date`, `requested_interview_time`, `reschedule_reason`, `resched_status`) VALUES
(1, 1, 15, 1, 'Irene Espeleta', '09331231232', 'irespeleta@my.cspc.edu.ph', 'sfdsfffffffffffffffffffffffffffffffffffffffff', 'Single', 45, 'dfgdfgdfgdfg', 'gfrgrfgrfgf', 'Irene Espeleta', '09676565666', 'fddgvdgdg', 'doc-3-1785174605742.png', 'Approved', NULL, '2026-07-27 17:50:05', '2026-08-06 05:49:55', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'None'),
(5, 1, 14, 1, 'kiikl', '09322334542', 'mayiee@gmail.com', 'sfdsfv', 'Single', 44, 'gbdh', 'grtgrd', 'gdhdh', '09676756756', 'hjjgyj', 'doc-3-1786204355053.jpg', 'Cancelled', NULL, '2026-08-07 07:41:01', '2026-08-08 15:53:01', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'None'),
(10, 1, 10, 1, 'thtrh', '09322334542', 'mayiee@gmail.com', 'jkj,j', 'Single', 33, 'htdhtghb', 'dfgdfg', 'fgrgr', '09676756756', 'gffbgt', 'doc-3-1786203008239.jpg', 'Under Review', NULL, '2026-08-07 09:04:29', '2026-08-08 15:30:08', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'None'),
(16, 1, 13, 1, 'retr', '09322334542', 'mayiee@gmail.com', '76uyuy', 'Single', 21, 'hjyh', 'fgrfghfd', 'fgfhfdgh', '09676756756', 'fgfhf', 'doc-3-1786110528274.jpg', 'Interview Scheduled', NULL, '2026-08-07 13:48:48', '2026-08-08 14:38:50', '2026-08-09', '23:33:00', 'virtual', 'https://meet.google.com/pqp-demo-meet', NULL, NULL, NULL, 'Approved');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `fk_app_animal` (`animal_id`),
  ADD KEY `fk_app_adopter` (`adopter_id`),
  ADD KEY `fk_user_applications_org` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD CONSTRAINT `fk_app_adopter` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_applications_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
