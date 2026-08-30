-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2026 at 08:43 AM
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `animals`
--

INSERT INTO `animals` (`animal_id`, `organization_id`, `name`, `species`, `gender`, `age`, `pet_description`, `health_status`, `vaccination_status`, `adoption_status`, `image_path`, `created_at`) VALUES
(12, 1, 'Bloop', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This cat appears calm and independent. It may prefer a quiet environment and approach people at its own pace. It seems observant and cautious around unfamiliar situations. Its personality appears gentle, relaxed, and low-energy.', 'Healthy', 'Vaccinated', 'Available', '1787640690877-312087.PNG', '2026-07-16 11:32:48'),
(13, 1, 'ADOBO ', 'Dog', 'Female', 'Adult (4-7 yrs old)', 'Adobo appears alert and observant around people and his surroundings. He seems curious while remaining cautious in unfamiliar situations. He may enjoy interaction once he becomes comfortable with people. His personality appears gentle, attentive, and independent.', 'Healthy', 'Vaccinated', 'Available', '1787639713598-50688.PNG', '2026-07-16 11:56:33'),
(14, 1, 'Albie', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'a cat who loves playing outside and plays with other cat', 'Healthy', 'Vaccinated', 'Available', '1787640649632-623824.PNG', '2026-07-23 09:55:57'),
(15, 1, 'TATA', 'Dog', 'Female', 'Adult (4-7 yrs old)', 'Loves food', 'Healthy', 'Vaccinated', 'Adopted', '1784812611011-994578.png', '2026-07-23 13:16:51'),
(21, 1, 'Chonk', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', NULL, 'Sick', 'Unknown', 'Pending', '1787640610061-742171.PNG', '2026-08-14 07:40:37'),
(26, 1, 'sample add pet', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', NULL, 'Healthy', 'Vaccinated', 'Adopted', NULL, '2026-08-14 08:00:21'),
(27, 1, 'Sadboi', 'Dog', 'Male', 'Puppy/Kitten (0-1 yr old)', 'Sadboi is alert and observant around his surroundings. He appears curious but slightly cautious when approaching unfamiliar situations. He may take time to become comfortable with new people. His personality seems gentle, attentive, and independent.', 'Healthy', 'Vaccinated', 'Available', '1787640306597-877425.PNG', '2026-08-25 06:45:06'),
(28, 1, 'Zeus', 'Dog', 'Male', 'Puppy/Kitten (0-1 yr old)', 'Zeus appears calm, quiet, and reserved. He prefers resting in peaceful areas and shows low-energy behavior. He may be cautious around unfamiliar people and situations. His personality seems gentle, relaxed, and independent.', 'Healthy', 'Vaccinated', 'Available', '1787640370251-830140.PNG', '2026-08-25 06:46:10'),
(29, 1, 'Taco', 'Dog', 'Male', 'Puppy/Kitten (0-1 yr old)', 'Taco appears alert, curious, and energetic. He seems attentive to people and interested in his surroundings. He may enjoy interaction, exploration, and active play. His personality appears playful, friendly, and lively.', 'Healthy', 'Vaccinated', 'Available', '1787640404899-215697.PNG', '2026-08-25 06:46:44'),
(30, 1, 'Roti', 'Dog', 'Male', 'Puppy/Kitten (0-1 yr old)', 'Roti appears calm and observant around his surroundings. He seems attentive while maintaining a relaxed behavior. He may prefer approaching people and new situations at his own pace. His personality appears gentle, quiet, and watchful.', 'Healthy', 'Vaccinated', 'Available', '1787640453860-940222.PNG', '2026-08-25 06:47:33'),
(31, 1, 'Nougat', 'Dog', 'Female', 'Adult (4-7 yrs old)', 'Nougat appears calm and low-energy. He seems comfortable resting quietly in peaceful spaces. He may prefer gentle interaction over highly active play. His personality appears relaxed, gentle, and easygoing.', 'Healthy', 'Vaccinated', 'Available', '1787640492940-569772.PNG', '2026-08-25 06:48:12'),
(32, 1, 'Mondy', 'Dog', 'Female', 'Puppy/Kitten (0-1 yr old)', 'Mondy appears calm, attentive, and approachable. He seems comfortable around people while remaining observant of his surroundings. He may enjoy gentle interaction and spending time near familiar people. His personality appears friendly, relaxed, and affectionate.', 'Healthy', 'Vaccinated', 'Available', '1787640528207-272351.PNG', '2026-08-25 06:48:48'),
(33, 1, 'Lebron', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'Lebron appears relaxed and low-energy. He seems comfortable spending time resting and staying in quiet areas. He may prefer a peaceful environment and gentle interaction. His personality appears calm, easygoing, and independent.', 'Healthy', 'Vaccinated', 'Available', '1787640567198-550782.PNG', '2026-08-25 06:49:27');

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
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

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
