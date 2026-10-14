-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 14, 2026 at 09:34 AM
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
  `category` varchar(50) NOT NULL DEFAULT 'Other',
  `item_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit` varchar(50) DEFAULT 'pcs',
  `location_image_path` varchar(255) DEFAULT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `rejection_reason` text DEFAULT NULL,
  `proof_image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inkind_donations`
--

INSERT INTO `inkind_donations` (`inkind_donation_id`, `adopter_id`, `organization_id`, `donor_name`, `donor_email`, `category`, `item_name`, `quantity`, `unit`, `location_image_path`, `status`, `rejection_reason`, `proof_image_path`, `created_at`) VALUES
(9, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'dry food', 5, 'pcs', NULL, 'Rejected', 'Verification failed. The donated items are damaged or unusable upon physical inspection.', NULL, '2026-09-05 01:26:17'),
(10, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'kjljli', 6, 'pcs', NULL, 'Rejected', 'Verification failed. The donated items are damaged or unusable upon physical inspection.', NULL, '2026-09-06 01:41:57'),
(11, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'dry good', 5, 'pcs', NULL, 'Pending', NULL, NULL, '2026-09-06 02:00:39'),
(12, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'dry food', 6, 'pcs', NULL, 'Pending', NULL, NULL, '2026-09-06 02:11:35'),
(13, 9, 1, 'Maria Wilkins', 'mariel005hernandez@gmail.com', 'Other', 'Dog food', 6, 'kg', NULL, 'Approved', NULL, NULL, '2026-10-01 08:08:29'),
(14, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'Dog Food', 5, 'packs', NULL, 'Approved', NULL, '/uploads/inkind-proof/inkind-2-1791962671912-444332216.jpg', '2026-10-14 06:41:24'),
(15, 1, 2, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'Deworming tablets', 13, 'pcs', NULL, 'Pending', NULL, NULL, '2026-10-14 06:44:18'),
(16, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Other', 'Rubber toy', 5, 'packs', NULL, 'Approved', NULL, '/uploads/inkind-proof/inkind-2-1791962222770-497990109.jpg', '2026-10-14 06:45:10'),
(17, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'Food & Treats', 'Cat food', 5, 'cans', NULL, 'Approved', NULL, '/uploads/inkind-proof/inkind-2-1791963095557-848113478.jpg', '2026-10-14 07:31:04');

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
  MODIFY `inkind_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
