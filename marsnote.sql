/*
SQLyog Community v13.1.7 (64 bit)
MySQL - 8.0.39 : Database - user_db
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`user_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `user_db`;

/*Table structure for table `combineid_note_user` */

DROP TABLE IF EXISTS `combineid_note_user`;

CREATE TABLE `combineid_note_user` (
  `note_id` bigint NOT NULL,
  `user_name` varchar(255) NOT NULL,
  PRIMARY KEY (`note_id`,`user_name`),
  KEY `combineid_note_user_user_id_note_id_index` (`user_name`,`note_id`),
  CONSTRAINT `combineid_note_user_note_id_address_note_id_fk` FOREIGN KEY (`note_id`) REFERENCES `note_id_address` (`note_id`),
  CONSTRAINT `combineid_note_user_users_user_name_fk` FOREIGN KEY (`user_name`) REFERENCES `users` (`user_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `combineid_note_user` */

insert  into `combineid_note_user`(`note_id`,`user_name`) values 
(9,'1292384382@qq.com'),
(10,'1292384382@qq.com'),
(11,'1292384382@qq.com');

/*Table structure for table `note_id_address` */

DROP TABLE IF EXISTS `note_id_address`;

CREATE TABLE `note_id_address` (
  `note_id` bigint NOT NULL AUTO_INCREMENT,
  `note_address` varchar(255) NOT NULL,
  PRIMARY KEY (`note_id`),
  UNIQUE KEY `note_id_address_pk` (`note_address`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `note_id_address` */

insert  into `note_id_address`(`note_id`,`note_address`) values 
(9,'.\\downloads\\note_1292384382@qq.com_20250622_234834.txt'),
(10,'.\\downloads\\note_1292384382@qq.com_20250624_152936.txt'),
(11,'.\\downloads\\note_1292384382@qq.com_20250624_161137.txt');

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) NOT NULL,
  `passwd_hash` char(32) NOT NULL,
  `available_aitype` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `idx_user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*Data for the table `users` */

insert  into `users`(`user_id`,`user_name`,`passwd_hash`,`available_aitype`) values 
(9,'test_user','my_plain_password','ChatGPT'),
(10,'123123131','12313131313',''),
(11,'1292384382@qq.com','123456',''),
(12,'1234567','123456',NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
