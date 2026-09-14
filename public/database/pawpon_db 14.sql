-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 14, 2026 at 04:10 AM
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
  `status` enum('pending','active','disabled','suspended','banned','rejected') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password_hash`, `role`, `status`, `email_verified`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'admin@pawpon.com', '$2b$10$l16R.DYg693wgKJJ20QQYucqrCl8.Zop120.UkdYO7g0TKXTc6vr6', 'admin', 'active', 1, '2026-07-06 14:27:26', '2026-09-08 06:44:58', '2026-09-08 14:44:58'),
(2, 'pawssion@gmail.com', '$2b$10$2hXt/yS9bNVHA2d31JWDHuzjfOcyEz5Px8RY3DN3MxhDFApxxCTMe', 'organization', 'active', 1, '2026-07-13 12:51:22', '2026-09-08 06:18:41', '2026-09-08 14:18:41'),
(3, 'shin@gmail.com', '$2b$10$tuu0.7L9PiYpbXeUNdRmw.rerKPVXwUhOuCzh/mgR1LduNDDVL5.q', 'adopter', 'active', 1, '2026-07-13 12:55:42', '2026-09-08 06:43:56', '2026-09-08 14:43:56'),
(4, 'jhyzzeeldianela8@gmail.com', '$2b$10$0GjjNk1KhUV8c9sZMehVlOcChT1tMtsjsJDGT.QdUGxWB5.m/vU6.', 'adopter', 'active', 1, '2026-07-24 16:05:49', '2026-07-24 16:21:20', '2026-07-25 00:21:20'),
(5, 'jhyzzeeldianela@gmail.com', '$2b$10$JVHLxLNP8jFjCy3C8lpla.4P9s/tdhcMMnUq699.aOKat47N2uFCe', 'organization', 'active', 1, '2026-07-24 16:07:44', '2026-09-08 04:30:07', '2026-09-08 12:30:07'),
(6, 'eneriatelepse@gmail.com', '$2b$10$CqRZqEY5tGsQpW1Z.Dequ.CizCVVCjsLj6ulBpg0A37TDEF5npogK', 'adopter', 'active', 1, '2026-08-09 15:02:03', '2026-08-17 11:34:11', '2026-08-17 19:34:11'),
(7, 'irespeleta@my.cspc.edu.ph', '$2b$10$hFdkc2foUWjwAaejb4kte.PpZ9tcNIyjzMxjbjZQCqHnFEODZCNhC', 'adopter', 'active', 1, '2026-08-19 09:55:24', '2026-08-25 04:06:20', '2026-08-25 12:06:20'),
(8, 'testlogin1@gmail.com', '$2b$10$sBiw21ltx.V1hXivCwxSrO7gjT2MKALbC/wzR7spPDW2znwRRLmMK', 'adopter', 'active', 1, '2026-09-05 03:10:03', '2026-09-07 11:41:44', '2026-09-07 19:41:44'),
(9, 'testloginorg1@gmail.com', '$2b$10$xnfvNgKMnzW2.DIaN.eKP.rwwzLre9aIbHYuwfzVwJdY3p0ehFxzu', 'organization', 'active', 1, '2026-09-05 03:12:01', '2026-09-07 11:46:28', NULL),
(10, 'testlogin2@gmail.com', '$2b$10$5ptRmUFb7/QnwbdHwHMndut806gPM2hePMS.Fba77I2i5AeaL8tYC', 'organization', 'active', 0, '2026-09-05 16:16:21', '2026-09-06 16:23:16', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `log_id` int(11) NOT NULL,
  `account_id` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `target_type` varchar(50) NOT NULL,
  `target_id` varchar(50) DEFAULT NULL,
  `details` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`log_id`, `account_id`, `action`, `target_type`, `target_id`, `details`, `created_at`) VALUES
(21, 3, 'adoption_application_cancelled', 'application', '37', NULL, '2026-09-05 02:05:56'),
(22, 3, 'adoption_application_submitted', 'application', '38', 'Re-application', '2026-09-05 02:22:07'),
(23, 5, 'interview_scheduled', 'interview', '38', '2026-09-05 10:30', '2026-09-05 02:23:05'),
(24, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 03:08:30'),
(25, 8, 'account_registered', 'user', '8', 'Adopter: test test', '2026-09-05 03:10:03'),
(26, 8, 'login_success', 'auth', '8', NULL, '2026-09-05 03:10:33'),
(27, 8, 'logout', 'auth', '8', NULL, '2026-09-05 03:11:00'),
(28, 9, 'account_registered', 'user', '9', 'Organization: test org', '2026-09-05 03:12:01'),
(29, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 03:12:33'),
(30, 7, 'login_failed', 'auth', '7', 'Wrong password', '2026-09-05 03:15:55'),
(31, NULL, 'login_failed', 'auth', NULL, 'Unknown email: irespeleta@my.cspc.ed', '2026-09-05 03:16:06'),
(32, NULL, 'login_failed', 'auth', NULL, 'Unknown email: dofdfdne@gmail.com', '2026-09-05 03:16:35'),
(33, NULL, 'login_failed', 'auth', NULL, 'Unknown email: 1=1@gmail.com', '2026-09-05 03:18:39'),
(34, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 03:25:12'),
(35, NULL, 'login_failed', 'auth', NULL, 'Unknown email: donxfvxve@gmail.com', '2026-09-05 03:25:26'),
(36, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 03:26:57'),
(37, NULL, 'login_failed', 'auth', NULL, 'Unknown email: done@gmail.com', '2026-09-05 03:27:08'),
(38, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 03:43:49'),
(39, 9, 'logout', 'auth', '9', NULL, '2026-09-05 03:44:36'),
(40, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 03:45:48'),
(41, 2, 'logout', 'auth', '2', NULL, '2026-09-05 03:45:53'),
(42, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 11:04:13'),
(43, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 11:04:25'),
(44, 2, 'logout', 'auth', '2', NULL, '2026-09-05 11:04:47'),
(45, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 11:04:53'),
(46, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 12:12:07'),
(47, 1, 'organization_approved', 'organization', '3', NULL, '2026-09-05 12:12:27'),
(48, 1, 'user_banned', 'user', '8', NULL, '2026-09-05 12:14:03'),
(49, 8, 'login_blocked', 'auth', '8', 'Account banned', '2026-09-05 12:14:28'),
(50, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:00'),
(51, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:41'),
(52, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:45'),
(53, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:46'),
(54, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:46'),
(55, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:16:50'),
(56, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 12:17:13'),
(57, 2, 'logout', 'auth', '2', NULL, '2026-09-05 12:17:16'),
(58, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:17:29'),
(59, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-05 12:17:34'),
(60, 8, 'login_success', 'auth', '8', NULL, '2026-09-05 12:17:39'),
(61, 8, 'logout', 'auth', '8', NULL, '2026-09-05 12:48:35'),
(62, 8, 'login_success', 'auth', '8', NULL, '2026-09-05 12:48:48'),
(63, 8, 'logout', 'auth', '8', NULL, '2026-09-05 12:49:12'),
(64, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 13:18:22'),
(65, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 13:18:34'),
(66, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 13:20:56'),
(67, 2, 'logout', 'auth', '2', NULL, '2026-09-05 13:21:09'),
(68, 5, 'login_success', 'auth', '5', NULL, '2026-09-05 13:21:29'),
(69, 5, 'pet_archived', 'pet', '93', NULL, '2026-09-05 13:22:05'),
(70, 5, 'pet_deleted', 'pet', '93', NULL, '2026-09-05 13:22:34'),
(71, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 14:39:33'),
(72, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 14:39:46'),
(73, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 14:39:54'),
(74, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 15:18:27'),
(75, 2, 'logout', 'auth', '2', NULL, '2026-09-05 15:22:43'),
(76, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 15:22:50'),
(77, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 15:29:43'),
(78, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 15:29:50'),
(79, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 15:35:16'),
(80, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 15:41:11'),
(81, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 15:49:33'),
(82, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 15:49:55'),
(83, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 15:50:05'),
(84, 3, 'donation_submitted', 'cash_donation', '24', '₱1', '2026-09-05 15:51:50'),
(85, 3, 'donation_submitted', 'cash_donation', '25', '₱6', '2026-09-05 15:53:04'),
(86, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 16:01:27'),
(87, 3, 'login_success', 'auth', '3', NULL, '2026-09-05 16:01:41'),
(88, 3, 'donation_submitted', 'cash_donation', '26', '₱3', '2026-09-05 16:03:00'),
(89, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 16:05:00'),
(90, 2, 'logout', 'auth', '2', NULL, '2026-09-05 16:15:04'),
(91, 10, 'account_registered', 'user', '10', 'Organization: test2', '2026-09-05 16:16:21'),
(92, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 16:16:44'),
(93, 10, 'logout', 'auth', '10', NULL, '2026-09-05 16:16:57'),
(94, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 16:25:00'),
(95, 10, 'login_pending_org', 'auth', '10', 'Org pending verification', '2026-09-05 16:25:07'),
(96, 10, 'logout', 'auth', '10', NULL, '2026-09-05 16:25:29'),
(97, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 16:28:58'),
(98, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 16:45:09'),
(99, 1, 'admin_profile_updated', 'admin_profile', '1', 'Email changed', '2026-09-05 16:45:53'),
(100, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 17:03:08'),
(101, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 17:03:35'),
(102, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 22:43:33'),
(103, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 22:47:26'),
(104, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 23:37:27'),
(105, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 4', '2026-09-05 23:37:41'),
(106, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:37:41'),
(107, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:37:46'),
(108, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 3', '2026-09-05 23:37:46'),
(109, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:37:48'),
(110, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:37:48'),
(111, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 2', '2026-09-05 23:37:52'),
(112, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:37:52'),
(113, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 1', '2026-09-05 23:38:00'),
(114, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:38:00'),
(115, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 23:38:29'),
(116, 1, 'admin_profile_verify_locked', 'admin_profile', '1', 'Locked after 5 failed attempts', '2026-09-05 23:38:37'),
(117, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:38:37'),
(118, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password', '2026-09-05 23:38:43'),
(119, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 23:40:02'),
(120, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-05 23:40:13'),
(121, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 3', '2026-09-05 23:40:21'),
(122, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 2', '2026-09-05 23:40:24'),
(123, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 1', '2026-09-05 23:40:27'),
(124, 2, 'org_profile_verify_locked', 'org_profile', '2', 'Locked after 5 failed attempts', '2026-09-05 23:40:29'),
(125, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 23:46:22'),
(126, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 4', '2026-09-05 23:46:28'),
(127, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 3', '2026-09-05 23:46:29'),
(128, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 2', '2026-09-05 23:46:35'),
(129, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 2', '2026-09-05 23:46:35'),
(130, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 1', '2026-09-05 23:46:38'),
(131, 1, 'admin_profile_verify_locked', 'admin_profile', '1', 'Locked after 5 failed attempts (via save)', '2026-09-05 23:46:39'),
(132, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 23:52:32'),
(133, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 4', '2026-09-05 23:52:38'),
(134, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 3', '2026-09-05 23:52:38'),
(135, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 2', '2026-09-05 23:52:48'),
(136, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 2', '2026-09-05 23:52:48'),
(137, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 1', '2026-09-05 23:52:53'),
(138, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 1', '2026-09-05 23:52:53'),
(139, 1, 'admin_profile_verify_locked', 'admin_profile', '1', 'Locked after 5 failed attempts', '2026-09-05 23:52:57'),
(140, 1, 'admin_profile_verify_locked', 'admin_profile', '1', 'Locked after 5 failed attempts (via save)', '2026-09-05 23:52:57'),
(141, 1, 'login_success', 'auth', '1', NULL, '2026-09-05 23:59:14'),
(142, NULL, 'logout', 'auth', NULL, NULL, '2026-09-05 23:59:33'),
(143, 2, 'login_success', 'auth', '2', NULL, '2026-09-05 23:59:40'),
(144, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-05 23:59:45'),
(145, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 3', '2026-09-05 23:59:52'),
(146, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 2', '2026-09-05 23:59:54'),
(147, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 1', '2026-09-05 23:59:55'),
(148, 2, 'org_profile_verify_locked', 'org_profile', '2', 'Locked after 5 failed attempts', '2026-09-05 23:59:55'),
(149, 2, 'logout', 'auth', '2', NULL, '2026-09-06 00:00:01'),
(150, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 00:00:08'),
(151, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-06 00:00:12'),
(152, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 3', '2026-09-06 00:00:17'),
(153, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 2', '2026-09-06 00:00:19'),
(154, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 1', '2026-09-06 00:00:20'),
(155, 2, 'org_profile_verify_locked', 'org_profile', '2', 'Locked after 5 failed attempts', '2026-09-06 00:00:24'),
(156, 2, 'logout', 'auth', '2', NULL, '2026-09-06 00:00:37'),
(157, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 00:00:43'),
(158, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-06 00:00:48'),
(159, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 00:13:24'),
(160, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 01:07:53'),
(161, 2, 'donation_status_updated', 'cash_donation', '26', 'Status: Approved', '2026-09-06 01:08:13'),
(162, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 01:27:47'),
(163, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 01:27:59'),
(164, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 01:28:04'),
(165, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 01:41:05'),
(166, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 01:41:11'),
(167, 3, 'donation_submitted', 'inkind_donation', '10', 'kjljli', '2026-09-06 01:41:57'),
(168, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 01:42:14'),
(169, 2, 'donation_status_updated', 'inkind_donation', '10', 'Status: Rejected', '2026-09-06 01:42:38'),
(170, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 01:59:38'),
(171, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 01:59:44'),
(172, 3, 'donation_submitted', 'inkind_donation', '11', 'dry good', '2026-09-06 02:00:39'),
(173, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 02:01:19'),
(174, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 02:10:27'),
(175, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 02:10:36'),
(176, 3, 'donation_submitted', 'inkind_donation', '12', 'dry food', '2026-09-06 02:11:35'),
(177, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 02:22:13'),
(178, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 02:22:20'),
(179, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 02:31:17'),
(180, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 02:31:25'),
(181, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 02:32:07'),
(182, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 02:41:12'),
(183, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 02:41:17'),
(184, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 02:42:27'),
(185, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 02:59:12'),
(186, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 07:22:09'),
(187, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 07:26:55'),
(188, 2, 'logout', 'auth', '2', NULL, '2026-09-06 07:40:36'),
(189, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 07:40:43'),
(190, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 07:41:35'),
(191, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 07:47:48'),
(192, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 07:59:10'),
(193, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 08:12:39'),
(194, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 11:56:17'),
(195, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 11:57:23'),
(196, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 11:57:38'),
(197, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 12:07:46'),
(198, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 12:13:47'),
(199, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 12:13:54'),
(200, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 12:18:08'),
(201, 2, 'logout', 'auth', '2', NULL, '2026-09-06 12:27:14'),
(202, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 12:29:09'),
(203, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 12:48:42'),
(204, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 12:49:35'),
(205, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 12:49:40'),
(206, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 13:00:32'),
(207, 2, 'logout', 'auth', '2', NULL, '2026-09-06 13:01:20'),
(208, 5, 'login_failed', 'auth', '5', 'Wrong password', '2026-09-06 13:01:46'),
(209, 5, 'login_success', 'auth', '5', NULL, '2026-09-06 13:01:54'),
(210, 5, 'logout', 'auth', '5', NULL, '2026-09-06 13:04:53'),
(211, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 13:04:59'),
(212, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 13:05:27'),
(213, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 13:26:48'),
(214, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 13:36:05'),
(215, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 13:42:29'),
(216, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 13:42:34'),
(217, 3, 'logout', 'auth', '3', NULL, '2026-09-06 14:16:36'),
(218, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 14:17:44'),
(219, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 14:18:18'),
(220, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 4', '2026-09-06 14:18:32'),
(221, 3, 'logout', 'auth', '3', NULL, '2026-09-06 14:18:46'),
(222, 8, 'login_success', 'auth', '8', NULL, '2026-09-06 14:18:57'),
(223, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-06 14:19:16'),
(224, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 3', '2026-09-06 14:19:27'),
(225, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 2', '2026-09-06 14:19:29'),
(226, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 1', '2026-09-06 14:19:35'),
(227, 2, 'org_profile_verify_locked', 'org_profile', '2', 'Locked after 5 failed attempts', '2026-09-06 14:19:37'),
(228, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 14:51:37'),
(229, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 4', '2026-09-06 14:51:51'),
(230, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 3', '2026-09-06 14:51:54'),
(231, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 2', '2026-09-06 14:51:54'),
(232, 2, 'org_profile_verification_failed', 'org_profile', '2', 'Attempts remaining: 1', '2026-09-06 14:51:55'),
(233, 2, 'org_profile_verify_locked', 'org_profile', '2', 'Locked after 5 failed attempts', '2026-09-06 14:51:56'),
(234, 2, 'logout', 'auth', '2', NULL, '2026-09-06 14:52:00'),
(235, 2, 'login_success', 'auth', '2', NULL, '2026-09-06 14:52:11'),
(236, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 14:52:32'),
(237, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Attempts remaining: 4', '2026-09-06 14:52:41'),
(238, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 3', '2026-09-06 14:52:44'),
(239, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 2', '2026-09-06 14:52:45'),
(240, 1, 'admin_profile_verification_failed', 'admin_profile', '1', 'Wrong current password (via save), attempts remaining: 1', '2026-09-06 14:52:51'),
(241, 1, 'admin_profile_verify_locked', 'admin_profile', '1', 'Locked after 5 failed attempts (via save)', '2026-09-06 14:52:53'),
(242, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 14:53:11'),
(243, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 14:53:19'),
(244, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 15:04:32'),
(245, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 15:04:39'),
(246, 3, 'logout', 'auth', '3', NULL, '2026-09-06 15:06:48'),
(247, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 15:06:54'),
(248, NULL, 'logout', 'auth', NULL, NULL, '2026-09-06 15:12:58'),
(249, 3, 'login_success', 'auth', '3', NULL, '2026-09-06 15:13:04'),
(250, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 15:15:34'),
(251, 1, 'user_suspended', 'user', '10', NULL, '2026-09-06 15:16:31'),
(252, 1, 'user_suspended', 'user', '10', NULL, '2026-09-06 15:16:41'),
(253, 10, 'login_blocked', 'auth', '10', 'Account suspended', '2026-09-06 15:17:05'),
(254, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 15:39:20'),
(255, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 15:53:10'),
(256, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 15:53:43'),
(257, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 16:12:42'),
(258, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 16:14:03'),
(259, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 16:16:01'),
(260, 1, 'user_suspended', 'user', '10', NULL, '2026-09-06 16:16:11'),
(261, 1, 'login_success', 'auth', '1', NULL, '2026-09-06 16:17:39'),
(262, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 11:04:45'),
(263, 2, 'logout', 'auth', '2', NULL, '2026-09-07 11:05:37'),
(264, 1, 'login_success', 'auth', '1', NULL, '2026-09-07 11:05:43'),
(265, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:06:31'),
(266, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:06:53'),
(267, 8, 'login_blocked', 'auth', '8', 'Account disabled', '2026-09-07 11:06:57'),
(268, 1, 'user_suspended', 'user', '9', NULL, '2026-09-07 11:07:16'),
(269, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:07:20'),
(270, 1, 'user_suspended', 'user', '9', NULL, '2026-09-07 11:16:24'),
(271, 1, 'user_suspended', 'user', '9', NULL, '2026-09-07 11:17:39'),
(272, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:17:46'),
(273, 1, 'user_suspended', 'user', '9', NULL, '2026-09-07 11:18:02'),
(274, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:18:06'),
(275, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:18:45'),
(276, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:18:52'),
(277, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:18:56'),
(278, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:39:35'),
(279, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:39:41'),
(280, 8, 'login_failed', 'auth', '8', 'Wrong password', '2026-09-07 11:40:37'),
(281, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:40:44'),
(282, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:40:55'),
(283, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:41:06'),
(284, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:41:37'),
(285, 8, 'login_success', 'auth', '8', NULL, '2026-09-07 11:41:44'),
(286, 8, 'logout', 'auth', '8', NULL, '2026-09-07 11:41:49'),
(287, 2, 'login_failed', 'auth', '2', 'Wrong password', '2026-09-07 11:42:01'),
(288, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 11:42:06'),
(289, 2, 'logout', 'auth', '2', NULL, '2026-09-07 11:42:47'),
(290, 9, 'login_blocked', 'auth', '9', 'Account suspended', '2026-09-07 11:42:52'),
(291, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 12:07:49'),
(292, 2, 'logout', 'auth', '2', NULL, '2026-09-07 12:13:46'),
(293, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 12:17:09'),
(294, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 21:47:22'),
(295, 3, 'login_success', 'auth', '3', NULL, '2026-09-07 21:49:10'),
(296, 2, 'logout', 'auth', '2', NULL, '2026-09-07 21:50:17'),
(297, 1, 'login_success', 'auth', '1', NULL, '2026-09-07 21:50:26'),
(298, NULL, 'logout', 'auth', NULL, NULL, '2026-09-07 22:48:48'),
(299, 2, 'login_success', 'auth', '2', NULL, '2026-09-07 22:49:08'),
(300, 3, 'login_success', 'auth', '3', NULL, '2026-09-07 22:50:11'),
(301, 1, 'login_success', 'auth', '1', NULL, '2026-09-07 22:50:19'),
(302, NULL, 'logout', 'auth', NULL, NULL, '2026-09-07 23:13:24'),
(303, 3, 'login_success', 'auth', '3', NULL, '2026-09-07 23:13:31'),
(304, 3, 'adoption_application_submitted', 'application', NULL, 'Pet #89', '2026-09-07 23:18:47'),
(305, 5, 'login_success', 'auth', '5', NULL, '2026-09-07 23:19:08'),
(306, 1, 'login_success', 'auth', '1', NULL, '2026-09-07 23:19:55'),
(307, 5, 'interview_scheduled', 'interview', '40', '2026-09-08 08:00', '2026-09-07 23:20:18'),
(308, 5, 'interview_rescheduled', 'interview', '40', '2026-09-08 08:30', '2026-09-07 23:21:08'),
(309, 5, 'logout', 'auth', '5', NULL, '2026-09-07 23:47:20'),
(310, 3, 'login_success', 'auth', '3', NULL, '2026-09-07 23:47:27'),
(311, 1, 'login_failed', 'auth', '1', 'Wrong password', '2026-09-08 02:45:47'),
(312, 1, 'login_failed', 'auth', '1', 'Wrong password', '2026-09-08 02:45:48'),
(313, 1, 'login_success', 'auth', '1', NULL, '2026-09-08 02:45:51'),
(314, 1, 'login_success', 'auth', '1', NULL, '2026-09-08 02:50:07'),
(315, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 02:50:24'),
(316, 2, 'feedback_submitted', 'feedback', '7', 'Feature Suggestion', '2026-09-08 02:51:23'),
(317, 2, 'logout', 'auth', '2', NULL, '2026-09-08 02:52:03'),
(318, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 02:52:09'),
(319, 2, 'logout', 'auth', '2', NULL, '2026-09-08 02:52:26'),
(320, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 02:52:32'),
(321, 3, 'feedback_submitted', 'feedback', '8', 'Report a Bug', '2026-09-08 02:52:45'),
(322, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 03:57:19'),
(323, 3, 'feedback_submitted', 'feedback', '9', 'Report a Bug', '2026-09-08 03:58:17'),
(324, 3, 'logout', 'auth', '3', NULL, '2026-09-08 03:58:23'),
(325, 1, 'login_success', 'auth', '1', NULL, '2026-09-08 03:58:32'),
(326, 1, 'feedback_resolved', 'feedback', '9', NULL, '2026-09-08 03:58:46'),
(327, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 03:58:55'),
(328, 2, 'logout', 'auth', '2', NULL, '2026-09-08 03:59:01'),
(329, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 03:59:08'),
(330, 3, 'logout', 'auth', '3', NULL, '2026-09-08 04:04:43'),
(331, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 04:04:57'),
(332, 2, 'pet_updated', 'pet', '58', NULL, '2026-09-08 04:05:09'),
(333, 2, 'pet_updated', 'pet', '57', NULL, '2026-09-08 04:05:18'),
(334, 2, 'pet_updated', 'pet', '56', NULL, '2026-09-08 04:05:23'),
(335, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 04:07:41'),
(336, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 04:07:53'),
(337, 2, 'pet_updated', 'pet', '58', NULL, '2026-09-08 04:08:47'),
(338, 2, 'pet_updated', 'pet', '57', NULL, '2026-09-08 04:09:28'),
(339, 2, 'pet_updated', 'pet', '56', NULL, '2026-09-08 04:09:56'),
(340, 2, 'pet_updated', 'pet', '58', NULL, '2026-09-08 04:10:13'),
(341, 2, 'pet_updated', 'pet', '57', NULL, '2026-09-08 04:10:22'),
(342, 2, 'pet_updated', 'pet', '58', NULL, '2026-09-08 04:10:31'),
(343, 2, 'pet_updated', 'pet', '55', NULL, '2026-09-08 04:11:06'),
(344, 2, 'pet_updated', 'pet', '54', NULL, '2026-09-08 04:11:59'),
(345, 2, 'pet_updated', 'pet', '53', NULL, '2026-09-08 04:13:24'),
(346, 2, 'pet_updated', 'pet', '49', NULL, '2026-09-08 04:14:24'),
(347, 2, 'pet_updated', 'pet', '48', NULL, '2026-09-08 04:15:11'),
(348, 2, 'pet_updated', 'pet', '47', NULL, '2026-09-08 04:15:43'),
(349, 2, 'pet_updated', 'pet', '46', NULL, '2026-09-08 04:16:20'),
(350, 2, 'pet_updated', 'pet', '44', NULL, '2026-09-08 04:17:01'),
(351, 2, 'pet_updated', 'pet', '45', NULL, '2026-09-08 04:17:39'),
(352, 2, 'pet_updated', 'pet', '43', NULL, '2026-09-08 04:18:13'),
(353, 2, 'pet_updated', 'pet', '42', NULL, '2026-09-08 04:18:58'),
(354, 2, 'pet_updated', 'pet', '41', NULL, '2026-09-08 04:19:29'),
(355, 2, 'pet_updated', 'pet', '40', NULL, '2026-09-08 04:19:58'),
(356, 2, 'pet_updated', 'pet', '36', NULL, '2026-09-08 04:21:03'),
(357, 2, 'pet_updated', 'pet', '35', NULL, '2026-09-08 04:21:35'),
(358, 2, 'pet_updated', 'pet', '34', NULL, '2026-09-08 04:22:15'),
(359, 2, 'pet_updated', 'pet', '33', NULL, '2026-09-08 04:22:52'),
(360, 2, 'pet_updated', 'pet', '32', NULL, '2026-09-08 04:23:24'),
(361, 2, 'pet_updated', 'pet', '31', NULL, '2026-09-08 04:23:48'),
(362, 2, 'pet_updated', 'pet', '30', NULL, '2026-09-08 04:24:17'),
(363, 2, 'pet_updated', 'pet', '29', NULL, '2026-09-08 04:24:44'),
(364, 2, 'pet_updated', 'pet', '28', NULL, '2026-09-08 04:25:50'),
(365, 2, 'pet_updated', 'pet', '27', NULL, '2026-09-08 04:26:23'),
(366, 2, 'logout', 'auth', '2', NULL, '2026-09-08 04:26:40'),
(367, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 04:26:48'),
(368, 3, 'logout', 'auth', '3', NULL, '2026-09-08 04:27:07'),
(369, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 04:27:10'),
(370, 2, 'logout', 'auth', '2', NULL, '2026-09-08 04:28:51'),
(371, 5, 'login_failed', 'auth', '5', 'Wrong password', '2026-09-08 04:29:04'),
(372, 5, 'login_failed', 'auth', '5', 'Wrong password', '2026-09-08 04:29:29'),
(373, 5, 'login_failed', 'auth', '5', 'Wrong password', '2026-09-08 04:29:48'),
(374, 5, 'login_failed', 'auth', '5', 'Wrong password', '2026-09-08 04:29:50'),
(375, 5, 'login_success', 'auth', '5', NULL, '2026-09-08 04:30:07'),
(376, 5, 'pet_archived', 'pet', '90', NULL, '2026-09-08 04:30:16'),
(377, 5, 'pet_archived', 'pet', '89', NULL, '2026-09-08 04:30:25'),
(378, 5, 'pet_archived', 'pet', '88', NULL, '2026-09-08 04:30:28'),
(379, 5, 'pet_archived', 'pet', '86', NULL, '2026-09-08 04:30:31'),
(380, 5, 'pet_archived', 'pet', '85', NULL, '2026-09-08 04:30:34'),
(381, 5, 'pet_archived', 'pet', '84', NULL, '2026-09-08 04:30:35'),
(382, 5, 'pet_archived', 'pet', '83', NULL, '2026-09-08 04:30:38'),
(383, 5, 'pet_archived', 'pet', '82', NULL, '2026-09-08 04:30:39'),
(384, 5, 'pet_archived', 'pet', '81', NULL, '2026-09-08 04:30:41'),
(385, 5, 'pet_archived', 'pet', '80', NULL, '2026-09-08 04:30:43'),
(386, 5, 'pet_archived', 'pet', '79', NULL, '2026-09-08 04:30:45'),
(387, 5, 'pet_archived', 'pet', '78', NULL, '2026-09-08 04:30:47'),
(388, 5, 'pet_archived', 'pet', '77', NULL, '2026-09-08 04:30:50'),
(389, 5, 'pet_archived', 'pet', '76', NULL, '2026-09-08 04:30:52'),
(390, 5, 'pet_archived', 'pet', '75', NULL, '2026-09-08 04:30:54'),
(391, 5, 'pet_archived', 'pet', '74', NULL, '2026-09-08 04:30:56'),
(392, 5, 'pet_archived', 'pet', '73', NULL, '2026-09-08 04:30:58'),
(393, 5, 'pet_archived', 'pet', '72', NULL, '2026-09-08 04:31:00'),
(394, 5, 'pet_archived', 'pet', '71', NULL, '2026-09-08 04:31:03'),
(395, 5, 'pet_archived', 'pet', '70', NULL, '2026-09-08 04:31:05'),
(396, 5, 'pet_archived', 'pet', '69', NULL, '2026-09-08 04:31:07'),
(397, 5, 'pet_archived', 'pet', '68', NULL, '2026-09-08 04:31:08'),
(398, 5, 'pet_archived', 'pet', '67', NULL, '2026-09-08 04:31:10'),
(399, 5, 'pet_archived', 'pet', '66', NULL, '2026-09-08 04:31:11'),
(400, 5, 'pet_archived', 'pet', '65', NULL, '2026-09-08 04:31:13'),
(401, 5, 'pet_archived', 'pet', '64', NULL, '2026-09-08 04:31:15'),
(402, 5, 'pet_archived', 'pet', '63', NULL, '2026-09-08 04:31:16'),
(403, 5, 'pet_archived', 'pet', '62', NULL, '2026-09-08 04:31:19'),
(404, 5, 'pet_archived', 'pet', '61', NULL, '2026-09-08 04:31:21'),
(405, 5, 'pet_archived', 'pet', '60', NULL, '2026-09-08 04:31:22'),
(406, 5, 'logout', 'auth', '5', NULL, '2026-09-08 04:31:25'),
(407, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 04:31:36'),
(408, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 05:27:35'),
(409, 2, 'login_success', 'auth', '2', NULL, '2026-09-08 06:18:41'),
(410, 3, 'login_success', 'auth', '3', NULL, '2026-09-08 06:43:56'),
(411, 3, 'feedback_submitted', 'feedback', '10', 'Feature Suggestion', '2026-09-08 06:44:09'),
(412, 2, 'logout', 'auth', '2', NULL, '2026-09-08 06:44:28'),
(413, NULL, 'login_failed', 'auth', NULL, 'Unknown email: admin@gmail.com', '2026-09-08 06:44:36'),
(414, 1, 'login_success', 'auth', '1', NULL, '2026-09-08 06:44:58'),
(415, 1, 'feedback_resolved', 'feedback', '10', NULL, '2026-09-08 06:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `adopters`
--

CREATE TABLE `adopters` (
  `adopter_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `birthday` date NOT NULL DEFAULT '2000-01-01',
  `civil_status` varchar(50) DEFAULT NULL,
  `occupation` varchar(100) DEFAULT NULL,
  `region` varchar(100) NOT NULL DEFAULT 'Region V (Bicol Region)',
  `street_address` varchar(255) NOT NULL DEFAULT '',
  `barangay` varchar(100) NOT NULL DEFAULT '',
  `city` varchar(100) NOT NULL DEFAULT '',
  `province` varchar(100) NOT NULL DEFAULT '',
  `zip_code` varchar(10) NOT NULL DEFAULT '',
  `phone_number` varchar(20) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `adopters`
--

INSERT INTO `adopters` (`adopter_id`, `account_id`, `first_name`, `last_name`, `birthday`, `civil_status`, `occupation`, `region`, `street_address`, `barangay`, `city`, `province`, `zip_code`, `phone_number`, `profile_picture`) VALUES
(1, 3, 'Shinrei', 'Nouzen', '1999-12-23', 'Single', 'Programmer', 'Region VI (Western Visayas)', 'hgnhghtghf', 'Mamhut Norte', 'Balasan', 'Antique', '3444', '09876543211', '/uploads/avatars/avatar-3-1786284038336.jpg'),
(2, 4, 'Jhyzzeel', 'Dianela', '2000-01-01', NULL, NULL, 'Region V (Bicol Region)', '', '', '', '', '', '09815439724', NULL),
(3, 6, 'Irene', 'Espeleta', '2000-01-01', NULL, NULL, 'Region V (Bicol Region)', '', '', '', '', '', '09786676767', NULL),
(4, 7, 'Irene', 'Espeleta', '2005-07-30', 'Single', NULL, 'Region V (Bicol Region)', 'hyytgg', 'Mainit', 'Bato', 'Camarines Sur', '1212', '09444444447', '/uploads/avatars/avatar-7-1787246507967.png'),
(5, 8, 'test', 'test', '2005-09-05', 'Single', 'Programmer', 'Region X (Northern Mindanao)', 'test', 'San Isidro (San Isidro-San Pedro)', 'Calamba', 'Bukidnon', '4434', '09777777777', NULL);

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
  `pet_description` text DEFAULT NULL,
  `health_status` enum('Healthy','Sick','Under Treatment','Recovered') NOT NULL DEFAULT 'Healthy',
  `vaccination_status` enum('Vaccinated','Not Vaccinated','Unknown') DEFAULT 'Unknown',
  `adoption_status` enum('Available','Pending','Adopted','Archived') DEFAULT 'Available',
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animals`
--

INSERT INTO `animals` (`animal_id`, `organization_id`, `name`, `species`, `gender`, `age`, `pet_description`, `health_status`, `vaccination_status`, `adoption_status`, `image_path`, `created_at`, `deleted_at`) VALUES
(27, 1, 'Adobo', 'Dog', 'Female', 'Adult (4-7 yrs old)', 'This pet is friendly, active, sociable, affectionate, and comfortable around people. It enjoys human interaction, being petted, and receiving attention and companionship. This pet has an energetic and playful temperament and enjoys regular physical activity and positive interaction. It is generally gentle and non-aggressive and responds well to patient and caring handling. This pet thrives with consistent companionship, attention, exercise, and a safe and supportive environment.', 'Healthy', 'Vaccinated', 'Available', '1787986431938-561861.PNG', '2026-08-29 06:53:51', NULL),
(28, 1, 'Sadboi', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'This pet is calm, friendly, gentle, affectionate, and approachable around people. It is comfortable with human interaction and enjoys being petted and receiving attention. This pet has a relaxed and easygoing temperament and responds well to gentle handling and companionship. It is generally sociable and non-aggressive, making it comfortable in positive and calm interactions with people.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787986796031-527255.png', '2026-08-29 06:57:20', NULL),
(29, 1, 'Nougat', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'This pet is shy, cautious, gentle, and reserved around people. It may be hesitant during initial interactions and prefers a slow, calm, and patient approach when meeting unfamiliar people. This pet is generally non-aggressive and can gradually become more comfortable through consistent, gentle, and positive interaction. It benefits from a calm environment, reassurance, and careful handling, especially while receiving proper care and monitoring for its current health condition.', 'Under Treatment', 'Vaccinated', 'Pending', '1787987218307-101263.png', '2026-08-29 07:04:52', NULL),
(30, 1, 'Lebron', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'This pet is active, friendly, energetic, and sociable toward people. It enjoys human interaction and responds well to attention and companionship. However, it can be aggressive toward other animals and may become reactive when around unfamiliar pets. This pet requires careful supervision and controlled interactions around other animals. With consistent training, patient handling, and positive reinforcement, it may gradually develop better social behavior and become more comfortable in different environments.', 'Healthy', 'Unknown', 'Available', '1787987418450-886668.png', '2026-08-29 07:10:18', NULL),
(31, 1, 'Chonk', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'This pet is calm, shy, gentle, and cautious around people. It tends to remain still and observant, especially when there is sudden movement or unfamiliar activity. This pet may be less active while recovering from an injury but remains generally non-aggressive during interactions. It responds best to slow, gentle, and patient handling and benefits from a quiet and supportive environment. With consistent care, reassurance, and positive interaction, it can gradually build trust and become more comfortable around people.', 'Under Treatment', 'Vaccinated', 'Pending', '1787987710920-990190.PNG', '2026-08-29 07:15:10', NULL),
(32, 1, 'Roti', 'Dog', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This pet is calm, observant, gentle, and slightly cautious around people. It tends to be quiet and attentive to its surroundings and may take some time to feel comfortable with unfamiliar people or environments. This pet is generally non-aggressive and responds well to slow, gentle, and patient interaction. With consistent positive attention and respectful handling, it can gradually build trust and become more comfortable around people.', 'Healthy', 'Unknown', 'Available', '1787987951420-624929.png', '2026-08-29 07:18:20', NULL),
(33, 1, 'Mondy', 'Dog', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This pet is playful, friendly, sociable, and energetic around people. It enjoys human interaction, social activities, and playful experiences. This pet is comfortable meeting and interacting with people and has a cheerful and outgoing temperament. It is generally gentle and non-aggressive and responds well to positive attention, companionship, and gentle handling.', 'Healthy', 'Vaccinated', 'Available', '1787988261643-881712.png', '2026-08-29 07:24:21', NULL),
(34, 1, 'Taco', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'This pet is kind, gentle, calm, and affectionate around people. It has a friendly and easygoing temperament and responds well to gentle human interaction. This pet is generally patient and non-aggressive, making it suitable for calm and positive interactions. It benefits from consistent care, attention, and gentle handling, especially while receiving proper care for its current health condition.', 'Healthy', 'Unknown', 'Pending', '1787988463114-127393.png', '2026-08-29 07:27:43', NULL),
(35, 1, 'Duke', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'This pet is kind, gentle, calm, and easygoing around people. It has a relaxed and peaceful temperament and tends to be quiet and laid-back. This pet is generally friendly, non-aggressive, and comfortable with gentle human interaction. It enjoys a calm environment, restful moments, and positive attention, and responds well to patient and gentle handling.', 'Healthy', 'Vaccinated', 'Available', '1787988638496-205012.PNG', '2026-08-29 07:30:38', NULL),
(36, 1, 'Zeus', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'This pet is calm, kind, gentle, shy, and reserved around people. It may be hesitant during initial interactions and prefers a quiet, patient approach. This pet is generally non-aggressive and responds well to gentle handling and positive attention. With consistent and reassuring interaction, it can gradually become more comfortable and build trust with people.', 'Healthy', 'Vaccinated', 'Available', '1787988818086-743176.PNG', '2026-08-29 07:33:38', NULL),
(37, 1, 'Gewe', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'A female cat with a mostly black coat and slight brown markings on different parts of the body. Gewe is generally calm and reserved around humans and can be slightly cautious, often preferring quiet and peaceful areas. Due to pregnancy, Gewe currently has limited human interaction and may require a calm environment with minimal disturbance. Gewe is currently pregnant.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787989001348-615559.PNG', '2026-08-29 07:36:41', NULL),
(38, 1, 'Albie', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'A male kitten with a light orange coat covering the back, tail, ears, and forehead, along with white markings on the underbody, legs, and face.', 'Healthy', 'Unknown', 'Available', '1787989060937-514756.PNG', '2026-08-29 07:37:40', NULL),
(39, 1, 'Flerken', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A female cat with an orange coat featuring light orange stripes.', 'Healthy', 'Unknown', 'Available', '1787989137443-530544.PNG', '2026-08-29 07:38:57', NULL),
(40, 1, 'Bloop', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This pet is active, playful, friendly, and sociable around people. It enjoys human interaction and is comfortable in shared environments. This pet is energetic, curious, and enjoys playtime, exploration, and positive attention. It is generally calm and non-aggressive during interactions and responds well to gentle handling and companionship.', 'Healthy', 'Unknown', 'Available', '1787989200974-113418.PNG', '2026-08-29 07:40:00', NULL),
(41, 1, 'Gato', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This pet is cautious, guarded, and mildly aggressive around people. It may be reserved during interactions and can react defensively when feeling uncomfortable or approached too quickly. This pet requires slow, careful, and patient handling, especially around unfamiliar people. It may need time and consistent positive interaction to build trust and become more comfortable. Due to its history of aggressive behavior, calm and respectful handling is important when assessing compatibility.', 'Healthy', 'Unknown', 'Available', '1787989386908-837233.png', '2026-08-29 07:41:19', NULL),
(42, 1, 'Sith', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'This pet is calm, shy, gentle, and cautious around people. It may be reserved and take time to become comfortable with unfamiliar individuals or new environments. This pet remains non-aggressive during interactions and responds best to a slow, patient, and gentle approach. With consistent positive attention and respectful handling, it can gradually build trust and become more comfortable around people.', 'Healthy', 'Unknown', 'Available', '1787989453503-139995.PNG', '2026-08-29 07:44:13', NULL),
(43, 1, 'Tiger', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This pet is active, observant, independent, and cautious around people. It prefers to maintain some personal space but can tolerate human interaction when approached calmly. This pet responds best to slow, gentle, and patient handling, especially in unfamiliar situations. It may take time to become comfortable with new people but can gradually build trust through consistent and positive interactions.', 'Healthy', 'Unknown', 'Available', '1787989607349-816999.PNG', '2026-08-29 07:46:47', NULL),
(44, 1, 'Chimi', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This pet is playful, curious, friendly, and generally sociable around people. It enjoys exploring its surroundings and engaging in playful activities and human interaction. It may be mildly cautious when meeting unfamiliar people or entering new environments, but remains non-aggressive during interactions. It responds well to gentle and patient handling and can become more comfortable through consistent and positive interaction.', 'Healthy', 'Vaccinated', 'Available', '1787989816670-780282.png', '2026-08-29 07:48:37', NULL),
(45, 1, 'Changa', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This pet is playful, friendly, sociable, and affectionate toward people. It is comfortable with human interaction and enjoys spending time with people. This pet is energetic, curious, and enjoys playful activities and exploring its surroundings. It is generally calm and non-aggressive during interactions and responds well to gentle and positive attention.', 'Healthy', 'Vaccinated', 'Available', '1787989998486-11527.png', '2026-08-29 07:53:18', NULL),
(46, 1, 'Red', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This pet is friendly, curious, tolerant, and generally sociable around people. It is comfortable with human interaction and is usually calm and non-aggressive. While it may be mildly cautious in unfamiliar situations, it responds well to gentle and patient handling. It enjoys exploring its surroundings, interacting with people, and receiving positive attention.', 'Healthy', 'Vaccinated', 'Available', '1787990088930-806277.PNG', '2026-08-29 07:54:48', NULL),
(47, 1, 'Oreo', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This pet is cautious, independent, and can be defensive when feeling stressed or uncomfortable. It may react negatively when approached suddenly and requires slow, gentle, and careful handling. It has a history of aggressive behavior toward certain individuals, so calm and patient interaction is important. With consistent, respectful, and positive interactions, this pet can gradually build trust and become more comfortable around people.', 'Healthy', 'Vaccinated', 'Available', '1787990193928-604248.PNG', '2026-08-29 07:56:33', NULL),
(48, 1, 'Milo', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This pet is calm, independent, cautious, and non-aggressive. It has a low-to-moderate level of sociability and may take time to become comfortable around people. It prefers a calm environment and gentle interaction, but can gradually build trust through patience, consistent attention, and positive human interaction.', 'Healthy', 'Unknown', 'Available', '1787990272670-415668.PNG', '2026-08-29 07:57:52', NULL),
(49, 1, 'Cheeto', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'This pet is active, curious, friendly, and moderately sociable. She enjoys exploring her surroundings and interacting with people when comfortable. She is generally calm and non-aggressive during interactions and responds well to gentle attention. She is approachable, adaptable, and can build trust through consistent and positive human interaction.', 'Healthy', 'Unknown', 'Available', '1787990349475-201017.PNG', '2026-08-29 07:59:09', NULL),
(51, 1, 'David', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat. No specific color or marking information is currently recorded for him.', 'Healthy', 'Vaccinated', 'Available', '1787990509367-476663.PNG', '2026-08-29 08:01:49', NULL),
(52, 1, 'Clarita', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A female cat with an orange-colored coat. No specific behavioral information is currently recorded for her.', 'Healthy', 'Vaccinated', 'Available', '1787990781881-237337.PNG', '2026-08-29 08:06:21', NULL),
(53, 1, 'Brent', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'This pet is gentle, curious, and playful. It enjoys exploring its surroundings and interacting with people when comfortable. It is affectionate and responsive to attention, and may need gentle interaction at first to build trust and become comfortable in a new environment. It enjoys playtime, human companionship, and positive interaction.', 'Healthy', 'Vaccinated', 'Available', '1787990896733-420280.PNG', '2026-08-29 08:08:16', NULL),
(54, 1, 'Mikha', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This pet is gentle, curious, playful, affectionate, and sociable. She enjoys exploring, playing, and interacting with people. She is generally calm and may approach people when comfortable, but benefits from gentle interaction while building trust.', 'Healthy', 'Vaccinated', 'Available', '1787990976665-42233.PNG', '2026-08-29 08:09:36', NULL),
(55, 1, 'Baby Shark 1', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'This kitten is active, playful, energetic, and curious. He enjoys exploring his surroundings and is comfortable approaching people for interaction.', 'Healthy', 'Vaccinated', 'Available', '1787991057801-285624.PNG', '2026-08-29 08:10:57', NULL),
(56, 1, 'Yuri', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This cat is cautious, territorial, and sometimes aggressive around people. He may require calm and careful handling to prevent aggressive behavior.', 'Healthy', 'Unknown', 'Available', '1787991122576-520545.PNG', '2026-08-29 08:12:02', NULL),
(57, 1, 'Tobi', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This pet is a shy, timid, and cautious cat who tends to avoid people when approached. He may need patience and gentle handling to gradually build trust and become more comfortable around humans.', 'Healthy', 'Unknown', 'Available', '1787991179865-199613.PNG', '2026-08-29 08:12:59', NULL),
(58, 1, 'Charlie', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'This pet is a friendly, gentle, and affectionate cat who is comfortable around people and enjoys being petted and staying close to humans. She is calm and non-aggressive, with no history of biting or aggressive behavior.', 'Healthy', 'Vaccinated', 'Available', '1787991240241-917957.PNG', '2026-08-29 08:14:00', NULL),
(59, 1, 'Yogurt', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'fvdghfhfhf', 'Healthy', 'Vaccinated', 'Adopted', '1788006119321-579897.PNG', '2026-08-29 12:21:59', NULL),
(60, 2, 'Joy Joy', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A medium-sized cat features a beautiful medium-length torbie coat displaying a unique mix of orange and greyish \"tilapia\" patterns, paired with striking green eyes, straight prick ears, and long whiskers. Distinctive physical details include a pink nose, mixed pink and black paw pads, and a bobbed or docked tail. She is fully spayed. ', 'Healthy', 'Unknown', 'Archived', '1788015879210-245108.PNG', '2026-08-29 13:56:56', NULL),
(61, 2, 'Pilay', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat sports a sleek short-haired tricolor coat in white, orange, and black, highlighted by vibrant green eyes, straight prick ears, and long whiskers. Black accents stand out on both its nose and paw pads, complementing its distinct color pattern. A notable feature is its docked tail. \r\n', 'Healthy', 'Unknown', 'Archived', '1788012781330-399882.png', '2026-08-29 14:07:07', NULL),
(62, 2, 'Lemon', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a short bi-color coat of white and orange, paired with striking copper eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads, perfectly complementing its bright fur pattern. \r\n', 'Healthy', 'Unknown', 'Archived', '1788012933938-739721.PNG', '2026-08-29 14:15:33', NULL),
(63, 2, 'Putol', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat sports a sleek short-haired bi-color coat of white and greyish \"tilapia\" patterns, anchored by striking copper eyes, straight prick ears, and long whiskers. Unique features include a bright pink nose contrasting with black paw pads, along with a distinct docked tail. ', 'Healthy', 'Unknown', 'Archived', '1788013002667-78798.PNG', '2026-08-29 14:16:42', NULL),
(64, 2, 'Lupin', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a short bi-color coat of white and orange, paired with rare blue-green eyes, straight prick ears, and medium-length whiskers. A soft pink nose contrasts sharply with its black paw pads, rounding out its distinct appearance. \r\n', 'Healthy', 'Unknown', 'Archived', '1788016015048-786453.PNG', '2026-08-29 14:17:35', NULL),
(65, 2, 'Pandakiko', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a short bi-color coat of white and greyish \"tilapia\" patterns, complemented by striking copper eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads, completing its clean two-tone look.', 'Healthy', 'Unknown', 'Archived', '1788013131560-18075.PNG', '2026-08-29 14:18:51', NULL),
(66, 2, 'Ginger', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white and orange, highlighted by striking copper eyes, straight prick ears, and long whiskers. Both her nose and paw pads are a soft pink color, perfectly matching her warm palette. As a notable update, she has recently given birth.', 'Healthy', 'Unknown', 'Archived', '1788013223668-667372.PNG', '2026-08-29 14:20:23', NULL),
(67, 2, 'Kulit', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, neutered cat features a medium-length bi-color coat of white with grey spots, highlighted by striking green eyes, straight prick ears, long whiskers, and a full set of teeth with intact fangs. A light pink nose contrasts neatly with its black paw pads, finishing off its distinct appearance.', 'Healthy', 'Unknown', 'Archived', '1788013272941-619630.PNG', '2026-08-29 14:21:12', NULL),
(68, 2, 'Sabrena', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a short tortoiseshell coat in orange and grey, highlighted by vivid green eyes, straight prick ears, medium whiskers, and a full set of teeth with intact fangs. A soft pink nose stands out against her black paw pads. She is currently pregnant, requiring extra attention and care.', 'Healthy', 'Unknown', 'Archived', '1788013330241-909080.PNG', '2026-08-29 14:22:10', NULL),
(69, 2, 'Junjun', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short bi-color coat of grey and white, highlighted by bright green eyes, straight prick ears, short whiskers, and a complete set of teeth with intact fangs. Soft pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Archived', '1788013405053-695517.PNG', '2026-08-29 14:23:25', NULL),
(70, 2, 'Blacky', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This small, unneutered kitten features a short bi-color coat of black and white, highlighted by bright green eyes, straight prick ears, short whiskers, and a complete set of teeth with intact fangs. Unique details include a black nose paired with peach paw pads, finishing off its adorable baby appearance.', 'Healthy', 'Unknown', 'Archived', '1788013508924-180013.PNG', '2026-08-29 14:25:08', NULL),
(71, 2, 'Chester', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat sports a short orange tabby coat paired with striking orange eyes, straight prick ears, medium whiskers, and a complete set of teeth with intact fangs. A distinct black nose contrasts with its soft peach paw pads. Most importantly, this cat requires immediate medical attention and urgent care.', 'Under Treatment', 'Unknown', 'Archived', '1788013619343-744563.PNG', '2026-08-29 14:26:59', NULL),
(72, 2, 'Wolvereen', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a short bi-color coat of dark grey and white, paired with striking copper eyes, straight prick ears, medium whiskers, and a full set of teeth with intact fangs. Soft pink coloring marks both its nose and paw pads, complementing its bold two-tone coat.', 'Healthy', 'Unknown', 'Archived', '1788013664212-6569.PNG', '2026-08-29 14:27:44', NULL),
(73, 2, 'Tipaklong ', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, spayed female cat features a short torbie coat with greyish \"tilapia\" patterns, complemented by vivid green eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks her nose, while her paw pads display a unique mix of black and pink.', 'Healthy', 'Unknown', 'Archived', '1788016258941-889909.JPG', '2026-08-29 14:33:15', NULL),
(74, 2, 'Ginger Boy', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat sports a short orange tabby coat highlighted by striking copper eyes, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, perfectly matching its warm, vibrant appearance.', 'Healthy', 'Unknown', 'Archived', '1788014050508-792134.PNG', '2026-08-29 14:34:10', NULL),
(75, 2, 'Max', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat of black and white, paired with striking green eyes, straight prick ears, and medium-length whiskers. A solid black nose accents its crisp color pattern.\r\n', 'Healthy', 'Unknown', 'Archived', '1788014107894-549581.PNG', '2026-08-29 14:35:07', NULL),
(76, 2, 'Rhea', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a medium-length tricolor coat blending white, orange, and greyish \"tilapia\" patterns, highlighted by striking copper eyes, straight prick ears, and long whiskers. A sleek black nose accents its distinct color combination.', 'Healthy', 'Unknown', 'Archived', '1788014296475-708792.PNG', '2026-08-29 14:38:16', NULL),
(77, 2, 'Tom', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending greyish \"tilapia\" patterns with white, paired with vivid green eyes, straight prick ears, and medium-length whiskers. A sharp black nose accents its appearance.', 'Healthy', 'Unknown', 'Archived', '1788014366598-391392.PNG', '2026-08-29 14:39:26', NULL),
(78, 2, 'Panther', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of black and white, paired with striking copper eyes, straight prick ears, and long whiskers. A sharp black nose accents its classic pattern.', 'Healthy', 'Unknown', 'Archived', '1788014408917-140149.PNG', '2026-08-29 14:40:08', NULL),
(79, 2, 'Kulit', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending white and greyish \"tilapia\" patterns, paired with vivid green eyes, straight prick ears, and long whiskers. A sleek black nose highlights its face.', 'Healthy', 'Unknown', 'Archived', '1788014450051-532981.PNG', '2026-08-29 14:40:50', NULL),
(80, 2, 'Tim', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending greyish \"tilapia\" patterns with white, paired with vivid green eyes, straight prick ears, and long whiskers. A unique blackish-orange nose accents its face.', 'Healthy', 'Unknown', 'Archived', '1788014489157-969172.PNG', '2026-08-29 14:41:29', NULL),
(81, 2, 'Mama B', 'Cat', 'Female', 'Adult (4-7 yrs old)', ' This large, spayed female cat features a medium-length tabby coat blending greyish \"tilapia\" patterns with white, paired with striking copper eyes, straight prick ears, and medium-length whiskers. A sharp black nose accents her defined features.\r\n', 'Healthy', 'Unknown', 'Archived', '1788014540893-758696.PNG', '2026-08-29 14:42:20', NULL),
(82, 2, 'Labo', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This large, neutered cat features a short bi-color coat of orange and white, paired with vivid green eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads. Notably, this cat is completely blind and requires a safe, familiar environment.', 'Healthy', 'Unknown', 'Archived', '1788014586341-684807.PNG', '2026-08-29 14:43:06', NULL),
(83, 2, 'Doraemon ', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white and orange, paired with vivid green eyes, straight prick ears, and long whiskers. Soft pink coloring marks both its nose and paw pads, completing its classic two-tone look.', 'Healthy', 'Unknown', 'Archived', '1788014636801-806070.PNG', '2026-08-29 14:43:56', NULL),
(84, 2, 'Snotty', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white, grey, and black, paired with striking yellow-green eyes, straight prick ears, and medium-length whiskers. A distinctive pink nose with black corners highlights its face, grounded by solid black paw pads.', 'Healthy', 'Unknown', 'Archived', '1788014697374-768157.PNG', '2026-08-29 14:44:57', NULL),
(85, 2, 'Basy', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length solid white coat, paired with light-blue eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads. Notably, its right eye shows an existing complication that may require monitoring or medical assessment.', 'Healthy', 'Unknown', 'Archived', '1788014752033-830181.PNG', '2026-08-29 14:45:52', NULL),
(86, 2, 'Flake', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short solid white coat paired with soft light-blue eyes, straight prick ears, and short whiskers. Delicate pink coloring marks both its nose and paw pads, highlighting its gentle baby appearance.', 'Healthy', 'Unknown', 'Archived', '1788014786550-906358.PNG', '2026-08-29 14:46:26', NULL),
(88, 2, 'Ponky', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short bi-color coat of orange and white, paired with unique light-green eyes with blue corners, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Archived', '1788014839957-503544.PNG', '2026-08-29 14:47:19', NULL),
(89, 2, 'Tom', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short tortoiseshell coat blending orange and light-grey patterns, paired with light-green eyes, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, completing its sweet, young appearance.', 'Healthy', 'Unknown', 'Archived', '1788014890345-843226.PNG', '2026-08-29 14:48:10', NULL),
(90, 2, 'Jerry', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short tortoiseshell coat blending orange and dark-grey patterns, paired with soft light-green, bluish eyes, straight prick ears, and short whiskers. Gentle pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Archived', '1788014935548-601261.PNG', '2026-08-29 14:48:55', NULL),
(91, 2, 'Scar', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered kitten features a medium-length bi-color coat of white and grey, paired with light-green eyes, straight prick ears, and medium-length whiskers. A unique pink nose with black corners highlights its face, grounded by solid black paw pads.', 'Healthy', 'Unknown', 'Adopted', '1788014977894-341570.PNG', '2026-08-29 14:49:37', NULL),
(93, 2, 'hyyyi', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', NULL, 'Healthy', 'Unknown', 'Available', NULL, '2026-09-05 01:33:29', '2026-09-05 21:22:34');

-- --------------------------------------------------------

--
-- Table structure for table `animal_embeddings`
--

CREATE TABLE `animal_embeddings` (
  `animal_id` int(11) NOT NULL,
  `embedding` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`embedding`)),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `model_name` varchar(100) DEFAULT 'paraphrase-multilingual-MiniLM-L12-v2'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animal_embeddings`
--

INSERT INTO `animal_embeddings` (`animal_id`, `embedding`, `updated_at`, `model_name`) VALUES
(27, '[0.3689751923084259,-0.06379503011703491,-0.10236383974552155,0.2329506129026413,-0.2922632098197937,-0.15730096399784088,0.2272602617740631,0.08779662847518921,0.09726376086473465,0.049915753304958344,0.13953952491283417,-0.09414749592542648,-0.04766877368092537,0.12399017810821533,-0.08253137022256851,-0.0824383944272995,0.2623871862888336,-0.24943126738071442,0.22124704718589783,-0.05928175151348114,-0.23699766397476196,-0.17028681933879852,0.054499998688697815,0.019420918077230453,-0.7437053918838501,-0.23875059187412262,-0.12072619795799255,0.02908436208963394,0.12319421023130417,0.12402299046516418,0.10794368386268616,-0.09144188463687897,0.14646519720554352,-0.19205878674983978,-0.4521057903766632,0.26256781816482544,0.13018304109573364,-0.5094770789146423,-0.26773521304130554,-0.015916984528303146,0.2196810245513916,-0.03712815046310425,0.3859725296497345,-0.15509344637393951,-0.2250141054391861,-0.028149845078587532,-0.35348349809646606,-0.17251382768154144,-0.12314005941152573,-0.1304682493209839,0.09766514599323273,-0.02556372806429863,0.15008936822414398,0.08794988691806793,0.2448025345802307,0.37808236479759216,0.30203792452812195,0.28472718596458435,-0.19884474575519562,0.06351582705974579,0.23741546273231506,0.12961935997009277,-0.1716068536043167,0.2147069126367569,0.04331415519118309,-0.1399238556623459,-0.24520070850849152,-0.010531154461205006,-0.2609919309616089,-0.07451280951499939,0.11727136373519897,0.04610690847039223,-0.004599991254508495,-0.01904323138296604,0.0625053197145462,-0.056653689593076706,-0.052434176206588745,-0.16018308699131012,0.197072833776474,0.12201139330863953,0.00025306185125373304,0.09793397784233093,0.09298069775104523,0.06996188312768936,0.05071205645799637,0.28335681557655334,0.1790090948343277,-0.1948925256729126,-0.4308159649372101,0.2597865164279938,0.12898994982242584,0.392778605222702,0.16528934240341187,-0.20818772912025452,0.005114156287163496,0.1800984889268875,0.005895122420042753,-0.1336592733860016,-0.6987394094467163,0.21769650280475616,0.08398488163948059,0.1826358288526535,-0.13435499370098114,-0.21346862614154816,0.012489914894104004,0.20785510540008545,-0.09778446704149246,-0.3849216401576996,-0.31868845224380493,0.24683304131031036,-0.10834909975528717,0.12161561846733093,-0.16761432588100433,0.09681148082017899,-0.04422687739133835,-0.04960475116968155,-0.5055302381515503,-0.052879899740219116,0.6029398441314697,0.13448794186115265,0.40841472148895264,-0.118568055331707,-0.08258695155382156,-0.13288849592208862,0.45108726620674133,-0.11302213370800018,0.23408427834510803,0.5143104195594788,-0.14291216433048248,-0.0888715609908104,0.1279228925704956,0.0473724864423275,-0.10192617028951645,-0.06786009669303894,0.22960719466209412,0.2768998444080353,-0.08656518161296844,-0.15830126404762268,-0.12237294763326645,0.11618920415639877,0.3193378746509552,-0.00012166074884589761,0.023869860917329788,0.01529422402381897,-0.02632242627441883,0.15760990977287292,0.0598728209733963,0.09445865452289581,0.04095424339175224,0.32516083121299744,0.18093590438365936,-0.22550080716609955,0.329438716173172,-0.21652637422084808,-0.10435857623815536,-0.128401979804039,-0.13354972004890442,0.06263387948274612,0.229654923081398,-0.12621858716011047,-0.4391357898712158,-0.007832219824194908,-0.03184105083346367,0.047962088137865067,-0.2374572604894638,-0.1424834132194519,-0.001980960601940751,-0.056640930473804474,0.4683816730976105,-0.14075323939323425,-0.016553325578570366,0.2142113596200943,0.12857972085475922,0.09764696657657623,-0.2501264810562134,-0.5778526663780212,-0.3958412706851959,0.16727757453918457,-0.04650880768895149,-0.07633026689291,0.20397290587425232,0.34433239698410034,-0.0883740559220314,-0.1476743370294571,-0.29356351494789124,0.18582451343536377,-0.32142210006713867,0.040555596351623535,0.24850578606128693,-0.207953080534935,0.2190493792295456,-0.3104208707809448,0.5400254726409912,-0.21397648751735687,-0.027554068714380264,0.02389419637620449,0.04576384276151657,0.08071116358041763,0.19072671234607697,0.007498389575630426,0.16483764350414276,-0.36092910170555115,0.15570196509361267,-0.10539557039737701,0.05374841019511223,-0.06865788251161575,0.14516468346118927,0.03636535257101059,0.23204141855239868,-0.03313835337758064,-0.1580803245306015,-0.06347881257534027,-0.29823991656303406,-0.12908935546875,-0.07131245732307434,0.18501393496990204,-0.045316677540540695,0.09857795387506485,0.5778216123580933,-0.20371520519256592,0.09852488338947296,0.19794127345085144,-0.1543797254562378,-0.09591126441955566,0.012294715270400047,-0.21242892742156982,0.0985901802778244,0.002828187309205532,-0.5113722681999207,0.24381692707538605,-0.2525869607925415,-0.14261628687381744,-0.1502283215522766,-0.029812682420015335,-0.20594513416290283,0.042204178869724274,0.4531117379665375,0.33443307876586914,0.3531552255153656,0.45398014783859253,-0.0049644154496490955,-0.3194137513637543,-0.12618699669837952,-0.007034376263618469,-0.044956669211387634,0.1760510951280594,-0.09714489430189133,0.4736762046813965,-0.1698700338602066,0.08094891160726547,0.02310837060213089,-0.4892962574958801,0.02826426364481449,-0.0314028300344944,0.1247379258275032,-0.4359002113342285,-0.04484270140528679,0.2603974938392639,-0.011914722621440887,0.1905984729528427,-0.09894703328609467,0.22489705681800842,0.043394509702920914,0.06860572844743729,0.1487545371055603,-0.22447218000888824,-0.0370766818523407,0.05267564207315445,0.39660754799842834,0.18226511776447296,-0.1374209225177765,-0.0256589837372303,-0.12421153485774994,0.05180846154689789,0.16435328125953674,-0.26331183314323425,0.009504087269306183,-0.13427898287773132,0.1541397124528885,0.15535220503807068,-0.31053972244262695,0.08710134774446487,-0.12348654866218567,0.3680504560470581,-0.15677312016487122,0.139764666557312,-0.10083937644958496,0.15160585939884186,-0.06006566435098648,-0.49326738715171814,-0.23920758068561554,-0.10530974715948105,-0.07454327493906021,-0.06761123985052109,0.12204626947641373,0.20809364318847656,0.2993527054786682,-0.13614320755004883,-0.09298615157604218,-0.006528311409056187,0.33173176646232605,-0.4353600740432739,0.14220264554023743,0.30453526973724365,-0.31611889600753784,0.2830655872821808,-0.0390421561896801,-0.3817562758922577,-0.3250158727169037,-0.3046976625919342,-0.3211175799369812,0.13444803655147552,0.12700489163398743,-0.25102221965789795,0.09405183047056198,0.39453789591789246,-0.33692532777786255,-0.2573404610157013,0.020463429391384125,-0.09999363124370575,0.1085292249917984,-0.017275121062994003,-0.3926856219768524,0.17447184026241302,-0.07885168492794037,-0.054077938199043274,-0.047158557921648026,-0.44359055161476135,-0.2127658575773239,0.0188150592148304,0.13073837757110596,-0.15644961595535278,0.04121937230229378,-0.04330473765730858,0.059772636741399765,0.000606479006819427,-0.07533702254295349,-0.05925983935594559,-0.21987903118133545,-0.004366248846054077,-0.0898325964808464,-0.09759794175624847,0.14737291634082794,-0.18793834745883942,-0.4369591474533081,0.0917399451136589,-0.1057940274477005,-0.2373756319284439,-0.012378966435790062,0.14129363000392914,-0.10118333250284195,0.21000532805919647,-0.3091272711753845,0.1607498675584793,0.2845100462436676,0.09929940849542618,-0.07616148144006729,-0.20673994719982147,-0.07716662436723709,0.007567437365651131,0.6183202266693115,0.2850486934185028,0.03845911845564842,-0.009568615816533566,-0.007893244735896587,0.2067670375108719,0.3160853385925293,-0.20434801280498505,0.06650038808584213,-0.17908868193626404,-0.23722541332244873,0.017926733940839767,-0.31676721572875977,0.3726355731487274,-0.2941451966762543,0.29328101873397827,0.08107873052358627,-0.08576852083206177,0.12908397614955902,0.33355680108070374,0.16988812386989594,0.011325748637318611,0.24797970056533813,0.38890910148620605]', '2026-09-08 04:26:23', 'paraphrase-multilingual-MiniLM-L12-v2'),
(28, '[0.40918785333633423,0.012129012495279312,-0.10316828638315201,0.15220698714256287,-0.2194141149520874,-0.18119242787361145,0.21124453842639923,0.10632120817899704,0.048377491533756256,0.0008080675033852458,0.14725849032402039,-0.06955685466527939,-0.013617908582091331,0.2362605780363083,-0.08067568391561508,-0.03584258630871773,0.2703208923339844,-0.21521839499473572,0.19418330490589142,-0.04531776160001755,-0.3039862811565399,-0.1540825068950653,0.10481759160757065,0.04011046513915062,-0.7991877794265747,-0.26844605803489685,-0.08762843161821365,-0.001146806636825204,0.13155095279216766,0.12418738007545471,0.1083771213889122,-0.11129046231508255,0.17374415695667267,-0.14012719690799713,-0.4033956229686737,0.2994665801525116,0.1417568176984787,-0.47922906279563904,-0.31240877509117126,0.005449434742331505,0.2308182716369629,-0.020508568733930588,0.3293989896774292,-0.1799326241016388,-0.15335412323474884,-0.06018967181444168,-0.35402366518974304,-0.15361399948596954,-0.22232012450695038,-0.10745285451412201,0.08322940766811371,0.003933703061193228,0.10997891426086426,0.05307615548372269,0.24623258411884308,0.4026592969894409,0.2543462812900543,0.25322121381759644,-0.133392795920372,0.035064321011304855,0.21080048382282257,0.0353025421500206,-0.18269379436969757,0.2621762454509735,0.14818213880062103,-0.040125492960214615,-0.26026400923728943,-0.06290697306394577,-0.2927968204021454,-0.09185586869716644,0.12487191706895828,0.022636722773313522,0.1013721227645874,0.009306325577199459,0.12400684505701065,-0.07893624156713486,-0.014736001379787922,-0.14741645753383636,0.15894587337970734,0.1278793066740036,-0.01805037446320057,0.1756969839334488,0.1163320392370224,0.00530977314338088,-0.01922440342605114,0.2848305106163025,0.1782924383878708,-0.16125766932964325,-0.491885781288147,0.27806025743484497,0.10815001279115677,0.38511282205581665,0.14898334443569183,-0.18498365581035614,-0.0422399528324604,0.15728920698165894,0.07463930547237396,-0.08641741424798965,-0.67149418592453,0.24580666422843933,0.2504517138004303,0.1818697601556778,-0.20752210915088654,-0.28385740518569946,0.02865235134959221,0.26180288195610046,-0.10887247323989868,-0.5050548315048218,-0.3098808825016022,0.2314728945493698,-0.15368548035621643,0.10458239167928696,-0.11269525438547134,0.10222526639699936,-0.07389085739850998,-0.10339894890785217,-0.4888017177581787,0.00024098227731883526,0.6376428008079529,0.0354900136590004,0.4512330889701843,-0.1167907863855362,0.0011524873552843928,-0.1278032511472702,0.520553469657898,-0.051939912140369415,0.22488506138324738,0.4350196421146393,-0.1105479970574379,-0.05608358979225159,0.11517909914255142,-0.05543052405118942,-0.11388732492923737,-0.08640701323747635,0.19750359654426575,0.254160076379776,-0.1719658523797989,-0.09491562843322754,-0.06745565682649612,0.015952665358781815,0.24873924255371094,-0.08216913044452667,-0.03982805460691452,0.02776210382580757,-0.009689994156360626,0.12789858877658844,-0.007513287477195263,0.1148223727941513,-0.012276996858417988,0.31020674109458923,0.10942069441080093,-0.17823141813278198,0.27641135454177856,-0.2941132187843323,-0.08952469378709793,-0.15359564125537872,-0.02263566106557846,0.036211371421813965,0.15483775734901428,-0.0638018473982811,-0.38662266731262207,-0.05894527584314346,-0.041013527661561966,0.07435692846775055,-0.2173825055360794,-0.18308451771736145,-0.08574935048818588,-0.10800260305404663,0.45192959904670715,-0.0021350369788706303,0.04745952785015106,0.214588925242424,0.164134681224823,0.14106957614421844,-0.31981170177459717,-0.5497386455535889,-0.4292408525943756,0.1476437896490097,-0.13791801035404205,-0.10193684697151184,0.23307804763317108,0.347816526889801,-0.14049041271209717,-0.1336822807788849,-0.28746190667152405,0.2204989194869995,-0.346767783164978,0.01707666926085949,0.17657214403152466,-0.3306512236595154,0.23538173735141754,-0.455740362405777,0.5670098066329956,-0.21361784636974335,-0.10856770724058151,-0.02309579774737358,0.13541992008686066,0.01236471813172102,0.06674280762672424,0.0909038707613945,0.20623096823692322,-0.22700749337673187,0.1797514110803604,-0.1207234337925911,0.03843894228339195,0.0002739198098424822,0.20155374705791473,0.03056374192237854,0.2143251746892929,0.07119152694940567,-0.20794248580932617,-0.00013602341641671956,-0.28251272439956665,-0.20084793865680695,-0.028475690633058548,0.26791349053382874,0.0185871422290802,0.16309808194637299,0.522948145866394,-0.17877930402755737,0.17891326546669006,0.14064259827136993,-0.15911197662353516,-0.10936523973941803,0.04356846958398819,-0.21831610798835754,0.03256993368268013,0.04526114836335182,-0.5216613411903381,0.27124273777008057,-0.16229477524757385,-0.1327691376209259,-0.17555904388427734,0.018943948671221733,-0.16718612611293793,0.00016368276556022465,0.5311192274093628,0.2671479880809784,0.43122145533561707,0.5362735986709595,-0.0013150403974577785,-0.3149598240852356,-0.13912774622440338,0.01992630586028099,-0.0055143749341368675,0.21901977062225342,-0.08450055122375488,0.41234293580055237,-0.16018444299697876,0.07908403873443604,-0.05626465380191803,-0.4608703553676605,0.003840278135612607,-0.024032095447182655,0.245693176984787,-0.37676188349723816,-0.12567681074142456,0.2251822054386139,-0.010140448808670044,0.09120205789804459,-0.12210103124380112,0.15201321244239807,0.0013194322818890214,0.18378569185733795,0.13700726628303528,-0.17164774239063263,-0.13194264471530914,-0.009629438631236553,0.38425594568252563,0.13520503044128418,-0.10747615247964859,-0.05228578299283981,-0.16808728873729706,0.018159151077270508,0.0439496748149395,-0.24510826170444489,-0.012617130763828754,-0.07229599356651306,0.1593119204044342,0.10918237268924713,-0.3254989683628082,0.08392547070980072,-0.13311904668807983,0.39333972334861755,-0.19416463375091553,0.061713382601737976,-0.12011680752038956,0.008353169076144695,-0.08657365292310715,-0.45082226395606995,-0.3443130552768707,-0.0868329405784607,-0.09859171509742737,-0.08250672370195389,0.1315087527036667,0.19248487055301666,0.43313074111938477,-0.05883610621094704,0.0177848469465971,-0.010377292521297932,0.3573310375213623,-0.44073858857154846,0.180160254240036,0.3121955990791321,-0.2552298903465271,0.2374940812587738,-0.09811259061098099,-0.2776544392108917,-0.33557432889938354,-0.3541390895843506,-0.2632001042366028,0.11880704015493393,0.14100997149944305,-0.27351561188697815,0.15612731873989105,0.38223445415496826,-0.3121066689491272,-0.2727595269680023,0.005738444626331329,-0.07181050628423691,0.08536537736654282,-0.12421825528144836,-0.511417031288147,0.26240620017051697,-0.07005578279495239,-0.004187325015664101,-0.09969141334295273,-0.48025432229042053,-0.2391785979270935,-0.059340544044971466,0.1508571356534958,-0.2320905178785324,-0.08198245614767075,-0.08631870150566101,0.019897349178791046,0.010632554069161415,-0.07088617235422134,-0.030974414199590683,-0.23091468214988708,0.06443935632705688,-0.057426340878009796,-0.1419937163591385,0.1039828434586525,-0.12143971025943756,-0.30479466915130615,0.058487746864557266,-0.15241657197475433,-0.2631671130657196,0.00738832401111722,0.08455922454595566,-0.16324175894260406,0.2713276445865631,-0.27572935819625854,0.14867882430553436,0.322862446308136,0.10409951955080032,-0.01603741943836212,-0.2046942263841629,0.008098644204437733,0.06118522956967354,0.6718124151229858,0.23785820603370667,-0.08066350966691971,0.027858629822731018,0.03040960803627968,0.23221224546432495,0.4755288064479828,-0.15345172584056854,0.08255253732204437,-0.25744327902793884,-0.20047594606876373,0.059786029160022736,-0.2778469920158386,0.37827521562576294,-0.3043068051338196,0.2341688722372055,0.10258827358484268,-0.11637856811285019,0.1330147534608841,0.37622717022895813,0.10189148038625717,0.1159292459487915,0.27486997842788696,0.4186534285545349]', '2026-09-08 04:25:50', 'paraphrase-multilingual-MiniLM-L12-v2'),
(29, '[0.45641446113586426,0.06152653321623802,-0.0754317045211792,0.19443249702453613,-0.18430061638355255,-0.21321441233158112,0.0283215269446373,0.11535247415304184,0.18512499332427979,-0.11722323298454285,0.23879572749137878,0.08264130353927612,0.028954297304153442,0.09291355311870575,0.018461788073182106,-0.09948712587356567,0.205706387758255,-0.18239763379096985,0.1342739760875702,-0.041647639125585556,-0.26810428500175476,-0.17170748114585876,0.13504861295223236,0.01640576496720314,-0.6775479316711426,-0.2289179414510727,-0.05496147274971008,-0.053441595286130905,0.12245041131973267,0.08793571591377258,0.10143277049064636,-0.20117156207561493,0.19732345640659332,-0.17172865569591522,-0.26771754026412964,0.26152291893959045,0.08039779216051102,-0.25060251355171204,-0.2515439987182617,0.10925742983818054,0.23213006556034088,-0.006309656426310539,0.2352038472890854,-0.1130840927362442,-0.21735349297523499,-0.11537676304578781,-0.41164693236351013,-0.1936831921339035,-0.28165850043296814,-0.1849168986082077,0.03259760141372681,0.06852147728204727,0.07964766025543213,-0.04145132005214691,0.26554322242736816,0.31561756134033203,0.2961726486682892,0.18525980412960052,-0.2101159393787384,0.11580879986286163,0.1727873980998993,0.0964876264333725,-0.23027768731117249,0.18316665291786194,0.22871573269367218,0.032670844346284866,-0.18136967718601227,-0.05871941149234772,-0.11773483455181122,0.08031211793422699,0.12270896881818771,0.031345997005701065,-0.09633532911539078,0.04260948300361633,0.12262188643217087,0.004821631126105785,-0.019594823941588402,-0.03576336055994034,0.19660186767578125,0.04825296252965927,0.06172788515686989,0.22084319591522217,0.05107168108224869,0.009033960290253162,-0.004746881313621998,0.28604909777641296,0.14936643838882446,-0.09308470785617828,-0.4940180778503418,0.1905757188796997,0.1208774670958519,0.257790207862854,0.10471761226654053,-0.1040906235575676,-0.08136521279811859,0.17798449099063873,0.05421951413154602,-0.03828926384449005,-0.5907812118530273,0.2079419046640396,0.2201516181230545,0.1886691451072693,-0.20281633734703064,-0.17112573981285095,0.12881456315517426,0.25026988983154297,-0.09396305680274963,-0.5894653797149658,-0.36539486050605774,0.29069429636001587,-0.17603322863578796,0.10119354724884033,-0.1410287469625473,0.09566569328308105,-0.046837106347084045,-0.08029299229383469,-0.40188920497894287,-0.03293709456920624,0.49512234330177307,0.13794094324111938,0.2849802076816559,-0.17405395209789276,-0.03849317133426666,-0.16779060661792755,0.4321204721927643,-0.021039113402366638,0.09251517057418823,0.3673665225505829,-0.04912954196333885,-0.07766608148813248,0.051554951816797256,-0.10042990744113922,-0.02907513454556465,-0.12521052360534668,0.2347584068775177,0.1413223296403885,-0.015253057703375816,-0.036525607109069824,-0.11206706613302231,-0.040410466492176056,0.2452283501625061,-0.09003330767154694,-0.05247115343809128,0.13610194623470306,0.037374790757894516,0.17784196138381958,0.012265568599104881,0.12614195048809052,-0.055357880890369415,0.09941668063402176,0.13494431972503662,-0.18745756149291992,0.3344203531742096,-0.3584328889846802,-0.09037062525749207,-0.23456908762454987,-0.11056527495384216,0.08523108810186386,0.05183706805109978,-0.05400705710053444,-0.41995319724082947,-0.053009018301963806,-0.101054348051548,0.06344130635261536,-0.07763973623514175,-0.14840067923069,-0.1832563728094101,-0.21889299154281616,0.3272307813167572,0.01869736798107624,-0.01993374153971672,0.10974474996328354,0.1421998143196106,0.12975788116455078,-0.24375349283218384,-0.4552450478076935,-0.5202463865280151,0.1764010787010193,-0.14761501550674438,-0.07840175926685333,0.16283616423606873,0.306622713804245,-0.20439347624778748,-0.1523112654685974,-0.20413878560066223,0.08374674618244171,-0.2016313374042511,0.03266093134880066,0.14392754435539246,-0.3138812780380249,0.10474845767021179,-0.3483346998691559,0.6002227663993835,-0.1433452069759369,-0.23383741080760956,0.0378972664475441,0.1784466654062271,-0.06424138695001602,0.014060734771192074,0.103897824883461,0.033446572721004486,-0.34153181314468384,0.16176103055477142,-0.023354865610599518,-0.011447664350271225,-0.08468948304653168,0.2755242586135864,-0.11149349063634872,0.3162851333618164,0.18577292561531067,-0.23216776549816132,0.20046907663345337,-0.23964974284172058,-0.21981775760650635,-0.05787498503923416,0.15246184170246124,-0.098992258310318,0.25710058212280273,0.4430901110172272,-0.03897428885102272,0.2168198525905609,0.07927528023719788,-0.057851411402225494,-0.15424035489559174,0.03482162579894066,-0.14841052889823914,0.12380935996770859,-0.009650775231420994,-0.43756231665611267,0.31867024302482605,-0.011340533383190632,-0.07469847798347473,-0.1460779905319214,0.05900471284985542,-0.34646010398864746,0.013924465514719486,0.4193025529384613,0.20326825976371765,0.46936723589897156,0.4606892764568329,0.014028134755790234,-0.2135973423719406,-0.13731983304023743,0.05514500290155411,-0.020359447225928307,0.1806478053331375,-0.11606722325086594,0.3402721881866455,-0.14037027955055237,0.11494632065296173,-0.031652502715587616,-0.3205621540546417,-0.09874537587165833,-0.0692381039261818,0.10831908881664276,-0.3857420086860657,-0.10951826721429825,0.1941438913345337,0.08126015216112137,0.22682291269302368,-0.05760867893695831,0.18775567412376404,-0.05218500643968582,0.19339968264102936,0.049632154405117035,-0.13491694629192352,-0.03939886763691902,-0.12604789435863495,0.33935821056365967,0.11143238842487335,-0.08691338449716568,-0.030589664354920387,-0.1736520230770111,0.0441853329539299,0.10762298107147217,-0.19213220477104187,-0.017768891528248787,0.03129560500383377,0.03290265426039696,0.1456049680709839,-0.43320339918136597,0.09325401484966278,0.05608212202787399,0.4148135483264923,-0.05716557800769806,0.07131172716617584,-0.27106478810310364,-0.0027600943576544523,-0.06500617414712906,-0.3710769712924957,-0.36987170577049255,0.003438544226810336,0.03834257647395134,-0.143155038356781,0.0726398229598999,0.2409450262784958,0.2859426736831665,-0.0864301547408104,-0.07953985780477524,-0.035601913928985596,0.27478960156440735,-0.5002825856208801,0.10536883771419525,0.26409777998924255,-0.15809881687164307,0.20128417015075684,-0.06193806231021881,-0.1811365783214569,-0.3192152678966522,-0.15493245422840118,-0.18927375972270966,0.043870776891708374,0.12323348224163055,-0.25009530782699585,-0.02210211008787155,0.3907131552696228,-0.13150064647197723,-0.2903941869735718,0.01539040170609951,-0.1984889805316925,0.13283196091651917,-0.002903440035879612,-0.2719455659389496,0.29511672258377075,0.04033279791474342,-0.029297243803739548,-0.17609021067619324,-0.31573399901390076,-0.2726488411426544,0.027720054611563683,-0.035987772047519684,-0.17169038951396942,0.04455075040459633,-0.11983861029148102,0.0066781737841665745,0.08520125597715378,0.0695437416434288,-0.12821298837661743,-0.22942744195461273,0.012283677235245705,-0.08142370730638504,-0.12194419652223587,0.10769270360469818,0.08693103492259979,-0.26651403307914734,-0.09956564754247665,-0.05130941793322563,-0.08479844033718109,0.022313544526696205,0.12643562257289886,-0.20144063234329224,0.2193508893251419,-0.1977786421775818,0.25185129046440125,0.2823486924171448,0.027680443599820137,-0.03297586739063263,-0.15448206663131714,-0.0066240401938557625,-0.001082944916561246,0.4898759722709656,0.12477482110261917,-0.10399580746889114,0.16943517327308655,0.06071321666240692,0.1706937551498413,0.34615209698677063,-0.289354145526886,0.03616953268647194,-0.3395988941192627,-0.13296368718147278,-0.047319408506155014,-0.20399175584316254,0.405611127614975,-0.16092409193515778,0.1793072521686554,0.05400567874312401,-0.11228642612695694,0.12082003057003021,0.39914289116859436,0.016487538814544678,0.1406845599412918,0.2386266142129898,0.42643240094184875]', '2026-09-08 04:24:44', 'paraphrase-multilingual-MiniLM-L12-v2'),
(30, '[0.39774030447006226,-0.09371278434991837,-0.1665419638156891,0.2376037836074829,-0.2658419907093048,-0.2710309624671936,0.17392498254776,0.02704686112701893,0.10951846092939377,0.058182574808597565,0.14641085267066956,0.13842536509037018,-0.08182743191719055,-0.008720328100025654,-0.0028408190701156855,-0.09614147990942001,0.2166881412267685,-0.16670702397823334,0.09365177154541016,-0.07678092271089554,-0.23842768371105194,-0.19102145731449127,0.014157479628920555,0.10408180952072144,-0.7780270576477051,-0.3121787905693054,-0.12936396896839142,-0.06423264741897583,0.09128119051456451,0.034399762749671936,0.05725257098674774,-0.20105111598968506,0.13430723547935486,-0.26618364453315735,-0.44654837250709534,0.20504865050315857,0.12163052707910538,-0.4388256371021271,-0.14682447910308838,0.03807147964835167,0.1886797398328781,-0.09431945532560349,0.351531445980072,-0.2163519561290741,-0.27146515250205994,-0.02257492206990719,-0.3720635771751404,-0.125813290476799,-0.3031638562679291,-0.19442515075206757,0.0469856821000576,-0.08928509056568146,0.13335904479026794,-0.1149708703160286,0.26507729291915894,0.22941191494464874,0.3125621974468231,0.35096651315689087,-0.13068637251853943,0.04574619606137276,0.22641761600971222,0.21267592906951904,-0.045628517866134644,0.12894396483898163,0.1763102263212204,-0.18946370482444763,-0.22395320236682892,0.16472311317920685,-0.21350808441638947,0.049718670547008514,0.14110317826271057,0.004524371586740017,0.00040616124169901013,-0.032110944390296936,0.1332818865776062,-0.08235429972410202,-0.11568906158208847,-0.13751257956027985,0.2394559383392334,0.061620112508535385,0.05865148827433586,0.2401704341173172,0.04484138637781143,-0.023002294823527336,0.10347728431224823,0.2613236606121063,0.1673913449048996,-0.21207910776138306,-0.2654300928115845,0.3011922836303711,0.14453360438346863,0.3185103237628937,0.21496576070785522,-0.20567375421524048,0.022139184176921844,0.132539764046669,-0.04724198579788208,-0.1379627138376236,-0.6278715133666992,0.2203904539346695,0.014949389733374119,0.16970811784267426,-0.23437874019145966,-0.07939297705888748,0.10761093348264694,0.10459455847740173,-0.04153978452086449,-0.37194937467575073,-0.440520703792572,0.32061776518821716,-0.11039326339960098,0.05534054711461067,-0.2721060812473297,0.05584605038166046,0.030925339087843895,-0.047867294400930405,-0.47008293867111206,-0.1226881742477417,0.3529926836490631,0.11208309233188629,0.3863302767276764,-0.2204277515411377,-0.1340477019548416,-0.1273772269487381,0.45873427391052246,0.1294739991426468,0.1542849987745285,0.38900744915008545,-0.1336987018585205,-0.18552716076374054,0.07910097390413284,0.018158841878175735,-0.06337875127792358,-0.15446969866752625,0.23512206971645355,0.2619793713092804,-0.08821174502372742,-0.12957324087619781,-0.06476879119873047,0.11684577912092209,0.2761767506599426,0.02219047211110592,0.14838610589504242,0.04336859658360481,-0.033618684858083725,0.11393686383962631,0.1622462123632431,0.07805892825126648,0.09929820895195007,0.23786264657974243,0.15187117457389832,-0.20178499817848206,0.3011893928050995,-0.10999544709920883,-0.1285361796617508,-0.1261819750070572,-0.16499057412147522,0.03521771356463432,0.255352646112442,-0.08722534030675888,-0.4387536644935608,0.13073089718818665,0.035704370588064194,0.005248710047453642,-0.02304016798734665,-0.1146746277809143,-0.020223179832100868,-0.057635754346847534,0.5103954076766968,-0.14535367488861084,-0.04132893681526184,0.24558250606060028,0.05469497665762901,0.0807669460773468,-0.22780285775661469,-0.5113904476165771,-0.49281543493270874,0.22281110286712646,-0.039340756833553314,-0.06682311743497849,0.27777013182640076,0.23547238111495972,0.045948710292577744,-0.0977277159690857,-0.25147292017936707,0.06322922557592392,-0.23628643155097961,0.0048643904738128185,0.24056518077850342,-0.16862426698207855,0.17001473903656006,-0.1221003606915474,0.5387246608734131,-0.17778895795345306,-0.0843513235449791,0.03560065105557442,0.014592327177524567,0.009374750778079033,0.07464449852705002,0.013354121707379818,-0.007321884855628014,-0.39258649945259094,0.10329227149486542,-0.07130608707666397,-0.04153929650783539,-0.08932050317525864,0.21311965584754944,0.008547553792595863,0.16276584565639496,-0.026778988540172577,-0.14318089187145233,0.029975293204188347,-0.26862525939941406,-0.11827006936073303,-0.025043068453669548,0.10298089683055878,-0.11393793672323227,0.23960810899734497,0.6059485077857971,-0.1327466368675232,0.01430351473391056,0.23603379726409912,-0.048556603491306305,-0.03802044317126274,-0.1274571716785431,-0.14613156020641327,0.1624424010515213,-0.006832911632955074,-0.4743368923664093,0.29927685856819153,-0.1923159658908844,-0.11310284584760666,-0.23044951260089874,-0.026597967371344566,-0.3386978805065155,-0.002012077020481229,0.33972904086112976,0.404634565114975,0.3829481601715088,0.2606569826602936,0.07910265028476715,-0.18128107488155365,-0.25390446186065674,-0.10671988874673843,-0.024687612429261208,0.27299582958221436,-0.06675403565168381,0.3347349762916565,-0.12969690561294556,0.06680849194526672,0.07250520586967468,-0.3654506504535675,0.027045834809541702,-0.06273209303617477,0.1199706494808197,-0.3679392337799072,0.02112942561507225,0.2428102046251297,0.014946931973099709,0.2872447669506073,-0.1330207884311676,0.20192112028598785,0.018613070249557495,0.08770279586315155,0.11441369354724884,-0.17231719195842743,-0.037915438413619995,-0.050358857959508896,0.33559826016426086,0.28014683723449707,-0.1956924945116043,-0.02513413317501545,-0.12758053839206696,0.10728732496500015,0.145823672413826,-0.28258880972862244,0.029427042230963707,-0.09172721952199936,0.04025660455226898,0.12884829938411713,-0.28023597598075867,0.15493470430374146,-0.07810778170824051,0.41514870524406433,-0.05313390865921974,0.17563989758491516,-0.17711450159549713,0.10142721980810165,-0.06695566326379776,-0.4847820997238159,-0.2959224581718445,-0.09622307121753693,0.12820039689540863,-0.004789311438798904,0.2756122946739197,0.28267884254455566,0.23316435515880585,-0.11282903701066971,-0.1613473892211914,-0.12927481532096863,0.3866032660007477,-0.3944742679595947,0.131536066532135,0.22130364179611206,-0.3027659058570862,0.23768238723278046,-0.013517173938453197,-0.3954239785671234,-0.3821144104003906,-0.20130708813667297,-0.19006900489330292,0.10894840955734253,0.06179128959774971,-0.31661078333854675,0.006108167581260204,0.20434364676475525,-0.26229429244995117,-0.2566416561603546,0.04578179866075516,-0.07362042367458344,0.06639420986175537,0.008768510073423386,-0.1405152529478073,0.32434189319610596,0.007953078486025333,0.08701629191637039,-0.17433296144008636,-0.35934728384017944,-0.22440889477729797,0.029115162789821625,0.05393122509121895,-0.11841315776109695,0.2809907793998718,-0.07391425222158432,0.15311460196971893,-0.007742874324321747,-0.04858528822660446,-0.14491204917430878,-0.11735984683036804,0.023133210837841034,-0.067350372672081,-0.10139197111129761,0.0691843256354332,-0.016271023079752922,-0.45703911781311035,-0.002851542318239808,-0.11547145992517471,-0.14967669546604156,-0.05289178714156151,0.09948988258838654,-0.13692736625671387,0.14531676471233368,-0.22613230347633362,0.16725365817546844,0.2850004732608795,0.10036752372980118,-0.25123414397239685,-0.22852706909179688,-0.0858941301703453,-0.03452831506729126,0.5254149436950684,0.1665492206811905,0.050850044935941696,0.09315285086631775,0.020285068079829216,0.238153338432312,0.23615296185016632,-0.2585495114326477,0.0705006942152977,-0.2214905172586441,-0.16533124446868896,0.02196635492146015,-0.28761711716651917,0.27016982436180115,-0.22412829101085663,0.2410293072462082,0.06031763181090355,0.005054634064435959,0.12530849874019623,0.42374804615974426,0.07464870810508728,0.0135530149564147,0.16978581249713898,0.375832200050354]', '2026-09-08 04:24:17', 'paraphrase-multilingual-MiniLM-L12-v2'),
(31, '[0.4128694534301758,-0.025685887783765793,-0.076090008020401,0.1982296258211136,-0.12202063947916031,-0.11696362495422363,0.0048979502171278,0.14609353244304657,0.19366207718849182,-0.07107870280742645,0.19954589009284973,0.14895832538604736,0.05179905518889427,0.16076265275478363,-0.14542549848556519,-0.08459710329771042,0.2545231282711029,-0.06190469488501549,0.006590023171156645,-0.01580917090177536,-0.40116316080093384,-0.17950069904327393,0.1238483339548111,0.12975135445594788,-0.7036988735198975,-0.1221284344792366,-0.17211440205574036,0.04469073563814163,0.06109834089875221,-0.0666840523481369,0.04494423791766167,-0.28621700406074524,0.04590021073818207,-0.21655064821243286,-0.3048734664916992,0.27016448974609375,0.11091801524162292,-0.28174111247062683,-0.27441075444221497,0.01870369352400303,0.07553119212388992,0.13186833262443542,0.27422064542770386,-0.12908168137073517,-0.13391193747520447,-0.0361168272793293,-0.233189195394516,-0.2671307325363159,-0.22568994760513306,-0.11779987066984177,0.05357377976179123,0.1259186863899231,0.1096130907535553,0.016104815527796745,0.2911053001880646,0.32518938183784485,0.250247985124588,0.3244236707687378,-0.11317575722932816,0.03201628848910332,0.23867756128311157,0.10446292161941528,-0.19136181473731995,0.13709348440170288,0.1763373613357544,-0.04848324880003929,-0.17640814185142517,-0.17304781079292297,-0.09514666348695755,0.051674988120794296,0.14246603846549988,0.12058243900537491,-0.017295511439442635,-0.12767578661441803,0.08136970549821854,-0.045897409319877625,-0.025647183880209923,-0.12846754491329193,0.22537362575531006,0.04131960868835449,0.11107894778251648,0.1645476520061493,0.003264849539846182,0.0831546038389206,0.002738158218562603,0.2678208351135254,0.17189759016036987,-0.0860329270362854,-0.4925899803638458,0.16286121308803558,0.27539610862731934,0.3944677710533142,0.1850479245185852,-0.07593193650245667,0.032076213508844376,0.2247604876756668,0.011342013254761696,-0.010028514079749584,-0.4970839023590088,0.19280016422271729,0.27750828862190247,0.11246229708194733,-0.22128771245479584,-0.17759917676448822,0.0813852846622467,0.15167272090911865,-0.06477944552898407,-0.4921470284461975,-0.4397590160369873,0.35753577947616577,-0.07034342736005783,0.15269427001476288,-0.1623864322900772,0.20313899219036102,0.025972329080104828,-0.020364992320537567,-0.4439328908920288,-0.04165012761950493,0.3986470103263855,0.1154632419347763,0.3556058704853058,-0.19837500154972076,0.050362225621938705,-0.17911048233509064,0.5178249478340149,-0.05222225561738014,0.13795600831508636,0.3807259202003479,-0.07006928324699402,-0.06694160401821136,0.10455313324928284,0.008281569927930832,-0.07835596799850464,-0.2474290430545807,0.14895661175251007,0.28817325830459595,-0.012248032726347446,-0.156259223818779,-0.11471777409315109,0.01549537107348442,0.2803911864757538,-0.15975096821784973,0.00465393578633666,0.08575917780399323,0.0064907860942184925,0.14048261940479279,0.07872423529624939,0.005396896507591009,0.03061378188431263,0.08554638922214508,0.07968802750110626,-0.20994062721729279,0.30151665210723877,-0.2631877660751343,0.017269622534513474,-0.09490299969911575,-0.18559500575065613,0.08589711040258408,0.03357032313942909,0.007337560411542654,-0.39285317063331604,-0.06004997715353966,-0.1793457269668579,-0.020808065310120583,-0.1667730212211609,-0.10914407670497894,-0.183987557888031,-0.23096974194049835,0.299172043800354,0.051609382033348083,-0.1333160549402237,0.11067305505275726,0.20169559121131897,0.00008167789201252162,-0.2333904504776001,-0.5460509657859802,-0.5345668196678162,0.12377849221229553,-0.08486286550760269,0.010548033751547337,0.2252524495124817,0.20112170279026031,-0.20339393615722656,-0.14213918149471283,-0.19965466856956482,0.1618117094039917,-0.27888739109039307,0.011016005650162697,0.26973891258239746,-0.20987363159656525,0.0890774205327034,-0.27085936069488525,0.5402292609214783,-0.1288616806268692,-0.17455385625362396,0.05467524752020836,0.07875825464725494,-0.03021313063800335,0.01661556586623192,0.11812639981508255,0.041709836572408676,-0.3778407573699951,0.17459885776042938,-0.12494295835494995,-0.10725991427898407,-0.07947515696287155,0.1037600040435791,-0.13598327338695526,0.21314512193202972,0.06099427863955498,-0.2188350409269333,0.12845392525196075,-0.12316388636827469,-0.21957892179489136,0.035858143121004105,0.20408150553703308,-0.156028613448143,0.22478124499320984,0.38828331232070923,-0.14819477498531342,0.2108648419380188,-0.016449259594082832,0.016554659232497215,-0.17512871325016022,-0.02013549953699112,-0.17936308681964874,0.1329713761806488,0.08637811988592148,-0.5153576135635376,0.2571921944618225,-0.14386047422885895,-0.03356388956308365,-0.23000559210777283,0.06052693352103233,-0.22782109677791595,0.04507243260741234,0.3070935904979706,0.28520336747169495,0.3730984032154083,0.38529306650161743,-0.07170046865940094,-0.2331787347793579,-0.10959238559007645,0.006525485310703516,-0.00150694465264678,0.1554308533668518,-0.0625091940164566,0.4843250811100006,-0.21478815376758575,0.20874184370040894,-0.08099610358476639,-0.32546743750572205,0.005621747579425573,-0.08534733206033707,0.10276113450527191,-0.2829340994358063,-0.1379854828119278,0.25220099091529846,0.03685114532709122,0.15099117159843445,-0.1466287523508072,0.19432432949543,-0.02816234715282917,0.3187682628631592,0.12116000801324844,-0.11574330925941467,-0.07145026326179504,-0.19597753882408142,0.36441922187805176,0.049791328608989716,-0.036580201238393784,-0.10224970430135727,-0.14233306050300598,-0.0037264360580593348,0.18124733865261078,-0.20481081306934357,-0.05169778689742088,0.04709520563483238,0.14078108966350555,0.16610942780971527,-0.33181020617485046,0.04061944782733917,-0.12937064468860626,0.37086474895477295,-0.10935775190591812,-0.0001688209013082087,-0.26254501938819885,0.08527687191963196,0.028331272304058075,-0.3252730965614319,-0.34142324328422546,0.006374384742230177,0.006884238217025995,-0.11869461089372635,0.11114229261875153,0.1795629858970642,0.27520015835762024,-0.07515978068113327,-0.130333811044693,-0.049296487122774124,0.16620300710201263,-0.48530441522598267,0.1088603138923645,0.44271761178970337,-0.1618475615978241,0.17084455490112305,-0.040474794805049896,-0.19880934059619904,-0.2667068839073181,-0.23684683442115784,-0.281694233417511,0.022844577208161354,0.09065365046262741,-0.11594861000776291,0.04278635233640671,0.37734442949295044,-0.13708645105361938,-0.3151976764202118,0.022291099652647972,-0.17970743775367737,0.09670375287532806,0.023467767983675003,-0.24177022278308868,0.28930938243865967,-0.07175809144973755,0.00408313749358058,-0.03439253941178322,-0.36812523007392883,-0.16356366872787476,-0.08839549869298935,-0.0018625418888404965,-0.13520124554634094,0.07851483672857285,-0.14409491419792175,0.03058711066842079,0.05496519058942795,-0.08908028155565262,-0.09764612466096878,-0.2229423224925995,-0.13042466342449188,0.025624502450227737,-0.14972391724586487,0.16377605497837067,-0.011379254050552845,-0.3518783450126648,0.03859267011284828,-0.09967980533838272,-0.10229391604661942,-0.14269287884235382,0.10288765281438828,-0.051582761108875275,0.1290917694568634,-0.1347932517528534,0.18097051978111267,0.22155235707759857,0.057683974504470825,0.15647245943546295,-0.03585245832800865,-0.02812016010284424,0.06374421715736389,0.4375874102115631,0.17460262775421143,-0.11375480145215988,0.19756750762462616,0.020642505958676338,0.18253836035728455,0.35390162467956543,-0.16344662010669708,0.008053610101342201,-0.3850269615650177,-0.06618769466876984,0.017981266602873802,-0.3054908812046051,0.3201892673969269,-0.23869405686855316,0.24051685631275177,0.07322783023118973,-0.006435083225369453,0.09020029008388519,0.2736383378505707,0.13490742444992065,0.14443013072013855,0.30762892961502075,0.38363298773765564]', '2026-09-08 04:23:48', 'paraphrase-multilingual-MiniLM-L12-v2'),
(32, '[0.47485876083374023,-0.00385245680809021,-0.12314260751008987,0.14918912947177887,-0.15055328607559204,-0.23316243290901184,0.0703909695148468,0.10258815437555313,0.19615215063095093,-0.08149868994951248,0.2024257481098175,0.07604534924030304,0.001503928448073566,0.2024277001619339,-0.05051806569099426,-0.07072914391756058,0.3191598355770111,-0.12471340596675873,0.1019163504242897,-0.03836667165160179,-0.3096977472305298,-0.15347424149513245,0.09082434326410294,0.06416308134794235,-0.7367159724235535,-0.20823711156845093,-0.11628738045692444,-0.02881935052573681,0.0037282072007656097,0.022757550701498985,0.0567166693508625,-0.26337793469429016,0.10560829937458038,-0.17177194356918335,-0.30808284878730774,0.2555898129940033,0.13638935983181,-0.3734484910964966,-0.25871482491493225,0.0447942353785038,0.19318877160549164,0.06100272759795189,0.27238351106643677,-0.15138790011405945,-0.17643840610980988,-0.0791158601641655,-0.34183740615844727,-0.15890640020370483,-0.27129918336868286,-0.17193983495235443,0.024232493713498116,0.023870229721069336,0.0668351799249649,-0.10606700927019119,0.14371760189533234,0.2571709156036377,0.21837478876113892,0.27064064145088196,-0.10925871133804321,-0.0033844837453216314,0.1954355537891388,0.08287130296230316,-0.1875033676624298,0.20808325707912445,0.24270449578762054,0.024409200996160507,-0.15234409272670746,-0.15049712359905243,-0.191831573843956,-0.03724035620689392,0.10451573133468628,0.039681799709796906,0.08355439454317093,-0.05785214155912399,0.14870469272136688,-0.025494078174233437,-0.06562941521406174,-0.03909720107913017,0.24376846849918365,0.010466513223946095,0.06645769625902176,0.33775970339775085,0.04407816380262375,0.0705459862947464,0.00808439776301384,0.26998862624168396,0.14912207424640656,-0.07180899381637573,-0.4858438968658447,0.2057705521583557,0.21310955286026,0.3065940737724304,0.08444269001483917,-0.13652338087558746,0.006388286128640175,0.14967529475688934,0.07196495682001114,-0.024126484990119934,-0.539341926574707,0.1888188272714615,0.32923609018325806,0.1321692168712616,-0.2977193593978882,-0.24041888117790222,0.11821164935827255,0.2841552793979645,-0.04423888772726059,-0.5660831928253174,-0.3940710425376892,0.33808064460754395,-0.1525682508945465,0.13081535696983337,-0.2083185315132141,0.10385158658027649,-0.01959500089287758,-0.0022262893617153168,-0.48412030935287476,0.03031611628830433,0.4591195285320282,0.08961299806833267,0.40946051478385925,-0.1589871644973755,-0.10193449258804321,-0.20417900383472443,0.5270636081695557,0.07350525259971619,0.19645467400550842,0.43145182728767395,-0.13275419175624847,-0.08450464904308319,0.06511490792036057,-0.05035822093486786,-0.1277599185705185,-0.18193300068378448,0.21095043420791626,0.2943844497203827,-0.07553913444280624,0.01027183048427105,-0.011694693006575108,0.01742512732744217,0.2115762084722519,-0.1698581725358963,-0.02561180852353573,0.1450963020324707,0.04081578552722931,0.12423989176750183,0.06699720770120621,0.09848979860544205,-0.020850686356425285,0.1007009893655777,0.13567377626895905,-0.17553044855594635,0.32992053031921387,-0.30393290519714355,-0.11908219754695892,-0.13341589272022247,-0.05761292949318886,0.00997923780232668,0.10348919034004211,0.026268266141414642,-0.42917126417160034,-0.007386757526546717,-0.11833301931619644,0.05651438608765602,-0.10559803992509842,-0.0893501490354538,-0.12942108511924744,-0.20147091150283813,0.30390214920043945,0.03949446231126785,-0.014487531036138535,0.19574019312858582,0.12700867652893066,0.040772147476673126,-0.276604562997818,-0.522875189781189,-0.5645842552185059,0.24318791925907135,-0.11576362699270248,-0.06529809534549713,0.2364974319934845,0.3437159061431885,-0.20664742588996887,-0.05129500478506088,-0.18826177716255188,0.12818588316440582,-0.2819500267505646,-0.04260850325226784,0.23384763300418854,-0.33764466643333435,0.12708021700382233,-0.3849804401397705,0.6021067500114441,-0.12056322395801544,-0.25741082429885864,0.03518672287464142,0.10284928232431412,-0.0008030377211980522,0.07036641240119934,0.11028242856264114,0.052708882838487625,-0.26897016167640686,0.12256543338298798,-0.07739901542663574,-0.01970367319881916,-0.03482450172305107,0.16849756240844727,-0.0043761227279901505,0.283989816904068,0.11526819318532944,-0.2226564735174179,0.1260218620300293,-0.254752516746521,-0.2765711545944214,0.018701892346143723,0.29469582438468933,-0.12021385133266449,0.2312108725309372,0.4911854863166809,-0.06391756981611252,0.19943858683109283,-0.00024184538051486015,-0.1279025673866272,-0.13208869099617004,-0.03508473187685013,-0.2440659999847412,0.07782620191574097,0.16659508645534515,-0.4863206148147583,0.30738914012908936,-0.03940841928124428,-0.08790194243192673,-0.2677669823169708,0.11729354411363602,-0.23204247653484344,0.014610896818339825,0.4620417058467865,0.2478329986333847,0.47687453031539917,0.3987083435058594,0.05267364904284477,-0.20406045019626617,-0.14907263219356537,0.06369585543870926,-0.04676169902086258,0.21209551393985748,-0.108341284096241,0.38886842131614685,-0.18912415206432343,0.12784302234649658,-0.09382759034633636,-0.3762175440788269,-0.08715838193893433,-0.08412095904350281,0.06391619890928268,-0.2794356346130371,-0.05448807030916214,0.1932186484336853,0.027517829090356827,0.18445198237895966,-0.12392102181911469,0.1654602587223053,-0.014296632260084152,0.30858343839645386,0.08339887857437134,-0.08557285368442535,-0.06667562574148178,-0.2491225004196167,0.33467647433280945,0.1066325381398201,-0.1083509773015976,-0.08828285336494446,-0.1936231553554535,-0.005666688550263643,0.054620809853076935,-0.21887217462062836,-0.005558086559176445,-0.006555479019880295,0.07229341566562653,0.15802942216396332,-0.36154139041900635,0.1396116018295288,-0.09342312812805176,0.44201934337615967,-0.09097015857696533,0.033952269703149796,-0.27409833669662476,0.026191117241978645,-0.042890507727861404,-0.41822028160095215,-0.3725815713405609,-0.0014389954740181565,0.07844436913728714,-0.07647639513015747,0.20779678225517273,0.15800654888153076,0.3620940148830414,-0.03954661265015602,-0.08362117409706116,-0.030319930985569954,0.3247961103916168,-0.5605788230895996,0.07512684911489487,0.315601646900177,-0.1089605912566185,0.15230117738246918,-0.09615509957075119,-0.16829919815063477,-0.3134041726589203,-0.22915871441364288,-0.2326100468635559,0.043675366789102554,0.14591509103775024,-0.17867806553840637,0.10769978910684586,0.4076993465423584,-0.16699261963367462,-0.2849382162094116,0.004218175075948238,-0.13327716290950775,0.026006212458014488,-0.11368444561958313,-0.21039631962776184,0.3574652671813965,-0.04299354553222656,-0.04042771831154823,-0.08327572792768478,-0.4249971807003021,-0.30588048696517944,-0.019585371017456055,0.03867443650960922,-0.23556184768676758,0.024145128205418587,-0.2286147028207779,0.04910518229007721,0.053026095032691956,-0.05901282653212547,-0.11596119403839111,-0.2402603179216385,0.02393886260688305,-0.04648527503013611,-0.15111099183559418,0.06887298077344894,-0.03473829850554466,-0.3034798800945282,-0.02093043550848961,-0.12211287021636963,-0.13873061537742615,-0.03977533429861069,0.026794688776135445,-0.19513152539730072,0.19834430515766144,-0.1612851619720459,0.18721090257167816,0.19037605822086334,0.024225814267992973,-0.026077084243297577,-0.0827493891119957,-0.024772753939032555,0.14560718834400177,0.47768479585647583,0.15275469422340393,-0.14814718067646027,0.15800078213214874,0.043682657182216644,0.26561886072158813,0.40821394324302673,-0.12316755950450897,0.02952725812792778,-0.2844204604625702,-0.04368186369538307,0.07963468134403229,-0.2993674576282501,0.36106938123703003,-0.25169676542282104,0.2941652834415436,0.11572441458702087,-0.12155161052942276,0.06080238148570061,0.3868695795536041,-0.04390573501586914,0.19407488405704498,0.22750309109687805,0.38954901695251465]', '2026-09-08 04:23:23', 'paraphrase-multilingual-MiniLM-L12-v2');
INSERT INTO `animal_embeddings` (`animal_id`, `embedding`, `updated_at`, `model_name`) VALUES
(33, '[0.3660373091697693,-0.0446394719183445,-0.021556317806243896,0.17210979759693146,-0.3686523139476776,-0.25918933749198914,0.2935623824596405,0.08152765780687332,0.05346063897013664,0.06229222193360329,0.1233816146850586,-0.08461230248212814,-0.049385931342840195,0.14482589066028595,-0.06234201788902283,-0.053602948784828186,0.25037550926208496,-0.19797563552856445,0.28388890624046326,-0.08569043129682541,-0.24043557047843933,-0.1393001675605774,0.08352287858724594,0.06876761466264725,-0.7502033114433289,-0.3027556240558624,-0.12963511049747467,0.002495930530130863,0.10592041164636612,0.17020687460899353,0.10767687112092972,-0.07171539962291718,0.15514710545539856,-0.09401462972164154,-0.4972151815891266,0.2754141092300415,0.12158132344484329,-0.5636499524116516,-0.24178744852542877,-0.002136504277586937,0.23700255155563354,-0.08717748522758484,0.34408658742904663,-0.2116510421037674,-0.2476734071969986,-0.051061637699604034,-0.41424083709716797,-0.14360487461090088,-0.19911551475524902,-0.12662681937217712,0.09435299038887024,0.029778392985463142,0.12432815134525299,0.08667287975549698,0.23255430161952972,0.4151076674461365,0.3356543779373169,0.1927291750907898,-0.20238283276557922,0.02717297151684761,0.2465364933013916,0.07571221888065338,-0.129080131649971,0.2824295461177826,0.10363268107175827,-0.12102285772562027,-0.24611404538154602,0.03210406377911568,-0.2812836468219757,-0.07356872409582138,0.08450739085674286,0.01241584587842226,0.01796751469373703,0.12017402797937393,0.10917490720748901,-0.13485737144947052,-0.12477245181798935,-0.20248453319072723,0.143407940864563,0.1369042843580246,0.017405619844794273,0.1688673049211502,0.08480247855186462,0.020715996623039246,0.05185746029019356,0.23758246004581451,0.1706370860338211,-0.21302665770053864,-0.43144485354423523,0.2719527781009674,0.08253844082355499,0.40765219926834106,0.168474480509758,-0.2327471822500229,-0.036724504083395004,0.11763416230678558,0.06112084537744522,-0.15160855650901794,-0.6256540417671204,0.30196550488471985,0.06948264688253403,0.21192273497581482,-0.09537581354379654,-0.25016161799430847,0.0714116245508194,0.2617243528366089,-0.15332116186618805,-0.501708984375,-0.2829093337059021,0.26897597312927246,-0.14294898509979248,0.10045622289180756,-0.13038791716098785,0.08537132292985916,-0.05951013043522835,-0.07001611590385437,-0.5828736424446106,-0.00046612671576440334,0.5706024765968323,0.07053610682487488,0.4537183940410614,-0.11450745165348053,-0.08260316401720047,-0.10198799520730972,0.4435214400291443,0.0054672094993293285,0.22096215188503265,0.5116480588912964,-0.13138329982757568,-0.08392453193664551,0.08789866417646408,-0.03176996856927872,-0.0723922848701477,-0.03011845424771309,0.25011640787124634,0.2764842212200165,-0.0843985378742218,-0.06843017786741257,-0.1396566927433014,0.04921567440032959,0.2902090847492218,-0.007856033742427826,0.02533576823771,0.007486708927899599,-0.0645550936460495,0.14243321120738983,0.08107545226812363,0.1527940034866333,0.02088804543018341,0.37912917137145996,0.17898628115653992,-0.1704072207212448,0.30308571457862854,-0.14824898540973663,-0.11358817666769028,-0.16755740344524384,-0.06183648854494095,0.05052627623081207,0.21175874769687653,-0.14910516142845154,-0.38864198327064514,-0.03489375859498978,0.018280571326613426,0.04285511374473572,-0.2133045196533203,-0.19551321864128113,-0.003826084779575467,-0.08581887185573578,0.5148547887802124,-0.13728970289230347,-0.042579375207424164,0.22908194363117218,0.06168169528245926,0.07962372153997421,-0.188625767827034,-0.530925452709198,-0.4699062407016754,0.18204373121261597,-0.06307431310415268,-0.08331596851348877,0.2573085129261017,0.3998069167137146,-0.06613028794527054,-0.15754179656505585,-0.24102526903152466,0.152964785695076,-0.31040507555007935,-0.0045948210172355175,0.24793818593025208,-0.2614295482635498,0.1827540248632431,-0.4119546115398407,0.5838844180107117,-0.21698610484600067,-0.00842383410781622,0.021304186433553696,0.12351708114147186,0.055705830454826355,0.23002685606479645,0.0062528555281460285,0.13833726942539215,-0.401486337184906,0.13329151272773743,-0.07332020252943039,0.09195258468389511,-0.06507182121276855,0.17159844934940338,0.010976152494549751,0.23958243429660797,0.0024530072696506977,-0.20323117077350616,-0.10504540055990219,-0.30064648389816284,-0.09683184325695038,-0.008065070025622845,0.10769183188676834,-0.0544569231569767,0.1675565093755722,0.543536365032196,-0.26776161789894104,0.07486936450004578,0.2783299684524536,-0.1653866320848465,-0.11253507435321808,-0.006432100664824247,-0.20593102276325226,-0.041861724108457565,0.019738037139177322,-0.5119309425354004,0.21683762967586517,-0.22119799256324768,-0.1244783028960228,-0.1370697319507599,-0.044059474021196365,-0.30179262161254883,0.02397170104086399,0.44934871792793274,0.3410697281360626,0.40996047854423523,0.47640886902809143,0.010299154557287693,-0.2632836699485779,-0.16348059475421906,-0.016525018960237503,0.0015877853147685528,0.2855471968650818,-0.17295877635478973,0.37052643299102783,-0.1770007610321045,0.024945518001914024,0.0675542950630188,-0.5377959609031677,-0.06368548423051834,-0.030228113755583763,0.24603676795959473,-0.4283530116081238,0.017274390906095505,0.21395841240882874,0.04827503114938736,0.19689683616161346,-0.08419852703809738,0.16331373155117035,0.048779018223285675,0.04861520230770111,0.1353415548801422,-0.23268423974514008,-0.07509499788284302,0.0924372673034668,0.35302141308784485,0.15580953657627106,-0.23148150742053986,-0.02188175916671753,-0.11077217757701874,0.07044602185487747,0.08698195219039917,-0.31621843576431274,0.06510977447032928,-0.17069484293460846,0.13960348069667816,0.14127328991889954,-0.379830539226532,0.12354083359241486,-0.08343701809644699,0.43152666091918945,-0.2027837485074997,0.156759575009346,-0.13929270207881927,0.0921122282743454,-0.07919814437627792,-0.4792236387729645,-0.2688446044921875,-0.07228068262338638,-0.0671573355793953,-0.11415321379899979,0.17905640602111816,0.3506590723991394,0.31012460589408875,-0.15587106347084045,-0.08100421726703644,-0.02830559015274048,0.35183244943618774,-0.42808371782302856,0.12439561635255814,0.2734539806842804,-0.22860771417617798,0.2994145154953003,-0.01430998183786869,-0.3585207760334015,-0.4401494860649109,-0.30499589443206787,-0.3427397608757019,0.16529272496700287,0.05575912445783615,-0.27158284187316895,0.1190139427781105,0.4509475529193878,-0.25483518838882446,-0.2681376039981842,-0.011532099917531013,-0.09706579148769379,0.08880225569009781,-0.06420028954744339,-0.3819224536418915,0.21846358478069305,-0.020807214081287384,-0.040569331496953964,-0.15237842500209808,-0.3863098621368408,-0.2774432599544525,-0.06993889808654785,0.09565068036317825,-0.2546120584011078,0.011905010789632797,-0.03232385963201523,0.1170942410826683,-0.007494605612009764,-0.06674380600452423,-0.022690648213028908,-0.22446680068969727,0.05061384662985802,-0.09311136603355408,-0.07974322885274887,0.09793950617313385,-0.1569848209619522,-0.41615739464759827,0.07760445028543472,-0.13246884942054749,-0.3089359998703003,0.020144851878285408,0.14183788001537323,-0.12750716507434845,0.3495503067970276,-0.2858900725841522,0.20658817887306213,0.34374284744262695,0.03249545395374298,-0.13388416171073914,-0.2222001552581787,-0.060316331684589386,0.02192595973610878,0.6279318928718567,0.2702482044696808,0.029461557045578957,0.014481226913630962,-0.05524085462093353,0.2174776792526245,0.3412097990512848,-0.21949894726276398,0.05222140997648239,-0.17391249537467957,-0.18734140694141388,0.020466605201363564,-0.3235265612602234,0.41568925976753235,-0.2732199728488922,0.2601470351219177,0.08155303448438644,-0.08145944029092789,0.14885281026363373,0.3759211301803589,0.21793532371520996,0.10629889369010925,0.17794449627399445,0.3973335325717926]', '2026-09-08 04:22:52', 'paraphrase-multilingual-MiniLM-L12-v2'),
(34, '[0.2641080319881439,-0.03411683812737465,-0.041745319962501526,0.13196726143360138,-0.26150059700012207,-0.20520977675914764,0.1595233678817749,0.10830327123403549,0.0933123454451561,-0.027170799672603607,0.13624340295791626,0.001630923943594098,-0.05604296550154686,0.18577630817890167,-0.10748321563005447,0.0019102905644103885,0.28196942806243896,-0.2290823757648468,0.15277746319770813,0.002535008592531085,-0.36891883611679077,-0.10480829328298569,0.11132766306400299,0.05119853466749191,-0.7856436371803284,-0.209235280752182,-0.07653279602527618,-0.022964010015130043,0.14752048254013062,0.15339991450309753,0.11008795350790024,-0.06312834471464157,0.2104804366827011,-0.13113287091255188,-0.43538984656333923,0.25597649812698364,0.040031325072050095,-0.39375001192092896,-0.22703300416469574,-0.013508620671927929,0.2516081631183624,-0.014914645813405514,0.3369821012020111,-0.08046475052833557,-0.17133213579654694,-0.03323382884263992,-0.30200472474098206,-0.13282941281795502,-0.08552052825689316,-0.07827676832675934,0.03474624454975128,0.030521681532263756,0.06902413815259933,0.016930142417550087,0.25260478258132935,0.37171053886413574,0.2611165940761566,0.2002178579568863,-0.19557137787342072,0.03940492123365402,0.22201095521450043,0.0050809020176529884,-0.16639600694179535,0.22281935811042786,0.15308532118797302,-0.06757956743240356,-0.21456563472747803,-0.04326567426323891,-0.24434371292591095,-0.01235746219754219,0.06271842867136002,-0.022219499573111534,0.15953080356121063,-0.051089201122522354,0.055322904139757156,-0.08388582617044449,-0.011871074326336384,-0.17805823683738708,0.15081855654716492,0.1094990149140358,0.010264386422932148,0.17106635868549347,0.15261228382587433,0.04003993049263954,-0.0019281075801700354,0.2871282398700714,0.16064389050006866,-0.2071543186903,-0.39302852749824524,0.279879093170166,0.15322230756282806,0.41250741481781006,0.2148907333612442,-0.1736065000295639,-0.0000697133073117584,0.16495321691036224,0.03218727931380272,-0.12207990884780884,-0.6399323344230652,0.2658300995826721,0.17524579167366028,0.10557085275650024,-0.18366757035255432,-0.4014628231525421,0.03165746480226517,0.2206886112689972,-0.14154449105262756,-0.48939433693885803,-0.31206345558166504,0.24376972019672394,-0.0820440724492073,0.072388656437397,-0.1436029076576233,0.15543028712272644,-0.08627866208553314,0.008533223532140255,-0.37175706028938293,0.021434703841805458,0.5412744879722595,-0.006187082268297672,0.3991142511367798,-0.17566440999507904,-0.05923297256231308,-0.0950721874833107,0.43153756856918335,-0.08903459459543228,0.12816086411476135,0.39669498801231384,-0.08159550279378891,-0.014598592184484005,0.15248973667621613,-0.005687182769179344,-0.10563868284225464,-0.02081468142569065,0.15078799426555634,0.25315767526626587,-0.09578592330217361,-0.08986057341098785,-0.05426109582185745,-0.046908896416425705,0.3166012465953827,-0.047934822738170624,-0.14211620390415192,0.05539044737815857,-0.11802170425653458,0.07727159559726715,0.02748420648276806,0.13689081370830536,0.00037872366374358535,0.23290030658245087,0.13634654879570007,-0.12284784018993378,0.26378175616264343,-0.20890991389751434,-0.0692373588681221,-0.1270790696144104,-0.03635719418525696,0.04019086807966232,0.21102076768875122,-0.016212884336709976,-0.3327687084674835,-0.06914319843053818,-0.10276579856872559,0.024943795055150986,-0.18010859191417694,-0.17859803140163422,-0.08639198541641235,-0.09471690654754639,0.4043714106082916,0.026314768940210342,0.030039912089705467,0.15673476457595825,0.14904344081878662,0.12794411182403564,-0.31617358326911926,-0.47097086906433105,-0.3391484320163727,0.10906997323036194,-0.09814741462469101,-0.1051710695028305,0.19184432923793793,0.34129786491394043,-0.1832624077796936,-0.07523008435964584,-0.22590768337249756,0.217208594083786,-0.30747169256210327,0.02226983942091465,0.1518421173095703,-0.4165017604827881,0.22581087052822113,-0.38603445887565613,0.5981808304786682,-0.2530907690525055,-0.02968834713101387,-0.05628140643239021,0.031640853732824326,0.0007805313216522336,0.08499117940664291,0.11900006234645844,0.13763581216335297,-0.26716527342796326,0.1092916801571846,-0.1263384073972702,0.05904299393296242,-0.04599672555923462,0.2061917930841446,-0.007581944111734629,0.2782224118709564,0.03932754322886467,-0.1916026622056961,0.03643593192100525,-0.23301808536052704,-0.14874441921710968,-0.09618250280618668,0.24946217238903046,-0.02229304425418377,0.08787313848733902,0.5210429430007935,-0.13605865836143494,0.1777157485485077,0.13188105821609497,-0.17041844129562378,-0.1228395402431488,-0.007951892912387848,-0.1825125515460968,0.023865872994065285,0.11819921433925629,-0.43593916296958923,0.220505028963089,-0.19942019879817963,-0.18667104840278625,-0.1274568736553192,0.09131801873445511,-0.18517044186592102,-0.07467062771320343,0.4360406994819641,0.1983269304037094,0.37298643589019775,0.46070098876953125,-0.032743290066719055,-0.3578735888004303,-0.1647336632013321,-0.03919213265180588,0.03833048790693283,0.27458930015563965,-0.04687671363353729,0.45202064514160156,-0.17147548496723175,0.11022034287452698,-0.13163146376609802,-0.4230160117149353,0.016155216842889786,-0.07662950456142426,0.16163372993469238,-0.3022930324077606,-0.17527692019939423,0.23762810230255127,0.012361282482743263,0.12920993566513062,-0.03603004664182663,0.16362082958221436,-0.02439005859196186,0.20662277936935425,0.12391418218612671,-0.2179640829563141,-0.11081134527921677,-0.03095276653766632,0.3375381827354431,0.14617463946342468,-0.04630986973643303,-0.0210657250136137,-0.08529867231845856,-0.012728877365589142,0.088351309299469,-0.2483239620923996,0.004378866404294968,0.016676096245646477,0.17428342998027802,0.14977338910102844,-0.2529749572277069,0.002891243901103735,-0.16123847663402557,0.3607666790485382,-0.1932351440191269,0.13289067149162292,-0.14539247751235962,0.01785925403237343,-0.18417200446128845,-0.43080535531044006,-0.2759305536746979,-0.10724791884422302,-0.08899599313735962,-0.08973077684640884,0.10476645827293396,0.14895270764827728,0.3288381099700928,-0.15954606235027313,-0.0028221099637448788,0.007637902162969112,0.343730092048645,-0.5137724876403809,0.20956872403621674,0.3253217935562134,-0.24197900295257568,0.19140736758708954,-0.041013043373823166,-0.18941518664360046,-0.3923279941082001,-0.3452741801738739,-0.23396643996238708,0.06434182077646255,0.12787461280822754,-0.2218109369277954,0.03042219579219818,0.37098947167396545,-0.35373881459236145,-0.33130788803100586,-0.0325963981449604,-0.10819864273071289,0.14024557173252106,-0.09887025505304337,-0.5165496468544006,0.25721508264541626,-0.06411046534776688,-0.1473557949066162,-0.1715065836906433,-0.3503830134868622,-0.2177344113588333,-0.034359198063611984,0.0639965757727623,-0.13616788387298584,-0.07142895460128784,-0.04111291840672493,0.07923159748315811,0.010966974310576916,-0.06243153288960457,-0.0511549636721611,-0.2122267335653305,-0.021310273557901382,-0.06265228986740112,-0.09428747743368149,0.08911826461553574,-0.13525299727916718,-0.3213408887386322,0.09082987904548645,-0.14184963703155518,-0.23163826763629913,0.019930537790060043,0.05073504149913788,-0.13949142396450043,0.2536928355693817,-0.25183218717575073,0.16568538546562195,0.3751784563064575,0.0692349448800087,0.007722277194261551,-0.16349203884601593,0.09639057517051697,0.0330810546875,0.62186598777771,0.34093937277793884,-0.1536242514848709,0.10618612915277481,0.05774875357747078,0.22814927995204926,0.38551419973373413,-0.1262545883655548,0.0702773705124855,-0.23951618373394012,-0.19177944958209991,0.11558350920677185,-0.22355122864246368,0.39081281423568726,-0.29780131578445435,0.19627030193805695,0.13387805223464966,-0.05471314117312431,0.22833728790283203,0.3490854501724243,0.14448606967926025,0.08156668394804001,0.3512699007987976,0.3923148214817047]', '2026-09-08 04:22:15', 'paraphrase-multilingual-MiniLM-L12-v2'),
(35, '[0.38565370440483093,-0.031687211245298386,-0.05494855344295502,0.1679660826921463,-0.21979208290576935,-0.14717265963554382,0.11059851944446564,0.1656879335641861,0.11546337604522705,-0.08330530673265457,0.15522217750549316,-0.010470867156982422,0.0062027801759541035,0.2823618948459625,-0.13826042413711548,-0.05002836138010025,0.26236492395401,-0.15656433999538422,0.19111329317092896,-0.03125293552875519,-0.30127328634262085,-0.17761015892028809,0.0986439660191536,0.07962803542613983,-0.7467907667160034,-0.24831131100654602,-0.09223140776157379,0.010624968446791172,0.07863542437553406,0.08016360551118851,0.10592297464609146,-0.14132456481456757,0.14623549580574036,-0.14327430725097656,-0.38043686747550964,0.2832725942134857,0.09474840760231018,-0.4240158498287201,-0.3380546569824219,0.06348346173763275,0.2579636573791504,0.015053901821374893,0.36195552349090576,-0.1760610193014145,-0.09969918429851532,-0.09752961248159409,-0.33083730936050415,-0.21939091384410858,-0.1253419816493988,-0.05553572252392769,0.13556213676929474,0.12424086779356003,0.033771585673093796,0.07550439983606339,0.2429465800523758,0.35071003437042236,0.22654284536838531,0.2734694480895996,-0.12636695802211761,0.0326177254319191,0.24125148355960846,0.005671530496329069,-0.19622842967510223,0.28973841667175293,0.18643587827682495,-0.004241099115461111,-0.22793805599212646,-0.08170926570892334,-0.27964603900909424,-0.08249077945947647,0.051322247833013535,0.013615035451948643,0.07168146967887878,-0.06892137974500656,0.06284617632627487,-0.10574910044670105,-0.001948071992956102,-0.12658868730068207,0.13245825469493866,0.11364352703094482,0.01553091499954462,0.166518896818161,0.09429986774921417,0.0971451997756958,-0.03183726966381073,0.25239887833595276,0.213096484541893,-0.10604989528656006,-0.5211967825889587,0.1972367912530899,0.18192432820796967,0.4011307954788208,0.16731838881969452,-0.16213315725326538,-0.011746480129659176,0.17304250597953796,0.10691048204898834,-0.12222135812044144,-0.6015249490737915,0.2707582712173462,0.3246484100818634,0.12266144901514053,-0.17665205895900726,-0.269093781709671,0.045458536595106125,0.25725048780441284,-0.09148015081882477,-0.5023568868637085,-0.26208195090293884,0.22861021757125854,-0.13714610040187836,0.13161934912204742,-0.10973149538040161,0.15852221846580505,-0.07060357928276062,-0.11324069648981094,-0.4381377100944519,0.00936057511717081,0.42267170548439026,0.016834747046232224,0.36301711201667786,-0.1711122691631317,0.01584268920123577,-0.1707502007484436,0.5149595737457275,-0.09658325463533401,0.160654678940773,0.5091422200202942,-0.047174885869026184,-0.061445631086826324,0.13701288402080536,-0.051659490913152695,-0.18021619319915771,-0.1984892338514328,0.21194852888584137,0.2907605767250061,-0.11300434917211533,-0.1048550084233284,-0.10997088998556137,-0.08222664147615433,0.28488051891326904,-0.1572893261909485,-0.06034336984157562,0.09058874845504761,-0.0441194623708725,0.12246227264404297,0.03416161239147186,0.12264962494373322,-0.039516109973192215,0.31077224016189575,0.1570778340101242,-0.180543452501297,0.32043758034706116,-0.3189757764339447,-0.09186789393424988,-0.13965539634227753,-0.06903338432312012,0.05114153400063515,0.1731611043214798,-0.02306128852069378,-0.29448559880256653,-0.033813659101724625,-0.10388372093439102,-0.020219147205352783,-0.2226710170507431,-0.050176799297332764,-0.15248095989227295,-0.15612691640853882,0.37972941994667053,0.04158451780676842,0.041086722165346146,0.14219051599502563,0.16464552283287048,0.07858458161354065,-0.32096391916275024,-0.527844250202179,-0.37170758843421936,0.12493626773357391,-0.18708643317222595,-0.10954627394676208,0.1580948680639267,0.3666718602180481,-0.19408199191093445,-0.10053770244121552,-0.30036309361457825,0.2665940821170807,-0.36910974979400635,-0.019382556900382042,0.2521354854106903,-0.3570864498615265,0.14845076203346252,-0.5106149911880493,0.5934290289878845,-0.18531103432178497,-0.12040569633245468,0.0005113934748806059,0.08802829682826996,-0.02323056384921074,0.1098516508936882,0.09994928538799286,0.12109819799661636,-0.2793722152709961,0.27182626724243164,-0.10247565060853958,0.06865274906158447,-0.04121078550815582,0.12875156104564667,-0.025709111243486404,0.33160409331321716,0.0823877602815628,-0.23389063775539398,0.007625963073223829,-0.31144070625305176,-0.1793624609708786,-0.042255811393260956,0.2697998881340027,-0.042318832129240036,0.1829605996608734,0.5053343772888184,-0.21868525445461273,0.2403697371482849,0.06634830683469772,-0.17656932771205902,-0.16497233510017395,0.03115035779774189,-0.1757117509841919,-0.06629564613103867,0.13633498549461365,-0.4391205310821533,0.2589259147644043,-0.14743027091026306,-0.09426284581422806,-0.23451195657253265,0.1071147471666336,-0.17496062815189362,0.019062742590904236,0.4708329141139984,0.24210897088050842,0.46194395422935486,0.4891093969345093,-0.06080981716513634,-0.29993492364883423,-0.11259853094816208,0.040565431118011475,-0.006446014158427715,0.23863734304904938,-0.08640088140964508,0.46128544211387634,-0.21638216078281403,0.13457298278808594,-0.08032626658678055,-0.3397231996059418,-0.013092521578073502,-0.07659903913736343,0.19472745060920715,-0.37178802490234375,-0.09261248260736465,0.2152562290430069,0.07832451164722443,0.11640189588069916,-0.1337495595216751,0.19550682604312897,-0.011461312882602215,0.22749297320842743,0.13138873875141144,-0.16488128900527954,-0.09911009669303894,-0.08603879064321518,0.3450695872306824,0.06884882599115372,-0.09835109859704971,-0.04858412966132164,-0.15094605088233948,-0.018327312543988228,0.04271194338798523,-0.28250277042388916,-0.004720363300293684,0.02421007677912712,0.17266546189785004,0.14369486272335052,-0.3747583329677582,0.11954884976148605,-0.11301276832818985,0.42397961020469666,-0.20421937108039856,0.0806325152516365,-0.1967596411705017,0.02063613012433052,-0.17608825862407684,-0.4053517282009125,-0.4043436348438263,-0.0596231184899807,-0.10288538783788681,-0.15063750743865967,0.10382723063230515,0.17338095605373383,0.4186469316482544,-0.12690295279026031,-0.002010616473853588,0.007624692749232054,0.2737950086593628,-0.49066361784935,0.10625521093606949,0.3114489018917084,-0.19868050515651703,0.1858440488576889,-0.12023261189460754,-0.21614956855773926,-0.3224306106567383,-0.3668248951435089,-0.3345470428466797,0.10414846241474152,0.17357675731182098,-0.1949627697467804,0.13561023771762848,0.4514862895011902,-0.23292963206768036,-0.3147009611129761,-0.04860013723373413,-0.18489351868629456,0.09477335959672928,-0.12930314242839813,-0.4640957713127136,0.30577975511550903,-0.05594959482550621,-0.0701490119099617,-0.039577171206474304,-0.41560447216033936,-0.2220935970544815,-0.07585563510656357,0.12284355610609055,-0.24155598878860474,-0.1224331334233284,-0.12439809739589691,0.053731951862573624,0.04970299452543259,-0.05455435812473297,-0.016328541561961174,-0.2045515477657318,0.009262321516871452,-0.02239053137600422,-0.17507575452327728,0.08623576909303665,-0.062323808670043945,-0.2988852262496948,0.058985721319913864,-0.12856829166412354,-0.25060170888900757,0.06643492728471756,0.10671994090080261,-0.14664269983768463,0.3208325505256653,-0.28268229961395264,0.19611911475658417,0.2523309588432312,0.11370649933815002,-0.01977883093059063,-0.13741102814674377,-0.010042267851531506,0.17310237884521484,0.5853193402290344,0.23318271338939667,-0.13059864938259125,0.06517230719327927,0.11065009236335754,0.17398981750011444,0.4334840476512909,-0.1012413427233696,0.07641304284334183,-0.33225610852241516,-0.17170527577400208,0.0811525210738182,-0.26605793833732605,0.3350260853767395,-0.2937716245651245,0.24782626330852509,0.1456056833267212,-0.10340863466262817,0.07034225016832352,0.33681079745292664,0.09218202531337738,0.1593514084815979,0.31816866993904114,0.41759970784187317]', '2026-09-08 04:21:35', 'paraphrase-multilingual-MiniLM-L12-v2'),
(36, '[0.42659732699394226,0.030846627429127693,-0.12314215302467346,0.1695500910282135,-0.26235899329185486,-0.20108160376548767,0.032571565359830856,0.1498684585094452,0.18173015117645264,-0.07505948096513748,0.1884845346212387,0.07257627695798874,-0.007234207820147276,0.21107564866542816,0.021614771336317062,0.006082797423005104,0.23219606280326843,-0.22340230643749237,0.09811577945947647,-0.02101469784975052,-0.3511328399181366,-0.18270240724086761,0.15817022323608398,0.012217998504638672,-0.7846965193748474,-0.28517791628837585,-0.05155466869473457,-0.06833869963884354,0.10525689274072647,0.05752906575798988,0.08628162741661072,-0.1991463154554367,0.22132201492786407,-0.154759481549263,-0.3304555416107178,0.3018226623535156,0.06140996143221855,-0.28681761026382446,-0.29300007224082947,0.05062131583690643,0.20825617015361786,0.0014788236003369093,0.3123094141483307,-0.13153903186321259,-0.16975641250610352,-0.12149839848279953,-0.32004445791244507,-0.14298976957798004,-0.2789856791496277,-0.16681019961833954,0.02659166418015957,0.04145454615354538,0.04553084075450897,0.001574381603859365,0.20821955800056458,0.3668571412563324,0.2175118774175644,0.20509570837020874,-0.1736285239458084,0.06636157631874084,0.1550513207912445,0.059171345084905624,-0.17792433500289917,0.1888672262430191,0.2192164659500122,0.04387820512056351,-0.1911938190460205,-0.1098191887140274,-0.20786501467227936,0.04534362629055977,0.15342798829078674,0.04008413106203079,0.0521891824901104,-0.03466496616601944,0.0878211259841919,-0.031172342598438263,-0.006951251998543739,-0.07039721310138702,0.26939940452575684,0.056746091693639755,-0.05651986226439476,0.26205042004585266,0.08185814321041107,0.03551486134529114,-0.08598452806472778,0.3052358329296112,0.1535637229681015,-0.14416684210300446,-0.5525847673416138,0.21555361151695251,0.15575671195983887,0.31261810660362244,0.0791977122426033,-0.09810304641723633,-0.053628914058208466,0.13305607438087463,0.04186348617076874,-0.08339250832796097,-0.5948213338851929,0.2147628664970398,0.26049572229385376,0.15324218571186066,-0.25508496165275574,-0.27347177267074585,0.06758400797843933,0.25157231092453003,-0.12539152801036835,-0.5483549237251282,-0.39475539326667786,0.29025888442993164,-0.14079727232456207,0.08884532749652863,-0.16556508839130402,0.13450784981250763,-0.06736341863870621,-0.0983542948961258,-0.41110870242118835,0.01667771115899086,0.4874926805496216,0.08183664828538895,0.42199990153312683,-0.19744570553302765,-0.012775052338838577,-0.16605298221111298,0.45066121220588684,-0.025289006531238556,0.06258409470319748,0.3885638117790222,-0.09647014737129211,-0.08211580663919449,0.09508449584245682,-0.07016556710004807,-0.1201343908905983,-0.17896868288516998,0.2095818817615509,0.22766466438770294,-0.10867471247911453,-0.09068325161933899,-0.10280504822731018,-0.04511598125100136,0.296161025762558,-0.15380680561065674,-0.04541069269180298,0.09337834268808365,0.01605060324072838,0.1082988828420639,-0.029686445370316505,0.10931847989559174,-0.015624704770743847,0.23125821352005005,0.14855974912643433,-0.18528789281845093,0.2735437750816345,-0.36292070150375366,-0.08331868052482605,-0.15773648023605347,-0.14380234479904175,0.08963394910097122,0.09977459162473679,0.03079829551279545,-0.4124751091003418,-0.07082155346870422,-0.09275390207767487,0.014304285869002342,-0.13345076143741608,-0.16548354923725128,-0.12060588598251343,-0.24364612996578217,0.3412160277366638,0.05847249552607536,0.010771899484097958,0.17973828315734863,0.14302892982959747,0.12403569370508194,-0.26233160495758057,-0.5130229592323303,-0.48833921551704407,0.1255698949098587,-0.14046154916286469,-0.11552037298679352,0.22862499952316284,0.35025912523269653,-0.19425860047340393,-0.14052420854568481,-0.20732638239860535,0.17132072150707245,-0.29496660828590393,0.00670159887522459,0.1381082683801651,-0.3339841365814209,0.08978218585252762,-0.32681551575660706,0.5288186073303223,-0.14743347465991974,-0.19670109450817108,0.019857758656144142,0.13938899338245392,-0.0852222591638565,0.057591021060943604,0.19840331375598907,0.07290560752153397,-0.30087247490882874,0.14334924519062042,-0.050436124205589294,0.0024572398979216814,-0.014495136216282845,0.27661097049713135,-0.024078059941530228,0.31177419424057007,0.11811619251966476,-0.23037298023700714,0.12864655256271362,-0.2671472132205963,-0.24899901449680328,-0.03165898472070694,0.2691020965576172,-0.07936489582061768,0.23534534871578217,0.44859257340431213,-0.09357427060604095,0.186783567070961,0.1296864151954651,-0.07771189510822296,-0.09930013120174408,0.005152218975126743,-0.16352251172065735,0.10700184106826782,0.07432910054922104,-0.460816353559494,0.33692196011543274,-0.0003596684255171567,-0.16209687292575836,-0.14400403201580048,0.1011323481798172,-0.2663542926311493,0.009835964068770409,0.4622485935688019,0.22361481189727783,0.4582521319389343,0.3655228018760681,0.0171766709536314,-0.24409089982509613,-0.14465048909187317,0.015561150386929512,-0.039699386805295944,0.2479274570941925,-0.142002671957016,0.3521852195262909,-0.14589770138263702,0.0821627825498581,-0.034861765801906586,-0.35920044779777527,-0.007076974958181381,-0.042215559631586075,0.11530463397502899,-0.3081347942352295,-0.09324204921722412,0.16076377034187317,0.08390004187822342,0.22269555926322937,-0.10032393038272858,0.17213872075080872,0.007462585810571909,0.24155819416046143,0.0584772489964962,-0.09917107224464417,-0.07828573882579803,-0.1809283196926117,0.3146170377731323,0.1213115006685257,-0.04185764864087105,-0.0399031862616539,-0.13693717122077942,-0.0013889081310480833,0.012603889219462872,-0.20891764760017395,-0.0474499873816967,0.023771442472934723,0.09981464594602585,0.16851016879081726,-0.3731451630592346,0.09934499859809875,-0.07416047900915146,0.3982393145561218,-0.11305934935808182,0.04021916911005974,-0.2020566761493683,-0.06569426506757736,-0.05020153149962425,-0.40688180923461914,-0.3363259434700012,-0.005145959556102753,0.011224029585719109,-0.1106564849615097,0.1283547282218933,0.14712639153003693,0.4564594030380249,-0.08344302326440811,-0.01104078721255064,-0.05010388046503067,0.28877824544906616,-0.5457844734191895,0.13344378769397736,0.3540795147418976,-0.1292629987001419,0.20071353018283844,-0.061080776154994965,-0.22289682924747467,-0.26760050654411316,-0.22853083908557892,-0.2003529965877533,0.03946136310696602,0.1306968480348587,-0.23719361424446106,0.04982896149158478,0.3579680621623993,-0.11415040493011475,-0.3371000587940216,-0.02008136361837387,-0.13526295125484467,0.11481855064630508,-0.08619903773069382,-0.2554052472114563,0.3500654697418213,0.035274989902973175,-0.032567791640758514,-0.1510884016752243,-0.37959685921669006,-0.28762003779411316,-0.040772709995508194,0.052887219935655594,-0.19309407472610474,0.03449762612581253,-0.18990306556224823,0.053428370505571365,0.08074744045734406,-0.025755370035767555,-0.13078182935714722,-0.2220611572265625,0.02100415714085102,-0.025486519560217857,-0.16146767139434814,0.07988177984952927,0.01998237520456314,-0.2586441934108734,-0.0420866459608078,-0.11452779173851013,-0.10362175852060318,-0.00684672687202692,0.1093149408698082,-0.15058620274066925,0.20343215763568878,-0.2174433320760727,0.20562036335468292,0.30631300806999207,0.09805759787559509,-0.03328636288642883,-0.12446198612451553,-0.007021489553153515,0.047897420823574066,0.536219596862793,0.13827677071094513,-0.0894480049610138,0.17945954203605652,0.07192570716142654,0.27238327264785767,0.3696167767047882,-0.1997799128293991,0.039669468998909,-0.3228262960910797,-0.10577548295259476,0.02622658759355545,-0.2575940489768982,0.3836537003517151,-0.21208137273788452,0.21370166540145874,0.12580564618110657,-0.08124710619449615,0.1462017446756363,0.3567938506603241,0.07188434153795242,0.18973475694656372,0.3113420605659485,0.3996623754501343]', '2026-09-08 04:21:03', 'paraphrase-multilingual-MiniLM-L12-v2'),
(40, '[0.4392118453979492,-0.12569519877433777,-0.11572437733411789,0.15983569622039795,-0.3320653438568115,-0.22359195351600647,0.2665814161300659,0.0629107877612114,0.08171559870243073,0.058150142431259155,0.1828782558441162,-0.03702615201473236,-0.07659866660833359,0.11429669708013535,-0.05345764756202698,-0.08597856760025024,0.25624358654022217,-0.22390230000019073,0.16639189422130585,-0.09401589632034302,-0.14644837379455566,-0.22181937098503113,0.0325465053319931,0.063446544110775,-0.772964596748352,-0.27779045701026917,-0.22021663188934326,0.020555995404720306,0.10010025650262833,0.11072731018066406,0.11867722868919373,-0.1353597342967987,0.1039569228887558,-0.20037423074245453,-0.4553036391735077,0.2492019236087799,0.05648424103856087,-0.5666540265083313,-0.20253413915634155,-0.033187855035066605,0.21768833696842194,-0.07499466091394424,0.3499504327774048,-0.20925892889499664,-0.2642532289028168,0.01726485602557659,-0.43294093012809753,-0.13236752152442932,-0.1915164738893509,-0.15895512700080872,0.01891944371163845,-0.015779739245772362,0.10575202852487564,0.07426445186138153,0.2519056499004364,0.4425928592681885,0.31914854049682617,0.24345354735851288,-0.15090402960777283,0.025897134095430374,0.30454689264297485,0.13649530708789825,-0.1487753987312317,0.25151681900024414,0.1241324320435524,-0.1212688460946083,-0.22667764127254486,0.007982037961483002,-0.3084234893321991,-0.07590244710445404,0.09308157116174698,0.09739203006029129,-0.05124397575855255,0.05579118803143501,0.1814490109682083,-0.0918174535036087,-0.11287947744131088,-0.20986300706863403,0.2354046106338501,0.17521750926971436,0.05828578397631645,0.127442866563797,-0.003850050736218691,0.014523066580295563,0.08554255962371826,0.2611916959285736,0.1359473019838333,-0.1731746345758438,-0.45742541551589966,0.22052156925201416,0.07965125143527985,0.4006901681423187,0.13589440286159515,-0.18313996493816376,-0.005541767925024033,0.20134645700454712,0.041116487234830856,-0.07949907332658768,-0.5942997336387634,0.2900552749633789,0.1260502189397812,0.22423477470874786,-0.13729296624660492,-0.2588459551334381,0.05227450281381607,0.2672942578792572,-0.04827408865094185,-0.420248806476593,-0.2987920343875885,0.2958395183086395,-0.14666561782360077,0.07616215944290161,-0.13982471823692322,0.11721275001764297,-0.04720054939389229,-0.07617320120334625,-0.5573286414146423,-0.030948905274271965,0.565097987651825,0.056754495948553085,0.402902215719223,-0.1191665530204773,-0.02199777029454708,-0.13997165858745575,0.4697083830833435,-0.036039263010025024,0.26387032866477966,0.493062824010849,-0.1891152560710907,-0.12751631438732147,0.138653963804245,-0.0036435401998460293,-0.09603042900562286,-0.12696605920791626,0.18681342899799347,0.29460740089416504,-0.09875171631574631,-0.05501847341656685,-0.1307574063539505,0.08880750834941864,0.2712950110435486,0.027606064453721046,0.1418152153491974,0.0029754198621958494,-0.013731216080486774,0.10313775390386581,0.12752068042755127,0.0857531800866127,0.03523935377597809,0.2734711170196533,0.1292550265789032,-0.18394388258457184,0.3704753816127777,-0.13539914786815643,-0.1478716880083084,-0.15841850638389587,-0.17726625502109528,0.009792780503630638,0.15505318343639374,-0.13985659182071686,-0.5325172543525696,0.035857997834682465,0.032605357468128204,0.07823164761066437,-0.23284287750720978,-0.13374513387680054,-0.008736886084079742,-0.10219951719045639,0.4212041199207306,-0.18264293670654297,-0.014692746102809906,0.2162182778120041,0.10504331439733505,0.03679893538355827,-0.1904231458902359,-0.5069848895072937,-0.5227081179618835,0.21751099824905396,-0.049186162650585175,-0.07031501084566116,0.2219012975692749,0.32549935579299927,-0.028054026886820793,-0.13638778030872345,-0.23267211019992828,0.1633717268705368,-0.2903701364994049,0.02844315394759178,0.3037523031234741,-0.29243841767311096,0.1524367779493332,-0.3710106909275055,0.5721160769462585,-0.09320732951164246,-0.08369959145784378,0.02524847351014614,0.1502588540315628,0.03521698713302612,0.21727924048900604,0.010416996665298939,0.1688017100095749,-0.3815267086029053,0.16492114961147308,-0.05556977912783623,-0.021699722856283188,-0.06374846398830414,0.18280096352100372,0.03379391133785248,0.24468107521533966,-0.04330965131521225,-0.2366044968366623,-0.07571288198232651,-0.40214109420776367,-0.1663346290588379,0.010289981961250305,0.1227385401725769,-0.09083342552185059,0.1857668161392212,0.565464437007904,-0.18518905341625214,0.06118185818195343,0.1964617371559143,-0.1007896438241005,-0.100367471575737,-0.005310487002134323,-0.22234919667243958,-0.0045788162387907505,0.05770379677414894,-0.5110835433006287,0.2742222547531128,-0.22205929458141327,-0.09687706083059311,-0.16520516574382782,-0.01634489931166172,-0.2976044714450836,0.08411496132612228,0.4562947750091553,0.3849003314971924,0.4136080741882324,0.4251055419445038,0.011505437083542347,-0.2819441854953766,-0.1333162635564804,0.08249419927597046,-0.03774450346827507,0.2574060559272766,-0.13449743390083313,0.3842219412326813,-0.15853475034236908,0.1013110876083374,0.0764998197555542,-0.5051040649414062,-0.003455887548625469,-0.02737990766763687,0.16379296779632568,-0.42708873748779297,0.05103088542819023,0.20847845077514648,0.016390927135944366,0.27780985832214355,-0.06150876730680466,0.08717653900384903,0.054333146661520004,0.14648117125034332,0.1491926908493042,-0.15562787652015686,-0.07305992394685745,0.0820155069231987,0.34578511118888855,0.21081571280956268,-0.27524319291114807,0.06274545937776566,-0.21282891929149628,0.0936075821518898,0.048364944756031036,-0.3070703446865082,0.01575075089931488,-0.20168162882328033,0.17007924616336823,0.14428873360157013,-0.3940766751766205,0.10150804370641708,-0.036884553730487823,0.38182249665260315,-0.09046903997659683,0.12788239121437073,-0.1510700136423111,0.15609563887119293,-0.05174606293439865,-0.46035414934158325,-0.2893160581588745,-0.02860320918262005,-0.007181410677731037,-0.07826782763004303,0.19764728844165802,0.2949795722961426,0.3259084224700928,-0.21974368393421173,-0.15344716608524323,0.014474845491349697,0.37316229939460754,-0.4015905559062958,0.09551066905260086,0.3285394608974457,-0.25761526823043823,0.2912416458129883,-0.04359300807118416,-0.36853593587875366,-0.3653539717197418,-0.2463936060667038,-0.359117329120636,0.15512974560260773,0.09028954058885574,-0.2693728506565094,0.07530787587165833,0.39786678552627563,-0.27732259035110474,-0.20885422825813293,0.022096458822488785,-0.08106233924627304,0.07991254329681396,-0.029882051050662994,-0.31569981575012207,0.1813403069972992,-0.08276595920324326,-0.07432399690151215,-0.12080521136522293,-0.41403332352638245,-0.2831648886203766,0.034713756293058395,0.13543671369552612,-0.2713620960712433,0.14913281798362732,-0.11662696301937103,0.09340404719114304,0.07413170486688614,-0.03289639577269554,-0.06113279610872269,-0.22144398093223572,0.042577873915433884,0.00415796646848321,-0.0976739153265953,0.1195984035730362,-0.07822053879499435,-0.44650354981422424,0.10572189092636108,-0.12383382022380829,-0.27482733130455017,0.00017561567074153572,0.11647437512874603,-0.13427110016345978,0.314134806394577,-0.2904480993747711,0.14505185186862946,0.3003126382827759,0.12294983863830566,-0.10899806022644043,-0.19654211401939392,-0.12810488045215607,-0.043086979538202286,0.5033720135688782,0.21357852220535278,0.002219671383500099,-0.04943463206291199,-0.031761787831783295,0.24344374239444733,0.29928213357925415,-0.2837201952934265,0.08782198280096054,-0.22417105734348297,-0.2201363891363144,0.03323156759142876,-0.29537713527679443,0.3456091284751892,-0.27149635553359985,0.3121652901172638,0.05646149814128876,-0.06957707554101944,0.10337795317173004,0.3545684516429901,0.17877860367298126,0.09886528551578522,0.125948965549469,0.39946913719177246]', '2026-09-08 04:19:58', 'paraphrase-multilingual-MiniLM-L12-v2'),
(41, '[0.40819546580314636,0.0528542660176754,-0.21500541269779205,0.2018183320760727,-0.20580071210861206,-0.19917501509189606,0.06492115557193756,0.040130097419023514,0.17859606444835663,-0.01084061712026596,0.1525920331478119,0.053166843950748444,-0.020261842757463455,0.1275215595960617,0.000668841996230185,-0.10424480587244034,0.23191720247268677,-0.2910952866077423,0.10064662247896194,0.07450813800096512,-0.21839822828769684,-0.19084595143795013,0.1195533499121666,-0.002347401110455394,-0.8485609889030457,-0.15228287875652313,-0.054179031401872635,-0.0748203918337822,0.11555294692516327,0.049315907061100006,0.06475204229354858,-0.2524169683456421,0.1725403517484665,-0.2109799087047577,-0.34508270025253296,0.18107527494430542,0.11139046400785446,-0.2953490614891052,-0.09228961169719696,0.02175227180123329,0.19452519714832306,0.02046922966837883,0.32980990409851074,-0.13099920749664307,-0.25640133023262024,-0.014885369688272476,-0.30831006169319153,-0.08574099093675613,-0.3455080986022949,-0.2543281316757202,-0.03899985924363136,-0.004063319880515337,0.16881564259529114,-0.19146502017974854,0.14712777733802795,0.22893165051937103,0.33362680673599243,0.3451009690761566,-0.18436665832996368,0.15011660754680634,0.20901048183441162,0.20864945650100708,-0.21352049708366394,0.11100833117961884,0.12122694402933121,-0.10523712635040283,-0.12002339214086533,0.017800329253077507,-0.11253463476896286,0.1311662793159485,0.11560676246881485,0.0064486125484108925,-0.10491222143173218,-0.06517064571380615,0.11258652806282043,0.09220460057258606,-0.10251931101083755,-0.05955200642347336,0.2662632167339325,-0.04914737492799759,0.07186402380466461,0.2625971734523773,0.09328773617744446,0.05710262432694435,0.016787154600024223,0.2931312620639801,0.1468433141708374,-0.16407042741775513,-0.3235577642917633,0.22718562185764313,0.2611176371574402,0.19119590520858765,0.1582099050283432,-0.20714184641838074,0.06074698641896248,0.18681283295154572,-0.043817512691020966,-0.012599955312907696,-0.6296443939208984,0.1294051855802536,0.06923966109752655,0.12241333723068237,-0.387896865606308,-0.19194796681404114,0.15330523252487183,0.2856680452823639,-0.054623764008283615,-0.5632737278938293,-0.4869389235973358,0.38131025433540344,-0.12493721395730972,0.10837332159280777,-0.212413027882576,0.060121748596429825,0.05126996710896492,0.0378229059278965,-0.43711042404174805,-0.009314173832535744,0.38731649518013,0.1400681436061859,0.3814253509044647,-0.25182005763053894,-0.07982774078845978,-0.09101276844739914,0.4291146397590637,0.022173918783664703,0.016986720263957977,0.28653720021247864,-0.10581942647695541,-0.1719065010547638,-0.011958214454352856,0.02831878326833248,-0.14030218124389648,-0.16988876461982727,0.2512079179286957,0.30040106177330017,-0.07428599148988724,-0.0713854432106018,-0.05401403829455376,0.006268943194299936,0.18384163081645966,-0.14978067576885223,0.1140013188123703,0.09120003879070282,0.13778123259544373,0.19469714164733887,0.05140617862343788,0.0039796968922019005,0.02938135899603367,0.08897750079631805,0.1765802800655365,-0.2032250165939331,0.3617924153804779,-0.22772130370140076,-0.1729925274848938,-0.12929661571979523,-0.1134718731045723,0.030532337725162506,0.04321649298071861,-0.10123385488986969,-0.3816353976726532,0.12596605718135834,0.06347720324993134,0.16114723682403564,-0.09273339807987213,-0.17448051273822784,-0.05095556005835533,-0.2365715056657791,0.3702426254749298,0.005841780453920364,-0.10232425481081009,0.20808327198028564,0.009251829236745834,0.021151255816221237,-0.4124557077884674,-0.5362154245376587,-0.5697665214538574,0.19798074662685394,-0.0444047749042511,0.015117074362933636,0.30990728735923767,0.2411988079547882,-0.14079853892326355,-0.04318423569202423,-0.047392744570970535,0.028610095381736755,-0.16542281210422516,0.10341935604810715,0.15886174142360687,-0.2433505356311798,0.14196495711803436,-0.19635778665542603,0.5036413073539734,-0.1139754131436348,-0.22273974120616913,0.05973903462290764,0.09555850178003311,0.013572431169450283,-0.04637019708752632,0.14419828355312347,-0.009509406983852386,-0.3118877708911896,0.026106378063559532,-0.03678001090884209,0.003544739680364728,-0.07208114117383957,0.22448788583278656,-0.0897381454706192,0.1915920525789261,0.11478199809789658,-0.16024483740329742,0.10978487879037857,-0.2758232355117798,-0.30787453055381775,0.0008410197915509343,0.11799483746290207,-0.13449734449386597,0.3302847146987915,0.4124409258365631,0.016447370871901512,0.1208140030503273,0.14972123503684998,-0.07613785564899445,-0.15465158224105835,0.002205171622335911,-0.2707090973854065,0.177496537566185,0.08135783672332764,-0.47880908846855164,0.3610495328903198,-0.10380090028047562,-0.220783531665802,-0.1392296403646469,0.04013723134994507,-0.35321059823036194,0.027852753177285194,0.3112066984176636,0.2656663954257965,0.41965052485466003,0.2014104425907135,0.0608840174973011,-0.26801228523254395,-0.1754322648048401,-0.056096214801073074,0.008827803656458855,0.09583352506160736,-0.0931999459862709,0.375827431678772,-0.12333155423402786,0.17388567328453064,-0.07582775503396988,-0.45153599977493286,0.009774979203939438,-0.008047474548220634,-0.11882724612951279,-0.3065127432346344,-0.04323927313089371,0.20934557914733887,0.012339184992015362,0.28071269392967224,-0.04561924189329147,0.25501003861427307,0.015473369508981705,0.14950083196163177,0.11388731747865677,-0.0397842712700367,-0.05603748932480812,-0.029431145638227463,0.3278100788593292,0.16631148755550385,-0.06216553971171379,-0.050798870623111725,-0.11272583156824112,0.06354054063558578,0.20604784786701202,-0.13010790944099426,-0.018508771434426308,-0.07935424149036407,-0.04353572800755501,0.17447374761104584,-0.268870085477829,0.17130829393863678,0.0478198416531086,0.44562527537345886,0.019023152068257332,0.13554313778877258,-0.2620639503002167,-0.07730046659708023,0.009530242532491684,-0.4237135350704193,-0.2562873959541321,-0.18844392895698547,0.07010873407125473,-0.13319194316864014,0.1492820680141449,0.19961370527744293,0.22517596185207367,0.0054832883179187775,-0.199983149766922,-0.08403196930885315,0.3108401298522949,-0.5043973922729492,0.1346106082201004,0.27955883741378784,-0.08928282558917999,0.19746053218841553,-0.0034604929387569427,-0.2093838006258011,-0.36553874611854553,-0.018507497385144234,-0.024888213723897934,0.06886448711156845,0.019687630236148834,-0.3110737204551697,0.11217162758111954,0.260808527469635,-0.24829550087451935,-0.2351917326450348,0.029443923383951187,-0.18745173513889313,0.08443146198987961,-0.09403248876333237,-0.13273368775844574,0.34354445338249207,0.0024705359246581793,0.0662788674235344,-0.28846919536590576,-0.3627276122570038,-0.15599875152111053,0.0246470645070076,0.10568089038133621,-0.1323665827512741,0.24744932353496552,-0.14910469949245453,0.08466534316539764,-0.012523720972239971,-0.04107702523469925,-0.20156057178974152,-0.28412020206451416,-0.06438158452510834,-0.09599041193723679,-0.1323024481534958,0.08044908940792084,0.002402724465355277,-0.40167680382728577,-0.07272318750619888,-0.16657209396362305,0.08840496093034744,-0.09076015651226044,0.15901648998260498,-0.14565514028072357,0.1369091272354126,-0.2159910798072815,0.2691100537776947,0.31234607100486755,0.015406261198222637,-0.11218856275081635,-0.1276385337114334,0.018750546500086784,0.009196358732879162,0.38765594363212585,0.22590555250644684,-0.09955155104398727,0.2416081428527832,0.013608742505311966,0.21614907681941986,0.28280726075172424,-0.16995176672935486,0.035925138741731644,-0.19635862112045288,-0.10045714676380157,-0.0014425510307773948,-0.2662418782711029,0.3578879237174988,-0.181876540184021,0.3408854901790619,0.15548652410507202,-0.07024001330137253,0.10055046528577805,0.46214810013771057,0.004868983756750822,-0.022289084270596504,0.21079139411449432,0.44612011313438416]', '2026-09-08 04:19:29', 'paraphrase-multilingual-MiniLM-L12-v2');
INSERT INTO `animal_embeddings` (`animal_id`, `embedding`, `updated_at`, `model_name`) VALUES
(42, '[0.4344574809074402,-0.00837745238095522,-0.1490323692560196,0.1408531218767166,-0.15912000834941864,-0.18370115756988525,0.00637177424505353,0.0527116134762764,0.14738795161247253,-0.06551514565944672,0.21123012900352478,0.15335029363632202,0.05954703316092491,0.16706416010856628,0.008750099688768387,-0.053231678903102875,0.24145355820655823,-0.142178475856781,0.09586004912853241,-0.0869436040520668,-0.33685895800590515,-0.1821436583995819,0.08740528672933578,0.08037523180246353,-0.7667183876037598,-0.20233626663684845,-0.1170361116528511,0.020476285368204117,0.07958617806434631,-0.0194868016988039,0.061837296932935715,-0.20520064234733582,0.17360058426856995,-0.175227552652359,-0.3171381950378418,0.26257920265197754,0.0701357051730156,-0.31672194600105286,-0.23179586231708527,0.07905957102775574,0.14091826975345612,0.05315127968788147,0.26762062311172485,-0.09354522824287415,-0.21177026629447937,-0.09224237501621246,-0.3218737840652466,-0.13129012286663055,-0.28857144713401794,-0.18884000182151794,0.0008586333715356886,0.004789458587765694,0.05773293599486351,-0.04005790129303932,0.21479307115077972,0.2838578224182129,0.23120874166488647,0.21748442947864532,-0.14758218824863434,0.04151834920048714,0.2423131912946701,0.08359577506780624,-0.1840052306652069,0.24381573498249054,0.2080765664577484,0.048351630568504333,-0.18639539182186127,-0.12951630353927612,-0.1581801474094391,0.05028979107737541,0.12182720750570297,0.04012622684240341,0.0069836219772696495,-0.04105642810463905,0.132902130484581,-0.06419149786233902,-0.06219392269849777,-0.06341589242219925,0.26228585839271545,0.08889560401439667,0.04563640430569649,0.3018433451652527,0.055009301751852036,0.0248661357909441,-0.04044856131076813,0.239242821931839,0.11428795009851456,-0.06826689839363098,-0.5136874914169312,0.15889166295528412,0.2201615422964096,0.2838135361671448,0.14107316732406616,-0.12739473581314087,-0.028272027149796486,0.13946183025836945,0.01954081654548645,0.014593630097806454,-0.5436023473739624,0.1606229990720749,0.21855458617210388,0.137983039021492,-0.29378214478492737,-0.23062697052955627,0.09221462905406952,0.24283385276794434,-0.05350646376609802,-0.5480812191963196,-0.38803088665008545,0.3782368004322052,-0.132734477519989,0.12861116230487823,-0.19255734980106354,0.1177947148680687,-0.009420306421816349,-0.06385741382837296,-0.4885736107826233,-0.02497599646449089,0.4315051734447479,0.15913110971450806,0.39675331115722656,-0.16421759128570557,-0.07503516972064972,-0.18792608380317688,0.46956995129585266,0.0005276388837955892,0.14538174867630005,0.4286060631275177,-0.11049702763557434,-0.062382493168115616,0.10684533417224884,-0.06591849774122238,-0.0768277570605278,-0.14039748907089233,0.2524881660938263,0.2629384696483612,-0.13805219531059265,-0.04418184608221054,-0.034658435732126236,-0.019242266193032265,0.1798841506242752,-0.05753449350595474,-0.03930992633104324,0.14012077450752258,0.14919787645339966,0.15164688229560852,0.05463607609272003,0.09789570420980453,-0.004260934889316559,0.1668367087841034,0.07432594150304794,-0.16995388269424438,0.30472350120544434,-0.30528372526168823,-0.04832293838262558,-0.11197788268327713,-0.07603693753480911,0.02797691896557808,0.03257569298148155,0.004497101530432701,-0.4142470061779022,0.007238101214170456,-0.05989939719438553,0.09160644561052322,-0.13190998136997223,-0.13532595336437225,-0.1416340172290802,-0.23963545262813568,0.3478166460990906,0.036355435848236084,-0.047707680612802505,0.21493254601955414,0.12691335380077362,0.05116311088204384,-0.22541747987270355,-0.5298919081687927,-0.5911175012588501,0.22507917881011963,-0.09548488259315491,-0.016382630914449692,0.162311390042305,0.32324928045272827,-0.28118306398391724,-0.10163247585296631,-0.24362297356128693,0.10327593237161636,-0.2619927227497101,-0.0024877008982002735,0.20513509213924408,-0.31504011154174805,0.071785569190979,-0.30406859517097473,0.6062800884246826,-0.1280922144651413,-0.18604342639446259,0.0359475240111351,0.1608520895242691,0.023896323516964912,0.05481426417827606,0.10773450881242752,-0.002856817562133074,-0.2513960897922516,0.1329059600830078,-0.08986453711986542,-0.0158905778080225,-0.0376487635076046,0.2268635481595993,-0.059435464441776276,0.24658282101154327,0.15049272775650024,-0.27244865894317627,0.13212639093399048,-0.22730877995491028,-0.2812824845314026,0.011594248004257679,0.19102197885513306,-0.033763375133275986,0.24519838392734528,0.4142839312553406,-0.03626176342368126,0.17014792561531067,0.04642387107014656,-0.05869032070040703,-0.15774282813072205,0.01635056361556053,-0.2459164261817932,0.14568404853343964,0.1116366907954216,-0.4690008759498596,0.2837212085723877,-0.060836102813482285,-0.06368153542280197,-0.245613694190979,0.10687001794576645,-0.30531495809555054,-0.021786902099847794,0.4776844382286072,0.21121487021446228,0.4366223216056824,0.3779565095901489,0.049490850418806076,-0.24692495167255402,-0.15205508470535278,0.06953968107700348,0.012298090383410454,0.24714885652065277,-0.12718185782432556,0.34446778893470764,-0.15966108441352844,0.20163331925868988,-0.0960419550538063,-0.34130537509918213,-0.019804826006293297,-0.06726052612066269,0.058562107384204865,-0.2967163920402527,-0.13966836035251617,0.19393981993198395,0.025757864117622375,0.18767784535884857,-0.10400804132223129,0.16214466094970703,-0.018773242831230164,0.3205873668193817,0.06715615838766098,-0.1370639204978943,-0.11607164889574051,-0.2323310822248459,0.32498976588249207,0.08341061323881149,-0.11149035394191742,-0.06077619269490242,-0.16471993923187256,0.021243678405880928,0.08283856511116028,-0.20944581925868988,-0.020939044654369354,-0.009747788310050964,0.052947431802749634,0.14503316581249237,-0.38056445121765137,0.10866754502058029,-0.05777839943766594,0.3964659869670868,-0.08021610230207443,0.04710424318909645,-0.23699675500392914,0.05379616841673851,-0.0266296174377203,-0.44616276025772095,-0.3277258574962616,0.018996810540556908,0.0010872066486626863,-0.11162850260734558,0.1741737276315689,0.16200532019138336,0.3153984844684601,-0.025615209713578224,-0.07515560835599899,-0.0945846363902092,0.31989791989326477,-0.5402088165283203,0.10126140713691711,0.3060566782951355,-0.12715372443199158,0.19284550845623016,-0.05602867156267166,-0.14743871986865997,-0.28155237436294556,-0.17320115864276886,-0.16020537912845612,0.020055988803505898,0.10804003477096558,-0.14668579399585724,0.06851734220981598,0.37431496381759644,-0.21084168553352356,-0.2559164762496948,-0.014924648217856884,-0.18748332560062408,0.07900861650705338,-0.05050354450941086,-0.26008370518684387,0.33931317925453186,0.025058859959244728,-0.01734788529574871,-0.06688038259744644,-0.3694303333759308,-0.21251237392425537,-0.010954197496175766,0.006290112622082233,-0.2040407359600067,0.13349179923534393,-0.19081729650497437,-0.021369410678744316,0.07583340257406235,-0.08245468884706497,-0.1738637536764145,-0.2771555483341217,0.0058674016036093235,-0.05842047929763794,-0.10222981870174408,0.12117312848567963,0.02263350412249565,-0.3226875066757202,-0.03117142803966999,-0.15040268003940582,-0.12429022043943405,-0.07904843240976334,0.03819946572184563,-0.12300451099872589,0.22218599915504456,-0.18517006933689117,0.18390345573425293,0.2352689504623413,-0.04108306020498276,-0.02840784378349781,-0.10504662245512009,-0.02209005504846573,0.08865854144096375,0.4860701262950897,0.12773604691028595,-0.07609622925519943,0.16942191123962402,0.02982262149453163,0.21258476376533508,0.3758307695388794,-0.18790489435195923,0.004435237962752581,-0.27651822566986084,-0.07048802822828293,0.026897631585597992,-0.25308752059936523,0.4122454822063446,-0.21029843389987946,0.21562190353870392,0.09757959842681885,-0.07428746670484543,0.08736895024776459,0.4299774169921875,0.005277042742818594,0.11646857857704163,0.26333966851234436,0.42499661445617676]', '2026-09-08 04:18:58', 'paraphrase-multilingual-MiniLM-L12-v2'),
(43, '[0.3617453873157501,-0.013474944047629833,-0.15837150812149048,0.2139820009469986,-0.21093453466892242,-0.2104446440935135,0.1078050285577774,-0.04250999540090561,0.26566943526268005,-0.025667035952210426,0.22115126252174377,0.1671055108308792,-0.07750444114208221,0.059618063271045685,0.03717219457030296,-0.15152345597743988,0.18164728581905365,-0.19397494196891785,0.10138893872499466,0.05287958309054375,-0.2739139199256897,-0.23625268042087555,-0.005498544313013554,0.03973027318716049,-0.8195832967758179,-0.1594420075416565,-0.21413566172122955,0.03684718534350395,0.06587859988212585,-0.03800293058156967,0.14232458174228668,-0.22768741846084595,0.165751650929451,-0.23728078603744507,-0.3002108335494995,0.23152852058410645,0.10934590548276901,-0.38436296582221985,-0.20355838537216187,0.029392147436738014,0.22356051206588745,0.06799797713756561,0.3589184582233429,-0.0474843755364418,-0.16119438409805298,0.0055862413719296455,-0.31976646184921265,-0.08958663791418076,-0.2641753852367401,-0.18011367321014404,-0.07269877940416336,0.018180960789322853,0.08570138365030289,-0.039825163781642914,0.2213197946548462,0.2922215163707733,0.2630993723869324,0.26436564326286316,-0.1960773915052414,0.10645206272602081,0.30175837874412537,0.14070133864879608,-0.1760430485010147,0.2063382863998413,0.19914481043815613,-0.03858964517712593,-0.13163980841636658,-0.052077773958444595,-0.15609011054039001,0.00875457189977169,0.1359912008047104,0.03584282472729683,-0.10293719917535782,-0.06556795537471771,0.15413592755794525,-0.027035946026444435,-0.13137507438659668,-0.06999523937702179,0.345990926027298,0.07546591013669968,0.008157476782798767,0.27012041211128235,0.050579022616147995,0.06905294209718704,-0.02880808711051941,0.2895253300666809,0.10860445350408554,-0.051868993788957596,-0.4797966480255127,0.2249700427055359,0.2063874751329422,0.23898062109947205,0.16368941962718964,-0.13833729922771454,-0.003567609703168273,0.1537507176399231,-0.03532588854432106,-0.0030867853201925755,-0.5616533756256104,0.16900470852851868,0.17397604882717133,0.1980850249528885,-0.33327531814575195,-0.22046715021133423,0.12713898718357086,0.22828370332717896,-0.030205421149730682,-0.45817604660987854,-0.38650673627853394,0.35469570755958557,-0.09502553194761276,0.09959552437067032,-0.22355996072292328,0.08768067508935928,-0.013058559969067574,-0.0479285754263401,-0.570573091506958,-0.03824654966592789,0.42090246081352234,0.14626990258693695,0.36653149127960205,-0.16069886088371277,-0.16567333042621613,-0.1601189523935318,0.5089119076728821,-0.07468658685684204,0.1348663568496704,0.4603230655193329,-0.08232241868972778,-0.05774340406060219,0.1748664379119873,-0.02059103362262249,-0.19259874522686005,-0.12368346005678177,0.22611881792545319,0.26580747961997986,-0.055666036903858185,-0.10926984995603561,-0.09530067443847656,0.060604166239500046,0.20336128771305084,-0.024779893457889557,0.09620156139135361,0.13957996666431427,0.10302002727985382,0.17191603779792786,0.10995370149612427,0.043061595410108566,0.013159794732928276,0.20305253565311432,0.15474729239940643,-0.24432076513767242,0.46987804770469666,-0.3053988814353943,-0.1592017114162445,-0.16686081886291504,-0.12055990099906921,0.07529199868440628,0.03453660011291504,-0.04040217027068138,-0.5389789938926697,0.15904834866523743,-0.06739116460084915,0.11127573996782303,-0.06085227429866791,-0.21571040153503418,-0.13162104785442352,-0.2484169602394104,0.3108653724193573,-0.040627941489219666,-0.06046080216765404,0.22633524239063263,0.053680043667554855,-0.018557514995336533,-0.230722114443779,-0.582425594329834,-0.5779956579208374,0.30963608622550964,-0.034656595438718796,-0.03763338550925255,0.13052348792552948,0.2958839237689972,-0.22920069098472595,-0.19585391879081726,-0.25516948103904724,0.0842006653547287,-0.24423350393772125,0.07277226448059082,0.2042710930109024,-0.23397164046764374,0.07883265614509583,-0.10167530924081802,0.5972446799278259,-0.06055701524019241,-0.19678716361522675,-0.04297969490289688,0.16790355741977692,0.0906950905919075,0.05889108404517174,0.08054916560649872,-0.026645569130778313,-0.33114296197891235,0.08931349962949753,-0.09006405621767044,0.008527632802724838,-0.05696217343211174,0.14612571895122528,-0.08983311802148819,0.2751125395298004,0.06859979778528214,-0.30351722240448,0.13630306720733643,-0.3388773202896118,-0.16832764446735382,0.015718810260295868,0.16580048203468323,-0.09844031184911728,0.2250758707523346,0.51326984167099,-0.10150019079446793,0.1054271012544632,0.10771898925304413,-0.10439932346343994,-0.19239620864391327,-0.07064571976661682,-0.26344144344329834,0.22762466967105865,0.0811847671866417,-0.4272746741771698,0.34009850025177,-0.04345997795462608,-0.16025292873382568,-0.16441185772418976,0.07695581763982773,-0.38963583111763,0.06455506384372711,0.4626038074493408,0.2752494215965271,0.38572293519973755,0.30489617586135864,0.08201012760400772,-0.31063759326934814,-0.12270540744066238,0.00993932131677866,-0.04437124356627464,0.2894400656223297,-0.018531212583184242,0.39183545112609863,-0.08483698219060898,0.18405643105506897,-0.001164534711278975,-0.4125630557537079,-0.014568907208740711,-0.09287455677986145,-0.0578683540225029,-0.35879895091056824,-0.11311349272727966,0.18412594497203827,0.08129864186048508,0.2258574664592743,-0.17566293478012085,0.27472081780433655,0.009704404510557652,0.1911335438489914,0.11036539077758789,-0.13872410356998444,-0.05306844413280487,-0.18098494410514832,0.41056597232818604,0.15228809416294098,-0.12861162424087524,-0.09732992947101593,-0.17496825754642487,-0.019636932760477066,0.09820406883955002,-0.21606551110744476,-0.04115989804267883,-0.149978905916214,0.0010303627932444215,0.21237286925315857,-0.40104031562805176,0.14307570457458496,-0.04609173908829689,0.41289663314819336,0.0053186859004199505,0.08119846880435944,-0.1489374339580536,0.12288720905780792,-0.1101045161485672,-0.43236735463142395,-0.2350054383277893,-0.07165124267339706,0.016179809346795082,-0.0985538437962532,0.2428630292415619,0.0882859006524086,0.33808574080467224,0.02825550176203251,-0.14003993570804596,-0.043816108256578445,0.34177452325820923,-0.554697573184967,0.04512310400605202,0.32086339592933655,-0.130774587392807,0.29886242747306824,0.024703530594706535,-0.24256111681461334,-0.2357589304447174,-0.08169922232627869,-0.1519274264574051,-0.018359264358878136,0.04078786447644234,-0.20539094507694244,0.08797537535429001,0.36871516704559326,-0.2455025315284729,-0.32819074392318726,-0.03263946250081062,-0.20212726294994354,0.06655542552471161,-0.06167594715952873,-0.20281104743480682,0.31710007786750793,-0.014061647467315197,-0.08044277131557465,-0.08934080600738525,-0.3766500651836395,-0.2590506374835968,0.08424060791730881,0.09997962415218353,-0.18052725493907928,0.2953648865222931,-0.19403144717216492,0.09992565214633942,0.103734090924263,-0.044419437646865845,-0.1910448521375656,-0.30625155568122864,-0.04665693640708923,-0.07481098175048828,-0.19613873958587646,0.17758709192276,-0.050486329942941666,-0.3823765218257904,-0.04624317213892937,-0.1390334665775299,-0.12986086308956146,-0.08905419707298279,0.07896558940410614,-0.12051407247781754,0.18267633020877838,-0.18188956379890442,0.2490120381116867,0.2459876537322998,-0.025264091789722443,-0.07330331951379776,-0.047174230217933655,-0.03958583250641823,0.0015776074724271894,0.4769321382045746,0.15757392346858978,-0.10461290180683136,0.17376300692558289,0.001422438188455999,0.2232827991247177,0.39883288741111755,-0.2701643705368042,0.03857368230819702,-0.23866958916187286,-0.05335880443453789,0.017704050987958908,-0.28314879536628723,0.3693317174911499,-0.2585204243659973,0.30325260758399963,0.018829548731446266,-0.03612001985311508,0.04377516359090805,0.48947590589523315,-0.0378347784280777,0.0454028882086277,0.2527604401111603,0.41719338297843933]', '2026-09-08 04:18:13', 'paraphrase-multilingual-MiniLM-L12-v2'),
(44, '[0.5135579109191895,-0.07241605222225189,-0.04644332453608513,0.14438894391059875,-0.3214609622955322,-0.2664916217327118,0.22469985485076904,0.08942712098360062,0.07115864753723145,0.039155472069978714,0.19312314689159393,-0.016474345698952675,-0.10079280287027359,0.10926438122987747,0.07703614234924316,-0.14230042695999146,0.23616476356983185,-0.16004665195941925,0.15376101434230804,-0.11625837534666061,-0.3207109570503235,-0.19445262849330902,0.024355174973607063,0.09216627478599548,-0.7847691774368286,-0.2615782916545868,-0.16062642633914948,0.01734837330877781,0.06074828654527664,0.07839047908782959,0.04301009327173233,-0.08297155052423477,0.0392799898982048,-0.1618558168411255,-0.42179086804389954,0.2173895239830017,0.10797813534736633,-0.47594311833381653,-0.1372494399547577,0.020460722967982292,0.19967222213745117,-0.04878988116979599,0.31256985664367676,-0.20469272136688232,-0.3099392056465149,-0.05282720923423767,-0.4260532855987549,-0.09337417036294937,-0.20627254247665405,-0.19652049243450165,0.030521951615810394,-0.009547233581542969,0.05348606035113335,-0.04530613496899605,0.2517566978931427,0.43619218468666077,0.2915585935115814,0.17347803711891174,-0.20183995366096497,0.04464893415570259,0.25294598937034607,0.10648387670516968,-0.15296946465969086,0.2142653465270996,0.11030464619398117,-0.06849703192710876,-0.21067526936531067,-0.10847631096839905,-0.1418730914592743,-0.07283001393079758,0.1034235805273056,0.036529239267110825,-0.06788644194602966,0.14424456655979156,0.22175009548664093,-0.12482629716396332,-0.13358496129512787,-0.11690505594015121,0.16426922380924225,0.08529727905988693,0.11172012984752655,0.26023367047309875,0.10998979210853577,0.05411252751946449,0.030928896740078926,0.23588773608207703,0.15778757631778717,-0.10007228702306747,-0.38680973649024963,0.2499115914106369,0.1167660653591156,0.28406277298927307,0.07631292939186096,-0.2046903818845749,-0.09696981310844421,0.183937668800354,0.01933913864195347,-0.028050143271684647,-0.519996702671051,0.2810615301132202,0.09747038781642914,0.19614174962043762,-0.11174081265926361,-0.18691037595272064,0.10701854526996613,0.26795607805252075,-0.07811560481786728,-0.5245704054832458,-0.31909656524658203,0.2812477648258209,-0.19524112343788147,0.14887453615665436,-0.07808142155408859,0.09717383235692978,-0.022442268207669258,-0.05832976847887039,-0.5867534875869751,-0.0025607699062675238,0.507148265838623,0.10071974247694016,0.44558030366897583,-0.13626132905483246,-0.1004253476858139,-0.13258807361125946,0.4369020462036133,0.08885315805673599,0.2702944874763489,0.4426180124282837,-0.10085128247737885,-0.03936398774385452,0.12424286454916,-0.08529727905988693,-0.03040435165166855,-0.027269676327705383,0.2368258386850357,0.2868543267250061,-0.06107446178793907,-0.02418108657002449,-0.13426807522773743,0.044629354029893875,0.2981640100479126,0.006790915969759226,0.0617385134100914,0.11616203188896179,-0.007982290349900723,0.12421011924743652,0.002637627301737666,0.14596471190452576,-0.07070234417915344,0.08085496723651886,0.19956496357917786,-0.14389891922473907,0.3645370602607727,-0.13592876493930817,-0.07586856186389923,-0.1336098462343216,-0.03582410886883736,0.024956364184617996,0.17999976873397827,-0.06227380037307739,-0.45213669538497925,-0.01842905953526497,-0.01199718564748764,0.1189500242471695,-0.11666662991046906,-0.12362533807754517,-0.061980314552783966,-0.18275558948516846,0.4325220584869385,-0.1476178616285324,-0.08187669515609741,0.27537772059440613,0.014267131686210632,-0.007197011727839708,-0.11118447780609131,-0.5325140953063965,-0.6520488858222961,0.2598174810409546,-0.0496797189116478,-0.10705830901861191,0.17176394164562225,0.34767717123031616,-0.08170387148857117,-0.11717921495437622,-0.2247573286294937,0.09316855669021606,-0.19870683550834656,0.060474734753370285,0.30011695623397827,-0.2574160695075989,0.04054322838783264,-0.3372691571712494,0.6096495985984802,-0.10501585900783539,-0.0860472247004509,0.057041607797145844,0.17324475944042206,0.05003282055258751,0.09135422855615616,0.059664029628038406,0.06296738237142563,-0.521152913570404,0.1159965991973877,-0.04398472234606743,0.01252721156924963,-0.07871406525373459,0.26218292117118835,-0.07325214892625809,0.2663350999355316,0.05717794969677925,-0.244508758187294,-0.001816999982111156,-0.31908589601516724,-0.157097727060318,0.01905006356537342,0.03218236565589905,-0.10551607608795166,0.24620218575000763,0.5086146593093872,-0.13805924355983734,0.01890750415623188,0.15590424835681915,-0.036372508853673935,-0.1535411775112152,-0.10168110579252243,-0.2241644561290741,0.04391566663980484,-0.04072314500808716,-0.6073242425918579,0.26371386647224426,-0.142008975148201,-0.08016427606344223,-0.1936657428741455,-0.11492955684661865,-0.3513796031475067,0.1457902491092682,0.4507572650909424,0.4062501788139343,0.40914386510849,0.4312988221645355,0.002257433021441102,-0.1843073070049286,-0.18187524378299713,0.0971626490354538,-0.01274331659078598,0.30544090270996094,-0.17257161438465118,0.26908278465270996,-0.1449660360813141,0.16207635402679443,0.13391512632369995,-0.46163251996040344,-0.12884795665740967,-0.03855806589126587,0.1198187991976738,-0.33310216665267944,-0.015198340639472008,0.1551719307899475,0.04490625858306885,0.367168128490448,-0.07198011875152588,0.06322154402732849,-0.004666225519031286,0.20989757776260376,0.0716855600476265,-0.20802927017211914,-0.09521429240703583,-0.07565724104642868,0.34117478132247925,0.18250662088394165,-0.23953858017921448,0.0388464629650116,-0.11546342819929123,0.015927735716104507,0.08981115370988846,-0.266610711812973,0.04410615935921669,-0.13562826812267303,0.08633160591125488,0.2063056230545044,-0.3899933993816376,0.11360848695039749,0.02782251313328743,0.4069047272205353,-0.11585570126771927,0.06740210205316544,-0.20572830736637115,0.08583422750234604,-0.04220990464091301,-0.4849180281162262,-0.28763410449028015,0.09566783159971237,0.059082020074129105,-0.08030147850513458,0.19073814153671265,0.3009621202945709,0.28702524304389954,-0.1777603030204773,-0.1598888635635376,-0.04221042990684509,0.3285629451274872,-0.44214653968811035,-0.0048842402175068855,0.3393781781196594,-0.1587432324886322,0.3058848977088928,0.033120252192020416,-0.3030901253223419,-0.34974339604377747,-0.20483367145061493,-0.3196560740470886,0.10964182019233704,-0.04030298814177513,-0.18797191977500916,-0.014485892839729786,0.4056895673274994,-0.16371817886829376,-0.27534982562065125,-0.00436770124360919,-0.10214336216449738,0.026797885075211525,-0.05731021240353584,-0.23600704967975616,0.23581236600875854,0.030275411903858185,-0.07478135079145432,-0.17193163931369781,-0.33450305461883545,-0.3580033779144287,0.027950340881943703,-0.11549153923988342,-0.22964629530906677,0.09483683854341507,-0.07534415274858475,0.12501685321331024,0.13048912584781647,0.014771302230656147,-0.12213829904794693,-0.2571299076080322,0.08837582170963287,-0.0741535946726799,-0.07727722823619843,0.15865199267864227,-0.029214005917310715,-0.42895278334617615,0.08599968254566193,-0.1447218805551529,-0.21960458159446716,0.025711067020893097,0.1934291273355484,-0.13234694302082062,0.3126731514930725,-0.19937150180339813,0.1804145872592926,0.35915786027908325,0.019949031993746758,-0.14759144186973572,-0.1487310826778412,-0.10192058980464935,-0.1380234956741333,0.4694293439388275,0.12657922506332397,0.006864913739264011,0.10916290432214737,-0.036948785185813904,0.26542332768440247,0.3835636377334595,-0.26446303725242615,0.003788454458117485,-0.21169182658195496,-0.1554841548204422,-0.07993276417255402,-0.31794923543930054,0.4137021601200104,-0.20556846261024475,0.2793089747428894,0.08237361162900925,-0.15855686366558075,0.07147978991270065,0.47378191351890564,0.06080896034836769,0.16621847450733185,0.15776538848876953,0.3695480227470398]', '2026-09-08 04:17:01', 'paraphrase-multilingual-MiniLM-L12-v2'),
(45, '[0.43294015526771545,-0.038807742297649384,-0.07389049977064133,0.15442372858524323,-0.28478163480758667,-0.25172096490859985,0.2933690845966339,0.07755468040704727,0.07360538840293884,0.06599744409322739,0.15890349447727203,-0.09419992566108704,-0.06077572703361511,0.14308422803878784,-0.07438777387142181,-0.08874605596065521,0.26200705766677856,-0.17339278757572174,0.2066490203142166,-0.07928510755300522,-0.20411339402198792,-0.15996693074703217,0.08294761925935745,0.09693662077188492,-0.8034152388572693,-0.2848050892353058,-0.17549046874046326,0.04254758730530739,0.07127512991428375,0.16272391378879547,0.10110048949718475,-0.1528196632862091,0.09570275247097015,-0.12968343496322632,-0.41830816864967346,0.25839921832084656,0.11785717308521271,-0.5876354575157166,-0.20458878576755524,-0.01131890807300806,0.2263188660144806,-0.07711581140756607,0.3183637857437134,-0.21182045340538025,-0.22272846102714539,-0.010278599336743355,-0.41334104537963867,-0.1494278609752655,-0.2390148639678955,-0.12354778498411179,0.06810637563467026,-0.03204520419239998,0.09103437513113022,0.04443059116601944,0.22113311290740967,0.4139765202999115,0.2962256073951721,0.20477329194545746,-0.17115795612335205,0.009991319850087166,0.25227826833724976,0.08422144502401352,-0.13171567022800446,0.2789683938026428,0.12093944847583771,-0.09435966610908508,-0.24627770483493805,-0.021411200985312462,-0.28554219007492065,-0.06834214180707932,0.08851084858179092,0.03817738965153694,-0.005484100431203842,0.09991911053657532,0.17941488325595856,-0.1236310601234436,-0.12075506150722504,-0.1592329889535904,0.1653219759464264,0.1194867491722107,0.05455242097377777,0.17234301567077637,0.08593668043613434,0.013181576505303383,0.05688304081559181,0.2808820307254791,0.15003027021884918,-0.16881754994392395,-0.4586215317249298,0.2688450813293457,0.08998130261898041,0.3524368405342102,0.15447841584682465,-0.21797612309455872,-0.013197296299040318,0.1559770256280899,0.05326571688055992,-0.12678103148937225,-0.5804722905158997,0.25613030791282654,0.14643025398254395,0.22542011737823486,-0.16041143238544464,-0.29723432660102844,0.05799650400876999,0.29058486223220825,-0.10789976269006729,-0.5006929636001587,-0.29712316393852234,0.2491978406906128,-0.1502809077501297,0.13000808656215668,-0.08993320912122726,0.11920306831598282,-0.08757559210062027,-0.09972629696130753,-0.5989322066307068,-0.000988006591796875,0.5979112386703491,0.07923156768083572,0.48641419410705566,-0.10701465606689453,-0.06881075352430344,-0.1445619761943817,0.45113906264305115,-0.025600289925932884,0.2849912941455841,0.49122512340545654,-0.1718967705965042,-0.08374416828155518,0.11392627656459808,-0.061749041080474854,-0.08769972622394562,-0.06268328428268433,0.22237251698970795,0.30527204275131226,-0.13621480762958527,-0.028827324509620667,-0.1157631129026413,0.020098790526390076,0.2522972822189331,0.010921826586127281,0.06639375537633896,0.027714988216757774,-0.02548660896718502,0.12277275323867798,0.05717048421502113,0.11344921588897705,-0.006354248151183128,0.3662472069263458,0.14727003872394562,-0.16778431832790375,0.30823183059692383,-0.15021473169326782,-0.13363158702850342,-0.14437736570835114,-0.11221273243427277,0.028520088642835617,0.17518234252929688,-0.11400386691093445,-0.45543554425239563,-0.020100820809602737,-0.01531320158392191,0.1224231868982315,-0.23032943904399872,-0.1522136777639389,-0.0282667875289917,-0.0749342292547226,0.46964189410209656,-0.1149071678519249,-0.03016546741127968,0.21336059272289276,0.08862193673849106,0.06617115437984467,-0.20893923938274384,-0.5298065543174744,-0.4965975880622864,0.19042842090129852,-0.03910693898797035,-0.08832165598869324,0.276660680770874,0.3464040160179138,-0.017885331064462662,-0.15983735024929047,-0.23672236502170563,0.13474120199680328,-0.3168168365955353,-0.012900673784315586,0.25918999314308167,-0.3228553235530853,0.17906226217746735,-0.4548737108707428,0.5616572499275208,-0.15351814031600952,-0.03589649498462677,0.029628518968820572,0.13615542650222778,0.09131146222352982,0.1826559156179428,0.016179651021957397,0.21832206845283508,-0.412381112575531,0.16159585118293762,-0.11201740801334381,0.018023313954472542,-0.05397443100810051,0.20712710916996002,0.027133245021104813,0.2784748673439026,0.0030839783139526844,-0.22762227058410645,-0.10810666531324387,-0.3382244110107422,-0.16840216517448425,0.014399521984159946,0.16185496747493744,-0.04928407445549965,0.1812444031238556,0.5832589268684387,-0.22488705813884735,0.08763958513736725,0.1781800091266632,-0.19540877640247345,-0.11375852674245834,-0.016777673736214638,-0.21323463320732117,-0.0529770590364933,0.08476491272449493,-0.5718783736228943,0.2445347160100937,-0.22979724407196045,-0.10976370424032211,-0.1997988224029541,-0.05862059444189072,-0.2540633976459503,0.0777525082230568,0.4617224335670471,0.3407042622566223,0.44180747866630554,0.5181193351745605,0.023889299482107162,-0.22664687037467957,-0.1485832929611206,0.04927217587828636,0.027855562046170235,0.22450916469097137,-0.14696656167507172,0.3849197328090668,-0.12436401844024658,0.08764653652906418,0.05761619657278061,-0.5334083437919617,-0.03532249480485916,-0.018613658845424652,0.20001932978630066,-0.427548348903656,0.004605554509907961,0.22073066234588623,0.00007175711652962491,0.18646816909313202,-0.08822456747293472,0.09729349613189697,0.042817965149879456,0.14198720455169678,0.15107356011867523,-0.1708011031150818,-0.03231385350227356,0.09125032275915146,0.33058083057403564,0.17466165125370026,-0.25310850143432617,0.059908926486968994,-0.12027427554130554,0.05983879789710045,0.08855296671390533,-0.29669812321662903,0.029491791501641273,-0.16164986789226532,0.14085236191749573,0.12962278723716736,-0.3780120015144348,0.10620751976966858,-0.07911434024572372,0.4500286281108856,-0.17443224787712097,0.1259310394525528,-0.14812257885932922,0.08348347246646881,-0.09852742403745651,-0.4806779623031616,-0.2888944149017334,-0.05432803928852081,-0.007550257723778486,-0.07320600748062134,0.19557328522205353,0.3183111846446991,0.3374173641204834,-0.18285147845745087,-0.07630617171525955,0.011977313086390495,0.37037500739097595,-0.4040278196334839,0.08973737806081772,0.30609437823295593,-0.24030812084674835,0.30032649636268616,-0.061734359711408615,-0.31709158420562744,-0.3909728527069092,-0.27613556385040283,-0.40079614520072937,0.1733512431383133,0.058613941073417664,-0.2534734606742859,0.11037393659353256,0.4189985692501068,-0.2363581508398056,-0.24155499041080475,0.031089195981621742,-0.08997040241956711,0.06122714281082153,-0.0886145830154419,-0.38120144605636597,0.22596679627895355,-0.04784376919269562,-0.07318539172410965,-0.18086357414722443,-0.43642133474349976,-0.29542413353919983,-0.0907396525144577,0.1118527427315712,-0.24873489141464233,0.030505388975143433,-0.0645654946565628,0.09588439762592316,0.08087757229804993,-0.026514362543821335,-0.04962427169084549,-0.19073519110679626,0.04476229473948479,-0.08611269295215607,-0.09250801801681519,0.15079265832901,-0.15323670208454132,-0.4244740903377533,0.10637888312339783,-0.14268502593040466,-0.27640658617019653,0.05795465409755707,0.10632248222827911,-0.09106632322072983,0.29546159505844116,-0.26310595870018005,0.18276314437389374,0.36517953872680664,0.03876609727740288,-0.10485415905714035,-0.2095937430858612,-0.05567685887217522,-0.02535543031990528,0.6091229915618896,0.1982538402080536,-0.015598142519593239,0.02684519812464714,-0.016015712171792984,0.2500912845134735,0.36987119913101196,-0.24808304011821747,0.03030359372496605,-0.22872722148895264,-0.23382128775119781,0.023360924795269966,-0.3370305895805359,0.3808736205101013,-0.28077518939971924,0.27322912216186523,0.0741114392876625,-0.11957673728466034,0.10577783733606339,0.41795358061790466,0.2055572122335434,0.14882323145866394,0.1622123122215271,0.39967063069343567]', '2026-09-08 04:17:39', 'paraphrase-multilingual-MiniLM-L12-v2'),
(46, '[0.529876708984375,-0.04227405786514282,-0.1704808622598648,0.10905549675226212,-0.2281745821237564,-0.2620765268802643,0.23150236904621124,0.1432109773159027,0.07896506041288376,0.0073785739950835705,0.1958307921886444,0.03777313977479935,-0.07427781075239182,0.1574835181236267,-0.013124821707606316,-0.07480531930923462,0.2988460063934326,-0.2666129767894745,0.1644720435142517,-0.10263213515281677,-0.3693193793296814,-0.17636969685554504,0.07727866619825363,0.08727667480707169,-0.8538131713867188,-0.2544662356376648,-0.09386453032493591,-0.017512241378426552,0.0046105110086500645,0.11412646621465683,0.020362751558423042,-0.15326432883739471,0.14058253169059753,-0.14686551690101624,-0.43067818880081177,0.24954617023468018,0.08444178849458694,-0.46606576442718506,-0.15068785846233368,0.022721104323863983,0.2059887945652008,-0.02320132404565811,0.3413656949996948,-0.18058516085147858,-0.23457962274551392,-0.04095487669110298,-0.4047122597694397,-0.11878340691328049,-0.1765647679567337,-0.19734375178813934,0.04563808813691139,0.011888785287737846,0.03973769024014473,0.010342836380004883,0.24721376597881317,0.4878913462162018,0.223916694521904,0.2154727578163147,-0.2125132977962494,0.04388923943042755,0.23610155284404755,0.0007347448263317347,-0.16089728474617004,0.20922575891017914,0.1624610275030136,-0.025203101336956024,-0.23059296607971191,-0.08102667331695557,-0.201473206281662,-0.08270464092493057,0.09806031733751297,0.06320890039205551,0.04184383898973465,0.1365019530057907,0.1881246715784073,-0.11903837323188782,-0.06192757934331894,-0.17480872571468353,0.19483619928359985,0.09980073571205139,0.05896556004881859,0.2843110263347626,0.07789214700460434,0.08196943253278732,0.04162038490176201,0.3198172450065613,0.21006421744823456,-0.10433150082826614,-0.3884061276912689,0.20325952768325806,0.1491183191537857,0.3519223630428314,0.07242254912853241,-0.25165805220603943,-0.08529023081064224,0.2534354031085968,0.04242599010467529,-0.030629776418209076,-0.5935376286506653,0.27787166833877563,0.19039027392864227,0.16166870296001434,-0.14940017461776733,-0.3280012607574463,0.09253530204296112,0.3215216398239136,-0.0685243234038353,-0.4984075427055359,-0.32467249035835266,0.24039709568023682,-0.16455771028995514,0.12097129225730896,-0.08961425721645355,0.13423125445842743,-0.0019291978096589446,-0.07212772220373154,-0.5215511322021484,0.035034649074077606,0.5469870567321777,-0.024162132292985916,0.4906538128852844,-0.12774963676929474,0.006477240938693285,-0.15005140006542206,0.4912944734096527,0.08216623961925507,0.2828059494495392,0.4005683660507202,-0.12044718116521835,-0.04777335375547409,0.1291312277317047,-0.08975953608751297,-0.08322911709547043,-0.0919131264090538,0.1497972458600998,0.28556931018829346,-0.07158376276493073,-0.007046057842671871,-0.14056304097175598,0.009785057976841927,0.38805699348449707,-0.03953518718481064,0.03170464187860489,0.11774612963199615,-0.06822939962148666,0.11995819211006165,-0.04993058368563652,0.14714449644088745,-0.032797470688819885,0.04273587837815285,0.1438980996608734,-0.10534664243459702,0.3898758292198181,-0.30705705285072327,-0.05156133696436882,-0.09905153512954712,0.007439098320901394,0.030447935685515404,0.24220450222492218,-0.012136072851717472,-0.4710538387298584,-0.062207192182540894,-0.03764902427792549,0.11908494681119919,-0.17501093447208405,-0.14400099217891693,-0.0518428198993206,-0.18192288279533386,0.41074615716934204,-0.05226224288344383,0.09172660112380981,0.1914317011833191,0.07599693536758423,0.056218601763248444,-0.21725694835186005,-0.5294009447097778,-0.5321965217590332,0.21845842897891998,-0.09365133941173553,-0.12458998709917068,0.1400362253189087,0.33039963245391846,-0.08437260240316391,-0.07248015701770782,-0.21050557494163513,0.22956548631191254,-0.22308480739593506,0.03815118595957756,0.2383764237165451,-0.39429330825805664,0.08721843361854553,-0.3744169771671295,0.6491909027099609,-0.06373868137598038,-0.12894383072853088,0.01816823147237301,0.16868159174919128,-0.026341870427131653,0.1545494943857193,0.11519291996955872,0.06736831367015839,-0.36233577132225037,0.09137821197509766,-0.06799623370170593,0.020513318479061127,-0.009876545518636703,0.2824665904045105,-0.0564909502863884,0.2680761516094208,0.011057224124670029,-0.20045819878578186,0.0651177391409874,-0.30227288603782654,-0.21364937722682953,-0.007601186167448759,0.16439120471477509,-0.05650380626320839,0.1805828958749771,0.6057825684547424,-0.1116873174905777,0.04928356409072876,0.1964881420135498,-0.16042397916316986,-0.15425197780132294,-0.10151538252830505,-0.20889723300933838,0.057054370641708374,0.05238866060972214,-0.573863685131073,0.3047764301300049,-0.14917708933353424,-0.19486282765865326,-0.18775610625743866,-0.08246080577373505,-0.2698885202407837,0.10434653609991074,0.5383521914482117,0.29540807008743286,0.47425466775894165,0.4533635973930359,-0.0465170294046402,-0.28218886256217957,-0.17843660712242126,0.05169185623526573,-0.04332089051604271,0.2998424172401428,-0.08913560956716537,0.3033525347709656,-0.18131215870380402,0.10926370322704315,0.06686370819807053,-0.4959268569946289,-0.09986003488302231,-0.11209658533334732,0.1574927568435669,-0.32310235500335693,-0.12384999543428421,0.13801309466362,-0.05896054953336716,0.2480161041021347,-0.06607449799776077,0.07556071877479553,0.012709541246294975,0.3623383045196533,0.08252517133951187,-0.1485859602689743,-0.10223408788442612,-0.13416042923927307,0.3387526869773865,0.16730013489723206,-0.143532857298851,0.024583565071225166,-0.13100643455982208,-0.021249812096357346,0.04029098153114319,-0.26223766803741455,0.05436781793832779,-0.021623650565743446,0.17461387813091278,0.21407529711723328,-0.39904722571372986,0.11322039365768433,-0.07256826758384705,0.3900633454322815,-0.11003296822309494,0.03162255883216858,-0.1666451394557953,0.05632183700799942,-0.11729925870895386,-0.45361244678497314,-0.3318813741207123,-0.00025364075554534793,0.059171393513679504,-0.10790593922138214,0.2107798308134079,0.1347401887178421,0.41653189063072205,-0.17482244968414307,-0.057807888835668564,0.00944762583822012,0.339219331741333,-0.45396721363067627,0.07036065310239792,0.35336270928382874,-0.19872106611728668,0.2337094098329544,-0.08351363986730576,-0.29167988896369934,-0.3010718822479248,-0.27499520778656006,-0.2722930908203125,0.06738857924938202,0.07030720263719559,-0.24951443076133728,0.025594431906938553,0.39888107776641846,-0.27585574984550476,-0.32640185952186584,-0.006749022752046585,-0.06827130168676376,0.05576648190617561,-0.09423069655895233,-0.3193574845790863,0.26479917764663696,-0.029722442850470543,-0.11224675923585892,-0.19987767934799194,-0.4135226011276245,-0.37523743510246277,0.013371283188462257,-0.0005006366409361362,-0.21778464317321777,-0.025988705456256866,-0.09029330313205719,0.10701234638690948,0.11049479991197586,-0.025836164131760597,-0.10311644524335861,-0.24138978123664856,0.10099873691797256,-0.035293299704790115,-0.19953349232673645,0.14428961277008057,-0.016866421326994896,-0.32554715871810913,0.14949209988117218,-0.1489168107509613,-0.18099841475486755,0.0455344058573246,0.12108514457941055,-0.2179562896490097,0.22986574470996857,-0.2566457688808441,0.16610437631607056,0.3778197467327118,0.12259044498205185,-0.07723650336265564,-0.15257404744625092,-0.05252230539917946,-0.0741073489189148,0.5400697588920593,0.17026208341121674,-0.1206972673535347,0.07808360457420349,0.04212883114814758,0.26679226756095886,0.4494316279888153,-0.205165296792984,0.03939037024974823,-0.29148784279823303,-0.18149219453334808,-0.03318968415260315,-0.23279429972171783,0.35164356231689453,-0.3017441928386688,0.2670201361179352,0.09837250411510468,-0.17167514562606812,0.1053609624505043,0.3729749023914337,0.06388366222381592,0.16271063685417175,0.24282898008823395,0.3182923495769501]', '2026-09-08 04:16:20', 'paraphrase-multilingual-MiniLM-L12-v2'),
(47, '[0.4012002944946289,-0.005313185974955559,-0.24471376836299896,0.28635597229003906,-0.1602061241865158,-0.17818154394626617,0.14818045496940613,0.08240237832069397,0.1627819687128067,-0.03178812563419342,0.10206104069948196,0.07844070345163345,-0.02407216839492321,0.13944892585277557,-0.06478454917669296,-0.0697052925825119,0.19432151317596436,-0.23270320892333984,0.03650094196200371,0.1275349259376526,-0.2038596123456955,-0.170595183968544,0.1495824009180069,-0.04864876717329025,-0.8773441910743713,-0.1405813843011856,-0.04880506545305252,-0.01223931647837162,0.06874842941761017,0.015142527408897877,0.04296247288584709,-0.3329506814479828,0.12751270830631256,-0.2948669493198395,-0.29237431287765503,0.17606116831302643,0.04772442206740379,-0.2752033472061157,-0.1072254478931427,0.06390571594238281,0.24282440543174744,0.054052628576755524,0.27050578594207764,-0.12888623774051666,-0.2026437222957611,-0.06202186644077301,-0.2695804834365845,-0.18193472921848297,-0.25265249609947205,-0.20350736379623413,-0.004323324654251337,0.0013205946888774633,0.20929527282714844,-0.2155054807662964,0.09753939509391785,0.2671755254268646,0.282067209482193,0.3351624608039856,-0.2252519279718399,0.21908389031887054,0.21052750945091248,0.1489960253238678,-0.20344655215740204,0.24157308042049408,0.2672688663005829,-0.043298255652189255,-0.14600646495819092,-0.06117058917880058,-0.1300068348646164,0.07098526507616043,0.15137551724910736,0.015097391791641712,0.0390627346932888,-0.19685612618923187,0.25049853324890137,0.017355548217892647,-0.06241621822118759,-0.026157986372709274,0.18369130790233612,-0.03292611241340637,0.06787724047899246,0.27051353454589844,0.07638759166002274,0.051727570593357086,-0.056733179837465286,0.22808244824409485,0.20232778787612915,-0.12046186625957489,-0.3435150980949402,0.2096448391675949,0.25803622603416443,0.21630854904651642,0.17550358176231384,-0.18407993018627167,0.14202500879764557,0.3204202950000763,-0.14992740750312805,-0.13904345035552979,-0.6092975735664368,0.07415545731782913,0.16290061175823212,0.1970551759004593,-0.33064761757850647,-0.19407027959823608,0.05025969445705414,0.27453330159187317,-0.08482370525598526,-0.5441489219665527,-0.5857763886451721,0.28282585740089417,-0.12362903356552124,0.12079890072345734,-0.11833930015563965,0.10880213230848312,0.01429949514567852,0.013412915170192719,-0.4451870322227478,-0.011019670404493809,0.41985002160072327,0.11864762753248215,0.36690619587898254,-0.21141386032104492,-0.110179103910923,-0.10451509803533554,0.4731065630912781,-0.03469904139637947,0.01822001300752163,0.27155572175979614,-0.0697815865278244,-0.06525539606809616,0.017654310911893845,0.0902986079454422,-0.1320095658302307,-0.17843613028526306,0.18642881512641907,0.29545852541923523,-0.09060531854629517,-0.09753311425447464,0.029717136174440384,0.042607907205820084,0.22783274948596954,-0.16495634615421295,0.05772404000163078,0.036348339170217514,0.012397097423672676,0.11212395876646042,0.019796257838606834,0.10652629286050797,0.043584730476140976,0.18301980197429657,0.1278562992811203,-0.21614958345890045,0.36506935954093933,-0.1726071685552597,-0.15448644757270813,-0.10489515960216522,-0.17799827456474304,0.04674670845270157,0.07891543209552765,-0.08872480690479279,-0.42096659541130066,0.06693989038467407,-0.08820061385631561,0.060139164328575134,-0.13473081588745117,-0.11453825235366821,-0.06960327923297882,-0.18891820311546326,0.38470175862312317,-0.07839725911617279,-0.08135710656642914,0.24108631908893585,0.06697157770395279,0.10544650256633759,-0.37224602699279785,-0.5656490921974182,-0.548214316368103,0.16638101637363434,-0.06723526120185852,0.004394530318677425,0.29126593470573425,0.25948017835617065,-0.16844944655895233,-0.1012309342622757,-0.09906307607889175,0.17370633780956268,-0.2679113745689392,0.0858788788318634,0.13890571892261505,-0.17619986832141876,0.1675550788640976,-0.30521467328071594,0.42702004313468933,0.017507316544651985,-0.18970933556556702,0.04202742129564285,0.11773752421140671,0.019744647666811943,-0.14033131301403046,0.2370106428861618,0.052639421075582504,-0.3751799166202545,0.11984897404909134,-0.06296905875205994,-0.030882034450769424,-0.14135242998600006,0.15822750329971313,-0.03242446109652519,0.17272524535655975,0.032811738550662994,-0.11929500848054886,0.1508508324623108,-0.13959625363349915,-0.28000086545944214,-0.051881615072488785,0.2072984278202057,-0.19391149282455444,0.30715855956077576,0.4924790859222412,0.0040373895317316055,0.1558873951435089,0.0956270694732666,-0.09084092080593109,-0.15184366703033447,-0.031612955033779144,-0.2964375615119934,0.12681901454925537,0.1473734825849533,-0.5147829055786133,0.40529513359069824,-0.10936800390481949,-0.1782560795545578,-0.2124146819114685,0.10269803553819656,-0.20818842947483063,0.05548866465687752,0.2543586194515228,0.4021613597869873,0.2943084239959717,0.3096187114715576,-0.04731811583042145,-0.1482684165239334,-0.1649334579706192,-0.01256501954048872,-0.003531242487952113,0.17763006687164307,-0.03751055523753166,0.3484838008880615,-0.17707844078540802,0.1300632804632187,-0.07866757363080978,-0.42391684651374817,0.0019401998724788427,-0.012700422666966915,-0.10505416989326477,-0.29284295439720154,-0.13106194138526917,0.3417744040489197,-0.012358921580016613,0.21344639360904694,-0.16046109795570374,0.19394923746585846,-0.033920768648386,0.23524872958660126,0.12651026248931885,-0.013193855993449688,-0.034354206174612045,-0.07027788460254669,0.34067338705062866,0.23393775522708893,0.06444042176008224,-0.044381022453308105,-0.10374639183282852,0.1374591886997223,0.17366951704025269,-0.06529313325881958,-0.06327357888221741,-0.02486666850745678,-0.028383877128362656,0.07460132241249084,-0.29756927490234375,0.15018342435359955,-0.0036000609397888184,0.3869251608848572,-0.0676320269703865,0.0741427019238472,-0.2964555025100708,-0.05028366670012474,-0.037021104246377945,-0.40171992778778076,-0.278861939907074,-0.18150483071804047,0.14658823609352112,-0.02599734254181385,0.17686361074447632,0.15493053197860718,0.21283479034900665,-0.0017641562735661864,-0.14055590331554413,-0.007372331339865923,0.2919279932975769,-0.6229564547538757,0.1221596971154213,0.31749436259269714,-0.06508392840623856,0.22238154709339142,-0.02099512703716755,-0.2835395634174347,-0.3992025554180145,-0.11911321431398392,-0.07239165902137756,0.11347810178995132,0.06857018172740936,-0.22321493923664093,0.04635865241289139,0.2722807824611664,-0.2991824746131897,-0.21534542739391327,0.11419103294610977,-0.1455201804637909,0.06858894228935242,-0.10993009060621262,-0.20665858685970306,0.3761579692363739,0.08386315405368805,-0.03764067962765694,-0.20009034872055054,-0.44445639848709106,-0.2896549105644226,-0.07357550412416458,0.07259368151426315,-0.20679792761802673,0.20436960458755493,-0.13518266379833221,0.09079445153474808,0.10094078630208969,-0.11618535220623016,-0.1004069447517395,-0.21639297902584076,-0.006367772817611694,-0.011226468719542027,-0.12265481799840927,0.016435548663139343,0.06734904646873474,-0.4412015378475189,-0.034930940717458725,-0.11997466534376144,-0.03954305499792099,-0.1271533966064453,0.11146887391805649,-0.02178516797721386,0.10788464546203613,-0.2499099224805832,0.16754111647605896,0.29937997460365295,0.06072487682104111,-0.0027534649707376957,-0.140315979719162,0.024742702022194862,0.019295645877718925,0.4349295496940613,0.2732636332511902,-0.1084180399775505,0.1861971914768219,-0.037914473563432693,0.3010999858379364,0.29651445150375366,-0.22620737552642822,0.027289120480418205,-0.29609084129333496,-0.13826869428157806,0.02380790188908577,-0.22708292305469513,0.21595482528209686,-0.26061543822288513,0.31683897972106934,0.1092691719532013,-0.011403566226363182,0.10599297285079956,0.4398043751716614,0.028382493183016777,0.10282439738512039,0.27402883768081665,0.3438038229942322]', '2026-09-08 04:15:43', 'paraphrase-multilingual-MiniLM-L12-v2');
INSERT INTO `animal_embeddings` (`animal_id`, `embedding`, `updated_at`, `model_name`) VALUES
(48, '[0.4563119411468506,0.02315637841820717,-0.13805702328681946,0.15403853356838226,-0.17576716840267181,-0.11720729619264603,0.022051747888326645,0.09938035905361176,0.11106758564710617,-0.027341296896338463,0.21869559586048126,-0.009976543486118317,0.04357362166047096,0.1646176129579544,-0.0323847196996212,-0.01115227397531271,0.27587538957595825,-0.12874889373779297,0.07775705307722092,0.07213173806667328,-0.2568996846675873,-0.18627353012561798,0.13477922976016998,0.03603770211338997,-0.7793631553649902,-0.2715892493724823,-0.13618773221969604,0.04683607816696167,0.11842209100723267,0.05482807755470276,0.13531887531280518,-0.18655867874622345,0.13244441151618958,-0.23826394975185394,-0.34114983677864075,0.2574750781059265,0.10926547646522522,-0.3766220808029175,-0.27880150079727173,0.03196864202618599,0.2017659991979599,0.06814561039209366,0.29241394996643066,-0.12308144569396973,-0.2415989637374878,-0.07926741987466812,-0.3728843331336975,-0.16756772994995117,-0.23142282664775848,-0.206785649061203,0.012871106155216694,0.026901647448539734,0.02939930185675621,-0.013958083465695381,0.1846073716878891,0.3645651042461395,0.23592232167720795,0.3051106929779053,-0.1880316436290741,0.0708157867193222,0.248931884765625,0.14333520829677582,-0.19768723845481873,0.22825251519680023,0.32416489720344543,0.05063968524336815,-0.20745879411697388,-0.11429306864738464,-0.20998674631118774,-0.016110865399241447,0.16457195580005646,0.07865563035011292,0.06040593981742859,-0.13417291641235352,0.20948675274848938,0.048423707485198975,-0.040599022060632706,-0.14034496247768402,0.3070913553237915,0.1493861824274063,0.04068572074174881,0.2586515545845032,-0.010040239430963993,0.06528569757938385,-0.11760597676038742,0.21193453669548035,0.13760745525360107,-0.0986396074295044,-0.5579935312271118,0.21631699800491333,0.16674938797950745,0.39286649227142334,0.1912478804588318,-0.17824146151542664,0.03720223903656006,0.223609060049057,0.013071668334305286,-0.10332098603248596,-0.5542035102844238,0.12126006186008453,0.1900443732738495,0.1258659064769745,-0.30184295773506165,-0.3095521926879883,0.07260742783546448,0.24936369061470032,-0.0812610536813736,-0.520487368106842,-0.33200931549072266,0.2571844458580017,-0.12365991622209549,0.06765981763601303,-0.13222989439964294,0.15057878196239471,-0.023718686774373055,-0.09626337885856628,-0.4768141210079193,0.01453807670623064,0.549819827079773,0.03353859856724739,0.39854785799980164,-0.13107219338417053,0.07233479619026184,-0.17470702528953552,0.6044676303863525,-0.04448330029845238,0.14100399613380432,0.46729913353919983,-0.1195753663778305,-0.021823754534125328,0.09624852240085602,-0.032311104238033295,-0.03879494220018387,-0.19359344244003296,0.18093736469745636,0.2721247673034668,-0.13304053246974945,0.0021929971408098936,0.03756357356905937,0.05950512737035751,0.17661182582378387,-0.1751050502061844,0.07582961022853851,0.13807813823223114,0.02141079492866993,0.05372151732444763,0.14258421957492828,0.02770623005926609,-0.03435821086168289,0.1290946751832962,0.10132117569446564,-0.1924421489238739,0.387373149394989,-0.32896873354911804,-0.05993884056806564,-0.14349684119224548,-0.1355045884847641,0.02890094928443432,0.06924626231193542,-0.047783613204956055,-0.4862130880355835,-0.0021540899761021137,-0.06106928735971451,0.016604073345661163,-0.18635952472686768,-0.10042604058980942,-0.12487881630659103,-0.16889560222625732,0.2936365306377411,0.00020362269424367696,0.0365271158516407,0.23255327343940735,0.1970241814851761,0.0528234988451004,-0.2754637897014618,-0.5487602949142456,-0.602385401725769,0.23089084029197693,-0.18365079164505005,-0.08575651794672012,0.264240562915802,0.23933885991573334,-0.23226238787174225,-0.0855901911854744,-0.20674380660057068,0.13919907808303833,-0.3476305603981018,0.046115923672914505,0.2098831832408905,-0.3341650664806366,0.09521494060754776,-0.33370712399482727,0.6247777342796326,-0.068675197660923,-0.2808459401130676,-0.11245202273130417,0.20405587553977966,0.014347976073622704,0.07752109318971634,0.05313688516616821,0.06872744858264923,-0.3010936975479126,0.1891109049320221,-0.18291814625263214,-0.017972290515899658,-0.03606791794300079,0.19170963764190674,-0.06260347366333008,0.24349701404571533,0.11951924860477448,-0.26629960536956787,0.07743554562330246,-0.2211456149816513,-0.29108110070228577,0.009794053621590137,0.2915477156639099,-0.11108748614788055,0.2441011667251587,0.4979061186313629,-0.08950822800397873,0.25778788328170776,0.06724866479635239,-0.10856883972883224,-0.20749035477638245,0.011220159009099007,-0.25195929408073425,0.05190065875649452,0.16230227053165436,-0.4016028642654419,0.3285856544971466,-0.1018003597855568,-0.05321468412876129,-0.16418279707431793,0.19831626117229462,-0.1995302438735962,-0.015998031944036484,0.5294422507286072,0.28270068764686584,0.3353371322154999,0.36894840002059937,0.020963594317436218,-0.18745489418506622,-0.10526212304830551,0.03474314510822296,-0.002806547563523054,0.20334628224372864,-0.12189267575740814,0.40011414885520935,-0.11566343158483505,0.14527563750743866,-0.14998793601989746,-0.42644214630126953,-0.0094346534460783,-0.04278545826673508,0.07389495521783829,-0.2843608856201172,-0.11174456030130386,0.17198488116264343,0.09118914604187012,0.1523405909538269,-0.17567205429077148,0.0771123617887497,-0.04815506562590599,0.28777074813842773,0.14414477348327637,-0.12262120097875595,-0.20503053069114685,-0.18909287452697754,0.3557969629764557,0.17295107245445251,-0.048352524638175964,-0.09971366822719574,-0.16373637318611145,0.09139198064804077,0.06925197690725327,-0.1678704023361206,-0.07720071077346802,-0.05556107684969902,0.11044801026582718,0.09432382136583328,-0.2656472623348236,0.08833014219999313,-0.036326780915260315,0.3956466317176819,-0.045250363647937775,0.002579709282144904,-0.21292853355407715,0.005528494715690613,0.029521744698286057,-0.42428573966026306,-0.39212360978126526,0.02378964051604271,0.0075510344468057156,-0.09999606013298035,0.18122200667858124,0.15104012191295624,0.4098496735095978,-0.053075388073921204,-0.1278795450925827,-0.014139242470264435,0.2694218158721924,-0.48646754026412964,0.13841281831264496,0.3037826120853424,-0.14106927812099457,0.225796177983284,-0.003512490075081587,-0.25719013810157776,-0.2629859149456024,-0.2360251247882843,-0.15170131623744965,0.06583298742771149,0.15759338438510895,-0.18138472735881805,0.1334221065044403,0.3272829055786133,-0.23787130415439606,-0.29139313101768494,0.054459381848573685,-0.19518175721168518,0.0840827077627182,-0.10736989974975586,-0.36332598328590393,0.4052542746067047,-0.05277751013636589,0.033117037266492844,-0.0914858728647232,-0.5283837914466858,-0.24267852306365967,0.023066964000463486,0.045354705303907394,-0.21001699566841125,0.036221522837877274,-0.1675538271665573,0.08326438814401627,0.07292678207159042,-0.15259523689746857,-0.07116427272558212,-0.2697831094264984,0.021128250285983086,0.0018716966733336449,-0.16837219893932343,-0.008912001736462116,-0.02442179247736931,-0.3169589638710022,-0.01686682365834713,-0.14201806485652924,-0.21937012672424316,-0.08679970353841782,0.044519297778606415,-0.13683411478996277,0.22387494146823883,-0.23918987810611725,0.08801152557134628,0.19323229789733887,0.03437855839729309,-0.02484610676765442,-0.09502021968364716,-0.004899810068309307,0.013993468135595322,0.49595320224761963,0.17429712414741516,-0.12231684476137161,0.11528337746858597,-0.0008042320259846747,0.27426695823669434,0.4249042868614197,-0.1865280270576477,0.055403437465429306,-0.27393800020217896,-0.07190612703561783,0.03403620794415474,-0.21533608436584473,0.27834609150886536,-0.28330451250076294,0.24257057905197144,0.14603449404239655,-0.06307582557201385,0.04482654109597206,0.3232503831386566,0.08547596633434296,0.19114993512630463,0.2892698645591736,0.3207714557647705]', '2026-09-08 04:15:11', 'paraphrase-multilingual-MiniLM-L12-v2'),
(49, '[0.4482688903808594,-0.11491981893777847,-0.1561492383480072,0.1997557133436203,-0.2947101891040802,-0.09380582720041275,0.1908392459154129,0.11809325963258743,0.03911634534597397,0.04618901014328003,0.2116297334432602,-0.07852976024150848,-0.08071786910295486,0.09107641130685806,-0.06622129678726196,-0.01943090185523033,0.2550995945930481,-0.21461154520511627,0.09331811219453812,-0.0799419954419136,-0.2605364918708801,-0.21503444015979767,0.05493897199630737,0.06913326680660248,-0.8155540227890015,-0.3161598742008209,-0.17739182710647583,0.027434049174189568,0.01408233679831028,0.05043267086148262,0.08136437833309174,-0.20075885951519012,0.011551675386726856,-0.20245997607707977,-0.4092555344104767,0.22276079654693604,0.11439120769500732,-0.5056513547897339,-0.20855054259300232,-0.04931415244936943,0.22367385029792786,-0.09151201695203781,0.33646613359451294,-0.21263086795806885,-0.27435460686683655,-0.10315559059381485,-0.41696420311927795,-0.0770021304488182,-0.17335836589336395,-0.1976180374622345,-0.07704038172960281,-0.02058505453169346,0.03404104337096214,0.10404472053050995,0.24117544293403625,0.48326823115348816,0.2512128949165344,0.2961275279521942,-0.11704780161380768,0.03481023386120796,0.281556636095047,0.15856702625751495,-0.1697985678911209,0.23621033132076263,0.1420447826385498,-0.0019474979490041733,-0.17638282477855682,-0.12567509710788727,-0.20825017988681793,-0.08194644004106522,0.15331698954105377,0.11666877567768097,-0.028800278902053833,0.035299528390169144,0.2554771602153778,-0.03874843195080757,-0.04910875856876373,-0.1283257156610489,0.32911017537117004,0.17972436547279358,0.05734850838780403,0.1412070095539093,0.035781487822532654,0.1467100977897644,0.04730920121073723,0.22805079817771912,0.14774487912654877,-0.12017732113599777,-0.4235118627548218,0.23486733436584473,0.10808870941400528,0.43406006693840027,0.04260208085179329,-0.24404865503311157,-0.033121444284915924,0.24247056245803833,0.005704518873244524,-0.12084729969501495,-0.6356387138366699,0.21249361336231232,0.10718557238578796,0.19541873037815094,-0.14009366929531097,-0.2991946041584015,0.09232307970523834,0.2547956109046936,-0.027771897614002228,-0.4287336468696594,-0.3125019073486328,0.22936269640922546,-0.10780857503414154,0.0661049485206604,-0.12124966084957123,0.12143440544605255,0.0895133912563324,-0.06278665363788605,-0.5552344918251038,-0.03447220101952553,0.5316627025604248,-0.006372056435793638,0.43691182136535645,-0.08900555223226547,0.031034385785460472,-0.10825695842504501,0.549765944480896,-0.03336375579237938,0.293096661567688,0.5376183390617371,-0.18069830536842346,-0.004713066387921572,0.17041997611522675,-0.007183991372585297,-0.08315840363502502,-0.10640114545822144,0.18315771222114563,0.26732349395751953,-0.11523798108100891,-0.05578643083572388,-0.1605062633752823,0.08848520368337631,0.2631390690803528,0.008009272627532482,0.14107100665569305,0.12624697387218475,0.0570850744843483,0.06813126057386398,0.04729731008410454,0.09900066256523132,0.0583517923951149,0.08824358880519867,0.2032219022512436,-0.2424604594707489,0.414206862449646,-0.29815566539764404,-0.0008046997827477753,-0.12428195029497147,-0.10625491291284561,0.021541422232985497,0.16642771661281586,-0.12093298882246017,-0.5546913146972656,0.014973458833992481,0.015961894765496254,0.09722822904586792,-0.24972042441368103,-0.09566274285316467,-0.009690329432487488,-0.13949498534202576,0.3629542291164398,-0.11346251517534256,0.09714477509260178,0.19907616078853607,0.09928986430168152,0.027658304199576378,-0.14267058670520782,-0.5014861226081848,-0.48856136202812195,0.22944359481334686,-0.0793357640504837,-0.12343218177556992,0.11441320925951004,0.29716360569000244,0.01109241507947445,-0.11525542289018631,-0.25545015931129456,0.22631065547466278,-0.22654755413532257,0.08280657976865768,0.32643353939056396,-0.30092066526412964,0.09812398999929428,-0.37053051590919495,0.5494314432144165,-0.09684545546770096,-0.15905529260635376,-0.04875846207141876,0.20248866081237793,0.014198248274624348,0.12920309603214264,0.09203840047121048,0.15116871893405914,-0.40210914611816406,0.13449791073799133,-0.06519417464733124,-0.0428038090467453,-0.069435715675354,0.20945720374584198,0.006695250980556011,0.25182074308395386,0.05558832734823227,-0.2140965610742569,0.043622683733701706,-0.3195515275001526,-0.25208085775375366,0.0064244624227285385,0.1763925552368164,-0.04806661605834961,0.20240002870559692,0.6908955574035645,-0.15978308022022247,0.06977938115596771,0.13117694854736328,-0.12867186963558197,-0.13381777703762054,-0.06428482383489609,-0.19587169587612152,0.1218055933713913,0.1003623753786087,-0.5162255764007568,0.29925015568733215,-0.22815312445163727,-0.06296607851982117,-0.08200273662805557,-0.08748489618301392,-0.26514703035354614,0.15056206285953522,0.551435649394989,0.3679461181163788,0.4157990515232086,0.3728645145893097,0.005591141059994698,-0.2597964406013489,-0.14547058939933777,0.11768236756324768,-0.06183576583862305,0.2810242772102356,-0.1431557536125183,0.34963780641555786,-0.17760968208312988,0.16423848271369934,0.10333888232707977,-0.4676899313926697,-0.10926283895969391,-0.03842701017856598,0.08352429419755936,-0.412480890750885,-0.04652201011776924,0.19357800483703613,-0.012948664836585522,0.32750654220581055,-0.11201194673776627,0.02943292446434498,0.030326910316944122,0.24715656042099,0.20709097385406494,-0.1600843071937561,-0.14445608854293823,-0.11124268174171448,0.3148949444293976,0.1458989828824997,-0.16525664925575256,0.08282840251922607,-0.18196508288383484,0.09764046221971512,0.04353960230946541,-0.2240477353334427,-0.013714619912207127,-0.10472335666418076,0.15789294242858887,0.21660709381103516,-0.3672548532485962,0.109990194439888,0.038949254900217056,0.36335858702659607,-0.13398902118206024,0.009925184771418571,-0.14547179639339447,0.052235353738069534,-0.05226784199476242,-0.531363844871521,-0.35189372301101685,0.010839877650141716,-0.05071428790688515,-0.07108859717845917,0.19905151426792145,0.24133914709091187,0.41570255160331726,-0.15314975380897522,-0.17457109689712524,-0.024838225916028023,0.2676146924495697,-0.3965182900428772,0.08409726619720459,0.3015051782131195,-0.20101599395275116,0.3613477647304535,-0.005840704310685396,-0.42474719882011414,-0.26785099506378174,-0.21398119628429413,-0.33528321981430054,0.020463353022933006,0.12033744901418686,-0.25295814871788025,0.054781295359134674,0.38448330760002136,-0.24313707649707794,-0.2929207682609558,0.038936834782361984,-0.0435565747320652,0.03493091091513634,-0.03589819744229317,-0.37017831206321716,0.29125434160232544,-0.053928643465042114,-0.05604925751686096,-0.1552942991256714,-0.43961381912231445,-0.3380919396877289,0.038726333528757095,0.06250724196434021,-0.20180995762348175,0.09880563616752625,-0.10890241712331772,0.11263902485370636,0.08746594190597534,-0.02464866451919079,-0.059420693665742874,-0.29322531819343567,0.0187442135065794,0.018605109304189682,-0.20795954763889313,0.1315600723028183,-0.09593460708856583,-0.4016057550907135,0.03120112046599388,-0.14549694955348969,-0.18587593734264374,-0.05919636785984039,0.18442943692207336,-0.14525821805000305,0.2787628769874573,-0.28427475690841675,0.08117477595806122,0.2801457345485687,0.18768443167209625,-0.08012744039297104,-0.11503394693136215,-0.21374955773353577,-0.0637301430106163,0.48953381180763245,0.10635151714086533,-0.0411246195435524,0.03905731439590454,-0.03853975608944893,0.2522999942302704,0.4357880651950836,-0.28349557518959045,0.04337144270539284,-0.27727803587913513,-0.23128579556941986,-0.05084570497274399,-0.24131383001804352,0.31122687458992004,-0.31100982427597046,0.28747618198394775,0.11894024908542633,-0.1736401915550232,0.02283584699034691,0.40886563062667847,0.08117661625146866,0.15548783540725708,0.15608829259872437,0.34851500391960144]', '2026-09-08 04:14:23', 'paraphrase-multilingual-MiniLM-L12-v2'),
(53, '[0.3613077700138092,-0.052129633724689484,-0.06461285799741745,0.16940639913082123,-0.3189247250556946,-0.12299704551696777,0.18784025311470032,0.041494905948638916,0.15884782373905182,0.08537702262401581,0.13098300993442535,-0.17077435553073883,-0.028310835361480713,0.09610787034034729,0.06874319911003113,-0.08397382497787476,0.1954561322927475,-0.19003081321716309,0.045167166739702225,-0.06065291538834572,-0.2637268006801605,-0.19896343350410461,-0.06531617045402527,-0.022778164595365524,-0.8061918020248413,-0.24746555089950562,-0.10594853013753891,0.07173927873373032,0.08522841334342957,0.045835454016923904,0.09565840661525726,-0.13719841837882996,0.023596949875354767,-0.19765877723693848,-0.41001924872398376,0.2554226815700531,0.05679020285606384,-0.4972088038921356,-0.16463087499141693,-0.03820930793881416,0.23228968679904938,-0.015419385395944118,0.3702571988105774,-0.14208422601222992,-0.23105961084365845,-0.06801111996173859,-0.385476291179657,-0.04752539098262787,-0.10739466547966003,-0.16571664810180664,-0.011829144321382046,-0.03313601016998291,-0.0016755004180595279,-0.07306542247533798,0.1740090548992157,0.521327555179596,0.3119771480560303,0.21189430356025696,-0.19937346875667572,0.06131270155310631,0.2003978192806244,0.08688278496265411,-0.16165341436862946,0.2686963677406311,0.16924850642681122,-0.030454549938440323,-0.24455417692661285,-0.12724320590496063,-0.15795575082302094,-0.13329564034938812,0.12513700127601624,-0.022434426471590996,0.02181950956583023,-0.09534752368927002,0.19068247079849243,-0.07652435451745987,-0.1238410621881485,-0.06060853600502014,0.18056029081344604,0.11628559976816177,0.09934736788272858,0.35356348752975464,0.08463434129953384,0.16263477504253387,-0.04856245219707489,0.2708739638328552,0.20960284769535065,-0.15416373312473297,-0.48553329706192017,0.30675220489501953,0.17559683322906494,0.22877943515777588,0.07791262865066528,-0.16004593670368195,-0.015793751925230026,0.1381009817123413,-0.0025831523817032576,-0.026247063651680946,-0.5978674292564392,0.08368567377328873,0.1419367790222168,0.19497007131576538,-0.1997564136981964,-0.27880731225013733,0.042531292885541916,0.34019413590431213,-0.1659846156835556,-0.5137194991111755,-0.3326813280582428,0.23619753122329712,-0.11802030354738235,0.18124015629291534,-0.08198612928390503,0.1301412284374237,0.030282320454716682,-0.04933929443359375,-0.5794891119003296,-0.058306653052568436,0.6344174146652222,0.10365719348192215,0.41605129837989807,-0.10154344141483307,-0.17557993531227112,-0.1581108272075653,0.3908286392688751,-0.10161522030830383,0.22857964038848877,0.5220434069633484,-0.051812414079904556,0.010358745232224464,0.11032240092754364,-0.07936642318964005,-0.08891846239566803,-0.04320988059043884,0.2603799104690552,0.45776817202568054,-0.16218942403793335,-0.1079956442117691,-0.0758465826511383,0.01421804167330265,0.19419234991073608,-0.07601380348205566,0.020444231107831,0.06970488280057907,0.0023121957201510668,0.05563771352171898,0.030071675777435303,0.09128876775503159,-0.09903772175312042,0.13028176128864288,0.20773127675056458,-0.18594522774219513,0.35667112469673157,-0.22020243108272552,-0.09108512103557587,-0.11671152710914612,-0.07409597188234329,-0.0063992273062467575,0.19589641690254211,-0.0209182295948267,-0.43183624744415283,-0.012157229706645012,-0.014851754531264305,0.10607767105102539,-0.09035862982273102,-0.11578813195228577,-0.07760027050971985,-0.14374154806137085,0.4387289583683014,-0.12562866508960724,-0.11396404355764389,0.29329341650009155,0.020517131313681602,0.0499703511595726,-0.13559465110301971,-0.4636826813220978,-0.4471827447414398,0.21013008058071136,-0.08508900552988052,-0.10468417406082153,0.13263371586799622,0.365782231092453,-0.1644236445426941,-0.15641751885414124,-0.2618129253387451,0.129855215549469,-0.24622710049152374,0.07748004794120789,0.20818881690502167,-0.2830567955970764,0.2045920193195343,-0.24889019131660461,0.6272359490394592,-0.09531214088201523,-0.0727551281452179,0.0012860902352258563,0.15029872953891754,0.062450677156448364,-0.014458107762038708,0.13243627548217773,0.06981073319911957,-0.4405211806297302,0.08945798873901367,-0.10744992643594742,0.05339740216732025,-0.07345996797084808,0.3280545473098755,0.010427907109260559,0.35051625967025757,0.06884444504976273,-0.24521346390247345,-0.06027378514409065,-0.3602108955383301,-0.22592748701572418,-0.017224259674549103,0.14645136892795563,-0.12928058207035065,0.1415598839521408,0.5448545813560486,-0.1328371912240982,0.07315850257873535,0.1124785989522934,-0.08795037865638733,-0.12503713369369507,-0.06935280561447144,-0.2690974473953247,0.07872748374938965,0.053484655916690826,-0.5519847273826599,0.33431658148765564,-0.19981083273887634,-0.15884195268154144,-0.1659540981054306,0.026701901108026505,-0.3041156530380249,0.1514834463596344,0.4727426767349243,0.34569793939590454,0.3234083950519562,0.3983857035636902,0.06609001755714417,-0.22307878732681274,-0.14335133135318756,0.09719372540712357,-0.013234182260930538,0.2981966435909271,-0.07745493948459625,0.25021710991859436,-0.07393911480903625,0.15893249213695526,0.12673719227313995,-0.5273134708404541,-0.09711196273565292,0.0931384265422821,0.052647512406110764,-0.33857616782188416,-0.032907597720623016,0.13233835995197296,0.023727763444185257,0.2945508360862732,-0.003761592088267207,0.10166631639003754,-0.0361505001783371,0.23079757392406464,0.09150820225477219,-0.1585986316204071,-0.08181603997945786,-0.04713509976863861,0.31092506647109985,0.17082326114177704,-0.1237196996808052,0.050485897809267044,-0.055692605674266815,0.051619961857795715,0.15457507967948914,-0.27945148944854736,0.023356571793556213,-0.18955513834953308,0.05987926945090294,0.19313128292560577,-0.37771764397621155,0.154573455452919,0.058902714401483536,0.38181373476982117,-0.11651479452848434,0.14369410276412964,-0.15752021968364716,0.009591533802449703,-0.07323108613491058,-0.49294233322143555,-0.2333967089653015,0.06285542249679565,-0.09981035441160202,-0.04148375988006592,0.127365842461586,0.20971110463142395,0.3620035946369171,-0.09002036601305008,-0.09581788629293442,0.054384563118219376,0.3763812184333801,-0.4998196065425873,-0.08186724781990051,0.3091038465499878,-0.24770742654800415,0.3624953627586365,-0.007159071508795023,-0.2897477447986603,-0.23156456649303436,-0.16181033849716187,-0.26619264483451843,0.10544095188379288,-0.010743461549282074,-0.12851731479167938,-0.018020564690232277,0.3450244069099426,-0.21180105209350586,-0.3336084485054016,0.026535650715231895,-0.08053810894489288,0.09308597445487976,-0.10483597218990326,-0.2786264419555664,0.23645395040512085,0.011326306499540806,-0.12969405949115753,-0.13675138354301453,-0.3172534704208374,-0.43260225653648376,0.03661506995558739,-0.09588806331157684,-0.18042577803134918,0.11606434732675552,-0.04673810675740242,0.08412066102027893,0.17760592699050903,-0.02290187031030655,-0.2060195952653885,-0.2583756744861603,0.04040328040719032,-0.03455902636051178,-0.07973489910364151,0.17864660918712616,-0.10025408118963242,-0.3805629014968872,0.005300434306263924,-0.15172390639781952,-0.20229429006576538,0.028750047087669373,0.1388855129480362,-0.023965751752257347,0.2972675859928131,-0.25464504957199097,0.16997000575065613,0.30070364475250244,-0.0014826197875663638,-0.07977379858493805,-0.15068547427654266,-0.10713723301887512,-0.0675063207745552,0.492000013589859,0.21025872230529785,-0.02778870426118374,0.05018574744462967,-0.06190444529056549,0.37000739574432373,0.44235536456108093,-0.26310446858406067,-0.04763190448284149,-0.16606515645980835,-0.2153072953224182,-0.06203412264585495,-0.337512344121933,0.32668259739875793,-0.23809650540351868,0.3333950340747833,0.15626361966133118,-0.10401777178049088,0.017870157957077026,0.5374817252159119,-0.024389825761318207,0.18779057264328003,0.2211097627878189,0.3605831563472748]', '2026-09-08 04:13:24', 'paraphrase-multilingual-MiniLM-L12-v2'),
(54, '[0.38959068059921265,-0.10680892318487167,-0.0817192941904068,0.17911170423030853,-0.3058515191078186,-0.13086821138858795,0.21421878039836884,0.05567213147878647,0.17267923057079315,0.022927934303879738,0.21509918570518494,-0.1439354568719864,-0.03783450275659561,0.10403182357549667,0.0008617021958343685,0.058290500193834305,0.2171543687582016,-0.22252485156059265,0.005777410231530666,-0.04072388634085655,-0.27772170305252075,-0.21539902687072754,-0.02387923002243042,-0.03111322596669197,-0.880521297454834,-0.32716062664985657,-0.15410499274730682,-0.002481583971530199,0.13446900248527527,0.07744672149419785,0.12879224121570587,-0.2094668298959732,-0.019723938778042793,-0.13387690484523773,-0.3872772753238678,0.33124348521232605,0.05801761895418167,-0.46199581027030945,-0.19538164138793945,-0.030630992725491524,0.2186356484889984,-0.06953084468841553,0.33498138189315796,-0.12799592316150665,-0.2600638270378113,-0.09005104005336761,-0.38015562295913696,-0.061306267976760864,-0.1775580644607544,-0.19112753868103027,-0.05344245582818985,0.023834845051169395,-0.11676262319087982,0.12046469002962112,0.2086029201745987,0.504292905330658,0.3342025876045227,0.2156750112771988,-0.22334882616996765,0.07953039556741714,0.22291935980319977,0.11484815925359726,-0.18710970878601074,0.2647266685962677,0.135142520070076,-0.0300705898553133,-0.21269425749778748,-0.1644057333469391,-0.2541346251964569,-0.119205042719841,0.24169723689556122,0.0616501048207283,-0.005396115593612194,-0.019924074411392212,0.21851862967014313,-0.04567646235227585,-0.0892738327383995,-0.09496230632066727,0.21973755955696106,0.1627892404794693,0.007401770446449518,0.21909067034721375,0.05583805590867996,0.16034473478794098,-0.06975433230400085,0.22935965657234192,0.19813194870948792,-0.22671274840831757,-0.487997829914093,0.2754407227039337,0.06781425327062607,0.4206833243370056,0.0631522461771965,-0.20755942165851593,-0.04365969076752663,0.15795454382896423,0.014386317692697048,-0.11043588817119598,-0.6767873764038086,0.20856249332427979,0.11789371073246002,0.2538069486618042,-0.17577610909938812,-0.41231784224510193,0.09267497062683105,0.35205575823783875,-0.1407576948404312,-0.5321246981620789,-0.30908963084220886,0.2026056945323944,-0.13901177048683167,0.16816827654838562,-0.18437986075878143,0.13304196298122406,0.0051545253954827785,-0.08699996769428253,-0.5202605724334717,-0.02971319854259491,0.6316207051277161,0.010473469272255898,0.47828489542007446,-0.060263488441705704,0.004377038683742285,-0.1494411677122116,0.42820268869400024,-0.06406397372484207,0.24040332436561584,0.5323944687843323,-0.13985271751880646,-0.009206213057041168,0.18673886358737946,-0.08023487031459808,-0.0798194408416748,-0.03587258607149124,0.23077960312366486,0.3661833703517914,-0.12369668483734131,-0.10364657640457153,-0.1437535136938095,0.007667457219213247,0.2876587510108948,-0.07233704626560211,0.05447736382484436,0.13653691112995148,0.02870483323931694,0.00025124155217781663,0.047708261758089066,0.08989857137203217,0.009857798926532269,0.15698650479316711,0.22680243849754333,-0.22770582139492035,0.3913883566856384,-0.3621084690093994,-0.03442305326461792,-0.10778804868459702,0.0010851845145225525,0.06885479390621185,0.19609348475933075,-0.014957847073674202,-0.37930789589881897,-0.061732035130262375,-0.044163864105939865,0.12917885184288025,-0.18905344605445862,-0.18364129960536957,-0.03254137933254242,-0.18852828443050385,0.29891929030418396,-0.11812145262956619,0.01614578254520893,0.24433161318302155,0.05322957783937454,0.081776924431324,-0.20867474377155304,-0.5374871492385864,-0.449556827545166,0.19564156234264374,-0.08374320715665817,-0.16954335570335388,0.166214257478714,0.36951908469200134,-0.13175664842128754,-0.1638602912425995,-0.2570367753505707,0.20917189121246338,-0.29620274901390076,0.10234401375055313,0.1968243569135666,-0.3761958181858063,0.16396483778953552,-0.3081994354724884,0.5975228548049927,-0.18420808017253876,-0.08547218888998032,-0.06258601695299149,0.2027280181646347,0.02398247830569744,0.09821479767560959,0.21048925817012787,0.14495137333869934,-0.4049350917339325,0.16332051157951355,-0.09173768758773804,-0.0003685152914840728,-0.06314046680927277,0.33027157187461853,-0.021351540461182594,0.34191155433654785,0.05108138546347618,-0.296135812997818,0.06514887511730194,-0.32650408148765564,-0.25959399342536926,-0.008734459057450294,0.2351074516773224,-0.11135093122720718,0.14196617901325226,0.654979407787323,-0.16181649267673492,0.1622239351272583,0.1285952776670456,-0.28330180048942566,-0.16910788416862488,-0.053348541259765625,-0.2348388284444809,0.08665893226861954,0.16895703971385956,-0.558359682559967,0.2494545727968216,-0.23416118323802948,-0.16122747957706451,-0.1090860590338707,0.009622735902667046,-0.2986776530742645,0.10304898768663406,0.579630434513092,0.3299162983894348,0.3242819011211395,0.44283223152160645,-0.007680519018322229,-0.32646873593330383,-0.11465023458003998,0.0740739107131958,-0.08491150289773941,0.33243417739868164,-0.08217527717351913,0.3749820291996002,-0.10968244075775146,0.07794039696455002,0.11327721178531647,-0.588116466999054,-0.09132473170757294,0.0974867194890976,0.08363080024719238,-0.3934098780155182,-0.07791103422641754,0.16035453975200653,0.0391496941447258,0.3005715310573578,-0.024595675989985466,0.043944984674453735,0.028885463252663612,0.27698954939842224,0.16308720409870148,-0.15414214134216309,-0.06406807154417038,-0.0655595138669014,0.3015664219856262,0.1852143555879593,-0.07792295515537262,0.061986710876226425,-0.06601271778345108,0.0056627364829182625,0.14096130430698395,-0.2401707023382187,-0.002372725633904338,-0.16867579519748688,0.14754100143909454,0.18607930839061737,-0.41001245379447937,0.07381229847669601,0.025340840220451355,0.3695620596408844,-0.1211337223649025,0.11801932752132416,-0.10650934278964996,-0.023295441642403603,-0.1120557188987732,-0.5489768981933594,-0.27823778986930847,0.049764301627874374,-0.17419478297233582,-0.09262391179800034,0.17519591748714447,0.15909287333488464,0.3959064483642578,-0.16727648675441742,-0.09242457151412964,0.03061039187014103,0.2869779169559479,-0.47783607244491577,0.01401956845074892,0.38656625151634216,-0.1835549920797348,0.35496917366981506,-0.013490685261785984,-0.37187430262565613,-0.24381455779075623,-0.28732404112815857,-0.2577955722808838,0.10799535363912582,0.09978858381509781,-0.199431911110878,0.03595087304711342,0.3755539059638977,-0.20447829365730286,-0.3921828269958496,0.042657557874917984,-0.06646207720041275,0.09433091431856155,-0.09421432018280029,-0.4464332163333893,0.20005548000335693,-0.005205800291150808,-0.17431458830833435,-0.20242571830749512,-0.3446151316165924,-0.36905616521835327,0.08041656017303467,0.061633672565221786,-0.15451450645923615,0.000804141687694937,-0.08993007242679596,0.14611603319644928,0.09675206243991852,-0.06405181437730789,-0.15504691004753113,-0.24590954184532166,0.04144615679979324,-0.010626082308590412,-0.2228657752275467,0.1675756722688675,-0.12903176248073578,-0.36009612679481506,-0.01890723966062069,-0.15196572244167328,-0.16676035523414612,-0.029822533950209618,0.13908721506595612,-0.1001296266913414,0.3170607089996338,-0.25727707147598267,0.2008410543203354,0.31844446063041687,0.13936837017536163,0.011966322548687458,-0.16182127594947815,-0.07729844748973846,0.05662715435028076,0.57133948802948,0.20319464802742004,-0.04808560386300087,0.07236757129430771,-0.054827459156513214,0.34455305337905884,0.4725731313228607,-0.22818557918071747,-0.0016625134740024805,-0.21128495037555695,-0.23863482475280762,-0.05863030627369881,-0.3085509240627289,0.3246553838253021,-0.2760739028453827,0.2982349693775177,0.20993641018867493,-0.12028276175260544,0.09603619575500488,0.4225226938724518,0.0658290684223175,0.20539332926273346,0.33260011672973633,0.43005505204200745]', '2026-09-08 04:11:59', 'paraphrase-multilingual-MiniLM-L12-v2'),
(55, '[0.4685569405555725,-0.06304048746824265,-0.16881592571735382,0.24233588576316833,-0.405794233083725,-0.05181803181767464,0.6282608509063721,-0.023640243336558342,-0.3904273808002472,0.3531162440776825,0.13440699875354767,-0.22077283263206482,-0.2971826195716858,0.24232181906700134,0.07155974954366684,-0.23794302344322205,0.3099673092365265,-0.5651304125785828,0.01798037253320217,0.004628457129001617,-0.04431496933102608,-0.26544150710105896,-0.16099895536899567,0.18211102485656738,-0.489652156829834,-0.6290832161903381,-0.688636839389801,0.05060245096683502,0.026502829045057297,-0.06124762445688248,-0.1444457471370697,-0.35511335730552673,0.11118945479393005,0.28091517090797424,-0.5395351648330688,-0.0002308144757989794,-0.12409397959709167,-0.43036749958992004,-0.28279051184654236,0.024122484028339386,-0.01906026527285576,0.034688010811805725,0.002444665879011154,0.07403691112995148,-0.08436129242181778,-0.21829822659492493,0.04447838291525841,-0.04189915955066681,0.001917909481562674,-0.15875233709812164,-0.5795011520385742,-0.19178041815757751,-0.11817993968725204,0.07083970308303833,-0.05008484423160553,0.3028773069381714,0.27876970171928406,-0.042541347444057465,0.21366171538829803,-0.29823094606399536,0.22943712770938873,-0.0650523230433464,-0.3407903015613556,0.1898178607225418,0.20445379614830017,-0.1404230296611786,-0.01995019055902958,-0.15795105695724487,0.1664479523897171,-0.34000566601753235,0.2773962616920471,0.15619653463363647,-0.07896800339221954,0.31200718879699707,0.3658886253833771,-0.14589838683605194,0.07498980313539505,0.11687066406011581,-0.0475066602230072,-0.05100913718342781,0.19909273087978363,0.16505201160907745,-0.08727379888296127,-0.1283283829689026,0.0046732258051633835,0.3270091712474823,-0.02031131647527218,-0.34776952862739563,-0.18179607391357422,0.040278613567352295,0.05268566682934761,0.46862319111824036,0.01866641640663147,-0.11661887168884277,-0.25420334935188293,-0.009284471161663532,0.42405229806900024,-0.2590548098087311,-0.5795618891716003,0.1026577353477478,0.1450885385274887,0.2836802899837494,0.13388904929161072,0.08668005466461182,-0.10340533405542374,-0.013744729571044445,0.28419390320777893,-0.009334951639175415,0.17016872763633728,-0.0769379660487175,0.026227161288261414,0.07425118237733841,0.08917714655399323,-0.05446773022413254,0.26733067631721497,0.03992565721273422,-0.42803099751472473,0.019764764234423637,0.6953019499778748,0.19728140532970428,0.13901767134666443,0.009425361640751362,0.07025028765201569,-0.0408916249871254,0.39178600907325745,-0.10872846841812134,0.5774936079978943,0.5121524333953857,-0.16157080233097076,0.16837146878242493,0.28267112374305725,0.23080790042877197,0.006541525945067406,-0.14584404230117798,-0.10581249743700027,0.22728531062602997,-0.19632138311862946,0.12064123153686523,-0.4061211049556732,0.018250001594424248,0.28260281682014465,0.4095975458621979,0.25991830229759216,0.041102148592472076,-0.04969429597258568,-0.10633023828268051,-0.05217896029353142,-0.12094593793153763,0.29523739218711853,0.030450094491243362,0.08280367404222488,-0.32549846172332764,0.4530242681503296,0.27627259492874146,0.04961787536740303,0.07589410245418549,-0.33861592411994934,0.15186522901058197,-0.03498260676860809,0.03644850105047226,-0.24814476072788239,-0.1619119793176651,0.09231502562761307,0.1511162519454956,-0.21753472089767456,-0.05914589762687683,0.27498671412467957,-0.015811771154403687,0.13151288032531738,-0.30838480591773987,0.3813077509403229,-0.09613347798585892,0.08997885882854462,-0.19457535445690155,-0.08333370834589005,-0.39837396144866943,-0.5646889209747314,0.09110516309738159,0.4452416002750397,-0.058437686413526535,0.29882383346557617,0.17179834842681885,0.032479178160429,0.13379274308681488,-0.3082279860973358,0.0893406867980957,-0.12251417338848114,0.07297691702842712,0.8753620386123657,-0.5171224474906921,0.32917672395706177,-0.13503523170948029,0.3521788716316223,-0.1864040493965149,-0.08097462356090546,-0.12935771048069,0.19141127169132233,0.26559191942214966,0.19795258343219757,0.04972471296787262,0.25742292404174805,-0.6142768263816833,-0.012519849464297295,0.0902298167347908,-0.13293145596981049,-0.18940916657447815,0.2270268201828003,-0.027724338695406914,0.21248438954353333,0.09415613114833832,-0.13317206501960754,-0.10444507002830505,-0.11055363714694977,-0.1278511881828308,0.38979372382164,-0.39160022139549255,-0.1967218965291977,0.3334541916847229,0.11847115308046341,-0.22952218353748322,0.021783573552966118,0.29329246282577515,0.03153713792562485,-0.27052831649780273,0.019308440387248993,0.018191995099186897,0.17071063816547394,-0.11732005327939987,-0.7935132384300232,-0.01115796621888876,-0.3927614390850067,0.0890900269150734,0.008362987078726292,-0.16614387929439545,-0.14034463465213776,0.41796866059303284,0.5787568688392639,0.24381576478481293,0.17284417152404785,0.5391037464141846,0.18950019776821136,-0.017530173063278198,-0.021414225921034813,0.21167680621147156,-0.029329216107726097,0.351870596408844,-0.1821972131729126,-0.09660889208316803,0.18230010569095612,0.13614659011363983,0.6177542805671692,-0.16641788184642792,-0.10879690945148468,-0.43003469705581665,-0.22598685324192047,-0.230789914727211,0.14584437012672424,-0.09862589091062546,0.30371230840682983,0.3913191258907318,-0.11233439296483994,-0.020705197006464005,0.2313562035560608,0.10370783507823944,-0.010377381928265095,0.14524534344673157,-0.14236454665660858,0.12104775011539459,0.02366691268980503,0.17551322281360626,-0.08082716912031174,0.19588084518909454,-0.5664525628089905,0.1650104969739914,0.45801952481269836,-0.2958172857761383,-0.09504137933254242,0.10606586933135986,-0.12729889154434204,0.51826411485672,-0.3078024089336395,0.45501646399497986,0.058341771364212036,-0.003317324910312891,-0.10963397473096848,0.08130176365375519,-0.021780358627438545,0.12986938655376434,0.013752782717347145,-0.4378386437892914,0.023676030337810516,-0.13278542459011078,-0.0772506445646286,-0.09407307952642441,0.40030279755592346,0.23407292366027832,-0.0630740076303482,-0.38665732741355896,-0.38486579060554504,0.31848278641700745,0.543299674987793,-0.27660036087036133,-0.9127237796783447,0.02621728740632534,-0.16192950308322906,0.1414417028427124,0.252699613571167,-0.324668824672699,-0.1723831295967102,-0.17614078521728516,-0.21782279014587402,0.18317215144634247,-0.1331433355808258,-0.09269451349973679,0.10153238475322723,0.10961558669805527,0.19443471729755402,-0.09354010969400406,-0.013788321055471897,0.02671002224087715,-0.21262572705745697,-0.26536938548088074,-0.3289715051651001,0.10721540451049805,0.1532161682844162,0.017963266000151634,-0.2753840982913971,-0.2875145375728607,-0.4908905029296875,-0.059831403195858,-0.0013511891011148691,-0.18044908344745636,0.10989172756671906,0.1397271752357483,0.3803393840789795,0.26734206080436707,-0.07556506246328354,-0.2196456640958786,-0.25285473465919495,0.2252659797668457,0.06727349758148193,0.035029470920562744,0.158638596534729,-0.1720450073480606,-0.4595988690853119,-0.09125896543264389,-0.21185095608234406,-0.1328117847442627,0.17974627017974854,0.23132415115833282,-0.13095809519290924,0.13131718337535858,-0.4384716749191284,0.01621432602405548,0.4032856225967407,0.5018774271011353,-0.04253750294446945,-0.06714675575494766,0.02504664845764637,-0.33772674202919006,0.16124187409877777,-0.325323224067688,0.1595967710018158,0.02199142426252365,-0.5545213222503662,-0.001096050371415913,0.03158460184931755,-0.6371346116065979,0.4173746705055237,0.08545301109552383,-0.2677913308143616,-0.2766740322113037,0.0067220996133983135,-0.14195990562438965,-0.36175742745399475,0.22048020362854004,0.009133817628026009,-0.08105292171239853,-0.09590019285678864,0.11326410621404648,0.14998997747898102,0.1512494832277298,-0.030805649235844612,0.20983991026878357]', '2026-09-08 04:11:05', 'paraphrase-multilingual-MiniLM-L12-v2'),
(56, '[0.6237689256668091,-0.006835584528744221,-0.25707656145095825,0.35663819313049316,-0.28804317116737366,-0.09783513098955154,0.4610605239868164,0.10898387432098389,-0.3215327262878418,0.2962268590927124,0.17122890055179596,0.10642135143280029,0.03508974611759186,0.2234521061182022,-0.002632398856803775,-0.19278860092163086,0.3254348933696747,-0.573644757270813,0.03544675558805466,0.30282580852508545,-0.07788505405187607,-0.19341492652893066,0.05808057636022568,0.08854265511035919,-0.7892709970474243,-0.5197587013244629,-0.4056284725666046,-0.07350572943687439,0.000597749836742878,-0.02777845412492752,-0.20932219922542572,-0.46667519211769104,0.14502933621406555,0.21965129673480988,-0.4252025783061981,-0.09393441677093506,-0.07875137776136398,-0.2503795921802521,-0.15039052069187164,0.00905407965183258,-0.06481311470270157,-0.018512893468141556,0.019534887745976448,-0.08623196929693222,-0.01972050964832306,-0.14719998836517334,0.2116987407207489,-0.10584582388401031,-0.29181045293807983,-0.23744022846221924,-0.4554375112056732,-0.19543048739433289,0.1112775057554245,-0.3588709235191345,-0.07140835374593735,0.16879448294639587,0.42293083667755127,0.2710687518119812,0.06485046446323395,-0.22459769248962402,0.18869753181934357,-0.057453256100416183,-0.22794407606124878,0.0755469799041748,0.2706120014190674,-0.16101646423339844,0.08621644973754883,0.025494026020169258,0.20409879088401794,0.21934477984905243,0.2286621332168579,0.11843226850032806,-0.054104506969451904,0.15075190365314484,0.25495123863220215,0.10920323431491852,0.1895262598991394,-0.013781414367258549,0.08789365738630295,-0.1528773456811905,-0.03214213252067566,0.29825806617736816,0.10431361198425293,-0.08077316731214523,-0.19475987553596497,0.40637725591659546,0.155875563621521,-0.3522859811782837,-0.08984735608100891,0.07744479179382324,0.14860627055168152,0.44268667697906494,0.4617519974708557,-0.17748507857322693,-0.11466546356678009,0.05748499557375908,0.3025442361831665,-0.2810365557670593,-0.5980159044265747,0.10662702471017838,0.26647520065307617,0.25131118297576904,-0.14108502864837646,-0.013206612318754196,0.05944908410310745,-0.02041633613407612,0.30049341917037964,-0.3471398949623108,-0.22102512419223785,0.2455877959728241,0.06726396083831787,0.06973829865455627,-0.15760299563407898,-0.0322168692946434,0.23595735430717468,-0.045653555542230606,-0.13770180940628052,0.07953685522079468,0.4054816961288452,-0.07047276943922043,0.18093854188919067,-0.3759607672691345,0.1949537992477417,-0.15757635235786438,0.4265233874320984,0.17934930324554443,0.14073625206947327,0.12677893042564392,-0.14210422337055206,-0.19336318969726562,0.039244767278432846,0.09297535568475723,-0.05640280246734619,-0.23487761616706848,-0.16338902711868286,0.3696189522743225,-0.12604975700378418,0.09355461597442627,-0.23735250532627106,-0.01760549657046795,0.3346947431564331,-0.0525587797164917,0.25780192017555237,0.11340610682964325,0.09566748887300491,0.05321042984724045,-0.1520569920539856,-0.317095547914505,0.2775370478630066,0.13642747700214386,0.17323023080825806,-0.28447145223617554,0.28413480520248413,0.22331741452217102,-0.04057592526078224,0.023649390786886215,-0.3553382158279419,0.1715119183063507,-0.0327921137213707,0.052657246589660645,-0.40188804268836975,0.1724889576435089,0.001367351971566677,0.27380669116973877,-0.10991416871547699,-0.051015663892030716,0.1251007318496704,-0.024321669712662697,0.10324354469776154,-0.08719837665557861,0.27648496627807617,0.15216943621635437,0.11936862766742706,-0.1574101597070694,-0.5403872728347778,-0.45260530710220337,-0.9050593376159668,-0.1331292688846588,0.2795109748840332,0.06882736086845398,0.5543653964996338,0.20165669918060303,-0.07440875470638275,0.2607046663761139,-0.20385921001434326,0.025050662457942963,-0.09280121326446533,0.08601449429988861,0.5737212896347046,-0.514211893081665,0.40835559368133545,-0.09551332890987396,0.447946161031723,-0.08338487148284912,-0.28925034403800964,-0.050892315804958344,0.05617211014032364,0.05773266777396202,0.0876021459698677,0.0722922533750534,0.1179906576871872,-0.36920732259750366,-0.18101100623607635,0.09419883787631989,0.002061263658106327,-0.23072607815265656,0.2337825894355774,-0.08026526868343353,0.13361351191997528,0.038614075630903244,-0.261149138212204,-0.08109207451343536,-0.09796912968158722,-0.33907902240753174,0.33989256620407104,-0.26348677277565,0.018950890749692917,0.508642852306366,0.20706713199615479,-0.05508119612932205,0.18160542845726013,0.21524804830551147,-0.03754056245088577,-0.30451273918151855,0.13653388619422913,-0.20317822694778442,0.24487188458442688,0.028228264302015305,-0.6924105882644653,0.24251046776771545,-0.24389520287513733,-0.3278099000453949,-0.281624436378479,-0.10011779516935349,-0.2455219328403473,0.255437433719635,0.4443487226963043,0.059938788414001465,0.4168993830680847,0.16107285022735596,0.042008474469184875,-0.22129105031490326,-0.23528751730918884,-0.08057446777820587,-0.053945392370224,0.04430066794157028,-0.25287771224975586,0.32805347442626953,0.0461537167429924,0.10530029237270355,0.037397079169750214,-0.2887824773788452,-0.006301268935203552,-0.1719149500131607,-0.12603521347045898,0.007722364738583565,0.02169034071266651,-0.04525809735059738,0.3527536988258362,0.21133677661418915,-0.1134803295135498,0.1352555751800537,0.15321679413318634,0.3054278492927551,-0.07308647781610489,0.10816991329193115,-0.011829021386802197,0.167064368724823,0.08463048934936523,0.15833202004432678,0.20592531561851501,-0.046342071145772934,-0.6943815350532532,0.08168190717697144,0.4415636658668518,-0.3323075771331787,-0.06650661677122116,0.14049884676933289,-0.0493563637137413,0.34628617763519287,0.028582580387592316,0.43349069356918335,-0.1690988838672638,0.1536417454481125,0.05981834977865219,0.06783266365528107,-0.24553456902503967,0.06497906893491745,0.10446828603744507,-0.25535738468170166,-0.24841967225074768,-0.2945338487625122,0.21234320104122162,-0.27801138162612915,0.4824252724647522,0.13508886098861694,-0.03357915207743645,-0.2479102909564972,-0.3599405288696289,0.04765329137444496,0.2971397042274475,-0.5468662977218628,-0.5915073752403259,0.2369886189699173,0.08210878074169159,-0.059366583824157715,0.25646328926086426,-0.18923574686050415,-0.3408083915710449,-0.040175072848796844,0.048306819051504135,0.3404444456100464,-0.04086675867438316,-0.15888696908950806,0.2904020845890045,0.057983629405498505,-0.07540015876293182,-0.14205056428909302,-0.03327038139104843,-0.08640098571777344,-0.32238951325416565,-0.4218876361846924,-0.07358457893133163,0.3656231164932251,0.10906849801540375,0.21984076499938965,-0.393665075302124,-0.5166921615600586,-0.2047528326511383,-0.20869314670562744,0.25160425901412964,-0.2730790674686432,0.2659802734851837,-0.08240287750959396,0.3196743130683899,0.13622832298278809,-0.05309443548321724,-0.2031746357679367,-0.37241724133491516,0.26198258996009827,0.06763507425785065,-0.10237441211938858,-0.15237829089164734,-0.015854092314839363,-0.33427125215530396,-0.07942076027393341,-0.2994978725910187,0.06417406350374222,-0.011114758439362049,0.1309489607810974,-0.1386842429637909,0.057887423783540726,-0.5497308969497681,0.0631372332572937,0.3067508339881897,0.46667763590812683,0.13721388578414917,-0.17537903785705566,0.25141870975494385,-0.17520707845687866,0.2960236668586731,-0.18419194221496582,-0.044017940759658813,0.22750598192214966,-0.4899325966835022,0.14815954864025116,0.007674574386328459,-0.22968581318855286,0.42586347460746765,-0.0761888399720192,-0.06321819126605988,-0.07842132449150085,0.01025385595858097,-0.06028447672724724,-0.4429941773414612,0.3568894863128662,0.22427348792552948,0.07717673480510712,0.024250708520412445,0.2294805645942688,0.16854628920555115,0.11998435854911804,0.2735946774482727,0.2533256411552429]', '2026-09-08 04:09:56', 'paraphrase-multilingual-MiniLM-L12-v2');
INSERT INTO `animal_embeddings` (`animal_id`, `embedding`, `updated_at`, `model_name`) VALUES
(57, '[0.407329261302948,0.040097471326589584,-0.22295670211315155,0.3379687964916229,-0.18824540078639984,-0.19369444251060486,0.17269183695316315,0.08158157020807266,0.08251459151506424,0.029131079092621803,0.19073839485645294,-0.030861184000968933,0.06628865748643875,0.08555611222982407,0.13500405848026276,-0.06325922161340714,0.2645892798900604,-0.5072185397148132,0.11212009936571121,0.17446322739124298,-0.17544767260551453,-0.2077275514602661,-0.0073186238296329975,-0.08134353160858154,-0.762715220451355,-0.38944000005722046,-0.2632082998752594,-0.08062401413917542,0.06253745406866074,0.0951656848192215,-0.02540167048573494,-0.383186012506485,0.16789355874061584,-0.021929290145635605,-0.2576451897621155,0.11908509582281113,0.0047090183943510056,-0.24807749688625336,-0.23916153609752655,-0.08018922805786133,0.07956452667713165,-0.04082559421658516,0.14514052867889404,-0.00359476450830698,-0.2203497290611267,-0.24515338242053986,-0.15497158467769623,-0.1436488777399063,-0.21739059686660767,-0.2117873728275299,-0.3253461718559265,0.10235510766506195,-0.07015035301446915,-0.18652872741222382,0.027529263868927956,0.2317747175693512,0.35596346855163574,0.3084988594055176,-0.14602722227573395,-0.013133554719388485,0.10859420895576477,-0.020677823573350906,-0.23751236498355865,0.1251656711101532,0.32418617606163025,-0.007494370453059673,-0.00933343730866909,-0.0478140264749527,0.006717548239976168,-0.012953841127455235,0.2798203229904175,0.09218056499958038,-0.03806798532605171,0.0208600964397192,0.16836313903331757,0.1154627576470375,0.029498502612113953,0.04606173187494278,0.15869034826755524,-0.029804503545165062,-0.06222323700785637,0.5017143487930298,0.06267017126083374,0.13719268143177032,-0.1760088950395584,0.38196995854377747,0.21206554770469666,-0.20983648300170898,-0.29814982414245605,0.12175209820270538,0.12381372600793839,0.30659720301628113,0.17488065361976624,-0.13782107830047607,-0.07683859765529633,-0.006985881831496954,0.28748467564582825,-0.09070160239934921,-0.8194466233253479,0.09591462463140488,0.2074514478445053,0.29816460609436035,-0.2532062530517578,-0.19631338119506836,0.18080122768878937,0.25402897596359253,0.016428276896476746,-0.4997219145298004,-0.28074362874031067,0.12396109849214554,0.011163045652210712,0.14933042228221893,-0.13802818953990936,0.04632081091403961,0.09840262681245804,0.022414827719330788,-0.3719601035118103,0.03317916393280029,0.5896602869033813,0.09718076139688492,0.27439606189727783,-0.18046851456165314,0.05606973171234131,-0.20377084612846375,0.36706429719924927,-0.000849516480229795,0.11087273806333542,0.34823766350746155,-0.07059909403324127,0.01470803003758192,0.01930435746908188,-0.03162594884634018,-0.11765601485967636,-0.17375454306602478,0.13406848907470703,0.3023938238620758,-0.1359870284795761,-0.10821515321731567,-0.21725359559059143,-0.038933366537094116,0.3934229910373688,-0.18535831570625305,0.009178081527352333,0.11770874261856079,0.05110849440097809,0.06248161196708679,0.0870659276843071,-0.054939333349466324,0.1287824660539627,-0.001602877746336162,0.2247202843427658,-0.3320907652378082,0.3631105124950409,-0.1454642117023468,-0.17144782841205597,-0.13709230720996857,-0.10072009265422821,0.21271176636219025,0.03363383188843727,0.00941737275570631,-0.36217162013053894,0.03945430368185043,-0.04783295467495918,0.1282474845647812,-0.10375499725341797,-0.12454394996166229,-0.009108202531933784,-0.28371888399124146,0.23048894107341766,-0.016651343554258347,0.18933086097240448,0.07883309572935104,0.10421929508447647,-0.042081207036972046,-0.3101876378059387,-0.5309353470802307,-0.7295633554458618,0.10229136794805527,0.09107017517089844,-0.02578728273510933,0.3032554090023041,0.26826363801956177,-0.3044489920139313,-0.14512543380260468,-0.14159876108169556,0.059943635016679764,-0.19969475269317627,0.06050598621368408,0.2907677888870239,-0.3109525740146637,0.2886887490749359,-0.026435745880007744,0.5857985019683838,-0.13046112656593323,-0.3269200325012207,-0.05303670093417168,0.06074822321534157,-0.024856489151716232,0.08219724893569946,0.15692763030529022,0.030980316922068596,-0.36211705207824707,0.0618680976331234,0.0278043020516634,0.10161145776510239,-0.178362637758255,0.27577152848243713,-0.24609263241291046,0.36609068512916565,0.05689292773604393,-0.20824141800403595,0.09264566749334335,-0.21002177894115448,-0.33747541904449463,0.09220282733440399,-0.01132541336119175,-0.06279788911342621,0.2811413109302521,0.4823940098285675,-0.07432100176811218,0.16285277903079987,0.18851947784423828,-0.09052769094705582,-0.1541282832622528,0.0519736111164093,-0.25076913833618164,0.2865128219127655,0.027118241414427757,-0.6179073452949524,0.19258643686771393,-0.106988325715065,-0.2589031159877777,-0.05374472588300705,-0.009890631772577763,-0.49987420439720154,0.2615228593349457,0.5950034856796265,0.16906122863292694,0.4675671458244324,0.32409846782684326,0.15430133044719696,-0.2810203433036804,-0.21565882861614227,-0.10048308223485947,-0.13699063658714294,0.22103416919708252,-0.17859239876270294,0.32856491208076477,0.05682412534952164,0.02498253621160984,0.12205987423658371,-0.45320257544517517,-0.04443298280239105,-0.120537169277668,-0.12831535935401917,-0.24604034423828125,0.023971598595380783,0.07112973928451538,0.26059889793395996,0.24706612527370453,-0.08763518184423447,0.33119404315948486,0.031478460878133774,0.18631167709827423,-0.015240317210555077,0.05599534884095192,-0.07724667340517044,-0.10605718940496445,0.21417173743247986,0.13594001531600952,0.02417580783367157,-0.11473584920167923,-0.3426506221294403,0.17342370748519897,0.3392025828361511,-0.3497670590877533,0.03877640888094902,0.045360587537288666,-0.096452996134758,0.360017329454422,-0.40164491534233093,0.39157187938690186,-0.046195704489946365,0.3483114242553711,-0.041359130293130875,0.13011318445205688,-0.18920306861400604,-0.05943034589290619,-0.02152688428759575,-0.42674824595451355,-0.22644372284412384,-0.05468164384365082,0.006513997446745634,-0.1767972707748413,0.3666509985923767,0.12498706579208374,0.1482686847448349,-0.2702106535434723,-0.20289133489131927,0.22111919522285461,0.3270862102508545,-0.5695658326148987,-0.29583293199539185,0.2609235644340515,0.07831680029630661,0.18978944420814514,0.2009422928094864,-0.13509391248226166,-0.3052380681037903,-0.23438571393489838,0.045478690415620804,0.13003328442573547,0.02378251776099205,-0.21427248418331146,0.17963021993637085,0.2618391513824463,-0.10523553192615509,-0.22831647098064423,0.03178304433822632,-0.09667526930570602,-0.013307886198163033,-0.27102479338645935,-0.22406822443008423,0.39054909348487854,0.047126054763793945,-0.06825362890958786,-0.25494927167892456,-0.39948779344558716,-0.35091644525527954,-0.053452253341674805,0.1472932994365692,-0.27575647830963135,0.10755530744791031,-0.08561573922634125,0.13065215945243835,0.15090130269527435,-0.015408850274980068,-0.31306856870651245,-0.2975008189678192,0.09904150664806366,0.0037946857046335936,-0.23619647324085236,0.029691219329833984,-0.015335910953581333,-0.2715309262275696,-0.1644066870212555,-0.2307356595993042,0.005683683790266514,0.0029405991081148386,0.14572551846504211,-0.1860782951116562,0.16102300584316254,-0.33238857984542847,0.287102073431015,0.398045152425766,0.2576318085193634,0.09386157244443893,-0.09019126743078232,0.05230942368507385,0.007599669974297285,0.41822707653045654,0.06470103561878204,-0.09647691994905472,0.22134627401828766,-0.27332431077957153,0.17725606262683868,0.22882585227489471,-0.35289058089256287,0.08773840218782425,-0.24981598556041718,-0.048429228365421295,-0.07887746393680573,-0.11507125198841095,0.09304844588041306,-0.22497166693210602,0.3024536073207855,0.17011535167694092,0.10203440487384796,0.06222163140773773,0.30117425322532654,0.04426076263189316,0.1981700211763382,0.3607938289642334,0.41510647535324097]', '2026-09-08 04:10:22', 'paraphrase-multilingual-MiniLM-L12-v2'),
(58, '[0.3587573170661926,-0.031438183039426804,-0.16129037737846375,0.23442989587783813,-0.26892349123954773,-0.08986774832010269,0.21729300916194916,0.10911376774311066,0.03173051401972771,0.03130368888378143,0.06655857712030411,-0.08191622793674469,-0.03435748815536499,0.259225457906723,-0.1818924993276596,-0.15647737681865692,0.26094526052474976,-0.45163723826408386,0.261608362197876,0.002399665769189596,-0.24271513521671295,-0.13476379215717316,0.02531725913286209,0.04993284121155739,-0.6777726411819458,-0.3440495431423187,-0.3544449806213379,-0.017206789925694466,0.01941186934709549,0.1306869387626648,-0.040871232748031616,-0.2763356864452362,0.14949192106723785,0.10195299237966537,-0.34838080406188965,0.11705125123262405,0.08422360569238663,-0.44561636447906494,-0.27246978878974915,-0.024529946967959404,0.2076241821050644,-0.09339975565671921,0.10727442800998688,-0.14001010358333588,-0.05242088437080383,-0.1296807825565338,-0.09498681128025055,-0.28587135672569275,-0.28774702548980713,-0.09479103982448578,-0.16152404248714447,0.0034181447699666023,0.07003387808799744,0.030603140592575073,0.11166037619113922,0.26820212602615356,0.287031888961792,0.13154654204845428,-0.06590073555707932,-0.07240688055753708,0.09040401875972748,-0.08867166936397552,-0.1624135822057724,0.1536870151758194,0.1521669179201126,-0.1445717215538025,-0.16051121056079865,-0.0010375857818871737,-0.09305959939956665,-0.02886209264397621,0.208771750330925,0.06994576752185822,0.023257212713360786,0.1704673022031784,0.13387855887413025,-0.026996532455086708,0.04028802737593651,-0.03564410284161568,0.09495212882757187,0.06598059087991714,-0.08310195803642273,0.18860244750976562,0.14737088978290558,-0.07678517699241638,-0.07119715213775635,0.31340092420578003,0.09588707983493805,-0.35952645540237427,-0.4109242856502533,0.20360668003559113,-0.026161592453718185,0.3737756311893463,0.3000141382217407,-0.10599882155656815,-0.07964532822370529,0.06799368560314178,0.29233279824256897,-0.10393496602773666,-0.7796961665153503,0.16912662982940674,0.2934964597225189,0.2903941571712494,-0.20219798386096954,-0.17768940329551697,0.03869364783167839,0.19064059853553772,-0.06713764369487762,-0.4002099335193634,-0.2754800021648407,0.1438109278678894,0.014887025579810143,0.12409383058547974,0.07105696946382523,0.06815384328365326,-0.00005725622031604871,-0.08238411694765091,-0.2990449368953705,0.0456552729010582,0.697809100151062,0.1550997793674469,0.23800988495349884,-0.2084764987230301,-0.08278381824493408,-0.24446643888950348,0.27699899673461914,-0.0757320374250412,0.29003074765205383,0.34757405519485474,-0.06404328346252441,-0.0027721687220036983,0.16408388316631317,-0.07636363059282303,-0.10049125552177429,-0.11852047592401505,0.09715156257152557,0.3252602219581604,-0.22707484662532806,-0.0246288925409317,-0.13552916049957275,-0.05156201496720314,0.4101807773113251,-0.13335241377353668,-0.06280799955129623,0.05608191341161728,0.06373178958892822,0.15281172096729279,0.20645149052143097,0.036988478153944016,0.18199492990970612,0.3779974579811096,0.06471322476863861,-0.22433613240718842,0.11353080719709396,-0.13908293843269348,-0.055739935487508774,-0.16564039885997772,-0.11978529393672943,0.19646838307380676,-0.026937879621982574,0.005709261167794466,-0.27688130736351013,0.02543695643544197,-0.10002121329307556,0.10925357788801193,-0.17670638859272003,-0.1876741200685501,0.061785198748111725,-0.11678478866815567,0.3289283514022827,-0.08369960635900497,0.16733145713806152,0.03482215851545334,0.21317718923091888,-0.03490792587399483,-0.36133700609207153,-0.48635631799697876,-0.6004918813705444,-0.01756693609058857,0.23239022493362427,-0.06834307312965393,0.1993127465248108,0.3968825936317444,-0.21084052324295044,-0.06317567080259323,-0.33604347705841064,0.22728891670703888,-0.2233978658914566,0.016091054305434227,0.2902030646800995,-0.38224682211875916,0.38842907547950745,-0.40331387519836426,0.49001362919807434,-0.23545855283737183,-0.1113792359828949,-0.03403369337320328,0.15722854435443878,0.0394674576818943,0.18887117505073547,0.06194154918193817,0.30351483821868896,-0.2914606034755707,0.09973256289958954,0.0033903359435498714,0.024797571823000908,-0.12392398715019226,0.1478673368692398,0.14082299172878265,0.19846808910369873,0.11899957805871964,-0.1655634343624115,-0.0875818133354187,-0.24398477375507355,-0.2273937463760376,0.08656449615955353,0.12200555205345154,0.1348632276058197,0.24012652039527893,0.4209766983985901,-0.14781931042671204,0.27943965792655945,0.10008788853883743,-0.029784750193357468,-0.0920661985874176,0.24173006415367126,-0.25665736198425293,0.18649542331695557,0.07148218899965286,-0.5396305918693542,0.11840783804655075,-0.27234676480293274,-0.16901259124279022,-0.3063352108001709,-0.09375720471143723,-0.0376141332089901,0.2307107299566269,0.5779091119766235,0.171037957072258,0.4872100055217743,0.5425796508789062,-0.03146896883845329,-0.3292787969112396,-0.18119299411773682,0.017952466383576393,-0.045635487884283066,0.07408560812473297,-0.2429446280002594,0.513979434967041,0.04475483298301697,0.0014246073551476002,-0.04960423707962036,-0.2687922418117523,0.036305610090494156,-0.052294403314590454,0.2163168489933014,-0.3278030753135681,-0.09537812322378159,0.15845932066440582,0.14817337691783905,0.09070966392755508,-0.034393247216939926,0.22697648406028748,0.07686954736709595,0.12918953597545624,-0.013870278373360634,-0.07741145044565201,-0.16981472074985504,0.10061135143041611,0.2658214867115021,0.09405691176652908,-0.09610646218061447,-0.008003314025700092,-0.27869153022766113,0.11031324416399002,0.17238008975982666,-0.2743380665779114,0.07838854938745499,0.09237467497587204,0.1667758971452713,0.1636360138654709,-0.2409314662218094,0.25938063859939575,-0.23990800976753235,0.2963204085826874,-0.13078425824642181,0.10821018368005753,-0.18539537489414215,0.1160646453499794,0.05340317264199257,-0.4255276620388031,-0.17967115342617035,-0.05979081988334656,-0.08616454154253006,-0.15133868157863617,0.3376195728778839,0.24134382605552673,0.10421376675367355,-0.23014682531356812,-0.07039204239845276,0.15304715931415558,0.26131945848464966,-0.5576288104057312,-0.21283464133739471,0.3620118498802185,-0.1430564820766449,0.12105099111795425,0.09435123950242996,-0.1647319495677948,-0.30278292298316956,-0.3223596513271332,-0.21777556836605072,0.28338098526000977,0.10615819692611694,-0.2700006663799286,0.208405002951622,0.19991573691368103,-0.27972540259361267,-0.23361904919147491,0.05249416083097458,-0.013079366646707058,-0.10801215469837189,-0.2117861956357956,-0.3980606198310852,0.17429260909557343,-0.05880681052803993,-0.0405375212430954,-0.09860902279615402,-0.6004647016525269,-0.22537195682525635,-0.01939508505165577,0.19318507611751556,-0.27839505672454834,-0.061789270490407944,-0.009393440559506416,0.07411665469408035,-0.03786874935030937,0.024690454825758934,-0.15261447429656982,-0.15266351401805878,0.1090545728802681,-0.0904134064912796,-0.1712995022535324,0.05011967197060585,-0.16618354618549347,-0.33190134167671204,-0.06702088564634323,-0.19961005449295044,-0.2168644666671753,0.023461664095520973,-0.0037406759802252054,-0.08219697326421738,0.1641802042722702,-0.28217825293540955,0.1906774640083313,0.348809152841568,0.21756629645824432,0.17475329339504242,-0.21879296004772186,0.038242824375629425,-0.016467833891510963,0.48035112023353577,0.12161573767662048,0.03294094279408455,-0.037010855972766876,-0.2839387059211731,0.276889443397522,0.28502023220062256,-0.24907274544239044,0.16793683171272278,-0.18685472011566162,-0.17533935606479645,0.11368309706449509,-0.10953419655561447,0.21439550817012787,-0.40540385246276855,0.34393176436424255,0.14594165980815887,-0.001401167013682425,0.21752114593982697,0.2480570375919342,0.22526268661022186,0.0561138316988945,0.26024678349494934,0.41610434651374817]', '2026-09-08 04:10:31', 'paraphrase-multilingual-MiniLM-L12-v2');

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
(68, 37, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:36:41'),
(69, 37, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:36:41'),
(70, 38, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:37:40'),
(71, 39, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:38:57'),
(91, 51, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:01:49'),
(92, 51, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:01:49'),
(93, 52, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:06:21'),
(94, 52, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:06:21'),
(107, 59, 'Dewormed', '2025-09-07', 'PBC', NULL, '2026-08-29 13:34:27'),
(113, 56, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:09:56'),
(115, 57, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:10:22'),
(116, 58, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:10:31'),
(117, 55, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:11:06'),
(118, 55, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:11:06'),
(119, 54, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:11:59'),
(120, 54, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:11:59'),
(121, 53, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:13:24'),
(122, 53, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:13:24'),
(123, 49, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:14:24'),
(124, 48, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:15:11'),
(125, 47, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:15:43'),
(126, 47, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:15:43'),
(127, 46, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:16:20'),
(128, 46, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:16:20'),
(129, 44, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:17:01'),
(130, 44, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:17:01'),
(131, 45, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:17:39'),
(132, 45, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:17:39'),
(133, 43, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:18:13'),
(134, 42, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:18:58'),
(135, 41, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:19:29'),
(136, 40, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:19:58'),
(137, 36, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:21:03'),
(138, 36, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:21:03'),
(139, 35, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:21:35'),
(140, 35, 'Vaccine', '2025-09-30', 'PBC', NULL, '2026-09-08 04:21:35'),
(141, 34, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:22:15'),
(142, 33, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:22:52'),
(143, 33, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:22:52'),
(144, 32, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:23:24'),
(145, 31, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:23:48'),
(146, 31, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-09-08 04:23:48'),
(147, 30, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:24:17'),
(148, 29, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:24:44'),
(149, 29, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-09-08 04:24:44'),
(150, 28, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:25:50'),
(151, 28, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-09-08 04:25:50'),
(152, 27, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-09-08 04:26:23'),
(153, 27, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-09-08 04:26:23');

-- --------------------------------------------------------

--
-- Table structure for table `application_interviews`
--

CREATE TABLE `application_interviews` (
  `interview_id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `interview_date` date DEFAULT NULL,
  `interview_time` time DEFAULT NULL,
  `interview_method` varchar(50) DEFAULT NULL,
  `interview_location_link` text DEFAULT NULL,
  `meetup_location` varchar(255) DEFAULT NULL,
  `requested_interview_date` date DEFAULT NULL,
  `requested_interview_time` time DEFAULT NULL,
  `reschedule_reason` text DEFAULT NULL,
  `resched_status` varchar(50) DEFAULT 'None',
  `org_reschedule_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application_interviews`
--

INSERT INTO `application_interviews` (`interview_id`, `application_id`, `interview_date`, `interview_time`, `interview_method`, `interview_location_link`, `meetup_location`, `requested_interview_date`, `requested_interview_time`, `reschedule_reason`, `resched_status`, `org_reschedule_count`, `created_at`, `updated_at`) VALUES
(57, 36, '2026-09-03', '10:30:00', 'onsite', 'Anonas Street, Sta. Mesa, Brgy. Barangay 636, Sampaloc, Ncr, City Of Manila, First District, 1016', 'Anonas Street, Sta. Mesa, Brgy. Barangay 636, Sampaloc, Ncr, City Of Manila, First District, 1016', NULL, NULL, NULL, 'Approved', 0, '2026-09-03 02:06:00', '2026-09-05 01:28:38'),
(59, 38, '2026-09-05', '10:30:00', 'onsite', 'Anonas Street, Sta. Mesa, Brgy. Barangay 636, Sampaloc, Ncr, City Of Manila, First District, 1016', NULL, NULL, NULL, NULL, 'Approved', 0, '2026-09-05 02:23:05', '2026-09-05 02:23:05'),
(60, 40, '2026-09-08', '08:30:00', 'onsite', 'Anonas Street, Sta. Mesa, Brgy. Barangay 636, Sampaloc, Ncr, City Of Manila, First District, 1016', NULL, NULL, NULL, NULL, 'Approved', 1, '2026-09-07 23:20:18', '2026-09-07 23:21:08');

-- --------------------------------------------------------

--
-- Table structure for table `cash_donations`
--

CREATE TABLE `cash_donations` (
  `cash_donation_id` int(11) NOT NULL,
  `adopter_id` int(11) DEFAULT NULL,
  `organization_id` int(11) NOT NULL,
  `donor_name` varchar(255) NOT NULL,
  `donor_email` varchar(255) NOT NULL,
  `payment_method` enum('gcash','maya') NOT NULL DEFAULT 'gcash',
  `gcash_account_name` varchar(255) DEFAULT NULL,
  `reference_number` varchar(100) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `receipt_path` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected') DEFAULT 'Pending',
  `rejection_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cash_donations`
--

INSERT INTO `cash_donations` (`cash_donation_id`, `adopter_id`, `organization_id`, `donor_name`, `donor_email`, `payment_method`, `gcash_account_name`, `reference_number`, `amount`, `receipt_path`, `status`, `rejection_reason`, `created_at`) VALUES
(23, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'gcash', 'tjtgtgjgt', 'gfrhg343433', 43.00, '/uploads/receipts/receipt-3-1788571491835.png', 'Approved', NULL, '2026-09-05 01:24:51'),
(24, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'gcash', 'Shinrei Nouzen', 'AB12345678CD', 1.00, '/uploads/receipts/receipt-3-1788623510384.jpg', 'Pending', NULL, '2026-09-05 15:51:50'),
(25, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'gcash', 'Shinrei Nouzen', 'gxdfgfdghdf', 6.00, '/uploads/receipts/receipt-3-1788623584533.png', 'Pending', NULL, '2026-09-05 15:53:04'),
(26, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'gcash', 'Shinrei Nouzen', 'gfr666666666666', 3.00, '/uploads/receipts/receipt-3-1788624180962.jpg', 'Approved', NULL, '2026-09-05 16:03:00');

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
(8, 3, NULL, 'user', 'Report a Bug', 'gbg', 'gbgbgb gvb gfbgbgbg', 3, 'pending', NULL, '2026-09-08 02:52:45'),
(9, 3, NULL, 'user', 'Report a Bug', 'IDKKK', 'tell me something i dont know', 5, 'resolved', NULL, '2026-09-08 03:58:17'),
(10, 3, NULL, 'user', 'Feature Suggestion', 'fgrfhfhg', 'xmc xcxjvnjd djfnjdfdnjfndkj', NULL, 'resolved', NULL, '2026-09-08 06:44:09');

-- --------------------------------------------------------

--
-- Table structure for table `guide_sections`
--

CREATE TABLE `guide_sections` (
  `section_id` int(11) NOT NULL,
  `audience` varchar(20) NOT NULL DEFAULT 'organization',
  `title` varchar(150) NOT NULL,
  `badge_color` varchar(20) NOT NULL DEFAULT 'blue',
  `bullets` text NOT NULL,
  `display_order` int(11) NOT NULL DEFAULT 0,
  `deleted_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guide_sections`
--

INSERT INTO `guide_sections` (`section_id`, `audience`, `title`, `badge_color`, `bullets`, `display_order`, `deleted_at`) VALUES
(1, 'organization', 'Managing Pets & Profiles', 'blue', '**Adding Pets:** Navigate to the Pets module, click \"Add Pet\", fill out required details such as name, species, age, gender, and upload clear pictures. You can also add a pet’s description, such as personality and behavior.\n**Adoption Status:**  Update the status regularly (*Available*, *Pending*, or *Adopted*) so adopters see accurate information.\n**Archiving:**Use the archive option for pets that are no longer active on the listing to keep your workspace clean.\n**Delete Record:** When deleting a pet’s record, you can still retrieve it before 30 days of deletion.', 1, NULL),
(2, 'organization', 'Reviewing Adoption Requests', 'emerald', 'Check incoming applications submitted by potential adopters through the Adoptions tab.\nVerify adopter information and match scores provided by the system.\nScheduled interviews first before approving or rejecting an application.\nRescheduled interviews if the adopter isn’t available or didn’t show up.\nUse the view calendar to view upcoming and available dates for scheduled interviews.\nApprove or reject applications based on your organization\'s shelter screening standards.', 2, NULL),
(3, 'organization', 'Donations & Organization Profile', 'amber', '**Donations:** Monitor records and ensure your organization\'s payment methods or drop-off instructions are updated.\n**Profile Settings:** Keep your shelter\'s contact number, address, and description accurate so donors and adopters can reach you easily.', 3, NULL),
(4, 'organization', 'Manage Kamustahan', 'blue', 'Track post-adoption check-ins for every adopted pet, with counts for Total Pets, For Update, and Updated shown at a glance.\nSwitch between Table View and Calendar View to see which pets are due for a well-being update.\nSchedule the next check-in date for an adopted pet so adopters know when to submit their update.\nReview each submitted update, including the adopter\'s photo, message, adopter name, and date submitted.\nExport kamustahan records by month for your organization\'s reports.', 4, NULL),
(5, 'organization', 'Analytics', 'emerald', 'View a real-time overview of your pets\' status (Available, Adopted, etc.) at a glance.\nFilter analytics by Day, Month, or Year to focus on the timeframe you need.\nTrack adopted pets and available pets over time through dedicated charts.\nMonitor cash and in-kind donations with separate charts and period labels.\nRefresh the dashboard anytime to pull the latest data.\nExport your analytics report as Excel or PDF for record-keeping or sharing with stakeholders.', 5, NULL),
(6, 'organization', 'ttyty', 'emerald', 'drytyutyt', 0, '2026-09-04 07:01:08');

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
(9, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'dry food', 5, 'pcs', NULL, 'Rejected', 'Verification failed. The donated items are damaged or unusable upon physical inspection.', '2026-09-05 01:26:17'),
(10, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'kjljli', 6, 'pcs', NULL, 'Rejected', 'Verification failed. The donated items are damaged or unusable upon physical inspection.', '2026-09-06 01:41:57'),
(11, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'dry good', 5, 'pcs', NULL, 'Pending', NULL, '2026-09-06 02:00:39'),
(12, 1, 1, 'Shinrei Nouzen', 'shin@gmail.com', 'dry food', 6, 'pcs', NULL, 'Pending', NULL, '2026-09-06 02:11:35');

-- --------------------------------------------------------

--
-- Table structure for table `kamustahan_updates`
--

CREATE TABLE `kamustahan_updates` (
  `update_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `organization_id` int(11) NOT NULL,
  `update_date` date NOT NULL,
  `update_text` text NOT NULL,
  `photos` text NOT NULL,
  `is_archived` tinyint(1) DEFAULT 0,
  `status` varchar(50) DEFAULT 'Pending',
  `scheduled_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamustahan_updates`
--

INSERT INTO `kamustahan_updates` (`update_id`, `animal_id`, `adopter_id`, `organization_id`, `update_date`, `update_text`, `photos`, `is_archived`, `status`, `scheduled_date`, `created_at`) VALUES
(35, 91, 1, 2, '2026-09-05', 'jljljlj', '/uploads/kamustahan/kamustahan-1788571830206.JPG', 0, 'Pending', '2026-09-05', '2026-09-05 01:30:30');

-- --------------------------------------------------------

--
-- Table structure for table `matchmaking_requests`
--

CREATE TABLE `matchmaking_requests` (
  `request_id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `preferred_species` enum('Dog','Cat') DEFAULT NULL,
  `preferred_gender` enum('Male','Female') DEFAULT NULL,
  `preferred_age` varchar(100) DEFAULT NULL,
  `preference_text` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 3, 'Interview Scheduled', 'Your interview is set for 2026-09-08 at 08:00.', 'interview_scheduled', 1, '/application', '2026-09-07 23:20:18'),
(3, 3, 'Interview Rescheduled', 'Your interview is set for 2026-09-08 at 08:30.', 'interview_rescheduled', 1, '/application', '2026-09-07 23:21:08'),
(4, 1, 'New Feedback Received', 'A new \"Feature Suggestion\" feedback was submitted: \"bfgb\"', 'feedback_new', 1, '/admin/feedback', '2026-09-08 02:51:23'),
(5, 1, 'New Feedback Received', 'A new \"Report a Bug\" feedback was submitted: \"gbg\"', 'feedback_new', 1, '/admin/feedback', '2026-09-08 02:52:45'),
(6, 1, 'New Feedback Received', 'A new \"Report a Bug\" feedback was submitted: \"IDKKK\"', 'feedback_new', 0, '/admin/feedback', '2026-09-08 03:58:17'),
(7, 1, 'New Feedback Received', 'A new \"Feature Suggestion\" feedback was submitted: \"fgrfhfhg\"', 'feedback_new', 1, '/admin/feedback', '2026-09-08 06:44:09');

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
  `region` varchar(100) NOT NULL DEFAULT 'Region V (Bicol Region)',
  `address` text DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `barangay` varchar(100) NOT NULL DEFAULT '',
  `province` varchar(100) DEFAULT NULL,
  `zip_code` varchar(10) NOT NULL DEFAULT '',
  `description` text DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `verification_status` enum('Pending','Approved','Rejected') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`organization_id`, `account_id`, `organization_name`, `organization_type`, `contact_person`, `contact_number`, `region`, `address`, `city`, `barangay`, `province`, `zip_code`, `description`, `profile_pic`, `verification_status`) VALUES
(1, 2, 'PAWSsion Benevolence Circle', 'Rescue Organization', 'Princes Kaye G. Lascano', '09777777777', 'Region V (Bicol Region)', 'National Rd', 'Nabua', 'San Miguel (Pob.)', 'Camarines Sur', '4443', 'Our organization is dedicated to caring for stray dogs and cats, advocating for animal rights, and promoting their welfare.', '/uploads/orgs/org-2-1787995554589-388628080.jpg', 'Approved'),
(2, 5, 'PUP Sintang Pusa', 'Animal Shelter', 'Jhyzzeel Dianela', '09815439724', 'National Capital Region (NCR)', 'Anonas Street, Sta. Mesa', 'Sampaloc', 'Barangay 636', 'Ncr, City Of Manila, First District', '1016', 'For the cats of PUP, we serve!', '/uploads/orgs/org-5-1788005945090-149762458.jpg', 'Approved'),
(3, 9, 'test org', 'Animal Shelter', 'test', '09999999999', 'Region XII (SOCCSKSARGEN)', 'test org', 'Columbio', 'Natividad', 'Cotabato (North Cotabato)', '4434', '', NULL, 'Approved'),
(4, 10, 'test2', 'Animal Shelter', 'test2', '09888888888', 'Region III (Central Luzon)', 'xvxv', 'Balagtas (Bigaa)', 'Borol 2nd', 'Aurora', '4434', '', NULL, 'Pending');

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
(1, 1, 'cf35b9afa57ce1e662c8b677c4cc91c4.jpg', '63977785c7d9215662d30505a2814e8c', '2026-07-13 12:51:22'),
(2, 2, 'adobo_landingpage.png', '266702a93b5daebe07590a6ff375db1f.png', '2026-07-24 16:07:44'),
(3, 3, '615415131_901128955781832_7628161544194646444_n.png', 'd419ebccee4eb4b01baeafe85dc40f19.png', '2026-09-05 03:12:01'),
(4, 4, '692422316_955475547227773_6354521244232087650_n.jpg', 'a0007d78a229a5994c25a21ba1f236cb.jpg', '2026-09-05 16:16:21');

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
(57, 2, 'PUP Sintang', 'Pili Camarines sur', 'Tuesday - Sunday 8:00 AM - 6:00 PM', 'knjbhvgcfrtf6g7h8j9okpl', 'qr-5-1787597664232-574312247.png', '2026-08-24 18:06:02', '2026-08-24 19:09:39'),
(62, 1, 'Camarines Sur Polytechnic Colleges', 'National Rd, Brgy. San Miguel (Pob.), Nabua, Camarines Sur, 4443', 'Monday - Friday 8:00 AM - 6:00 PM', '', 'qr-2-1787924666162-614673456.JPG', '2026-08-28 13:28:53', '2026-09-06 13:01:00');

-- --------------------------------------------------------

--
-- Table structure for table `organization_dropoff_hours`
--

CREATE TABLE `organization_dropoff_hours` (
  `organization_id` int(11) NOT NULL,
  `day_of_week` tinyint(4) NOT NULL,
  `is_open` tinyint(1) NOT NULL DEFAULT 1,
  `start_time` time NOT NULL DEFAULT '08:00:00',
  `end_time` time NOT NULL DEFAULT '18:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organization_dropoff_hours`
--

INSERT INTO `organization_dropoff_hours` (`organization_id`, `day_of_week`, `is_open`, `start_time`, `end_time`) VALUES
(1, 0, 0, '08:00:00', '18:00:00'),
(1, 1, 1, '08:00:00', '18:00:00'),
(1, 2, 1, '08:00:00', '18:00:00'),
(1, 3, 1, '08:00:00', '18:00:00'),
(1, 4, 1, '08:00:00', '18:00:00'),
(1, 5, 1, '08:00:00', '18:00:00'),
(1, 6, 0, '08:00:00', '18:00:00'),
(2, 0, 0, '08:00:00', '18:00:00'),
(2, 1, 1, '08:00:00', '18:00:00'),
(2, 2, 1, '08:00:00', '18:00:00'),
(2, 3, 1, '08:00:00', '18:00:00'),
(2, 4, 1, '08:00:00', '18:00:00'),
(2, 5, 1, '08:00:00', '18:00:00'),
(2, 6, 1, '08:00:00', '18:00:00');

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
(93, 1, 'PBC', '09786467787', 'qr-2-1788662795656-312674426.jpg', '2026-09-05 01:23:46', '2026-09-06 11:57:14', 'PBC', '09766555555', 'qr-2-1788695834138-104335928.jpg', 'maya');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `reset_id` int(11) NOT NULL,
  `account_id` int(11) NOT NULL,
  `token_hash` varchar(64) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `password_reset_tokens`
--

INSERT INTO `password_reset_tokens` (`reset_id`, `account_id`, `token_hash`, `expires_at`, `used_at`, `created_at`) VALUES
(2, 8, '29c6f1f30c051ead5c4e00f8684dde07b8f7531a4472785971d2d8aed21f8205', '2026-08-08 11:05:53', NULL, '2026-08-08 02:35:53'),
(5, 9, '57d7d39b2141f734e47b6838f9a6be7e24f3f0c9451533bf9d96faf3e1fa9eba', '2026-08-08 11:45:48', '2026-08-08 11:17:42', '2026-08-08 03:15:48');

-- --------------------------------------------------------

--
-- Table structure for table `site_settings`
--

CREATE TABLE `site_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `site_settings`
--

INSERT INTO `site_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('support_email', 'pawssion_admin@gmail.com', '2026-09-03 12:01:19'),
('support_hours_days', 'Monday – Friday', '2026-09-03 12:01:19'),
('support_hours_time', '9:00 AM – 5:00 PM', '2026-09-03 12:21:02'),
('support_phone', '09655666666', '2026-09-03 12:31:32');

-- --------------------------------------------------------

--
-- Table structure for table `user_adoption_applications`
--

CREATE TABLE `user_adoption_applications` (
  `application_id` int(11) NOT NULL,
  `organization_id` int(11) DEFAULT NULL,
  `animal_id` int(11) NOT NULL,
  `adopter_id` int(11) DEFAULT NULL,
  `applicant_snapshot` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`applicant_snapshot`)),
  `adoption_intent` text DEFAULT NULL,
  `emergency_name` varchar(150) NOT NULL,
  `emergency_phone` varchar(15) NOT NULL,
  `emergency_relation` varchar(50) NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'Under Review',
  `decline_reason` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_adoption_applications`
--

INSERT INTO `user_adoption_applications` (`application_id`, `organization_id`, `animal_id`, `adopter_id`, `applicant_snapshot`, `adoption_intent`, `emergency_name`, `emergency_phone`, `emergency_relation`, `document_path`, `status`, `decline_reason`, `created_at`, `updated_at`) VALUES
(35, 1, 59, NULL, '{\"full_name\":\"Kristina B. Lor\",\"contact_number\":\"09777777777\",\"email\":\"krlor@my.cspc.edu.ph\",\"full_address\":\"hyytgg\",\"civil_status\":\"Single\",\"age\":\"22\",\"occupation\":\"ghnghn\"}', 'dgg', 'Irene Espeleta', '09778777777', 'dfgfxgf', NULL, 'Approved', NULL, '2026-08-29 13:34:27', '2026-08-29 13:34:27'),
(36, 2, 91, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-09-03T02:05:39.452Z\"}', 'I want a pet', 'Irene Espeleta', '09676565666', 'Friend', 'doc-3-1788401139439.jpg', 'Approved', NULL, '2026-09-03 02:05:39', '2026-09-05 01:28:38'),
(37, 1, 58, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-09-05T01:21:12.837Z\"}', 'bhgjhgj', 'Irene Espeleta', '09676565666', 'gjgjgj', 'doc-3-1788571272796.png', 'Cancelled', NULL, '2026-09-05 01:21:12', '2026-09-05 02:05:56'),
(38, 2, 90, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-09-05T02:22:07.359Z\"}', 'ghjkhkhjk', 'Irene Espeleta', '09676565666', 'khkhkhk', 'doc-3-1788574927342.png', 'Interview Scheduled', NULL, '2026-09-05 02:22:07', '2026-09-05 02:23:05'),
(39, 2, 88, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-09-05T01:18:12.464Z\"}', 'jgjgj', 'Irene Espeleta', '09676565666', 'fddgvdgdg', 'doc-3-1788571092439.png', 'Cancelled', NULL, '2026-09-05 01:18:12', '2026-09-05 01:19:15'),
(40, 2, 89, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-09-07T23:18:47.524Z\"}', 'r6yrtyt', 'Irene Espeleta', '09676565666', 'fgfg', 'doc-3-1788823127508.png', 'Interview Scheduled', NULL, '2026-09-07 23:18:47', '2026-09-07 23:21:08');

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
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `fk_log_account` (`account_id`);

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
-- Indexes for table `animal_embeddings`
--
ALTER TABLE `animal_embeddings`
  ADD PRIMARY KEY (`animal_id`);

--
-- Indexes for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  ADD PRIMARY KEY (`medical_id`),
  ADD KEY `animal_id` (`animal_id`);

--
-- Indexes for table `application_interviews`
--
ALTER TABLE `application_interviews`
  ADD PRIMARY KEY (`interview_id`),
  ADD UNIQUE KEY `unique_app_interview` (`application_id`);

--
-- Indexes for table `cash_donations`
--
ALTER TABLE `cash_donations`
  ADD PRIMARY KEY (`cash_donation_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`feedback_id`),
  ADD KEY `fk_feedback_account` (`account_id`),
  ADD KEY `fk_feedback_organization` (`organization_id`);

--
-- Indexes for table `guide_sections`
--
ALTER TABLE `guide_sections`
  ADD PRIMARY KEY (`section_id`);

--
-- Indexes for table `inkind_donations`
--
ALTER TABLE `inkind_donations`
  ADD PRIMARY KEY (`inkind_donation_id`),
  ADD KEY `adopter_id` (`adopter_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  ADD PRIMARY KEY (`update_id`),
  ADD KEY `animal_id` (`animal_id`),
  ADD KEY `adopter_id` (`adopter_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `matchmaking_requests`
--
ALTER TABLE `matchmaking_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `adopter_id` (`adopter_id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`),
  ADD KEY `account_id` (`account_id`);

--
-- Indexes for table `organization_availability`
--
ALTER TABLE `organization_availability`
  ADD PRIMARY KEY (`availability_id`),
  ADD UNIQUE KEY `uniq_org_day` (`organization_id`,`day_of_week`);

--
-- Indexes for table `organization_documents`
--
ALTER TABLE `organization_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- Indexes for table `organization_dropoff_details`
--
ALTER TABLE `organization_dropoff_details`
  ADD PRIMARY KEY (`dropoff_id`),
  ADD UNIQUE KEY `unique_org_dropoff` (`organization_id`),
  ADD UNIQUE KEY `unique_organization_dropoff` (`organization_id`);

--
-- Indexes for table `organization_dropoff_hours`
--
ALTER TABLE `organization_dropoff_hours`
  ADD PRIMARY KEY (`organization_id`,`day_of_week`);

--
-- Indexes for table `organization_payment_details`
--
ALTER TABLE `organization_payment_details`
  ADD PRIMARY KEY (`payment_id`),
  ADD UNIQUE KEY `unique_organization_payment` (`organization_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`reset_id`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `fk_password_reset_account` (`account_id`);

--
-- Indexes for table `site_settings`
--
ALTER TABLE `site_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `fk_app_animal` (`animal_id`),
  ADD KEY `fk_app_adopter` (`adopter_id`),
  ADD KEY `fk_user_applications_org` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=416;

--
-- AUTO_INCREMENT for table `adopters`
--
ALTER TABLE `adopters`
  MODIFY `adopter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=94;

--
-- AUTO_INCREMENT for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  MODIFY `medical_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `application_interviews`
--
ALTER TABLE `application_interviews`
  MODIFY `interview_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT for table `cash_donations`
--
ALTER TABLE `cash_donations`
  MODIFY `cash_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `feedback_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `guide_sections`
--
ALTER TABLE `guide_sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inkind_donations`
--
ALTER TABLE `inkind_donations`
  MODIFY `inkind_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  MODIFY `update_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `matchmaking_requests`
--
ALTER TABLE `matchmaking_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `organization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `organization_availability`
--
ALTER TABLE `organization_availability`
  MODIFY `availability_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=123;

--
-- AUTO_INCREMENT for table `organization_documents`
--
ALTER TABLE `organization_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `organization_dropoff_details`
--
ALTER TABLE `organization_dropoff_details`
  MODIFY `dropoff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=86;

--
-- AUTO_INCREMENT for table `organization_payment_details`
--
ALTER TABLE `organization_payment_details`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=114;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_log_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

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
-- Constraints for table `animal_embeddings`
--
ALTER TABLE `animal_embeddings`
  ADD CONSTRAINT `animal_embeddings_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE;

--
-- Constraints for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  ADD CONSTRAINT `animal_medical_history_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE;

--
-- Constraints for table `application_interviews`
--
ALTER TABLE `application_interviews`
  ADD CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `user_adoption_applications` (`application_id`) ON DELETE CASCADE;

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `fk_feedback_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_feedback_organization` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  ADD CONSTRAINT `kamustahan_updates_ibfk_1` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kamustahan_updates_ibfk_2` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `kamustahan_updates_ibfk_3` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `matchmaking_requests`
--
ALTER TABLE `matchmaking_requests`
  ADD CONSTRAINT `matchmaking_requests_ibfk_1` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_availability`
--
ALTER TABLE `organization_availability`
  ADD CONSTRAINT `organization_availability_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_documents`
--
ALTER TABLE `organization_documents`
  ADD CONSTRAINT `organization_documents_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_dropoff_hours`
--
ALTER TABLE `organization_dropoff_hours`
  ADD CONSTRAINT `organization_dropoff_hours_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

--
-- Constraints for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD CONSTRAINT `fk_app_adopter` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_applications_org` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
