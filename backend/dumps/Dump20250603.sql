-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: imperio_gamer_db
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria_geral`
--

DROP TABLE IF EXISTS `auditoria_geral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_geral` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tabela_afetada` varchar(50) DEFAULT NULL,
  `acao` varchar(10) DEFAULT NULL,
  `registro_id` int DEFAULT NULL,
  `campo_alterado` varchar(100) DEFAULT NULL,
  `valor_antigo` text,
  `valor_novo` text,
  `usuario_id` int DEFAULT NULL,
  `data_acao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_geral`
--

LOCK TABLES `auditoria_geral` WRITE;
/*!40000 ALTER TABLE `auditoria_geral` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria_geral` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'INFROMÁTICA'),(2,'ACESSÓRIOS GAMER'),(3,'MÓVEIS'),(4,'ACESSÓRIOS CELULARES');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `criado_por` int DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf` (`cpf`),
  KEY `criado_por` (`criado_por`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Lucas de Oliveira','52783410842','lucasolrodrigues16lp@gmail.com','14996476032',1,'2025-05-26 21:46:55');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_ordem_servico`
--

DROP TABLE IF EXISTS `itens_ordem_servico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_ordem_servico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ordem_servico_id` int NOT NULL,
  `produto_id` int NOT NULL,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) GENERATED ALWAYS AS ((`quantidade` * `preco_unitario`)) STORED,
  PRIMARY KEY (`id`),
  KEY `ordem_servico_id` (`ordem_servico_id`),
  KEY `produto_id` (`produto_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_ordem_servico`
--

LOCK TABLES `itens_ordem_servico` WRITE;
/*!40000 ALTER TABLE `itens_ordem_servico` DISABLE KEYS */;
/*!40000 ALTER TABLE `itens_ordem_servico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `itens_venda`
--

DROP TABLE IF EXISTS `itens_venda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `itens_venda` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venda_id` int DEFAULT NULL,
  `produto_id` int DEFAULT NULL,
  `quantidade` int DEFAULT '1',
  `preco_unitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venda_id` (`venda_id`),
  KEY `produto_id` (`produto_id`)
) ENGINE=MyISAM AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `itens_venda`
--

LOCK TABLES `itens_venda` WRITE;
/*!40000 ALTER TABLE `itens_venda` DISABLE KEYS */;
INSERT INTO `itens_venda` VALUES (1,1,1,1,120.00),(2,2,2,1,250.50),(3,3,1,1,120.00),(4,4,1,1,120.00),(5,5,1,1,120.00),(6,6,1,1,120.00),(7,7,1,1,120.00),(8,8,1,1,120.00),(9,9,1,1,120.00),(10,10,1,1,120.00),(11,61,1,1,120.00),(12,62,1,2,120.00),(13,62,2,1,250.50),(14,63,1,1,120.00),(15,64,1,1,120.00),(16,65,1,1,120.00),(17,66,1,1,120.00),(18,67,1,1,120.00),(19,68,1,1,120.00),(20,69,1,1,120.00),(21,70,1,1,120.00),(22,71,1,1,120.00),(23,72,1,1,120.00),(24,73,1,1,120.00),(25,74,1,1,120.00);
/*!40000 ALTER TABLE `itens_venda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `logs_acesso`
--

DROP TABLE IF EXISTS `logs_acesso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `logs_acesso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL,
  `data_acesso` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `logs_acesso`
--

LOCK TABLES `logs_acesso` WRITE;
/*!40000 ALTER TABLE `logs_acesso` DISABLE KEYS */;
/*!40000 ALTER TABLE `logs_acesso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordens_servico`
--

DROP TABLE IF EXISTS `ordens_servico`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordens_servico` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `descricao` text,
  `status` enum('aberta','em_andamento','concluida','cancelada') DEFAULT 'aberta',
  `data_abertura` datetime DEFAULT CURRENT_TIMESTAMP,
  `data_conclusao` datetime DEFAULT NULL,
  `criado_por` int DEFAULT NULL,
  `total` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `criado_por` (`criado_por`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordens_servico`
--

LOCK TABLES `ordens_servico` WRITE;
/*!40000 ALTER TABLE `ordens_servico` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordens_servico` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `produtos`
--

DROP TABLE IF EXISTS `produtos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `produtos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `preco_custo` decimal(10,2) DEFAULT NULL,
  `preco_venda` decimal(10,2) DEFAULT NULL,
  `estoque` int DEFAULT '0',
  `categoria_id` int DEFAULT NULL,
  `codigo_barras` varchar(50) DEFAULT NULL,
  `imagem` varchar(255) DEFAULT NULL,
  `criado_por` int DEFAULT NULL,
  `ultima_entrada` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo_barras` (`codigo_barras`),
  KEY `categoria_id` (`categoria_id`),
  KEY `criado_por` (`criado_por`)
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `produtos`
--

LOCK TABLES `produtos` WRITE;
/*!40000 ALTER TABLE `produtos` DISABLE KEYS */;
INSERT INTO `produtos` VALUES (1,'Mouse Gamer XYZ','Mouse com alta precisão e iluminação RGB',60.00,120.00,20,2,'11111','/imagens/mouse_xyz.png',1,'2025-05-25 16:59:17'),(2,'Teclado Mecânico ABC','Teclado com switches azuis e backlight',150.00,250.50,14,2,'22222','/imagens/teclado_abc.png',1,'2025-05-25 16:59:17'),(3,'Monitor 24\" Full HD','Monitor com resolução 1920x1080 e taxa 75Hz',500.00,850.00,5,1,'33333','/imagens/monitor_24.png',1,'2025-05-25 16:59:17'),(4,'Cadeira Gamer Pro','Cadeira ergonômica com suporte lombar',700.00,1200.00,3,3,'44444','/imagens/cadeira_gamer.png',1,'2025-05-25 16:59:17'),(18,'Capinha Iphone 13 - veludo','Capinha personalizada do Iphone 13, com veludo interno e silicone externo.',13.00,25.00,10,4,'9879879','5555',1,'2025-06-03 16:33:57');
/*!40000 ALTER TABLE `produtos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `produtos_mais_vendidos`
--

DROP TABLE IF EXISTS `produtos_mais_vendidos`;
/*!50001 DROP VIEW IF EXISTS `produtos_mais_vendidos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `produtos_mais_vendidos` AS SELECT 
 1 AS `nome`,
 1 AS `total_vendido`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `senha_temporaria` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Lucas','lucas.souza','$2b$10$NQcKIwfZ6/R9j37dznOfje7hylXAUDTFsLLFpV4WH1v.OMBUchXfm','2025-04-23 03:23:37',0),(3,'Regiane','Regiane.Rodrigues','toxicanbridge','2025-04-24 15:41:50',1),(4,'Kauâ','kaua.bariani','$2b$10$9XGFfdjnpIqsyic9mxVY1eai.dsR/7An9FVvQdrONI6GDp8J71Cn.','2025-05-21 22:51:42',0);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendas`
--

DROP TABLE IF EXISTS `vendas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `criado_por` int DEFAULT NULL,
  `criado_em` datetime DEFAULT CURRENT_TIMESTAMP,
  `metodo_pagamento` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `criado_por` (`criado_por`)
) ENGINE=MyISAM AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendas`
--

LOCK TABLES `vendas` WRITE;
/*!40000 ALTER TABLE `vendas` DISABLE KEYS */;
INSERT INTO `vendas` VALUES (1,NULL,120.00,1,'2025-05-27 18:17:23','Crédito'),(2,NULL,250.50,1,'2025-05-27 18:19:56','Crédito'),(3,1,120.00,1,'2025-05-28 19:47:22','pix'),(4,1,120.00,1,'2025-05-28 19:48:09','pix'),(5,1,120.00,1,'2025-05-28 19:48:22','pix'),(6,1,120.00,1,'2025-05-28 19:48:30','pix'),(7,NULL,120.00,1,'2025-05-28 19:49:52','pix'),(8,NULL,120.00,1,'2025-05-28 19:50:03',NULL),(9,NULL,120.00,1,'2025-05-28 19:52:46','pix'),(10,NULL,120.00,1,'2025-05-28 19:52:53','pix'),(11,NULL,1581.00,1,'2025-05-31 14:51:46','pix'),(12,NULL,1581.00,1,'2025-05-31 14:51:54','pix'),(13,1,120.00,1,'2025-05-31 15:03:10',NULL),(14,1,120.00,1,'2025-05-31 15:06:42','Debito'),(15,1,120.00,1,'2025-05-31 15:08:27','pix'),(16,1,120.00,1,'2025-05-31 15:12:03',NULL),(17,NULL,120.00,1,'2025-05-31 15:44:05','Dinheiro'),(18,NULL,120.00,1,'2025-05-31 15:47:01','Crédito'),(19,NULL,120.00,1,'2025-05-31 15:47:17',NULL),(20,NULL,120.00,1,'2025-05-31 15:52:21',NULL),(21,NULL,120.00,1,'2025-05-31 15:52:43',NULL),(22,NULL,120.00,1,'2025-05-31 15:53:02',NULL),(23,NULL,120.00,1,'2025-05-31 15:54:29','Débito'),(24,NULL,120.00,1,'2025-05-31 15:54:49','Crédito'),(25,NULL,120.00,1,'2025-05-31 15:55:20','Pix'),(26,1,120.00,1,'2025-05-31 15:56:22','Débito'),(27,NULL,120.00,1,'2025-05-31 15:59:47','Débito'),(28,NULL,960.00,1,'2025-05-31 16:00:32','Débito'),(29,NULL,120.00,1,'2025-05-31 16:01:41','Débito'),(30,NULL,120.00,1,'2025-05-31 16:04:50','Débito'),(31,NULL,120.00,1,'2025-05-31 16:26:36','Débito'),(32,NULL,120.00,1,'2025-05-31 16:33:22','Débito'),(33,NULL,120.00,1,'2025-05-31 16:47:21','Débito'),(34,NULL,240.00,1,'2025-05-31 16:47:52','Débito'),(35,NULL,120.00,1,'2025-05-31 17:00:02','Débito'),(36,NULL,240.00,1,'2025-05-31 17:01:14','Débito'),(37,NULL,240.00,1,'2025-05-31 17:02:28','Débito'),(38,NULL,240.00,1,'2025-05-31 17:04:44','Débito'),(39,NULL,120.00,1,'2025-05-31 17:06:33','Débito'),(40,NULL,240.00,1,'2025-05-31 17:08:11','Débito'),(41,NULL,0.00,1,'2025-06-01 13:45:02','Débito'),(42,1,240.00,1,'2025-06-01 13:58:59','Débito'),(43,NULL,0.00,NULL,'2025-06-01 14:18:00',NULL),(44,NULL,0.00,NULL,'2025-06-01 14:22:00',NULL),(45,NULL,0.00,NULL,'2025-06-01 14:22:50',NULL),(46,NULL,120.00,2147483647,'2025-06-01 14:23:16',NULL),(47,NULL,370.50,2147483647,'2025-06-01 14:25:17',NULL),(48,1,240.00,1,'2025-06-02 18:43:36',NULL),(49,NULL,120.00,1,'2025-06-03 16:34:19',NULL),(50,NULL,240.00,1,'2025-06-03 16:38:55',NULL),(51,NULL,240.00,1,'2025-06-03 16:40:17',NULL),(52,NULL,240.00,1,'2025-06-03 19:52:46',NULL),(53,NULL,370.50,1,'2025-06-03 20:12:08',NULL),(54,NULL,120.00,1,'2025-06-03 20:16:45','credito'),(55,NULL,120.00,1,'2025-06-03 20:19:28',NULL),(56,NULL,120.00,1,'2025-06-03 20:20:46','debito'),(57,NULL,240.00,1,'2025-06-03 20:28:05',NULL),(58,NULL,240.00,1,'2025-06-03 20:28:52',NULL),(59,NULL,120.00,1,'2025-06-03 20:29:22','credito'),(60,1,120.00,1,'2025-06-03 20:29:56','credito'),(61,NULL,120.00,1,'2025-06-03 20:36:43','credito'),(62,1,490.50,1,'2025-06-03 20:39:18',NULL),(63,1,120.00,1,'2025-06-03 20:42:04','debito'),(64,1,120.00,1,'2025-06-03 20:42:24','debito'),(65,1,120.00,1,'2025-06-03 20:42:59','Debito'),(66,NULL,120.00,1,'2025-06-03 20:43:19','credito'),(67,NULL,120.00,1,'2025-06-03 20:54:30','credito'),(68,NULL,120.00,1,'2025-06-03 20:56:01','credito'),(69,NULL,120.00,1,'2025-06-03 20:56:16','credito'),(70,NULL,120.00,1,'2025-06-03 20:56:53','credito'),(71,NULL,120.00,1,'2025-06-03 20:57:07','credito'),(72,NULL,120.00,1,'2025-06-03 20:57:14','credito'),(73,NULL,120.00,1,'2025-06-03 21:00:15',NULL),(74,NULL,120.00,1,'2025-06-03 21:00:47',NULL);
/*!40000 ALTER TABLE `vendas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vendas_por_periodo`
--

DROP TABLE IF EXISTS `vendas_por_periodo`;
/*!50001 DROP VIEW IF EXISTS `vendas_por_periodo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vendas_por_periodo` AS SELECT 
 1 AS `id`,
 1 AS `cliente_id`,
 1 AS `total`,
 1 AS `criado_em`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `produtos_mais_vendidos`
--

/*!50001 DROP VIEW IF EXISTS `produtos_mais_vendidos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `produtos_mais_vendidos` AS select `p`.`nome` AS `nome`,sum(`iv`.`quantidade`) AS `total_vendido` from (`produtos` `p` join `itens_venda` `iv` on((`p`.`id` = `iv`.`produto_id`))) group by `p`.`id` order by `total_vendido` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vendas_por_periodo`
--

/*!50001 DROP VIEW IF EXISTS `vendas_por_periodo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vendas_por_periodo` AS select `v`.`id` AS `id`,`v`.`cliente_id` AS `cliente_id`,`v`.`total` AS `total`,`v`.`criado_em` AS `criado_em` from `vendas` `v` where (`v`.`criado_em` between '2025-01-01' and now()) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-03 23:04:42
