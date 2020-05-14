-- MySQL dump 10.13  Distrib 8.0.19, for Linux (x86_64)
--
-- Host: localhost    Database: crud
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `operacoes`
--

DROP TABLE IF EXISTS `operacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operacoes` (
  `id` int NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `descricao` text,
  `valor` float(10,2) NOT NULL,
  `quantidade` int NOT NULL,
  `operacao` enum('criar','editar','vender','estocar','excluir') NOT NULL,
  `data` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `produto` varchar(255) NOT NULL,
  `custo` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `operacoes`
--

LOCK TABLES `operacoes` WRITE;
/*!40000 ALTER TABLE `operacoes` DISABLE KEYS */;
INSERT INTO `operacoes` VALUES (18,'gabriel','suahsuasuahsau',10.00,100,'criar','2020-05-13 05:22:12','Sistema',1.00),(24,'gabriel','saushhusua',10.00,100,'criar','2020-05-13 05:25:59','Primeiro teste',1.00),(15,'gabriel','',10.00,99,'vender','2020-05-13 05:45:35','Figado',1.00),(15,'gabriel','',10.00,990,'estocar','2020-05-13 05:47:49','Figado',1.00),(15,'gabriel','',10.00,990,'editar','2020-05-13 05:48:16','Figado',100.00),(17,'gabriel','',10.00,100,'excluir','2020-05-13 05:49:55','Margarina',1.00);
/*!40000 ALTER TABLE `operacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `descricao` text,
  `valor` float(10,2) NOT NULL,
  `quantidade` int NOT NULL,
  `custo` float(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (18,'Sistema','suahsuasuahsau',10.00,100,1.00),(19,'Caralho','suahshaushahsua1',100.00,100,10.00),(20,'teste','1',1.00,1,1.00),(21,'a','1',1.00,1,1.00),(22,'aaaaaaaaaaa','1',1.00,1,1.00),(23,'bbbb','1',1.00,1,1.00),(24,'Primeiro teste','saushhusua',10.00,100,1.00),(25,'Segundo teste','1',1.00,1,1.00),(26,'ccc','1',1.00,1,1.00),(27,'ccccc','111',1.00,1,1.00),(28,'cccc','1',1.00,1,1.00),(29,'suahsahsuahSUAs','aushuashau',1.00,1,1.00),(30,'kkkk','saysuas',1.00,1,1.00),(31,'tetse','1',1.00,1,1.00);
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transacoes`
--

DROP TABLE IF EXISTS `transacoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacoes` (
  `id` int NOT NULL,
  `produto` varchar(255) NOT NULL,
  `quantidade` int NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transacoes`
--

LOCK TABLES `transacoes` WRITE;
/*!40000 ALTER TABLE `transacoes` DISABLE KEYS */;
INSERT INTO `transacoes` VALUES (13,'Computador',1,'gabriel','2020-05-12 01:03:49'),(11,'Macarrão',1,'gabriel','2020-05-12 01:31:14'),(10,'Sopa',1,'vendedor','2020-05-12 17:09:30');
/*!40000 ALTER TABLE `transacoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('admin','gerente','vendedor','editor') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (2,'petterson','pitter','$2a$10$JF7tK5ShW6eUVqbutrclu.7tgqcglCwCLtPV3.KIpWAUEwm6Xv.Na','','2020-05-04 04:41:13','2020-05-04 04:41:13'),(4,'gabriel','gabriel','$2a$10$KnBzFoRAsTiXSMxA.Y.gju2TjlOhMjdz92YXoDijyANOpuBV4Tdii','admin','2020-05-05 18:47:32','2020-05-05 18:47:32'),(5,'gerente','gerente','$2a$10$C7OoDxLGQa.w06S3FdxURONpLECSWdoNIvacFX.BecQqWFYQbNG56','gerente','2020-05-05 19:57:26','2020-05-05 19:57:26'),(7,'vendedor','vendedor','$2a$10$7dxRyofu.GoF7.wGlvpKle4.sMHUTnkWx1uA9mxgIfP7E8yl9k4Y6','vendedor','2020-05-05 19:59:24','2020-05-05 19:59:24'),(8,'editor','editor','$2a$10$hoxKhCw46UXWPoCuKpvYhe9b78lEo/IZFhCviOsFqihHtSryWop7e','editor','2020-05-05 20:00:47','2020-05-05 20:00:47'),(9,'teste','teste','$2a$10$Tv5Bn5vsteGaXnFDVBcVi.pG5uMpC4rDZesKh07A1qcdDeJ.wQOMW','admin','2020-05-05 20:20:12','2020-05-05 20:20:12');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-14  7:56:34
