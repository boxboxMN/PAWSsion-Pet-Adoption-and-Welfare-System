-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 29, 2026 at 05:16 PM
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
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `account_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('adopter','organization','admin') NOT NULL,
  `status` enum('pending','active','disabled','suspended','banned','rejected') DEFAULT 'active',
  `email_verified` tinyint(1) DEFAULT 0,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`account_id`, `email`, `password_hash`, `role`, `status`, `email_verified`, `profile_pic`, `created_at`, `updated_at`, `last_login`) VALUES
(1, 'admin@pawpon.com', '$2b$10$l16R.DYg693wgKJJ20QQYucqrCl8.Zop120.UkdYO7g0TKXTc6vr6', 'admin', 'active', 1, NULL, '2026-07-06 14:27:26', '2026-08-29 11:47:01', '2026-08-29 19:47:01'),
(2, 'pawssion@gmail.com', '$2b$10$2hXt/yS9bNVHA2d31JWDHuzjfOcyEz5Px8RY3DN3MxhDFApxxCTMe', 'organization', 'active', 1, NULL, '2026-07-13 12:51:22', '2026-08-29 15:14:44', '2026-08-29 23:14:44'),
(3, 'shin@gmail.com', '$2b$10$tuu0.7L9PiYpbXeUNdRmw.rerKPVXwUhOuCzh/mgR1LduNDDVL5.q', 'adopter', 'active', 1, NULL, '2026-07-13 12:55:42', '2026-08-29 13:57:10', '2026-08-29 21:57:10'),
(4, 'jhyzzeeldianela8@gmail.com', '$2b$10$0GjjNk1KhUV8c9sZMehVlOcChT1tMtsjsJDGT.QdUGxWB5.m/vU6.', 'adopter', 'active', 1, NULL, '2026-07-24 16:05:49', '2026-07-24 16:21:20', '2026-07-25 00:21:20'),
(5, 'jhyzzeeldianela@gmail.com', '$2b$10$JVHLxLNP8jFjCy3C8lpla.4P9s/tdhcMMnUq699.aOKat47N2uFCe', 'organization', 'active', 1, NULL, '2026-07-24 16:07:44', '2026-08-29 15:15:20', '2026-08-29 23:15:20'),
(6, 'eneriatelepse@gmail.com', '$2b$10$CqRZqEY5tGsQpW1Z.Dequ.CizCVVCjsLj6ulBpg0A37TDEF5npogK', 'adopter', 'active', 1, NULL, '2026-08-09 15:02:03', '2026-08-17 11:34:11', '2026-08-17 19:34:11'),
(7, 'irespeleta@my.cspc.edu.ph', '$2b$10$hFdkc2foUWjwAaejb4kte.PpZ9tcNIyjzMxjbjZQCqHnFEODZCNhC', 'adopter', 'active', 1, NULL, '2026-08-19 09:55:24', '2026-08-25 04:06:20', '2026-08-25 12:06:20');

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
(4, 7, 'Irene', 'Espeleta', '2005-07-30', 'Single', NULL, 'Region V (Bicol Region)', 'hyytgg', 'Mainit', 'Bato', 'Camarines Sur', '1212', '09444444447', '/uploads/avatars/avatar-7-1787246507967.png');

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
(27, 1, 'Adobo', 'Dog', 'Female', 'Adult (4-7 yrs old)', 'A friendly and active female dog, with brown and white markings on the extremities and the end of the tail. Adobo is sociable, affectionate, and comfortable with human interaction and petting, with no recorded history of biting or aggressive behavior. The dog has an active temperament and may be suitable for adopters who can provide regular companionship, attention, physical activity, and a safe environment. Adobo gave birth to seven puppies on August 4, 2025. \r\n', 'Healthy', 'Vaccinated', 'Available', '1787986431938-561861.PNG', '2026-08-29 06:53:51'),
(28, 1, 'Sadboi', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'A male dog with a predominantly white coat featuring black markings across the back and tail area, along with light brown coloring on the upper head and ears. Sadboi has a calm and friendly temperament and is comfortable with human interaction and petting. The dog demonstrates a gentle and approachable disposition and has no recorded incidents of biting or aggressive behavior. Sadboi may be suitable for adopters looking for a calm, friendly, and affectionate companion that is comfortable with human interaction. The current status of Sadboi is not specified. ', 'Healthy', 'Vaccinated', 'Available', '1787986796031-527255.png', '2026-08-29 06:57:20'),
(29, 1, 'Nougat', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'A male dog approximately 2–3 years old, with a light-brown coat and dirty-white coloring on the face. Nougat has a shy and cautious temperament around humans and may require patience and a gradual approach when becoming familiar with people. There are no recorded incidents of biting or aggressive behavior. Nougat currently has skin problems on the front legs, possibly associated with a previous wound or infection, and may require continued care and monitoring.', 'Under Treatment', 'Vaccinated', 'Pending', '1787987218307-101263.png', '2026-08-29 07:04:52'),
(30, 1, 'Lebron', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'Lebron is a male dog with a brown and tan coat, erect ears, and distinct white markings on his chest and both front and back paws. He exhibits an active and friendly behavior toward humans, though he shows aggression toward other dogs and requires careful management around other animals.', 'Healthy', 'Unknown', 'Available', '1787987418450-886668.png', '2026-08-29 07:10:18'),
(31, 1, 'Chonk', 'Dog', 'Male', 'Adolescence (2-3 yrs old)', 'A male dog with brown as the dominant coat color and white markings on the legs, tip of the tail, chest, and belly. Black shading is present around the eyes and nose. Chonk has a calm and shy temperament and tends to remain still and cautious around movement. The dog may currently have reduced activity due to an injury and has no recorded incidents of biting or aggressive behavior. Chonk currently has fractured legs and requires medical attention and appropriate care.', 'Under Treatment', 'Vaccinated', 'Pending', '1787987710920-990190.PNG', '2026-08-29 07:15:10'),
(32, 1, 'Roti', 'Dog', 'Female', 'Puppy/Kitten (0-1 yr old)', 'A female dog. She has a predominantly black coat with tiny brown markings above both eyes, brown patches on all four legs, and white markings on the sides of her mouth. She is calm and observant, although she can be slightly cautious around humans. Despite this, she is generally non-aggressive, with no recorded incidents of biting or aggression.\r\n', 'Healthy', 'Unknown', 'Available', '1787987951420-624929.png', '2026-08-29 07:18:20'),
(33, 1, 'Mondy', 'Dog', 'Female', 'Puppy/Kitten (0-1 yr old)', 'A female puppy with a combination of brown and white coloring, with brown covering the upper body and white markings on the chest and belly. Mondy has a playful, friendly, and social temperament and is comfortable interacting with people. The puppy enjoys social interaction and may be suitable for adopters looking for a young, playful, and friendly companion. No recorded incidents of biting or aggressive behavior are indicated.', 'Healthy', 'Vaccinated', 'Available', '1787988261643-881712.png', '2026-08-29 07:24:21'),
(34, 1, 'Taco', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'A male dog with a white coat and a black nose. Taco has a kind and gentle temperament. A skin infection is present near the left eye and may require appropriate medical attention and care. ', 'Healthy', 'Unknown', 'Pending', '1787988463114-127393.png', '2026-08-29 07:27:43'),
(35, 1, 'Duke', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'A black dog with spots of ash-gray fur, known for a kind, gentle, and sleepy disposition. Duke has a calm temperament around people, with no recorded incidents of biting or aggressive behavior. ', 'Healthy', 'Vaccinated', 'Available', '1787988638496-205012.PNG', '2026-08-29 07:30:38'),
(36, 1, 'Zeus', 'Dog', 'Male', 'Adult (4-7 yrs old)', 'A male brown dog. Known for having a calm, kind, and gentle temperament, Zeus is generally shy and reserved when interacting with humans. No recorded incidents of biting or aggressive behavior have been reported.', 'Healthy', 'Vaccinated', 'Available', '1787988818086-743176.PNG', '2026-08-29 07:33:38'),
(37, 1, 'Gewe', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'A female cat with a mostly black coat and slight brown markings on different parts of the body. Gewe is generally calm and reserved around humans and can be slightly cautious, often preferring quiet and peaceful areas. Due to pregnancy, Gewe currently has limited human interaction and may require a calm environment with minimal disturbance. Gewe is currently pregnant.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787989001348-615559.PNG', '2026-08-29 07:36:41'),
(38, 1, 'Albie', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'A male kitten with a light orange coat covering the back, tail, ears, and forehead, along with white markings on the underbody, legs, and face.', 'Healthy', 'Unknown', 'Available', '1787989060937-514756.PNG', '2026-08-29 07:37:40'),
(39, 1, 'Flerken', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A female cat with an orange coat featuring light orange stripes.', 'Healthy', 'Unknown', 'Available', '1787989137443-530544.PNG', '2026-08-29 07:38:57'),
(40, 1, 'Bloop', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male adult cat with a white coat and dark orange markings on the left ear, above the eyes, and on the tail. Bloop is active, playful, and friendly, enjoys human interaction, and is comfortable around students. The cat is social and non-aggressive in shared areas, with no recorded incidents of biting or aggression.\r\n', 'Healthy', 'Unknown', 'Available', '1787989200974-113418.PNG', '2026-08-29 07:40:00'),
(41, 1, 'Gato', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'A male cat with a gray coat covering the upper body, head, and ears, and white markings on the lower body, including the chest, belly, legs, and nose. Gato is cautious and mildly aggressive around humans and tends to be guarded during interactions. The cat requires a slow and careful approach when interacting with people. Gato has a recorded history of aggression toward ROTC officers, which should be considered when assessing compatibility and handling requirements.\r\n', 'Healthy', 'Unknown', 'Available', '1787989386908-837233.png', '2026-08-29 07:41:19'),
(42, 1, 'Sith', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'A female cat with a black coat covering the upper body, face, ears, and parts of the legs, along with white markings on the chest, belly, and legs. Sith has a calm and shy behavior and is cautious around humans but remains non-aggressive during interactions. The cat may benefit from a patient and gentle approach when interacting with people.', 'Healthy', 'Unknown', 'Available', '1787989453503-139995.PNG', '2026-08-29 07:44:13'),
(43, 1, 'Tiger', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A female cat with black and grayish coloring and tiger-like markings, along with light brown coloring on the face and legs. Tiger is active and observant and generally shows an independent and cautious behavior around humans. The cat may allow human interaction but prefers to maintain some distance and responds better to a slow and gentle approach.\r\n', 'Healthy', 'Unknown', 'Available', '1787989607349-816999.PNG', '2026-08-29 07:46:47'),
(44, 1, 'Chimi', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'A female kitten with yellowish to light orange patches on the body, ears, and tail, along with white markings on the chest, belly, and legs. Chimi is playful and curious, with a mildly cautious behavior around humans while remaining non-aggressive during interactions. The kitten has no recorded incidents of biting or aggressive behavior.', 'Healthy', 'Vaccinated', 'Available', '1787989816670-780282.png', '2026-08-29 07:48:37'),
(45, 1, 'Changa', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'A female kitten with a combination of orange and white colors throughout her body. She is playful, friendly, and sociable with humans, making her comfortable with human interaction. Changa is also non-aggressive and has no recorded incidents of biting or aggressive behavior.', 'Healthy', 'Vaccinated', 'Available', '1787989998486-11527.png', '2026-08-29 07:53:18'),
(46, 1, 'Red', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat with a combination of orange and white coloring and a distinctive red collar. He is friendly and curious, while remaining tolerant of human interaction. Red can be mildly cautious at times but is generally non-aggressive and has no recorded incidents of biting or aggressive behavior.', 'Healthy', 'Vaccinated', 'Available', '1787990088930-806277.PNG', '2026-08-29 07:54:48'),
(47, 1, 'Oreo', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat approximately 4–5 years old, with a black upper body, face including the area around the eyes, and tail, contrasted by a white lower body covering the chest, belly, and legs. He is generally cautious and may display mild defensive reactions when stressed or approached abruptly, so he requires slow, gentle, and careful handling. Oreo has a recorded history of aggression toward ROTC officers.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787990193928-604248.PNG', '2026-08-29 07:56:33'),
(48, 1, 'Milo', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'A male cat with black patches on his back, the back of his head, and tail, while white is the dominant color throughout the rest of his body. He is calm and independent, with a cautious attitude toward humans. Milo has a low-to-moderate level of sociability but remains non-aggressive during interactions.\r\n', 'Healthy', 'Unknown', 'Available', '1787990272670-415668.PNG', '2026-08-29 07:57:52'),
(49, 1, 'Cheeto', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'A female cat with a multi-colored coat. She is active and curious, with a moderate level of sociability and a generally friendly presence around humans. Cheeto is non-aggressive during interactions and has no recorded incidents of biting or aggressive behavior.', 'Healthy', 'Unknown', 'Available', '1787990349475-201017.PNG', '2026-08-29 07:59:09'),
(51, 1, 'David', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat. No specific color or marking information is currently recorded for him.', 'Healthy', 'Vaccinated', 'Available', '1787990509367-476663.PNG', '2026-08-29 08:01:49'),
(52, 1, 'Clarita', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A female cat with an orange-colored coat. No specific behavioral information is currently recorded for her.', 'Healthy', 'Vaccinated', 'Available', '1787990781881-237337.PNG', '2026-08-29 08:06:21'),
(53, 1, 'Brent', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'A male kitten with an all-black coat. He is a young cat who may be a good match for adopters looking for a kitten to raise and bond with. His personality and compatibility with different adopters may be better assessed through gentle interaction.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787990896733-420280.PNG', '2026-08-29 08:08:16'),
(54, 1, 'Mikha', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'A female kitten with a gray, silver, and black patterned coat resembling the markings of a tilapia. She is a young cat who may be a good match for adopters looking to care for and bond with a kitten. Her personality and compatibility may be better assessed through gentle interaction.', 'Healthy', 'Vaccinated', 'Available', '1787990976665-42233.PNG', '2026-08-29 08:09:36'),
(55, 1, 'Baby Shark 1', 'Cat', 'Male', 'Puppy/Kitten (0-1 yr old)', 'A male kitten. He is very active and playful, enjoying running around and exploring his surroundings. He is also curious about people and may approach them for interaction. His energetic and playful nature may make him a good match for adopters who can provide plenty of playtime and attention.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787991057801-285624.PNG', '2026-08-29 08:10:57'),
(56, 1, 'Yuri', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat with gray stripes along his back and white markings on his neck, chest, and extremities. He can sometimes display aggressive behavior and has a recorded history of aggression toward ROTC officers, so he should be approached calmly and with caution.', 'Healthy', 'Unknown', 'Available', '1787991122576-520545.PNG', '2026-08-29 08:12:02'),
(57, 1, 'Tobi', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'A male cat with orange markings on his head and back, while his neck, chest, and legs are white. He also has distinctive pink paws and a pink nose. Tobi is shy and tends to immediately run away when approached by people, so he may require patience and gentle handling to gradually build trust.\r\n', 'Healthy', 'Unknown', 'Available', '1787991179865-199613.PNG', '2026-08-29 08:12:59'),
(58, 1, 'Charlie', 'Cat', 'Female', 'Adult (4-7 yrs old)', 'A female cat with a gray coat featuring black stripes and distinctive green eyes. She is very friendly and comfortable around people, allowing humans to pet her and stay close to her. Charlie is non-aggressive and has no recorded incidents of biting or aggressive behavior.\r\n', 'Healthy', 'Vaccinated', 'Available', '1787991240241-917957.PNG', '2026-08-29 08:14:00'),
(59, 1, 'Yogurt', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'fvdghfhfhf', 'Healthy', 'Vaccinated', 'Adopted', '1788006119321-579897.PNG', '2026-08-29 12:21:59'),
(60, 2, 'Joy Joy', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'A medium-sized cat features a beautiful medium-length torbie coat displaying a unique mix of orange and greyish \"tilapia\" patterns, paired with striking green eyes, straight prick ears, and long whiskers. Distinctive physical details include a pink nose, mixed pink and black paw pads, and a bobbed or docked tail. She is fully spayed. ', 'Healthy', 'Unknown', 'Available', '1788015879210-245108.PNG', '2026-08-29 13:56:56'),
(61, 2, 'Pilay', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat sports a sleek short-haired tricolor coat in white, orange, and black, highlighted by vibrant green eyes, straight prick ears, and long whiskers. Black accents stand out on both its nose and paw pads, complementing its distinct color pattern. A notable feature is its docked tail. \r\n', 'Healthy', 'Unknown', 'Available', '1788012781330-399882.png', '2026-08-29 14:07:07'),
(62, 2, 'Lemon', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a short bi-color coat of white and orange, paired with striking copper eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads, perfectly complementing its bright fur pattern. \r\n', 'Healthy', 'Unknown', 'Available', '1788012933938-739721.PNG', '2026-08-29 14:15:33'),
(63, 2, 'Putol', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat sports a sleek short-haired bi-color coat of white and greyish \"tilapia\" patterns, anchored by striking copper eyes, straight prick ears, and long whiskers. Unique features include a bright pink nose contrasting with black paw pads, along with a distinct docked tail. ', 'Healthy', 'Unknown', 'Available', '1788013002667-78798.PNG', '2026-08-29 14:16:42'),
(64, 2, 'Lupin', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a short bi-color coat of white and orange, paired with rare blue-green eyes, straight prick ears, and medium-length whiskers. A soft pink nose contrasts sharply with its black paw pads, rounding out its distinct appearance. \r\n', 'Healthy', 'Unknown', 'Available', '1788016015048-786453.PNG', '2026-08-29 14:17:35'),
(65, 2, 'Pandakiko', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a short bi-color coat of white and greyish \"tilapia\" patterns, complemented by striking copper eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads, completing its clean two-tone look.', 'Healthy', 'Unknown', 'Available', '1788013131560-18075.PNG', '2026-08-29 14:18:51'),
(66, 2, 'Ginger', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white and orange, highlighted by striking copper eyes, straight prick ears, and long whiskers. Both her nose and paw pads are a soft pink color, perfectly matching her warm palette. As a notable update, she has recently given birth.', 'Healthy', 'Unknown', 'Available', '1788013223668-667372.PNG', '2026-08-29 14:20:23'),
(67, 2, 'Kulit', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, neutered cat features a medium-length bi-color coat of white with grey spots, highlighted by striking green eyes, straight prick ears, long whiskers, and a full set of teeth with intact fangs. A light pink nose contrasts neatly with its black paw pads, finishing off its distinct appearance.', 'Healthy', 'Unknown', 'Available', '1788013272941-619630.PNG', '2026-08-29 14:21:12'),
(68, 2, 'Sabrena', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a short tortoiseshell coat in orange and grey, highlighted by vivid green eyes, straight prick ears, medium whiskers, and a full set of teeth with intact fangs. A soft pink nose stands out against her black paw pads. She is currently pregnant, requiring extra attention and care.', 'Healthy', 'Unknown', 'Available', '1788013330241-909080.PNG', '2026-08-29 14:22:10'),
(69, 2, 'Junjun', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short bi-color coat of grey and white, highlighted by bright green eyes, straight prick ears, short whiskers, and a complete set of teeth with intact fangs. Soft pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Available', '1788013405053-695517.PNG', '2026-08-29 14:23:25'),
(70, 2, 'Blacky', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This small, unneutered kitten features a short bi-color coat of black and white, highlighted by bright green eyes, straight prick ears, short whiskers, and a complete set of teeth with intact fangs. Unique details include a black nose paired with peach paw pads, finishing off its adorable baby appearance.', 'Healthy', 'Unknown', 'Available', '1788013508924-180013.PNG', '2026-08-29 14:25:08'),
(71, 2, 'Chester', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat sports a short orange tabby coat paired with striking orange eyes, straight prick ears, medium whiskers, and a complete set of teeth with intact fangs. A distinct black nose contrasts with its soft peach paw pads. Most importantly, this cat requires immediate medical attention and urgent care.', 'Under Treatment', 'Unknown', 'Available', '1788013619343-744563.PNG', '2026-08-29 14:26:59'),
(72, 2, 'Wolvereen', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a short bi-color coat of dark grey and white, paired with striking copper eyes, straight prick ears, medium whiskers, and a full set of teeth with intact fangs. Soft pink coloring marks both its nose and paw pads, complementing its bold two-tone coat.', 'Healthy', 'Unknown', 'Available', '1788013664212-6569.PNG', '2026-08-29 14:27:44'),
(73, 2, 'Tipaklong ', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, spayed female cat features a short torbie coat with greyish \"tilapia\" patterns, complemented by vivid green eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks her nose, while her paw pads display a unique mix of black and pink.', 'Healthy', 'Unknown', 'Available', '1788016258941-889909.JPG', '2026-08-29 14:33:15'),
(74, 2, 'Ginger Boy', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat sports a short orange tabby coat highlighted by striking copper eyes, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, perfectly matching its warm, vibrant appearance.', 'Healthy', 'Unknown', 'Available', '1788014050508-792134.PNG', '2026-08-29 14:34:10'),
(75, 2, 'Max', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat of black and white, paired with striking green eyes, straight prick ears, and medium-length whiskers. A solid black nose accents its crisp color pattern.\r\n', 'Healthy', 'Unknown', 'Available', '1788014107894-549581.PNG', '2026-08-29 14:35:07'),
(76, 2, 'Rhea', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This large, unneutered cat features a medium-length tricolor coat blending white, orange, and greyish \"tilapia\" patterns, highlighted by striking copper eyes, straight prick ears, and long whiskers. A sleek black nose accents its distinct color combination.', 'Healthy', 'Unknown', 'Available', '1788014296475-708792.PNG', '2026-08-29 14:38:16'),
(77, 2, 'Tom', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending greyish \"tilapia\" patterns with white, paired with vivid green eyes, straight prick ears, and medium-length whiskers. A sharp black nose accents its appearance.', 'Healthy', 'Unknown', 'Available', '1788014366598-391392.PNG', '2026-08-29 14:39:26'),
(78, 2, 'Panther', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of black and white, paired with striking copper eyes, straight prick ears, and long whiskers. A sharp black nose accents its classic pattern.', 'Healthy', 'Unknown', 'Available', '1788014408917-140149.PNG', '2026-08-29 14:40:08'),
(79, 2, 'Kulit', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending white and greyish \"tilapia\" patterns, paired with vivid green eyes, straight prick ears, and long whiskers. A sleek black nose highlights its face.', 'Healthy', 'Unknown', 'Available', '1788014450051-532981.PNG', '2026-08-29 14:40:50'),
(80, 2, 'Tim', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This large, neutered cat features a medium-length bi-color coat blending greyish \"tilapia\" patterns with white, paired with vivid green eyes, straight prick ears, and long whiskers. A unique blackish-orange nose accents its face.', 'Healthy', 'Unknown', 'Available', '1788014489157-969172.PNG', '2026-08-29 14:41:29'),
(81, 2, 'Mama B', 'Cat', 'Female', 'Adult (4-7 yrs old)', ' This large, spayed female cat features a medium-length tabby coat blending greyish \"tilapia\" patterns with white, paired with striking copper eyes, straight prick ears, and medium-length whiskers. A sharp black nose accents her defined features.\r\n', 'Healthy', 'Unknown', 'Available', '1788014540893-758696.PNG', '2026-08-29 14:42:20'),
(82, 2, 'Labo', 'Cat', 'Male', 'Adult (4-7 yrs old)', 'This large, neutered cat features a short bi-color coat of orange and white, paired with vivid green eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads. Notably, this cat is completely blind and requires a safe, familiar environment.', 'Healthy', 'Unknown', 'Available', '1788014586341-684807.PNG', '2026-08-29 14:43:06'),
(83, 2, 'Doraemon ', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white and orange, paired with vivid green eyes, straight prick ears, and long whiskers. Soft pink coloring marks both its nose and paw pads, completing its classic two-tone look.', 'Healthy', 'Unknown', 'Available', '1788014636801-806070.PNG', '2026-08-29 14:43:56'),
(84, 2, 'Snotty', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length bi-color coat of white, grey, and black, paired with striking yellow-green eyes, straight prick ears, and medium-length whiskers. A distinctive pink nose with black corners highlights its face, grounded by solid black paw pads.', 'Healthy', 'Unknown', 'Available', '1788014697374-768157.PNG', '2026-08-29 14:44:57'),
(85, 2, 'Basy', 'Cat', 'Female', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered cat features a medium-length solid white coat, paired with light-blue eyes, straight prick ears, and medium-length whiskers. Soft pink coloring marks both its nose and paw pads. Notably, its right eye shows an existing complication that may require monitoring or medical assessment.', 'Healthy', 'Unknown', 'Available', '1788014752033-830181.PNG', '2026-08-29 14:45:52'),
(86, 2, 'Flake', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short solid white coat paired with soft light-blue eyes, straight prick ears, and short whiskers. Delicate pink coloring marks both its nose and paw pads, highlighting its gentle baby appearance.', 'Healthy', 'Unknown', 'Available', '1788014786550-906358.PNG', '2026-08-29 14:46:26'),
(88, 2, 'Ponky', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short bi-color coat of orange and white, paired with unique light-green eyes with blue corners, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Available', '1788014839957-503544.PNG', '2026-08-29 14:47:19'),
(89, 2, 'Tom', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short tortoiseshell coat blending orange and light-grey patterns, paired with light-green eyes, straight prick ears, and short whiskers. Soft pink coloring marks both its nose and paw pads, completing its sweet, young appearance.', 'Healthy', 'Unknown', 'Available', '1788014890345-843226.PNG', '2026-08-29 14:48:10'),
(90, 2, 'Jerry', 'Cat', 'Female', 'Puppy/Kitten (0-1 yr old)', 'This small, unneutered kitten features a short tortoiseshell coat blending orange and dark-grey patterns, paired with soft light-green, bluish eyes, straight prick ears, and short whiskers. Gentle pink coloring marks both its nose and paw pads, completing its adorable baby appearance.', 'Healthy', 'Unknown', 'Available', '1788014935548-601261.PNG', '2026-08-29 14:48:55'),
(91, 2, 'Scar', 'Cat', 'Male', 'Adolescence (2-3 yrs old)', 'This medium-sized, unneutered kitten features a medium-length bi-color coat of white and grey, paired with light-green eyes, straight prick ears, and medium-length whiskers. A unique pink nose with black corners highlights its face, grounded by solid black paw pads.', 'Healthy', 'Unknown', 'Available', '1788014977894-341570.PNG', '2026-08-29 14:49:37');

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
(44, 27, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-08-29 06:53:52'),
(45, 27, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 06:53:52'),
(48, 28, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 06:59:56'),
(49, 28, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-08-29 06:59:56'),
(54, 30, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:12:44'),
(55, 31, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:15:10'),
(56, 31, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:15:10'),
(57, 29, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:15:23'),
(58, 29, 'Vaccinated', '2025-09-28', 'PBC', NULL, '2026-08-29 07:15:23'),
(60, 32, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:19:11'),
(61, 33, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:24:21'),
(62, 33, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:24:21'),
(63, 34, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:27:43'),
(64, 35, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:30:38'),
(65, 35, 'Vaccine', '2025-09-30', 'PBC', NULL, '2026-08-29 07:30:38'),
(66, 36, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:33:38'),
(67, 36, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:33:38'),
(68, 37, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:36:41'),
(69, 37, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:36:41'),
(70, 38, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:37:40'),
(71, 39, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:38:57'),
(72, 40, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:40:01'),
(74, 41, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:43:07'),
(75, 42, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:44:13'),
(76, 43, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:46:47'),
(79, 44, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:50:16'),
(80, 44, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:50:16'),
(81, 45, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:53:18'),
(82, 45, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:53:18'),
(83, 46, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:54:48'),
(84, 46, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:54:48'),
(85, 47, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:56:33'),
(86, 47, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 07:56:33'),
(87, 48, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:57:52'),
(88, 49, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 07:59:09'),
(91, 51, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:01:49'),
(92, 51, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:01:49'),
(93, 52, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:06:21'),
(94, 52, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:06:21'),
(95, 53, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:08:16'),
(96, 53, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:08:16'),
(97, 54, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:09:36'),
(98, 54, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:09:36'),
(99, 55, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:10:57'),
(100, 55, 'Vaccine', '2025-09-28', 'PBC', NULL, '2026-08-29 08:10:57'),
(101, 56, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:12:02'),
(102, 57, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 08:12:59'),
(104, 58, 'Dewormed', '2025-09-30', 'PBC', NULL, '2026-08-29 12:20:13'),
(107, 59, 'Dewormed', '2025-09-07', 'PBC', NULL, '2026-08-29 13:34:27');

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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application_interviews`
--

