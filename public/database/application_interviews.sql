-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2026 at 05:05 AM
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
-- Table structure for table `application_interviews`
--

CREATE TABLE `application_interviews` (
  `interview_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `interview_date` date DEFAULT NULL,
  `interview_time` time DEFAULT NULL,
  `interview_method` varchar(50) DEFAULT NULL,
  `interview_location_link` text DEFAULT NULL,
  `meetup_location` varchar(255) DEFAULT NULL,
  `requested_interview_date` date DEFAULT NULL,
  `requested_interview_time` time DEFAULT NULL,
  `reschedule_reason` text DEFAULT NULL,
  `resched_status` varchar(50) DEFAULT 'None',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application_interviews`
--

INSERT INTO `application_interviews` (`interview_id`, `application_id`, `interview_date`, `interview_time`, `interview_method`, `interview_location_link`, `meetup_location`, `requested_interview_date`, `requested_interview_time`, `reschedule_reason`, `resched_status`, `created_at`, `updated_at`) VALUES
(38, 29, '2026-08-25', '08:00:00', 'virtual', 'https://meet.google.com/pqp-demo-meet', NULL, NULL, NULL, NULL, 'Approved', '2026-08-24 10:24:05', '2026-08-24 10:24:05'),
(44, 28, '2026-08-25', '11:30:00', 'virtual', 'https://meet.google.com/pqp-demo-meet', NULL, NULL, NULL, NULL, 'Approved', '2026-08-25 03:14:34', '2026-08-25 03:14:34'),
(45, 31, '2026-08-25', '12:00:00', 'virtual', 'https://meet.google.com/pqp-demo-meet', NULL, NULL, NULL, NULL, 'Approved', '2026-08-25 03:36:19', '2026-08-25 03:36:19'),
(47, 32, '2026-08-26', '17:00:00', 'onsite', 'CSPC Nabua, Brgy. Goyudan, Bato, Albay, 3444', 'CSPC Nabua, Brgy. Goyudan, Bato, Albay, 3444', NULL, NULL, NULL, 'Approved', '2026-08-26 08:33:26', '2026-08-26 11:03:38'),
(48, 33, '2026-08-27', '08:00:00', 'onsite', 'CSPC Nabua, Brgy. Goyudan, Bato, Albay, 3444', NULL, NULL, NULL, NULL, 'Approved', '2026-08-26 09:45:39', '2026-08-26 09:45:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application_interviews`
--
ALTER TABLE `application_interviews`
  ADD PRIMARY KEY (`interview_id`),
  ADD UNIQUE KEY `unique_app_interview` (`application_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application_interviews`
--
ALTER TABLE `application_interviews`
  MODIFY `interview_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application_interviews`
--
ALTER TABLE `application_interviews`
  ADD CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `user_adoption_applications` (`application_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
