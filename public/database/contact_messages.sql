-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 15, 2026 at 07:47 PM
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
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `message_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `subject_category` varchar(50) NOT NULL,
  `message` text NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `previous_status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`message_id`, `account_id`, `full_name`, `email`, `subject_category`, `message`, `status`, `created_at`, `previous_status`) VALUES
(1, NULL, 'hyyyi', 'shin@gmail.com', 'donation', 'fedgfgg eersgrgrtgrtg', 'pending', '2026-09-13 15:15:49', NULL),
(2, NULL, 'hyyyi', 'pawssion@gmail.com', 'adoption', 'dgdg sdfsfdsfdfdfdfdf', 'resolved', '2026-09-13 15:21:31', NULL),
(3, NULL, 'tes3', 'testlogin54@gmail.com', 'other', 'xfsdfdfdfd dfd gd', 'resolved', '2026-09-13 15:34:07', NULL),
(4, NULL, 'Irene Espeleta', 'testloginorg61@gmail.com', 'donation', 'ytrytytytn  yryeryytyty', 'pending', '2026-09-13 20:06:42', NULL),
(5, NULL, 'Irene Espeleta', 'irespeleta@my.cspc.edu.ph', 'adoption', 'sjdnfufjdndbdhbfdyugbdsnbg dfgsrfggtgfgfr', 'resolved', '2026-09-13 20:14:22', NULL),
(6, NULL, 'vbfgxghfghf', 'irespeleta@my.cspc.edu.ph', 'donation', 'gfdgrg fghydtyhtyn', 'resolved', '2026-09-16 01:39:56', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `account_id` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `contact_messages`
--
ALTER TABLE `contact_messages`
  ADD CONSTRAINT `contact_messages_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