INSERT INTO `application_interviews` (`interview_id`, `application_id`, `interview_date`, `interview_time`, `interview_method`, `interview_location_link`, `meetup_location`, `requested_interview_date`, `requested_interview_time`, `reschedule_reason`, `resched_status`, `created_at`, `updated_at`) VALUES
(49, 36, '2026-08-31', '08:00:00', 'onsite', 'Anonas Street, Sta. Mesa, Brgy. Barangay 636, Sampaloc, Ncr, City Of Manila, First District, 1016', NULL, NULL, NULL, NULL, 'Approved', '2026-08-29 15:14:18', '2026-08-29 15:14:18');

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
(1, 2, 'PAWSsion Benevolence Circle', 'Rescue Organization', 'Princes Kaye G. Lascano', '09876543211', 'Region V (Bicol Region)', 'National Rd', 'Nabua', 'San Miguel (Pob.)', 'Camarines Sur', '4443', 'Our organization is dedicated to caring for stray dogs and cats, advocating for animal rights, and promoting their welfare.', '/uploads/orgs/org-2-1787995554589-388628080.jpg', 'Approved'),
(2, 5, 'PUP Sintang Pusa', 'Animal Shelter', 'Jhyzzeel Dianela', '09815439724', 'National Capital Region (NCR)', 'Anonas Street, Sta. Mesa', 'Sampaloc', 'Barangay 636', 'Ncr, City Of Manila, First District', '1016', 'For the cats of PUP, we serve!', '/uploads/orgs/org-5-1788005945090-149762458.jpg', 'Approved');

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
(2, 2, 'adobo_landingpage.png', '266702a93b5daebe07590a6ff375db1f.png', '2026-07-24 16:07:44');

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
(62, 1, 'Camarines Sur Polytechnic Colleges', NULL, NULL, NULL, 'qr-2-1787924666162-614673456.JPG', '2026-08-28 13:28:53', '2026-08-28 13:44:26');

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
(36, 2, 91, 1, '{\"full_name\":\"Shinrei Nouzen\",\"contact_number\":\"09876543211\",\"email\":\"shin@gmail.com\",\"full_address\":\"hgnhghtghf, Barangay Mamhut Norte, Balasan, Antique, Region VI (Western Visayas), 3444\",\"civil_status\":\"Single\",\"age\":26,\"occupation\":\"Programmer\",\"submitted_at\":\"2026-08-29T15:13:10.369Z\"}', 'I want a pet', 'Irene Espeleta', '09676565666', 'Friend', 'doc-3-1788016390346.jpg', 'Interview Scheduled', NULL, '2026-08-29 15:13:10', '2026-08-29 15:14:18');

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
-- Indexes for table `organizations`
--
ALTER TABLE `organizations`
  ADD PRIMARY KEY (`organization_id`),
  ADD KEY `account_id` (`account_id`);

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
  MODIFY `account_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `adopters`
--
ALTER TABLE `adopters`
  MODIFY `adopter_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `animals`
