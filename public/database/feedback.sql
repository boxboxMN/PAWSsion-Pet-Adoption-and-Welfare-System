-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 05:36 AM
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
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `feedback_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `submitted_by` enum('organization','user') NOT NULL,
  `feedback_type` varchar(50) NOT NULL,
  `subject` varchar(150) NOT NULL,
  `message` text NOT NULL,
  `rating` tinyint(4) DEFAULT NULL,
  `status` enum('pending','resolved','archived') NOT NULL DEFAULT 'pending',
  `previous_status` enum('pending','resolved') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`feedback_id`, `account_id`, `organization_id`, `submitted_by`, `feedback_type`, `subject`, `message`, `rating`, `status`, `previous_status`, `created_at`) VALUES
(3, 3, NULL, 'user', 'Report a Bug', 'ytyt', 'ttyutyrtytyut', 4, 'resolved', NULL, '2026-08-31 09:57:43'),
(4, 2, 1, 'organization', 'Report a Bug', 'gdggfg', 'fgfghfghfhf', 3, 'archived', 'pending', '2026-09-02 14:18:21'),
(5, 3, NULL, 'user', 'Feature Suggestion', 'hhghg', 'gjgjgjgjgjgj', NULL, 'pending', NULL, '2026-09-03 10:26:25'),
(6, 3, NULL, 'user', 'Feature Suggestion', 'fgfgf', 'fgfgfgfgfgfhfhfhfhfghf', 3, 'pending', NULL, '2026-09-07 23:21:39'),
(7, 2, NULL, 'user', 'Feature Suggestion', 'bfgb', 'fgbgfbgbgffbfbfb', 2, 'pending', NULL, '2026-09-08 02:51:23'),
(8, 3, NULL, 'user', 'Report a Bug', 'gbg', 'gbgbgb gvb gfbgbgbg', 3, 'resolved', NULL, '2026-09-08 02:52:45'),
(9, 2, 1, 'organization', 'Report a Bug', 'ghgth', 'thtght rgrtgrtgrt', 3, 'pending', NULL, '2026-09-08 04:13:29'),
(10, 3, NULL, 'user', 'Feature Suggestion', 'khku', 'jhujkhjkh dfedfgdg', 5, 'resolved', NULL, '2026-09-08 04:14:08'),
(11, 2, 1, 'organization', 'Report a Bug', 'ghgth', 'gjgjgjgjgttj gjgjgjg', 3, 'resolved', NULL, '2026-09-11 04:14:25'),
(12, 2, 1, 'organization', 'Report a Bug', 'uuu', 'uiuuuiu i 7i7yi7i7i7i', 5, 'pending', NULL, '2026-09-12 02:19:16'),
(13, 3, NULL, 'user', 'Report a Bug', 'hdggd', 'gsgdfgfdgdfgd  fefegreg', 2, 'pending', NULL, '2026-09-13 23:35:23'),
(14, 3, NULL, 'user', 'Feature Suggestion', 'ggf', 'dfgdffgfggfedgege', 1, 'pending', NULL, '2026-09-13 23:35:48'),
(15, 3, NULL, 'user', 'Report a Bug', 'dgh', 'ghgghngnh hfghghgh', 2, 'pending', NULL, '2026-09-13 23:44:59'),
(16, 3, NULL, 'user', 'General Feedback', '\' OR \'1\'=\'1 \' OR 1=1 -- admin\'-- \'; DROP TABLE users; --', 'hfh gtj hjhj', NULL, 'archived', 'pending', '2026-09-13 23:53:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `fk_feedback_account` (`account_id`),
  ADD KEY `fk_feedback_organization` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_feedback_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
