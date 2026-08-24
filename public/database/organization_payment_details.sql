-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2026 at 09:13 PM
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
-- Table structure for table `organization_payment_details`
--

CREATE TABLE `organization_payment_details` (
  `payment_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `gcash_name` varchar(150) DEFAULT NULL,
  `gcash_number` varchar(20) DEFAULT NULL,
  `qr_code` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `maya_name` varchar(150) DEFAULT NULL,
  `maya_number` varchar(20) DEFAULT NULL,
  `maya_qr_code` varchar(255) DEFAULT NULL,
  `payment_method` varchar(20) NOT NULL DEFAULT 'gcash'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_payment_details`
--

INSERT INTO `organization_payment_details` (`payment_id`, `organization_id`, `gcash_name`, `gcash_number`, `qr_code`, `created_at`, `updated_at`, `maya_name`, `maya_number`, `maya_qr_code`, `payment_method`) VALUES
(80, 2, 'Jhyzzeel Dianela', '09815439729', 'qr-5-1787567384853-170908830.jpg', '2026-08-24 10:29:44', '2026-08-24 19:09:39', 'John D', '09815439728', 'qr-5-1787567421309-858190497.png', 'maya');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `organization_payment_details`
--
ALTER TABLE `organization_payment_details`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `unique_organization_payment` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `organization_payment_details`
--
ALTER TABLE `organization_payment_details`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=90;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