--
ALTER TABLE `animals`
  MODIFY `animal_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `animal_medical_history`
--
ALTER TABLE `animal_medical_history`
  MODIFY `medical_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=108;

--
-- AUTO_INCREMENT for table `application_interviews`
--
ALTER TABLE `application_interviews`
  MODIFY `interview_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `cash_donations`
--
ALTER TABLE `cash_donations`
  MODIFY `cash_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `inkind_donations`
--
ALTER TABLE `inkind_donations`
  MODIFY `inkind_donation_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `kamustahan_updates`
--
ALTER TABLE `kamustahan_updates`
  MODIFY `update_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `matchmaking_requests`
--
ALTER TABLE `matchmaking_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organizations`
--
ALTER TABLE `organizations`
  MODIFY `organization_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `organization_documents`
--
ALTER TABLE `organization_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `organization_dropoff_details`
--
ALTER TABLE `organization_dropoff_details`
  MODIFY `dropoff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- AUTO_INCREMENT for table `organization_payment_details`
--
ALTER TABLE `organization_payment_details`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `reset_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `user_adoption_applications`
--
ALTER TABLE `user_adoption_applications`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- Constraints for dumped tables
--

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
-- Constraints for table `organizations`
--
ALTER TABLE `organizations`
  ADD CONSTRAINT `organizations_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`account_id`) ON DELETE CASCADE;

--
-- Constraints for table `organization_documents`
--
ALTER TABLE `organization_documents`
  ADD CONSTRAINT `organization_documents_ibfk_1` FOREIGN KEY (`organization_id`) REFERENCES `organizations` (`organization_id`) ON DELETE CASCADE;

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
