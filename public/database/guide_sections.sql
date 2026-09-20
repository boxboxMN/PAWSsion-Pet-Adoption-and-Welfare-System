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
(2, 'organization', 'Reviewing Adoption Requests', 'emerald', 'Check incoming applications submitted by potential adopters through the Adoptions tab.\nVerify adopter information and match scores provided by the system.\nScheduled interviews first before approving or rejecting an application.\nRescheduled interviews if the adopter isn’t available or didn’t show up.\nUse the view calendar to view upcoming and available dates for scheduled interviews.\nApprove or reject applications based on your organization\'s shelter screening standards.', 3, NULL),
(3, 'organization', 'Donations & Organization Profile', 'amber', '**Donations:** Monitor records and ensure your organization\'s payment methods or drop-off instructions are updated.\n**Profile Settings:** Keep your shelter\'s contact number, address, and description accurate so donors and adopters can reach you easily.', 2, NULL),
(4, 'organization', 'Manage Kamustahan', 'blue', 'Track post-adoption check-ins for every adopted pet, with counts for Total Pets, For Update, and Updated shown at a glance.\nSwitch between Table View and Calendar View to see which pets are due for a well-being update.\nSchedule the next check-in date for an adopted pet so adopters know when to submit their update.\nReview each submitted update, including the adopter\'s photo, message, adopter name, and date submitted.\nExport kamustahan records by month for your organization\'s reports.', 4, NULL),
(5, 'organization', 'Analytics', 'emerald', 'View a real-time overview of your pets\' status (Available, Adopted, etc.) at a glance.\nFilter analytics by Day, Month, or Year to focus on the timeframe you need.\nTrack adopted pets and available pets over time through dedicated charts.\nMonitor cash and in-kind donations with separate charts and period labels.\nRefresh the dashboard anytime to pull the latest data.\nExport your analytics report as Excel or PDF for record-keeping or sharing with stakeholders.', 5, NULL),
(6, 'organization', 'ttyty', 'emerald', 'drytyutyt', 0, '2026-09-04 07:01:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `guide_sections`
--
ALTER TABLE `guide_sections`
  ADD PRIMARY KEY (`section_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `guide_sections`
--
ALTER TABLE `guide_sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
