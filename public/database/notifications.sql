-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 17, 2026 at 05:35 AM
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
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `message` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `link` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `account_id`, `title`, `message`, `type`, `is_read`, `link`, `created_at`) VALUES
(1, 5, 'New Adoption Application', 'A new application was submitted for pet #89.', 'application_submitted', 1, '/org/adoption', '2026-09-07 23:18:47'),
(6, 2, 'New Adoption Application', 'A new application was submitted for pet #54.', 'application_submitted', 1, '/org/adoption', '2026-09-08 03:53:28'),
(7, 2, 'New Adoption Application', 'An adopter re-submitted an application for review.', 'application_submitted', 1, '/org/adoption', '2026-09-08 03:55:46'),
(17, 5, 'New Kamustahan Update', 'An adopter posted a new pet update for you to review.', 'kamustahan_submitted', 1, '/org/kamustahan', '2026-09-10 15:10:17'),
(19, 2, 'Your Feedback Has Been Resolved', 'Your feedback \"ghgth\" has been marked as resolved by our team. Thank you for helping us improve Pawpon!', 'feedback_resolved', 1, NULL, '2026-09-11 04:14:37'),
(20, 2, 'Your Feedback Has Been Reopened', 'Your feedback \"ghgth\" has been reopened for further review.', 'feedback_reopened', 1, NULL, '2026-09-11 05:27:08'),
(21, 2, 'Your Feedback Has Been Resolved', 'Your feedback \"ghgth\" has been marked as resolved by our team. Thank you for helping us improve Pawpon!', 'feedback_resolved', 1, NULL, '2026-09-11 05:27:19'),
(23, 3, 'Account Deactivated', 'Your account has been deactivated by an administrator.', 'account_disabled', 1, '/profile', '2026-09-11 11:34:15'),
(24, 3, 'Account Suspended', 'Your account has been suspended by an administrator. Please contact support if you believe this is a mistake.', 'account_suspended', 1, '/profile', '2026-09-11 11:36:12'),
(25, 8, 'Account Banned', 'Your account has been permanently banned for violating platform policies.', 'account_banned', 0, '/profile', '2026-09-11 11:36:27'),
(27, 3, 'Account Deactivated', 'Your account has been deactivated by an administrator.', 'account_disabled', 1, '/profile', '2026-09-12 01:45:44'),
(28, 2, 'Your Feedback Has Been Reopened', 'Your feedback \"ghgth\" has been reopened for further review.', 'feedback_reopened', 1, NULL, '2026-09-12 02:18:11'),
(29, 2, 'Your Feedback Has Been Resolved', 'Your feedback \"ghgth\" has been marked as resolved by our team. Thank you for helping us improve Pawpon!', 'feedback_resolved', 1, NULL, '2026-09-12 02:18:22'),
(30, 1, 'New Feedback Received', 'A new \"Report a Bug\" feedback was submitted by an organization: \"uuu\"', 'feedback_new', 1, '/admin/feedback', '2026-09-12 02:19:16'),
(31, 3, 'Account Deactivated', 'Your account has been deactivated by an administrator.', 'account_disabled', 1, '/profile', '2026-09-12 10:59:01'),
(32, 3, 'Account Deactivated', 'Your account has been deactivated by an administrator.', 'account_disabled', 1, '/profile', '2026-09-12 11:00:06'),
(33, 1, 'New Organization Pending Approval', 'test3 has registered and is awaiting verification.', 'org_pending', 1, '/admin/organization', '2026-09-13 06:35:32'),
(37, 1, 'New Contact Message', 'Irene Espeleta sent a message about \"donation\": \"ytrytytytn  yryeryytyty\"', 'contact_message_new', 1, '/admin/contact-messages', '2026-09-13 12:06:42'),
(38, 1, 'New Contact Message', 'Irene Espeleta sent a message about \"adoption\": \"sjdnfufjdndbdhbfdyugbdsnbg dfgsrfggtgfgfr\"', 'contact_message_new', 1, '/admin/contact-messages', '2026-09-13 12:14:22'),
(39, 1, 'New Feedback Received', 'A new \"Report a Bug\" feedback was submitted by an adopter: \"hdggd\"', 'feedback_new', 1, '/admin/feedback', '2026-09-13 23:35:23'),
(40, 1, 'New Feedback Received', 'A new \"Feature Suggestion\" feedback was submitted by an adopter: \"ggf\"', 'feedback_new', 1, '/admin/feedback', '2026-09-13 23:35:48'),
(41, 1, 'New Feedback Received', 'A new \"Report a Bug\" feedback was submitted by an adopter: \"dgh\"', 'feedback_new', 1, '/admin/feedback', '2026-09-13 23:44:59'),
(42, 1, 'New Feedback Received', 'A new \"General Feedback\" feedback was submitted by an adopter: \"\' OR \'1\'=\'1 \' OR 1=1 -- admin\'-- \'; DROP TABLE users; --\"', 'feedback_new', 0, '/admin/feedback', '2026-09-13 23:53:47'),
(43, 1, 'New Contact Message', 'vbfgxghfghf sent a message about \"donation\": \"gfdgrg fghydtyhtyn\"', 'contact_message_new', 1, '/admin/contact-messages', '2026-09-15 17:39:56');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `account_id` (`account_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
