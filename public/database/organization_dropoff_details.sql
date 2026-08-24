-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2026 at 09:12 PM
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
-- Table structure for table `organization_dropoff_details`
--

CREATE TABLE `organization_dropoff_details` (
  `dropoff_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `dropoff_location_name` varchar(255) DEFAULT NULL,
  `dropoff_address` text DEFAULT NULL,
  `dropoff_hours` varchar(255) DEFAULT NULL,
  `dropoff_notes` text DEFAULT NULL,
  `dropoff_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_dropoff_details`
--

INSERT INTO `organization_dropoff_details` (`dropoff_id`, `organization_id`, `dropoff_location_name`, `dropoff_address`, `dropoff_hours`, `dropoff_notes`, `dropoff_image`, `created_at`, `updated_at`) VALUES
(57, 2, 'PUP Sintang', 'Pili Camarines sur', 'Tuesday - Sunday 8:00 AM - 6:00 PM', 'knjbhvgcfrtf6g7h8j9okpl', 'qr-5-1787597664232-574312247.png', '2026-08-24 18:06:02', '2026-08-24 19:09:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `organization_dropoff_details`
--
ALTER TABLE `organization_dropoff_details`
  ADD PRIMARY KEY (`dropoff_id`),
  ADD UNIQUE KEY `unique_org_dropoff` (`organization_id`),
  ADD UNIQUE KEY `unique_organization_dropoff` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `organization_dropoff_details`
--
ALTER TABLE `organization_dropoff_details`
  MODIFY `dropoff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
