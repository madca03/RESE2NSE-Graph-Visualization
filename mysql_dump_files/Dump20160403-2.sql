-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: localhost    Database: graph
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `configurations`
--

DROP TABLE IF EXISTS `configurations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `configurations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `base_browser_width` double DEFAULT NULL,
  `base_graph_container_width` double DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configurations`
--

LOCK TABLES `configurations` WRITE;
/*!40000 ALTER TABLE `configurations` DISABLE KEYS */;
/*!40000 ALTER TABLE `configurations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edges`
--

DROP TABLE IF EXISTS `edges`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `edges` (
  `edge_id` varchar(255) NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `target` varchar(255) DEFAULT NULL,
  `traffic` varchar(255) DEFAULT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`edge_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edges`
--

LOCK TABLES `edges` WRITE;
/*!40000 ALTER TABLE `edges` DISABLE KEYS */;
INSERT INTO `edges` VALUES ('e0','n5','n2','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e1','n7','n2','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e10','n2','n1','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e11','n8','n10','moderate',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e12','n2','n9','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e13','n8','n2','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e14','n8','n5','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e15','n12','n15','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e16','n16','n19','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e17','n14','n13','light',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e18','n18','n16','heavy',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e19','n16','n18','light',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e2','n2','n7','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e20','n20','n15','heavy',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e21','n19','n12','light',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e22','n14','n19','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e23','n11','n12','light',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e24','n11','n15','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e25','n17','n18','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e26','n19','n17','light',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e27','n13','n17','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e28','n14','n17','moderate',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e29','n20','n12','heavy',2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e3','n8','n3','moderate',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e30','n29','n30','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e31','n23','n25','moderate',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e32','n21','n23','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e33','n24','n26','moderate',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e34','n21','n26','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e35','n26','n28','moderate',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e36','n27','n26','light',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e37','n26','n27','light',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e38','n26','n21','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e39','n26','n24','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e4','n5','n2','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e40','n24','n30','light',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e41','n22','n26','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e42','n27','n21','moderate',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e43','n29','n23','light',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e44','n22','n26','heavy',3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e45','n33','n32','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e46','n40','n33','light',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e47','n36','n32','moderate',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e48','n40','n35','moderate',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e49','n37','n40','moderate',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e5','n5','n8','moderate',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e50','n31','n34','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e51','n40','n39','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e52','n40','n34','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e53','n40','n35','moderate',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e54','n40','n36','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e55','n39','n32','light',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e56','n40','n37','heavy',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e57','n38','n32','light',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e58','n34','n38','moderate',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e59','n32','n34','light',4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e6','n8','n4','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e7','n6','n2','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e8','n1','n4','light',1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('e9','n6','n8','heavy',1,'2016-04-03 15:39:59','2016-04-03 15:39:59');
/*!40000 ALTER TABLE `edges` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `floors`
--

DROP TABLE IF EXISTS `floors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `floors` (
  `floor_number` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`floor_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `floors`
--

LOCK TABLES `floors` WRITE;
/*!40000 ALTER TABLE `floors` DISABLE KEYS */;
INSERT INTO `floors` VALUES (1,'floorplan1','2016-04-03 15:39:59','2016-04-03 15:39:59'),(2,'floorplan2','2016-04-03 15:39:59','2016-04-03 15:39:59'),(3,'floorplan3','2016-04-03 15:39:59','2016-04-03 15:39:59'),(4,'floorplan4','2016-04-03 15:39:59','2016-04-03 15:39:59');
/*!40000 ALTER TABLE `floors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nodes`
--

DROP TABLE IF EXISTS `nodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nodes` (
  `node_id` varchar(255) NOT NULL,
  `label` varchar(255) DEFAULT NULL,
  `x` double DEFAULT NULL,
  `y` double DEFAULT NULL,
  `coordinate_set` tinyint(1) DEFAULT '0',
  `sensor_type` varchar(255) DEFAULT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `last_transmission` varchar(255) DEFAULT NULL,
  `packets_sent` int(11) DEFAULT NULL,
  `packets_received` int(11) DEFAULT NULL,
  `floor_number` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`node_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nodes`
--

LOCK TABLES `nodes` WRITE;
/*!40000 ALTER TABLE `nodes` DISABLE KEYS */;
INSERT INTO `nodes` VALUES ('n1','Node1',367.79760445035413,316.76604276059936,1,'Humidity','3C-8C-BD-6B-AE-22','v8qq2fvquxr',31,74,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n10','Node10',715.2715781403365,225.66637281054525,1,'Pressure','D7-74-55-47-AB-07','qm1qt1emi',32,1,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n11','Node11',366.87322513731056,104.81618957836329,1,'Humidity','DD-70-C5-9B-D0-41','bezb54gqfr',44,71,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n12','Node12',104.82544531535291,112.86970479446353,1,'Temperature','99-E6-96-AA-A1-33','itbmgmvlsor',8,52,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n13','Node13',524.5239977747558,123.65203228012916,1,'Temperature','99-E6-96-AA-A1-33','q0cpw6x0f6r',33,31,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n14','Node14',596.7307251500516,334.4501198884625,1,'Pressure','99-E6-96-AA-A1-33','m3b2iuj714i',15,69,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n15','Node15',100.71609235780991,222.41104594750038,1,'Humidity','3C-8C-BD-6B-AE-22','lh1vzql4n29',94,95,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n16','Node16',409.67357521453164,351.84257261398386,1,'Pressure','69-81-38-8F-58-AC','609zqlu9pb9',80,70,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n17','Node17',637.7756053612862,120.96272995610596,1,'Light Intensity','F3-EA-61-C5-E9-CC','4nggrza1yvi',59,60,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n18','Node18',405.675608835458,221.97892613565378,1,'Temperature','69-81-38-8F-58-AC','7vzkpousor',71,1,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n19','Node19',651.1667443877053,223.24537100252704,1,'Light Intensity','DD-61-A3-D8-F9-C6','vcm7bx7ds4i',84,23,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n2','Node2',115.42086410086216,221.68549800994668,1,'Pressure','F3-EA-61-C5-E9-CC','sy2aewgsyvi',85,35,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n20','Node20',123.46854381455228,336.99935356509286,1,'Temperature','F3-EA-61-C5-E9-CC','p4p40smunmi',57,29,2,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n21','Node21',290.9104108967659,97.78681814391794,1,'Humidity','84-8C-FD-DE-24-AC','w4e94x9lik9',10,70,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n22','Node22',97.82437644334652,315.6329829857683,1,'Humidity','F3-EA-61-C5-E9-CC','z92dfgvi',10,8,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n23','Node23',737.8357571972032,203.9927062776615,1,'Light Intensity','69-81-38-8F-58-AC','e9n80cf2yb9',86,52,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n24','Node24',464.69640382458783,187.45041248015863,1,'Temperature','DD-61-A3-D8-F9-C6','0nyf0mb1emi',34,23,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n25','Node25',506.60454749403914,279.83390376160924,1,'Temperature','84-8C-FD-DE-24-AC','8titqd26gvi',41,36,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n26','Node26',105.06331392792771,214.93821538026975,1,'Pressure','56-C6-26-8D-02-DC','wz2udxnu3di',23,12,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n27','Node27',468.04127129245967,101.12056555009394,1,'Temperature','DD-70-C5-9B-D0-41','lvou6snstt9',45,1,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n28','Node28',110.67395362103241,120.831117319247,1,'Temperature','56-C6-26-8D-02-DC','5nmd8lu9pb9',80,0,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n29','Node29',398.1054549538329,304.8993675730072,1,'Humidity','99-E6-96-AA-A1-33','ok8a3qy3nmi',39,64,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n3','Node3',609.6303457177775,317.7055689881546,1,'Humidity','D7-74-55-47-AB-07','3u5dxqolxr',61,54,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n30','Node30',692.792462552319,243.0345212419869,1,'Humidity','F3-EA-61-C5-E9-CC','yajdcxr',31,95,3,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n31','Node31',369.9652124714473,191.2578877335257,1,'Temperature','F3-EA-61-C5-E9-CC','6ipl2zz1tt9',57,80,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n32','Node32',101.9117380660017,113.7616205488905,1,'Temperature','DD-70-C5-9B-D0-41','ob7s4m9rudi',86,92,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n33','Node33',325.41969968382085,89.78331689708077,1,'Humidity','69-81-38-8F-58-AC','tg80k2lc8fr',85,23,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n34','Node34',363.67587927684315,293.5650992129926,1,'Temperature','D7-74-55-47-AB-07','5k0erfz85mi',17,65,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n35','Node35',715.746919912491,181.6931287551688,1,'Temperature','84-8C-FD-DE-24-AC','vog30udi',49,73,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n36','Node36',191.76789526197348,299.22722849496313,1,'Temperature','99-E6-96-AA-A1-33','cfutueah5mi',28,37,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n37','Node37',671.8625030400717,280.1491609430783,1,'Temperature','84-8C-FD-DE-24-AC','ldoya5uerk9',32,29,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n38','Node38',596.4715145091022,110.7842554391423,1,'Light Intensity','56-C6-26-8D-02-DC','tfwmw8kt9',86,36,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n39','Node39',114.28729831666033,219.94789333560297,1,'Humidity','69-81-38-8F-58-AC','g7lzvpiizfr',27,98,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n4','Node4',328.2258681156681,187.70420286256407,1,'Pressure','3C-8C-BD-6B-AE-22','h6jxr9ysyvi',19,40,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n40','Node40',543.4482517826241,236.03741871055198,1,'Temperature','DD-61-A3-D8-F9-C6','5b1bn6fxbt9',4,17,4,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n5','Node5',335.2659867440221,109.57404922341212,1,'Temperature','3C-8C-BD-6B-AE-22','ou2zpfu5wmi',76,46,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n6','Node6',185.1709693941104,304.7331112850286,1,'Light Intensity','99-E6-96-AA-A1-33','i1vdxp9cnmi',30,8,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n7','Node7',135.7791005865663,119.25570836575224,1,'Humidity','3C-8C-BD-6B-AE-22','y4nbjrzr529',39,27,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n8','Node8',615.2066523394739,201.57158729582247,1,'Pressure','84-8C-FD-DE-24-AC','9aywfmyrpb9',62,50,1,'2016-04-03 15:39:59','2016-04-03 15:39:59'),('n9','Node9',545.7528650594996,125.8348924517843,1,'Temperature','56-C6-26-8D-02-DC','032vauzyqfr',62,50,1,'2016-04-03 15:39:59','2016-04-03 15:39:59');
/*!40000 ALTER TABLE `nodes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequelizemeta`
--

DROP TABLE IF EXISTS `sequelizemeta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `SequelizeMeta_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequelizemeta`
--

LOCK TABLES `sequelizemeta` WRITE;
/*!40000 ALTER TABLE `sequelizemeta` DISABLE KEYS */;
INSERT INTO `sequelizemeta` VALUES ('20160202214130-create-node.js'),('20160202214339-create-edge.js'),('20160325085050-create-floor.js'),('20160403184634-create-configuration.js');
/*!40000 ALTER TABLE `sequelizemeta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-03 23:42:24
