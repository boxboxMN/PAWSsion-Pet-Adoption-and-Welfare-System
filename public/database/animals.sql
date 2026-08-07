-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 07, 2026 at 07:29 AM
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
(10, 1, 'NOUGAT', 'Dog', 'Female', 'Adolescence (2-3 yrs old)', '2026-06-29', 'WHITE', 'This sweet animal is looking for a forever home. They have been socialized with humans and are ready to be part of a loving family. Great with kids and always eager to greet you at the door', 'Healthy', 'Vaccinated', 'Available', '1784476469890-470542.PNG', '2026-07-14 16:27:42', 'Kind,Cool,Friendly,Cute'),
(12, 1, 'SADBOI', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', '2026-07-12', 'black and white', 'Calm and friendly, allows human interaction and petting. Kinds always\r\n', 'Healthy', 'Vaccinated', 'Available', '1784476346068-454492.PNG', '2026-07-16 11:32:48', 'kind,cute,friendly,Calm'),
(13, 1, 'ADOBO ', 'Dog', 'Female', 'Adult (4-7 yrs old)', '2026-06-22', 'brown and white on extremities & end of tail', 'Very friendly, active, allows human interaction and petting.\r\n', 'Healthy', 'Vaccinated', 'Available', '1784812642399-55744.png', '2026-07-16 11:56:33', 'Friendly,Kind,Kyut,Chubby'),
(14, 1, 'Luca', 'Cat', 'Female', 'Adult (4-7 yrs old)', '2026-07-23', 'blue', 'a cat who loves playing outside and plays with other cat', 'Healthy', 'Vaccinated', 'Available', '1784800557935-647386.png', '2026-07-23 09:55:57', 'kind,big,friendly'),
(15, 1, 'TATA', 'Dog', 'Female', 'Adult (4-7 yrs old)', '2026-07-23', 'fsddfs', 'Loves food', 'Healthy', 'Vaccinated', 'Adopted', '1784812611011-994578.png', '2026-07-23 13:16:51', 'Kind,Cute,Friendly,Playful');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `animals`
--
ALTER TABLE `animals`
  ADD PRIMARY KEY (`animal_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `animals`
--
ALTER TABLE `animals`
  ADD CONSTRAINT `animals_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
