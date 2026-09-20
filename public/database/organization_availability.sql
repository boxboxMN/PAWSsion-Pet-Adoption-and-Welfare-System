-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 05:37 AM
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
-- Table structure for table `organization_availability`
--

CREATE TABLE `organization_availability` (
  `availability_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `is_open` tinyint(1) NOT NULL DEFAULT 1,
  `start_time` time NOT NULL DEFAULT '08:00:00',
  `end_time` time NOT NULL DEFAULT '21:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_availability`
--

INSERT INTO `organization_availability` (`availability_id`, `organization_id`, `day_of_week`, `is_open`, `start_time`, `end_time`) VALUES
(53, 1, 0, 1, '08:00:00', '23:00:00'),
(54, 1, 1, 1, '08:00:00', '18:00:00'),
(55, 1, 2, 1, '08:00:00', '18:00:00'),
(56, 1, 3, 1, '08:00:00', '18:00:00'),
(57, 1, 4, 1, '08:00:00', '18:00:00'),
(58, 1, 5, 1, '08:00:00', '18:00:00'),
(59, 1, 6, 1, '08:00:00', '18:00:00'),
(67, 2, 0, 0, '08:00:00', '23:00:00'),
(68, 2, 1, 1, '08:00:00', '18:00:00'),
(69, 2, 2, 1, '08:00:00', '18:00:00'),
(70, 2, 3, 1, '08:00:00', '18:00:00'),
(71, 2, 4, 1, '08:00:00', '18:00:00'),
(72, 2, 5, 1, '08:00:00', '18:00:00'),
(73, 2, 6, 1, '08:00:00', '18:00:00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `organization_availability`
--
ALTER TABLE `organization_availability`
  ADD PRIMARY KEY (`availability_id`),
  ADD UNIQUE KEY `uniq_org_day` (`organization_id`,`day_of_week`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `organization_availability`
--
ALTER TABLE `organization_availability`
  MODIFY `availability_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `organization_availability`
--
ALTER TABLE `organization_availability`
  ADD CONSTRAINT `organization_availability_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
