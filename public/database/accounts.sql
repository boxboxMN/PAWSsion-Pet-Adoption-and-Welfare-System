-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2026 at 03:34 AM
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
  `last_login` datetime DEFAULT NULL,
  `profile_verify_attempts` int(11) NOT NULL DEFAULT 0,
  `profile_verify_locked_until` timestamp NULL DEFAULT NULL,
  `current_session_id` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password_hash`, `role`, `status`, `email_verified`, `created_at`, `updated_at`, `last_login`, `profile_verify_attempts`, `profile_verify_locked_until`, `current_session_id`) VALUES
(1, 'admin@pawpon.com', '$2b$10$l16R.DYg693wgKJJ20QQYucqrCl8.Zop120.UkdYO7g0TKXTc6vr6', 'admin', 'active', 1, '2026-07-06 14:27:26', '2026-09-23 01:30:12', '2026-09-23 09:30:12', 0, NULL, 'JrJeO2z0bkZzDr9cX3zTv6VQJs6vLFjb'),
(2, 'pawssion@gmail.com', '$2b$10$2hXt/yS9bNVHA2d31JWDHuzjfOcyEz5Px8RY3DN3MxhDFApxxCTMe', 'organization', 'active', 1, '2026-07-13 12:51:22', '2026-09-23 01:30:05', '2026-09-23 09:29:45', 0, NULL, NULL),
(3, 'shin@gmail.com', '$2b$10$tuu0.7L9PiYpbXeUNdRmw.rerKPVXwUhOuCzh/mgR1LduNDDVL5.q', 'adopter', 'active', 1, '2026-07-13 12:55:42', '2026-09-23 01:31:15', '2026-09-23 09:31:15', 0, NULL, '-LTKMMHJrbxzKsfTZ6QKEJ3VqsOh4JcA'),
(4, 'jhyzzeeldianela8@gmail.com', '$2b$10$0GjjNk1KhUV8c9sZMehVlOcChT1tMtsjsJDGT.QdUGxWB5.m/vU6.', 'adopter', 'active', 1, '2026-07-24 16:05:49', '2026-09-21 07:09:05', '2026-09-21 15:09:05', 0, NULL, NULL),
(5, 'jhyzzeeldianela@gmail.com', '$2b$10$JVHLxLNP8jFjCy3C8lpla.4P9s/tdhcMMnUq699.aOKat47N2uFCe', 'organization', 'active', 1, '2026-07-24 16:07:44', '2026-09-23 00:38:09', '2026-09-23 08:27:40', 0, NULL, NULL),
(6, 'eneriatelepse@gmail.com', '$2b$10$CqRZqEY5tGsQpW1Z.Dequ.CizCVVCjsLj6ulBpg0A37TDEF5npogK', 'adopter', 'active', 1, '2026-08-09 15:02:03', '2026-08-17 11:34:11', '2026-08-17 19:34:11', 0, NULL, NULL),
(7, 'irespeleta@my.cspc.edu.ph', '$2b$10$hFdkc2foUWjwAaejb4kte.PpZ9tcNIyjzMxjbjZQCqHnFEODZCNhC', 'adopter', 'active', 1, '2026-08-19 09:55:24', '2026-08-25 04:06:20', '2026-08-25 12:06:20', 0, NULL, NULL),
(8, 'testlogin1@gmail.com', '$2b$10$sBiw21ltx.V1hXivCwxSrO7gjT2MKALbC/wzR7spPDW2znwRRLmMK', 'adopter', 'active', 1, '2026-09-05 03:10:03', '2026-09-16 03:35:44', '2026-09-16 11:35:44', 0, NULL, NULL),
(9, 'testloginorg1@gmail.com', '$2b$10$xnfvNgKMnzW2.DIaN.eKP.rwwzLre9aIbHYuwfzVwJdY3p0ehFxzu', 'organization', 'active', 1, '2026-09-05 03:12:01', '2026-09-07 11:46:28', NULL, 0, NULL, NULL),
(10, 'testlogin2@gmail.com', '$2b$10$5ptRmUFb7/QnwbdHwHMndut806gPM2hePMS.Fba77I2i5AeaL8tYC', 'organization', 'active', 1, '2026-09-05 16:16:21', '2026-09-16 11:27:03', NULL, 0, NULL, NULL),
(11, 'johnkirby@gmail.com', '$2b$10$PTfpiZidWKQA.Tp3dsoQpuuEu.fa1LC0N//PsdeNrS67UtACWHOXa', 'adopter', 'active', 1, '2026-09-15 05:29:31', '2026-09-15 05:29:31', NULL, 0, NULL, NULL),
(12, 'kim@gmail.com', '$2b$10$4eYEmRFwsiZDdsOHAV5A.eT90J55bJoqv3JAK2gVCQbwksjHdQOyq', 'adopter', 'active', 1, '2026-09-15 06:10:27', '2026-09-15 06:10:27', NULL, 0, NULL, NULL),
(13, 'testcreate@gmail.com', '$2b$10$mc2sZk6YkkZpw91GbFmIK.wSzx/ZIQ.8g/0IBYFCBJalouX4jmdI2', 'adopter', 'active', 1, '2026-09-15 21:16:58', '2026-09-15 21:20:20', '2026-09-16 05:20:20', 0, NULL, NULL),
(14, 'test3@gmail.com', '$2b$10$Q7NQtmw5MroazDZu8.ZKPepVVNrtr5Ya1VMzDMuq6SgyDN23TbWp.', 'organization', 'suspended', 1, '2026-09-15 22:03:12', '2026-09-19 18:05:08', '2026-09-16 09:01:10', 0, NULL, NULL),
(15, 'kirby@gmail.com', '$2b$10$9G1aHLF0JIBOTC6S6kFzBOrHYEloYCiG00KIAIP48RsfUuiPjYwH6', 'adopter', 'active', 1, '2026-09-16 15:30:41', '2026-09-16 15:30:51', '2026-09-16 23:30:51', 0, NULL, NULL),
(16, 'kim1@gmail.com', '$2b$10$Y98N2FxkYWffZH54i261Nugv9XPi9dwrsxg4UaRRGMVXPDEefk12a', 'adopter', 'active', 1, '2026-09-16 18:54:24', '2026-09-16 19:04:13', '2026-09-17 03:04:13', 0, NULL, NULL),
(17, 'test@gmail.com', '$2b$10$9vSlbe1LO1kn09nueUht4Oniy6VMBnY/Ue9E.H1nqhtiToTRyaYu.', 'adopter', 'active', 1, '2026-09-16 19:39:56', '2026-09-16 19:39:56', NULL, 0, NULL, NULL),
(18, 'jhy@gmail.com', '$2b$10$81a4IGU1bRqAi1m8T.THjeuw9VYJ68Yv5z/nsvXjkUYLt7.EuhIUC', 'adopter', 'active', 1, '2026-09-17 00:51:45', '2026-09-17 00:51:45', NULL, 0, NULL, NULL),
(19, 'test12@gmail.com', '$2b$10$1cCqBDPsXOXAFUQslnTMRenFkv1UFIrzrWru4//PtN3S/HLCIWulS', 'adopter', 'active', 1, '2026-09-17 01:07:18', '2026-09-17 01:07:51', '2026-09-17 09:07:51', 0, NULL, NULL),
(20, 'test132@gmail.com', '$2b$10$kfxxq2LRBa8ANZSFBlJ9N.NC1rhstfVco0gy2eCLS8idGEO9R8flK', 'adopter', 'active', 1, '2026-09-17 01:33:36', '2026-09-17 01:34:27', '2026-09-17 09:34:27', 0, NULL, NULL),
(21, 'xsstest1@gmail.com', '$2b$10$9/62F9K1uw6M21poksYyB.Uy1yeyiGgDelCEGy1TY9sW9pxK7sNYm', 'adopter', 'active', 1, '2026-09-17 01:40:24', '2026-09-17 01:40:24', NULL, 0, NULL, NULL),
(23, 'xsstest2@gmail.com', '$2b$10$fmF44f9TVxfGjINwx2pCoO0Z.lL.uiIrpD26ncK8cG5JEFkG3mBRG', 'adopter', 'active', 1, '2026-09-17 01:41:53', '2026-09-17 01:42:22', '2026-09-17 09:42:22', 0, NULL, NULL),
(24, 'tester@gmail.com', '$2b$10$9EfYT4haeeS/nOvkEfWxYOX6eBDrbhzZbiutqY3IDjfsN2ntOrzBK', 'adopter', 'disabled', 1, '2026-09-20 02:44:18', '2026-09-20 19:35:50', '2026-09-20 15:14:48', 0, NULL, NULL),
(25, 'test1@gmail.com', '$2b$10$fpjJ3MjPTgsnatJKHl.tquCUmEGUsBymX4mRnzUX3GD4xIjcUZ/96', 'organization', 'active', 1, '2026-09-21 02:12:25', '2026-09-21 02:14:55', NULL, 0, NULL, NULL),
(26, 'torg@gmail.com', '$2b$10$YZWJWzYoOUC5EED0kgLSae8P2gWmZOOvkikT/Kyi7z9iIhvJHZ9Wy', 'organization', 'active', 1, '2026-09-21 02:13:58', '2026-09-21 02:21:39', NULL, 0, NULL, NULL),
(27, 'tester1@gmail.com', '$2b$10$XvztGzMG7iQgq0vndwWo/.aOQxAsl8.dHYEwkOasjTTAKmFJ9cnla', 'adopter', 'active', 1, '2026-09-21 07:24:46', '2026-09-21 07:24:46', NULL, 0, NULL, NULL),
(28, 'tester2@gmail.com', '$2b$10$DA94/tf7n4BuPIr2QlJMnOiKurRN3Hd1fwkXvXvWw7M5PTEigQema', 'adopter', 'active', 1, '2026-09-21 07:28:43', '2026-09-21 07:28:43', NULL, 0, NULL, NULL),
(29, 'shintest2026@gmail.com', '$2b$10$MQT2SsilesXIPHBOG6nB2.lDZZsZfjUhilp2il6h7ok5/wDozJMeW', 'adopter', 'active', 1, '2026-09-22 03:21:27', '2026-09-22 07:06:19', '2026-09-22 15:06:19', 0, NULL, NULL),
(30, 'jhyzzeeldianela1@gmail.com', '$2b$10$WxtymOhIpapDPJF/HdYUEeejTm20K.R9323v2xT4UaM27z37VhfQK', 'organization', 'active', 1, '2026-09-22 04:17:20', '2026-09-22 04:19:38', NULL, 0, NULL, NULL),
(31, 'irene@gmail.com', '$2b$10$aXBPS8fvLbowEoZWQnQ4TO/NdwgGIx26yqKLFd37T2TBUupGCufO6', 'adopter', 'active', 1, '2026-09-22 07:59:57', '2026-09-22 08:00:04', '2026-09-22 16:00:04', 0, NULL, NULL),
(32, 'mariel@gmail.com', '$2b$10$Kqe3AqncqT.a/c/ThrQY4uXDaNXwpnNXosN/Rq.lK4LBIgQdoEWza', 'organization', 'active', 1, '2026-09-22 08:01:48', '2026-09-22 08:02:29', '2026-09-22 16:02:29', 0, NULL, NULL),
(34, 'jhazzeel@gmail.com', '$2b$10$Shohb.71fRSjIo4UmKPVI.rXFlyFjB11lAQL6NS6yQ8H0K2aUspmu', 'adopter', 'active', 1, '2026-09-23 00:58:30', '2026-09-23 00:58:30', NULL, 0, NULL, NULL),
(35, 'jhazzeel1@gmail.com', '$2b$10$Z5NysvOMQUk178TGs0uAkuAn5QVOe7JTQGJ2IfivkU2XgGLC91JOK', 'organization', 'active', 1, '2026-09-23 01:17:08', '2026-09-23 01:18:23', NULL, 0, NULL, NULL);

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
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
