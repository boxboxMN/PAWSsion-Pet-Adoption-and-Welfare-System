-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 12, 2026 at 05:35 AM
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
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('adopter','organization','admin') NOT NULL,
  `status` enum('pending','active','rejected','disabled') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password_hash`, `role`, `status`, `email_verified`, `created_at`, `updated_at`) VALUES
(1, 'admin@pawpon.com', '$2b$10$l16R.DYg693wgKJJ20QQYucqrCl8.Zop120.UkdYO7g0TKXTc6vr6', 'admin', 'active', 1, '2026-07-06 14:27:26', '2026-07-06 14:40:55'),
(2, 'maye@gmail.com', '$2b$10$fBoRZ9hzACik6Md.qXuuieJILqfW34Kl0gtQy/oOjK1aJGoYeb.F6', 'organization', 'active', 1, '2026-07-06 15:05:19', '2026-07-07 15:28:29'),
(3, '37436626262@org', '$2b$10$83xvjlDFSk4VS/25pEya7Oq1JLEbuis.Y7muVQDqyI3mAIpboVWzS', 'organization', 'active', 1, '2026-07-06 15:06:25', '2026-07-07 06:38:10'),
(4, 'mav@gmail.com', '$2b$10$ILw2E6hNngIrtumePkPFOue7if8JGl8j9S14QhscWfcFqvZxJaUqm', 'adopter', 'active', 1, '2026-07-06 17:19:46', '2026-07-06 17:19:46'),
(5, 'nzn@gmail.com', '$2b$10$ZSf6OGeCgRJW9r9I2sDbLOjP92qBvLe0np8kOrUYTsJreqgInMQUu', 'adopter', 'active', 1, '2026-07-07 16:24:06', '2026-07-07 16:24:06'),
(6, 'pta@gmail.com', '$2b$10$eevuTrGIsuQ/mSskiSdUz.EuxhgUHjvBpiaFyPscTK62jhN1wct96', 'organization', 'active', 1, '2026-07-09 12:12:25', '2026-07-09 15:28:12'),
(7, 'ye@gmail.com', '$2b$10$Fvgovyt9tFqiAcFuaTLiL.AQtpimupY..PJXy7vLw6LtwiIAezbAu', 'organization', 'active', 1, '2026-07-09 14:24:10', '2026-07-09 15:26:23'),
(8, 'nyal@gmail.com', '$2b$10$d6DPlHHkGDbVyDPh8CZVnOGxqhwLmB3W70K/aUPhR6S1oqeP7OclG', 'organization', 'active', 1, '2026-07-09 15:32:59', '2026-07-09 15:33:17'),
(9, 'mn@gmail.com', '$2b$10$C8eWay.qhE3hKp5iVtiJ0uwSw7ngE8Dft7batwlR0Ss1AP9R1/e8G', 'adopter', 'active', 1, '2026-07-10 09:23:07', '2026-07-10 09:23:07'),
(10, 'mma@gmail.com', '$2b$10$qFzysAZ.OklYUewRIAmlM.RhM00HHN0CrrKis3x4uexVawv.v2km6', 'organization', 'active', 1, '2026-07-10 09:25:03', '2026-07-10 09:43:59'),
(11, 'bruh@gmail.com', '$2b$10$6.pWqdAWmbSf4pgf/grBcex/mPWPcWbe0yROFTmZQBMFhGEcOGH.G', 'organization', 'active', 1, '2026-07-10 09:44:55', '2026-07-10 09:53:20'),
(12, 'act@gamil.com', '$2b$10$3VsO1qTh5Pe2LejcNG.SpucCZnDVMQ68dFCPlhspBSpwQ3GHkoWaO', 'organization', 'active', 1, '2026-07-10 09:56:24', '2026-07-10 09:56:36'),
(13, 'may@gmail.com', '$2b$10$pI/ysAl56th5N8CFggDPyuamP0oc5lBNzA.lrmWJOajyj4UeqHRuS', 'organization', 'active', 1, '2026-07-10 11:11:32', '2026-07-10 13:45:09'),
(14, 'paw@gmail.com', '$2b$10$7sNL4KdDsber1qDupXHVJujYQfwAFHCeQKTZtPNYip/KsrhxagYye', 'organization', 'active', 1, '2026-07-10 14:01:01', '2026-07-10 14:02:27'),
(15, 'am@gmail.com', '$2b$10$UTIQYI2z9N3eulqOKTJ2zelsIPhIvzMPgBjKvBZqJf45pp6/.5.nS', 'adopter', 'active', 1, '2026-07-12 03:10:24', '2026-07-12 03:10:24'),
(16, 'lol@gmail.com', '$2b$10$/ApF96QK2F8VY44fiJ.N1egOb6ASC9nId24D0e8NG1zG2aIHAvaXa', 'adopter', 'active', 1, '2026-07-12 03:20:44', '2026-07-12 03:20:44'),
(17, 'sas@gmail.com', '$2b$10$YoALIHJhoBUnWmSA8oHNF.xEq25TLo5tpwrFihrmA7aPtonaelCNu', 'adopter', 'active', 1, '2026-07-12 03:23:24', '2026-07-12 03:23:24'),
(18, 'ayyy@gmailc.om', '$2b$10$znqqG5..NkO/pd3UYTtzjul29t1NVVD68xS.THvZrtjh4AeA4BmBW', 'adopter', 'active', 1, '2026-07-12 03:28:33', '2026-07-12 03:28:33'),
(19, 'dad@gmail.com', '$2b$10$.7pYGur3jgXzGN8uzJfp9eLqVGhD/Q1Sts392nhr/PBKncnS0Ar4K', 'organization', 'pending', 0, '2026-07-12 03:29:51', '2026-07-12 03:29:51');

-- --------------------------------------------------------

--
-- Table structure for table `adopters`
--

CREATE TABLE `adopters` (
  `adopter_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adopters`
--

INSERT INTO `adopters` (`adopter_id`, `account_id`, `first_name`, `last_name`, `phone_number`, `profile_picture`) VALUES
(1, 4, 'mav@gmail.com', 'mav@gmail.com', '', NULL),
(2, 5, 'Shin', 'Nouzen', '', NULL),
(3, 9, 'Shi', 'La', '', NULL),
(4, 15, 'Mariel', 'Hernandez', '', NULL),
(5, 16, 'lol', 'ma', '09876543211', NULL),
(6, 17, 'sas', 'sas', '09765432122', NULL),
(7, 18, 'ayyy', 'ayyy', '09876666666', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE `organizations` (
  `organization_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `organization_name` varchar(255) DEFAULT NULL,
  `organization_type` varchar(100) DEFAULT NULL,
  `contact_person` varchar(150) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `verification_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`organization_id`, `account_id`, `organization_name`, `organization_type`, `contact_person`, `contact_number`, `address`, `city`, `province`, `description`, `verification_status`) VALUES
(1, 2, 'PAWWSION', 'NGO', 'Althea IDK', '37436626262', 'San Miguel, Nabua Camarines Sur', 'Nabua', 'Camarines Sur', 'Driven by compassion, Pawssion Project serves as a sanctuary of hope for stray and abandoned paws, working tirelessly to give every rescue a second chance at a loving home. Our organization is dedicated to caring for stray dogs and cats, advocating for animal rights, and promoting their welfare.', 'Approved'),
(2, 3, 'PAWPON', 'Foundation', '37436626262@org', '37436626262@org', '37436626262@org', '37436626262@org', '37436626262@org', '37436626262@org', 'Approved'),
(3, 6, 'pta@gmail.com', 'Animal Shelter', 'pta@gmail.com', 'pta@gmail.com', 'pta@gmail.com', 'pta@gmail.com', 'pta@gmail.com', 'pta@gmail.com', 'Approved'),
(4, 7, 'ye@gmail.com', 'Animal Shelter', 'ye@gmail.com', 'ye@gmail.com', 'ye@gmail.com', 'ye@gmail.com', 'ye@gmail.com', 'ye@gmail.com', 'Approved'),
(5, 8, 'nyal@gmail.com', 'Animal Shelter', 'nyal@gmail.com', 'nyal@gmail.com', 'nyal@gmail.com', 'nyal@gmail.com', 'nyal@gmail.com', 'nyal@gmail.com', 'Approved'),
(6, 10, 'ASOG TBI', 'Foundation', 'ShiLa Bruh', '0987654321', 'SNIC', 'IC', 'CAM SUR', 'Join our community to support rescued cats and dogs.\r\nCreate an organization account to manage rescued animals,\r\ntrack adoption requests, and coordinate donations\r\nto give them a loving home.', 'Approved'),
(7, 11, 'SHEEEESSH', 'NGO', 'bruh@gmail.com', 'bruh@gmail.com', 'bruh@gmail.com', 'bruh@gmail.com', 'bruh@gmail.com', 'bruh@gmail.com', 'Approved'),
(8, 12, 'act@gamil.com', 'Foundation', 'act@gamil.com', 'act@gamil.com', 'act@gamil.com', 'act@gamil.com', 'act@gamil.com', 'act@gamil.com', 'Approved'),
(9, 13, 'PAWPON', 'Animal Shelter', 'Irene Espeleta', '0987654321', 'SNIC', 'IC', 'QWERTY', 'Connecting hearts, Saving lives\r\nJoin our community to support rescued cats and dogs.\r\nCreate an organization account to manage rescued animals,\r\ntrack adoption requests, and coordinate donations\r\nto give them a loving home.', 'Approved'),
(10, 14, 'paw@gmail.com', 'Animal Shelter', 'paw@gmail.com', 'paw@gmail.com', 'paw@gmail.com', 'paw@gmail.com', 'paw@gmail.com', 'paw@gmail.com', 'Approved'),
(11, 19, 'ORG', 'NGO', 'VAVVBN', '0987654444', 'ASSAS', 'SSSS', 'SSSS', 'AQWERTYY', 'Pending');

-- --------------------------------------------------------

--
-- Table structure for table `organization_documents`
--

CREATE TABLE `organization_documents` (
  `document_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `document_name` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_documents`
--

INSERT INTO `organization_documents` (`document_id`, `organization_id`, `document_name`, `file_path`, `uploaded_at`) VALUES
(1, 1, 'images.jpg', '06fe2c20a1278415a418850f8a48166f', '2026-07-06 15:05:19'),
(2, 2, 'ð¥° So Cute ð¥º Knight.jpg', 'b32394245fa6f5420e85d88f8ccfe4ac', '2026-07-06 15:06:25'),
(3, 3, 'ChatGPT Image Jun 27, 2026, 10_09_37 PM.png', '240931cdd2c92df4253f91d666942031', '2026-07-09 12:12:25'),
(4, 4, 'ChatGPT Image Jun 27, 2026, 10_11_11 PM.png', 'a7094878375cae8fc900d9e6d75b9250', '2026-07-09 14:24:10'),
(5, 5, 'ChatGPT Image Jun 27, 2026, 01_46_47 PM.png', 'b7ce8d955cdff3e292a3a43e497930ba', '2026-07-09 15:32:59'),
(6, 6, 'ChatGPT Image Jun 27, 2026, 10_11_11 PM.png', 'de89f28ff7f63ccd917bb9f63afe7c54', '2026-07-10 09:25:03'),
(7, 7, 'ChatGPT Image Jun 27, 2026, 10_13_56 PM.png', '72aadfee7d3c8ba6dd72a208807c42c9', '2026-07-10 09:44:55'),
(8, 8, 'IMG20260321104451.jpg', 'cdadfcfd2b73ce336cd334b36343b298', '2026-07-10 09:56:24'),
(9, 9, 'images.jpg', 'ed39ec0c7810bc5e258354d1006b6b40', '2026-07-10 11:11:32'),
(10, 10, 'IMG20260321104531.jpg', '0e8f11c04797d00802a7ebcadb3054ca', '2026-07-10 14:01:01'),
(11, 11, 'images.jpg', 'f749d942a4b22eedb59910eefe457ba9', '2026-07-12 03:29:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`account_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `adopters`
--
ALTER TABLE `adopters`
  ADD PRIMARY KEY (`adopter_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `organization_documents`
--
ALTER TABLE `organization_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `adopters`
--
ALTER TABLE `adopters`
  MODIFY `adopter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `organization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `organization_documents`
--
ALTER TABLE `organization_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adopters`
--
ALTER TABLE `adopters`
  ADD CONSTRAINT `adopters_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_documents`
--
ALTER TABLE `organization_documents`
  ADD CONSTRAINT `organization_documents_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
