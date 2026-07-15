-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 15, 2026 at 04:14 PM
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
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password_hash`, `role`, `status`, `email_verified`, `profile_pic`, `created_at`, `updated_at`) VALUES
(1, 'admin@pawpon.com', '$2b$10$l16R.DYg693wgKJJ20QQYucqrCl8.Zop120.UkdYO7g0TKXTc6vr6', 'admin', 'active', 1, NULL, '2026-07-06 14:27:26', '2026-07-06 14:40:55'),
(2, 'pawssion@gmail.com', '$2b$10$2hXt/yS9bNVHA2d31JWDHuzjfOcyEz5Px8RY3DN3MxhDFApxxCTMe', 'organization', 'active', 1, NULL, '2026-07-13 12:51:22', '2026-07-13 12:53:17'),
(3, 'shin@gmail.com', '$2b$10$tuu0.7L9PiYpbXeUNdRmw.rerKPVXwUhOuCzh/mgR1LduNDDVL5.q', 'adopter', 'active', 1, NULL, '2026-07-13 12:55:42', '2026-07-13 12:55:42');

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
(1, 3, 'Shinrei', 'Nouzen', '09876543211', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `animals`
--

CREATE TABLE `animals` (
  `animal_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `species` enum('Dog','Cat') NOT NULL,
  `gender` enum('Male','Female') NOT NULL,
  `age` enum('Puppy/Kitten (0-1 yr old)','Adolescence (2-3 yrs old)','Adult (4-7 yrs old)','Senior (8-10 yrs old)') NOT NULL,
  `birth_date` date DEFAULT NULL,
  `color` varchar(100) DEFAULT NULL,
  `behavior_description` text DEFAULT NULL,
  `health_status` enum('Healthy','Sick','Under Treatment','Recovered') NOT NULL DEFAULT 'Healthy',
  `vaccination_status` enum('Vaccinated','Not Vaccinated','Unknown') DEFAULT 'Unknown',
  `adoption_status` enum('Available','Pending','Adopted','Archived') DEFAULT 'Available',
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `personality_tags` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animals`
--

INSERT INTO `animals` (`animal_id`, `organization_id`, `name`, `species`, `gender`, `age`, `birth_date`, `color`, `behavior_description`, `health_status`, `vaccination_status`, `adoption_status`, `image_path`, `created_at`, `personality_tags`) VALUES
(1, 1, 'Adobo', 'Dog', 'Female', 'Adult (4-7 yrs old)', '2026-07-01', 'brown and white on extremities & end of tail', 'Very friendly, active, allows human interaction and petting', 'Healthy', 'Vaccinated', 'Available', '1783947283842-144609.webp', '2026-07-13 12:54:43', NULL),
(2, 1, 'Tata', 'Dog', 'Male', 'Puppy/Kitten (0-1 yr old)', '2026-07-01', 'Black and White', 'Kind and friendly', 'Healthy', 'Vaccinated', 'Available', '1784034813727-535776.jpg', '2026-07-14 13:13:33', NULL),
(3, 1, 'chaii', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-14', 'blue', 'kind. friendly, kind', 'Healthy', 'Vaccinated', 'Available', '1784035739782-158074.jpg', '2026-07-14 13:28:59', NULL),
(4, 1, 'Luca', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-14', 'White', 'idk h', 'Healthy', 'Vaccinated', 'Available', '1784036153187-370476.jpg', '2026-07-14 13:35:53', NULL),
(5, 1, 'Mayeee', 'Dog', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-14', 'Black', 'idkkk am ded', 'Healthy', 'Vaccinated', 'Available', '1784036600457-928340.jpg', '2026-07-14 13:43:20', 'Kind,Cutr,Funny'),
(6, 1, 'Shin', 'Dog', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-14', 'White', 'IDK HE SBUTE', 'Healthy', 'Vaccinated', 'Available', '1784042995248-790113.jpg', '2026-07-14 15:29:55', 'Kind,Funny,Tried af'),
(7, 1, 'SHEEEE', 'Dog', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-14', 'MLAWN', 'DED', 'Healthy', 'Vaccinated', 'Available', '1784043699866-409101.jpg', '2026-07-14 15:41:39', 'KIND'),
(8, 1, 'She', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', '2026-07-10', 'fdfsf', 'fsfsdfdsfsf', 'Healthy', 'Vaccinated', 'Pending', '1784044060035-338096.png', '2026-07-14 15:47:40', 'fsdfsdf'),
(9, 1, 'dadddfsdf', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', '2026-07-10', 'fsdfsff', 'fsfsdffsf', 'Healthy', 'Vaccinated', 'Available', '1784044160834-285534.png', '2026-07-14 15:49:20', 'fsdfdsf'),
(10, 1, 'MAYEN', 'Dog', 'Female', 'Adolescence (2-3 yrs old)', '2026-07-01', 'WHITE', 'This sweet animal is looking for a forever home. They have been socialized with humans and are ready to be part of a loving family. Great with kids and always eager to greet you at the door', 'Healthy', 'Vaccinated', 'Available', '1784046462243-214982.jpg', '2026-07-14 16:27:42', 'Kind,Cool,Friendly,Cute');

-- --------------------------------------------------------

--
-- Table structure for table `animal_medical_history`
--

CREATE TABLE `animal_medical_history` (
  `medical_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `treatment` varchar(150) NOT NULL,
  `administered_date` date NOT NULL,
  `administered_by` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animal_medical_history`
--

INSERT INTO `animal_medical_history` (`medical_id`, `animal_id`, `treatment`, `administered_date`, `administered_by`, `notes`, `created_at`) VALUES
(1, 9, 'fsdfsdf', '2026-07-03', 'dsfdfsd', NULL, '2026-07-14 15:49:20'),
(2, 10, 'Deworm', '2026-07-02', 'Dr. Shin Nouzen', NULL, '2026-07-14 16:27:42');

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
(1, 2, 'PAWSsion Benevolence Circle', 'Rescue Organization', 'Althea idk ', '09876543212', 'CSPC Nabua', 'idk NABUA', 'CamSur', 'Join our community to support rescued cats and dogs.\r\nCreate an organization account to manage rescued animals,\r\ntrack adoption requests, and coordinate donations\r\nto give them a loving home.', 'Approved');

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
(1, 1, 'cf35b9afa57ce1e662c8b677c4cc91c4.jpg', '63977785c7d9215662d30505a2814e8c', '2026-07-13 12:51:22');

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
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`animal_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  ADD PRIMARY KEY (`medical_id`),
  ADD KEY `animal_id` (`animal_id`);

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
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `adopters`
--
ALTER TABLE `adopters`
  MODIFY `adopter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  MODIFY `medical_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `organization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `organization_documents`
--
ALTER TABLE `organization_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `adopters`
--
ALTER TABLE `adopters`
  ADD CONSTRAINT `adopters_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `animals`
--
ALTER TABLE `animals`
  ADD CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  ADD CONSTRAINT `animal_medical_history_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE;

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
