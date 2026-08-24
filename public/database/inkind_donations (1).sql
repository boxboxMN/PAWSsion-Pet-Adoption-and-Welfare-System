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
-- Table structure for table `inkind_donations`
--

CREATE TABLE `inkind_donations` (
  `inkind_donation_id` int(11) NOT NULL,
  `adopter_id` int(11) DEFAULT NULL,
  `organization_id` int(11) NOT NULL,
  `donor_name` varchar(255) NOT NULL,
  `donor_email` varchar(255) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) DEFAULT 'pcs',
  `location_image_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inkind_donations`
--

INSERT INTO `inkind_donations` (`inkind_donation_id`, `adopter_id`, `organization_id`, `donor_name`, `donor_email`, `item_name`, `quantity`, `unit`, `location_image_path`, `status`, `rejection_reason`, `created_at`) VALUES
(7, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'busal', 6, 'pcs', NULL, 'Pending', NULL, '2026-07-24 08:11:50'),
(8, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'busal', 6, 'pcs', NULL, 'Approved', NULL, '2026-07-24 08:12:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `inkind_donations`
--
ALTER TABLE `inkind_donations`
  ADD PRIMARY KEY (`inkind_donation_id`),
  ADD KEY `adopter_id` (`adopter_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `inkind_donations`
--
ALTER TABLE `inkind_donations`
  MODIFY `inkind_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
