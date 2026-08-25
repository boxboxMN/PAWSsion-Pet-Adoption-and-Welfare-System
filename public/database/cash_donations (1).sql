-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 24, 2026 at 09:11 PM
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
(10, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'Jhyzzeel Dianela', 'kjhgcfxdrctg67890', 600.00, '/uploads/receipts/receipt-4-1784909495104.png', 'Pending', NULL, '2026-07-24 08:11:35'),
(11, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'Jhyzzeel Dianela', 'ihugyftdr567890', 700.00, '/uploads/receipts/receipt-4-1784909533509.jpg', 'Approved', NULL, '2026-07-24 08:12:13'),
(12, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'kjhghjkm', 'ghjkkjhygtr567890-0987654567890-0987', 90.00, '/uploads/receipts/receipt-4-1787322350071.jpg', 'Pending', NULL, '2026-08-21 14:25:50'),
(13, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'kjhgcfcrtyui', 'mknjhrd4567y8u9i0', 5678909.00, '/uploads/receipts/receipt-4-1787323677500.png', 'Approved', NULL, '2026-08-21 14:47:57'),
(14, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'jhyzzeel Dianela', 'jbhgc6t7y89i0', 36.00, '/uploads/receipts/receipt-4-1787325307468.jpg', 'Approved', NULL, '2026-08-21 15:15:07'),
(15, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'zjanjdq', '234829484658202', 60.00, '/uploads/receipts/receipt-4-1787496107668.jpg', 'Pending', NULL, '2026-08-23 14:41:47'),
(16, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'ghjkm', '12345678904892', 58.00, '/uploads/receipts/receipt-4-1787496357859.jpg', 'Pending', NULL, '2026-08-23 14:45:57'),
(17, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'gcash', 'Jhyzzeel Dianela', '1234567890865', 130.00, '/uploads/receipts/receipt-4-1787497972376.jpg', 'Pending', NULL, '2026-08-23 15:12:52'),
(18, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'maya', 'Jhyzzeel Barte', '1235678987654', 54.00, '/uploads/receipts/receipt-4-1787498576770.jpg', 'Approved', NULL, '2026-08-23 15:22:56'),
(19, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'maya', 'Jhyzzeel Dianela', '12345678909865', 40.00, '/uploads/receipts/receipt-4-1787568467623.jpg', 'Pending', NULL, '2026-08-24 10:47:47'),
(20, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'maya', 'Jhyzzeel Dianela', '1234567384950', 50.00, '/uploads/receipts/receipt-4-1787569848067.jpg', 'Pending', NULL, '2026-08-24 11:10:48'),
(21, 2, 2, 'Jhyzzeel Dianela', 'jhyzzeeldianela8@gmail.com', 'maya', 'John Kirby Perez', '2345677654321', 127.00, '/uploads/receipts/receipt-4-1787570549535.jpg', 'Approved', NULL, '2026-08-24 11:22:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cash_donations`
--
ALTER TABLE `cash_donations`
  ADD PRIMARY KEY (`cash_donation_id`),
  ADD KEY `organization_id` (`organization_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cash_donations`
--
ALTER TABLE `cash_donations`
  MODIFY `cash_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
