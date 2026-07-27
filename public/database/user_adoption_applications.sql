-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 27, 2026 at 08:04 PM
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
-- Table structure for table `user_adoption_applications`
--

CREATE TABLE `user_adoption_applications` (
  `application_id` int(11) NOT NULL,
  `animal_id` int(11) NOT NULL,
  `adopter_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `contact_number` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `full_address` text NOT NULL,
  `civil_status` varchar(20) NOT NULL,
  `age` int(11) NOT NULL,
  `occupation` varchar(100) NOT NULL,
  `adoption_intent` text NOT NULL,
  `emergency_name` varchar(150) NOT NULL,
  `emergency_phone` varchar(15) NOT NULL,
  `emergency_relation` varchar(50) NOT NULL,
  `document_path` varchar(255) NOT NULL,
  `status` enum('Pending','Approved','Rejected','Cancelled') DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_adoption_applications`
--

INSERT INTO `user_adoption_applications` (`application_id`, `animal_id`, `adopter_id`, `full_name`, `contact_number`, `email`, `full_address`, `civil_status`, `age`, `occupation`, `adoption_intent`, `emergency_name`, `emergency_phone`, `emergency_relation`, `document_path`, `status`, `created_at`, `updated_at`) VALUES
(1, 15, 1, 'Irene Espeleta', '09331231232', 'irespeleta@my.cspc.edu.ph', 'sfdsfffffffffffffffffffffffffffffffffffffffff', 'Single', 45, 'dfgdfgdfgdfg', 'gfrgrfgrfgf', 'Irene Espeleta', '09676565666', 'fddgvdgdg', 'doc-3-1785174605742.png', 'Pending', '2026-07-27 17:50:05', '2026-07-27 17:50:05'),
(2, 15, 1, 'Irene Espeleta', '09331231232', 'irespeleta@my.cspc.edu.ph', 'sfdsfffffffffffffffffffffffffffffffffffffffff', 'Married', 45, 'dfgdfgdfgdfg', 'hgjfhjuhjhm', 'Irene Espeleta', '09676565666', 'jfjfghjhgjg', 'doc-3-1785175113458.png', 'Pending', '2026-07-27 17:58:33', '2026-07-27 17:58:33'),
(3, 15, 1, 'Irene Espeleta', '09331231232', 'irespeleta@my.cspc.edu.ph', 'sfdsfffffffffffffffffffffffffffffffffffffffff', 'Single', 45, 'dfgdfgdfgdfg', 'hnhnhnhn', 'Irene Espeleta', '09676565666', 'rrgrg', 'doc-3-1785175383163.png', 'Pending', '2026-07-27 18:03:03', '2026-07-27 18:03:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `fk_app_animal` (`animal_id`),
  ADD KEY `fk_app_adopter` (`adopter_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  ADD CONSTRAINT `fk_app_adopter` FOREIGN KEY (`adopter_id`) REFERENCES `adopters` (`adopter_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_app_animal` FOREIGN KEY (`animal_id`) REFERENCES `animals` (`animal_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
