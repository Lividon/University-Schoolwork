-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/

- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `course` varchar(20) NOT NULL,
  `class_name` text NOT NULL,
  `active` tinyint(1) NOT NULL,
  `display_message` text,
  `default_length` int NOT NULL DEFAULT '0',
  `default_location` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `office_hours`
--

CREATE TABLE `office_hours` (
  `office_hours_idx` int NOT NULL,
  `email` varchar(20) NOT NULL,
  `email_original_TA` varchar(20) DEFAULT NULL,
  `course` varchar(20) NOT NULL,
  `start_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expected_end` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `location` text NOT NULL,
  `actual_end` timestamp NULL DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `registered_users`
--

CREATE TABLE `registered_users` (
  `first_name` text,
  `last_name` text,
  `email` varchar(20) NOT NULL,
  `faculty` tinyint(1) NOT NULL,
  `default_location` varchar(200) DEFAULT NULL,
  `image` text
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `staff_list`
--

CREATE TABLE `staff_list` (
  `staff_list_id` int NOT NULL,
  `email` varchar(20) NOT NULL DEFAULT '',
  `course` varchar(10) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`course`);

--
-- Indexes for table `office_hours`
--
ALTER TABLE `office_hours`
  ADD PRIMARY KEY (`office_hours_idx`);

--
-- Indexes for table `registered_users`
--
ALTER TABLE `registered_users`
  ADD PRIMARY KEY (`email`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `staff_list`
--
ALTER TABLE `staff_list`
  ADD PRIMARY KEY (`staff_list_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `office_hours`
--
ALTER TABLE `office_hours`
  MODIFY `office_hours_idx` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_list`
--
ALTER TABLE `staff_list`
  MODIFY `staff_list_id` int NOT NULL AUTO_INCREMENT;
COMMIT;
