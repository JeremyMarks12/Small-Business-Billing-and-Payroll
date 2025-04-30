-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 30, 2025 at 03:51 AM
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
-- Database: `sbabilling`
--

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE `company` (
  `id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`id`, `address`, `name`, `phone_number`) VALUES
(1, 'Address 1', 'Company 1', 'Phone Number 1'),
(2, 'Address 2', 'Company 2', 'Phone Number 2'),
(4, 'Address 4', 'Company 4', 'Phone Number 4'),
(6, 'Address 5', 'Company 5', 'Phone Number 5');

-- --------------------------------------------------------

--
-- Table structure for table `woitems`
--

CREATE TABLE `woitems` (
  `id` int(11) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `assessment` varchar(255) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `file_number` varchar(255) DEFAULT NULL,
  `my_price` double NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `plat` int(11) NOT NULL,
  `sbatotal` double NOT NULL,
  `inspector_pay` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `woitems`
--

INSERT INTO `woitems` (`id`, `address`, `assessment`, `comments`, `company`, `date`, `file_number`, `my_price`, `name`, `plat`, `sbatotal`, `inspector_pay`) VALUES
(13, 'N/A', 'No', 'N/A', 'Company 1', '2025-04-29', '123456789', 100, 'inspector 1', 1, 50, 50),
(14, 'N/A', 'No', 'N/A', 'Company 5', '2025-04-17', '987654321', 200, 'inspector 1', 1, 50, 150),
(15, 'N/A', 'Yes', 'Unfair Pay', 'Company 2', '2025-03-13', '111111111111', 150, 'inspector 1', 0, 100, 50),
(16, '1', 'No', '1', 'Company 4', '2025-04-30', '00000000000', 1000, 'inspector 2', 1, 200, 800),
(17, 'N/A', 'No', 'N/A', 'Company 1', '2025-04-29', '23456789', 100, 'inspector 2', 1, 20, 80),
(18, 'Home', 'Yes', 'N/A', 'Company 5', '2025-03-27', '9873232', 200, 'inspector 2', 0, 100, 100),
(19, 'home', 'Yes', 'rip off', 'Company 1', '2025-04-17', '44444444444', 1000, 'inspector 1', 0, 100, 900);

-- --------------------------------------------------------

--
-- Table structure for table `worker`
--

CREATE TABLE `worker` (
  `workerid` int(11) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `is_admin` bit(1) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `worker`
--

INSERT INTO `worker` (`workerid`, `first_name`, `is_admin`, `last_name`, `password`, `username`) VALUES
(11, 'System', b'1', 'Administrator', 'admin123', 'admin'),
(14, 'admin', b'1', '1', '12345678!', 'admin1'),
(15, 'inspector', b'0', '1', '12345678!', 'inspector1'),
(24, 'admin', b'1', '2', '12345678!', 'admin2'),
(28, 'inspector', b'0', '2', '12345678!', 'inspector2');

-- --------------------------------------------------------

--
-- Table structure for table `work_order`
--

CREATE TABLE `work_order` (
  `id` int(11) NOT NULL,
  `assigned_date` date DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `inspector_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_order`
--

INSERT INTO `work_order` (`id`, `assigned_date`, `pdf_path`, `inspector_id`) VALUES
(1, '2025-04-29', 'C:/uploads/1745970870554_My Order Request_RequestedTask (1).pdf', 15);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `woitems`
--
ALTER TABLE `woitems`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `worker`
--
ALTER TABLE `worker`
  ADD PRIMARY KEY (`workerid`);

--
-- Indexes for table `work_order`
--
ALTER TABLE `work_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi3lqnsvrpa37yfeo6o2ld0k44` (`inspector_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `company`
--
ALTER TABLE `company`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `woitems`
--
ALTER TABLE `woitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `worker`
--
ALTER TABLE `worker`
  MODIFY `workerid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `work_order`
--
ALTER TABLE `work_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `work_order`
--
ALTER TABLE `work_order`
  ADD CONSTRAINT `FKi3lqnsvrpa37yfeo6o2ld0k44` FOREIGN KEY (`inspector_id`) REFERENCES `worker` (`workerid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
