CREATE DATABASE  IF NOT EXISTS `pilates` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `pilates`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: pilates
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `cabecera_factura`
--

DROP TABLE IF EXISTS `cabecera_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cabecera_factura` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_factura` date DEFAULT NULL,
  `numero_factura` varchar(45) DEFAULT NULL,
  `sub_total` decimal(10,0) DEFAULT NULL,
  `descuento` decimal(10,0) DEFAULT NULL,
  `tipo_factura` int(11) DEFAULT NULL,
  `comprador_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cabecera_factura_persona2_idx` (`comprador_id`),
  CONSTRAINT `fk_cabecera_factura_persona2` FOREIGN KEY (`comprador_id`) REFERENCES `persona` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cabecera_factura`
--

LOCK TABLES `cabecera_factura` WRITE;
/*!40000 ALTER TABLE `cabecera_factura` DISABLE KEYS */;
INSERT INTO `cabecera_factura` VALUES (67,'2024-10-22','0001',1200,0,NULL,58),(68,'2024-10-23','0002',1200,0,NULL,59),(69,'2024-10-22','0001',1300,0,1,58),(70,'2024-10-22','0003',20000,10,3,58),(71,'2024-10-02','0004',20000,5,3,59),(72,'2024-10-23','0004',150000,0,1,58),(73,'2024-10-21','0005',150000,0,3,59),(74,'2024-10-25','0004',20000,10,NULL,60),(75,'2024-10-22','0005',20000,10,NULL,61),(76,'2024-10-22','006',120000,10,NULL,62),(77,'2024-10-22','0007',15000,0,NULL,63),(78,'2024-10-22','007',1199,0,1,58);
/*!40000 ALTER TABLE `cabecera_factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria_producto`
--

DROP TABLE IF EXISTS `categoria_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_producto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_producto`
--

LOCK TABLES `categoria_producto` WRITE;
/*!40000 ALTER TABLE `categoria_producto` DISABLE KEYS */;
INSERT INTO `categoria_producto` VALUES (1,'elementos');
/*!40000 ALTER TABLE `categoria_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacto`
--

DROP TABLE IF EXISTS `contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefono` varchar(45) DEFAULT NULL,
  `email` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacto`
--

LOCK TABLES `contacto` WRITE;
/*!40000 ALTER TABLE `contacto` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamento`
--

DROP TABLE IF EXISTS `departamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `provincia_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_localidad_provincia1_idx` (`provincia_id`),
  CONSTRAINT `fk_localidad_provincia1` FOREIGN KEY (`provincia_id`) REFERENCES `provincia` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamento`
--

LOCK TABLES `departamento` WRITE;
/*!40000 ALTER TABLE `departamento` DISABLE KEYS */;
INSERT INTO `departamento` VALUES (1,'Capital',13),(2,'Obera',13),(3,'Iguazu',13),(4,'Eldorado',13),(5,'Guarani',13),(6,'San Ignacio',13),(7,'Cainguas',13),(8,'Libertador Gral. San Martin',13),(9,'Apostoles',13),(10,'Leandro N. Alem',13),(11,'General Manuel Belgrano',13),(12,'Montecarlo',13),(13,'Candelaria',13),(14,'San Pedro',13),(15,'25 de Mayo',13),(16,'San Javier',13),(17,'Concepcion',13);
/*!40000 ALTER TABLE `departamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_factura`
--

DROP TABLE IF EXISTS `detalle_factura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_factura` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `detalle` varchar(100) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio` decimal(10,0) NOT NULL,
  `cabecera_factura_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_detalle_factura_cabecera_factura1_idx` (`cabecera_factura_id`),
  CONSTRAINT `fk_detalle_factura_cabecera_factura1` FOREIGN KEY (`cabecera_factura_id`) REFERENCES `cabecera_factura` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_factura`
--

LOCK TABLES `detalle_factura` WRITE;
/*!40000 ALTER TABLE `detalle_factura` DISABLE KEYS */;
INSERT INTO `detalle_factura` VALUES (48,NULL,1,1200,67),(49,NULL,1,1200,68),(50,'pago de cuota',NULL,1300,69),(51,'cobro de cuota',NULL,18000,70),(52,'cobro de cuota',NULL,19000,71),(53,'pago de sueldos',NULL,150000,72),(54,'cobro de cuotas',NULL,150000,73),(55,NULL,1,18000,74),(56,NULL,1,18000,75),(57,NULL,1,10800,76),(58,NULL,1,15000,77),(59,'pago de cuota',NULL,1199,78);
/*!40000 ALTER TABLE `detalle_factura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pedido_id` int(11) NOT NULL,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `precio_venta` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_detalle_pedido_pedido1_idx` (`pedido_id`),
  KEY `fk_detalle_pedido_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_detalle_pedido_pedido1` FOREIGN KEY (`pedido_id`) REFERENCES `pedido` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_detalle_pedido_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dia_horario`
--

DROP TABLE IF EXISTS `dia_horario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dia_horario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `turno_tipo` varchar(45) DEFAULT NULL,
  `hora_inicio` varchar(45) DEFAULT NULL,
  `hora_fin` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dia_horario`
--

LOCK TABLES `dia_horario` WRITE;
/*!40000 ALTER TABLE `dia_horario` DISABLE KEYS */;
/*!40000 ALTER TABLE `dia_horario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dias_semana`
--

DROP TABLE IF EXISTS `dias_semana`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dias_semana` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dias_semana`
--

LOCK TABLES `dias_semana` WRITE;
/*!40000 ALTER TABLE `dias_semana` DISABLE KEYS */;
INSERT INTO `dias_semana` VALUES (1,'Lunes'),(2,'Martes'),(3,'Miercoles'),(4,'Jueves'),(5,'Viernes');
/*!40000 ALTER TABLE `dias_semana` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dias_turno`
--

DROP TABLE IF EXISTS `dias_turno`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dias_turno` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dias_turno`
--

LOCK TABLES `dias_turno` WRITE;
/*!40000 ALTER TABLE `dias_turno` DISABLE KEYS */;
INSERT INTO `dias_turno` VALUES (1,'Lunes, Miércoles y Viernes'),(2,'Martes y Jueves');
/*!40000 ALTER TABLE `dias_turno` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direccion`
--

DROP TABLE IF EXISTS `direccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direccion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) DEFAULT NULL,
  `municipio_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_direccion_municipio1_idx` (`municipio_id`),
  CONSTRAINT `fk_direccion_municipio1` FOREIGN KEY (`municipio_id`) REFERENCES `municipio` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direccion`
--

LOCK TABLES `direccion` WRITE;
/*!40000 ALTER TABLE `direccion` DISABLE KEYS */;
INSERT INTO `direccion` VALUES (1,'Calle SiempreViva ',1),(3,'Calle siemprevivia 123',1),(4,'Calle siemprevivia 123',1),(5,'Calle siemprevivia 123',1),(6,'Calle siemprevivia 123',1),(7,'Calle siemprevivia 123',1),(8,'Calle siemprevivia 123',1),(9,'Calle siemprevivia 123',1),(10,'Calle siemprevivia 123',1),(11,'Calle siemprevivia 123',1),(12,'Calle siemprevivia 123',1),(13,'Calle siemprevivia 123',1),(14,'Calle siemprevivia 123',1),(15,'Calle siemprevivia 123',1),(16,'Calle siemprevivia 123',1),(17,'Calle siemprevivia 123',1),(18,'Calle siemprevivia 123',1),(19,'Calle siemprevivia 123',1),(20,'Calle siemprevivia 123',1),(21,'Sargento Brítez 2347',1),(22,'Sargento Brítez 2347',1),(23,'Calle siemprevivia 123',1),(24,'Sargento Brítez 2347',1),(25,'Calle 72 num 5126',1),(26,'Calle siemprevivia 123',1),(27,'Sargento Brítez 2347',1),(28,'Esperanza 147',1),(29,'Esperanza 147',1),(30,'Esperanza 147',1),(31,'Esperanza 147',1),(32,'Esperanza 147',1),(33,'roca mora 32',1),(34,'Las Calandrias 4532',1),(35,'Las magnolias 5432',1),(36,'Esperanza 147',1),(37,'Esperanza 147',1);
/*!40000 ALTER TABLE `direccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicio`
--

DROP TABLE IF EXISTS `ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(100) DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `grupo_muscular` varchar(45) DEFAULT NULL,
  `url_video` varchar(255) DEFAULT NULL,
  `url_imagen` varchar(255) DEFAULT NULL,
  `calorias_promedio` varchar(45) DEFAULT NULL,
  `nivel_dificultad` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicio`
--

LOCK TABLES `ejercicio` WRITE;
/*!40000 ALTER TABLE `ejercicio` DISABLE KEYS */;
INSERT INTO `ejercicio` VALUES (1,'Cien (Hundred)','Ejercicio clásico de pilates para calentamiento.','Abdominales','','','30','Básico'),(2,'Rodar hacia arriba (Roll Up)','Mejora la flexibilidad y fortalece el core.','Abdominales','','','40','Básico'),(3,'Círculos con las piernas','Fortalece los músculos de la cadera.','Piernas','','','25','Básico'),(4,'Estiramiento de una pierna','Estira la pierna y fortalece los músculos del core.','Abdominales','','','35','Básico'),(5,'Estiramiento de la columna','Mejora la flexibilidad de la columna vertebral.','Espalda','','','20','Básico'),(6,'Plancha básica','Mejora la estabilidad del core y la fuerza del abdomen.','Abdominales','','','60','Básico'),(7,'Plancha lateral','Fortalece los oblicuos y mejora la estabilidad.','Abdominales','','','50','Intermedio'),(8,'Plancha con elevación de pierna','Desafía el core y fortalece las piernas.','Abdominales','','','70','Avanzado'),(9,'Estiramiento de dos piernas','Fortalece el abdomen y estira las piernas.','Abdominales','','','50','Intermedio'),(10,'Cruce de piernas (Criss-Cross)','Mejora la estabilidad del core.','Abdominales','','','45','Intermedio'),(11,'Tesoro (Teaser)','Desafía el equilibrio y fortalece todo el cuerpo.','Abdominales','','','55','Avanzado'),(12,'Elevación lateral de piernas','Fortalece las piernas y los oblicuos.','Piernas','','','30','Intermedio'),(13,'Plancha con giro de cadera','Desafía la fuerza del core y la estabilidad.','Abdominales','','','65','Avanzado'),(14,'Plancha con flexión de brazos','Fortalece el abdomen y los brazos.','Abdominales, Brazos','','','80','Intermedio'),(15,'Tesoro II (Teaser II)','Desafío avanzado para fuerza y equilibrio.','Abdominales','','','65','Avanzado'),(16,'Plancha dinámica','Plancha en movimiento para mejorar la resistencia.','Abdominales','','','75','Avanzado'),(17,'Flexiones de brazos (Push-Ups)','Fortalece los brazos, el pecho y el core.','Pecho, Abdominales','','','70','Intermedio'),(18,'Tesoro II (Teaser II)','Desafío avanzado para fuerza y equilibrio.','Abdominales','','','65','Avanzado'),(19,'Puente de hombros','Fortalece la espalda y mejora la postura.','Espalda','','','30','Básico'),(20,'Flexión lateral','Mejora la flexibilidad de los costados del torso.','Costados','','','20','Intermedio');
/*!40000 ALTER TABLE `ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_pago_pedido`
--

DROP TABLE IF EXISTS `estado_pago_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_pago_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pago_pedido`
--

LOCK TABLES `estado_pago_pedido` WRITE;
/*!40000 ALTER TABLE `estado_pago_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_pago_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado_pedido`
--

DROP TABLE IF EXISTS `estado_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado_pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado_pedido`
--

LOCK TABLES `estado_pedido` WRITE;
/*!40000 ALTER TABLE `estado_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `estado_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movimiento_stock`
--

DROP TABLE IF EXISTS `movimiento_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimiento_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `tipo_movimiento_id` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `observacion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_movimiento_stock_producto1_idx` (`producto_id`),
  KEY `fk_movimiento_stock_tipo_movimiento1_idx` (`tipo_movimiento_id`),
  CONSTRAINT `fk_movimiento_stock_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_movimiento_stock_tipo_movimiento1` FOREIGN KEY (`tipo_movimiento_id`) REFERENCES `tipo_movimiento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movimiento_stock`
--

LOCK TABLES `movimiento_stock` WRITE;
/*!40000 ALTER TABLE `movimiento_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimiento_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `municipio`
--

DROP TABLE IF EXISTS `municipio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `municipio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `departamento_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_municipio_departamento1_idx` (`departamento_id`),
  CONSTRAINT `fk_municipio_departamento1` FOREIGN KEY (`departamento_id`) REFERENCES `departamento` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `municipio`
--

LOCK TABLES `municipio` WRITE;
/*!40000 ALTER TABLE `municipio` DISABLE KEYS */;
INSERT INTO `municipio` VALUES (1,'Posadas',1),(2,'Fachinal',1),(3,'Garupa',1);
/*!40000 ALTER TABLE `municipio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais`
--

DROP TABLE IF EXISTS `pais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pais` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais`
--

LOCK TABLES `pais` WRITE;
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
INSERT INTO `pais` VALUES (1,'Argentina');
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `total` decimal(10,0) DEFAULT NULL,
  `estado_pedido_id` int(11) NOT NULL,
  `estado_pago_pedido_id` int(11) NOT NULL,
  `fecha_pedido` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_pedido_user1_idx` (`user_id`),
  KEY `fk_pedido_estado_pedido1_idx` (`estado_pedido_id`),
  KEY `fk_pedido_estado_pago_pedido1_idx` (`estado_pago_pedido_id`),
  CONSTRAINT `fk_pedido_estado_pago_pedido1` FOREIGN KEY (`estado_pago_pedido_id`) REFERENCES `estado_pago_pedido` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_estado_pedido1` FOREIGN KEY (`estado_pedido_id`) REFERENCES `estado_pedido` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_pedido_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apellido` varchar(45) DEFAULT NULL,
  `nombre` varchar(45) DEFAULT NULL,
  `dni` varchar(45) DEFAULT NULL,
  `cuil` varchar(45) DEFAULT NULL,
  `direccion_id` int(11) NOT NULL,
  `tipo_persona_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_persona_direccion1_idx` (`direccion_id`),
  KEY `fk_persona_tipo_persona1_idx` (`tipo_persona_id`),
  CONSTRAINT `fk_persona_direccion1` FOREIGN KEY (`direccion_id`) REFERENCES `direccion` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_persona_tipo_persona1` FOREIGN KEY (`tipo_persona_id`) REFERENCES `tipo_persona` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (52,'Lean','Anibarro','364729','36587416',26,1),(53,'Brz','Pazz','37221007','20364073292',27,1),(54,'CORREA','LEANDRO','40040762','20400407621',28,1),(55,'CORREA','LEANDRO','40040765','20400407651',29,1),(56,'CORREA','LEANDRO','40040768','20400407681',30,1),(57,'CORREA','LEANDRO','40040769','20400407691',31,1),(58,'Correa','Leandro','40040763','20400407631',32,1),(59,'Anibarro','Nicolas','36407328','20364073282',33,1),(60,'José','Maria','36407327','20364073272',34,1),(61,'Estigarribia','Koki','36407326','20364073262',35,1),(62,'Cardozo','Kati','222222222','202222222221',36,1),(63,'Fernandez','Dario','24555999','20245559991',37,1);
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona_contacto`
--

DROP TABLE IF EXISTS `persona_contacto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona_contacto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `persona_id` int(11) NOT NULL,
  `contacto_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_usuario_contacto_persona1_idx` (`persona_id`),
  KEY `fk_usuario_contacto_contacto1_idx` (`contacto_id`),
  CONSTRAINT `fk_usuario_contacto_contacto1` FOREIGN KEY (`contacto_id`) REFERENCES `contacto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_contacto_persona1` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona_contacto`
--

LOCK TABLES `persona_contacto` WRITE;
/*!40000 ALTER TABLE `persona_contacto` DISABLE KEYS */;
/*!40000 ALTER TABLE `persona_contacto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `porcentaje_global`
--

DROP TABLE IF EXISTS `porcentaje_global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `porcentaje_global` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `porcentaje_global_producto` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `porcentaje_global`
--

LOCK TABLES `porcentaje_global` WRITE;
/*!40000 ALTER TABLE `porcentaje_global` DISABLE KEYS */;
INSERT INTO `porcentaje_global` VALUES (1,70);
/*!40000 ALTER TABLE `porcentaje_global` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `precio_venta` decimal(10,0) DEFAULT NULL,
  `porcentaje_especifico_producto` int(11) DEFAULT NULL,
  `categoria_producto_id` int(11) NOT NULL,
  `porcentaje_global_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_producto_categoria_producto1_idx` (`categoria_producto_id`),
  KEY `fk_producto_porcentaje_global1_idx` (`porcentaje_global_id`),
  CONSTRAINT `fk_producto_categoria_producto1` FOREIGN KEY (`categoria_producto_id`) REFERENCES `categoria_producto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_producto_porcentaje_global1` FOREIGN KEY (`porcentaje_global_id`) REFERENCES `porcentaje_global` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Colchoneta Everlats 10mm',48990,0,1,1),(2,'Colchoneta Matt 4mm',20850,0,1,1),(3,'Colchoneta Mat yoga Pilates 10mm',20500,0,1,1),(4,'Colchoneta Mat Yoga 6mm',19989,0,1,1),(5,'Colchoneta  Yoga Pilates 5mm',8830,0,1,1),(6,'Anillo de pilates_ Flex Ring Drb',14170,0,1,1),(7,'Anillo de pilates_ Flex Ring Marca El Rey',17990,0,1,1),(8,'Anillo Flex Ring Aro Arco',15490,0,1,1),(9,'Pelota de Pilates Esferodinamia 45 cm',9749,0,1,1),(10,'Pelota Esferodinamia 75 cm',23650,0,1,1),(11,'Pelota Esferodinamia 55 cm',15999,0,1,1),(12,'Pelota Esferodinamia 45 cm - gmp equipamiento',9750,0,1,1),(13,'Pelota lisa de 35 cm ',9500,0,1,1),(14,'Bozu Ball Media esfera con bandas 34 cm ',65000,0,1,1),(15,'Bozu Ball Media esfera con bandas 60 cm ',95000,0,1,1),(16,'kit de Pilates  Banda tiraband + tone ball+ c',18000,0,1,1),(17,'Set de 3 Bandas de Resistencia Tela Elastica',17990,0,1,1),(18,'Tiraband tension leve Tela Elastica Mir Fitne',16989,0,1,1),(19,'Tiraband tension Alta Tela Elastica Mir Fitne',17989,0,1,1),(20,'Rolo Rodillo masajeador Texturizado',20990,0,1,1),(21,'Rolo Rodillo masajeador Texturizado Premium',32100,0,1,1),(22,'Pelota Masajes Contractura Pinches ',5156,0,1,1),(23,'Pelota Masajes Contractura Pinches x 4',13759,0,1,1),(24,'Mancuernas Par de 2kg',6054,0,1,1),(25,'Mancuernas Par Recubierta de Goma de 4kg',12824,0,1,1),(26,'Mancuerna 2kg Recubierta de Goma de Fundicion',11193,0,1,1);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `provincia`
--

DROP TABLE IF EXISTS `provincia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `provincia` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `pais_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_provincia_pais_idx` (`pais_id`),
  CONSTRAINT `fk_provincia_pais` FOREIGN KEY (`pais_id`) REFERENCES `pais` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `provincia`
--

LOCK TABLES `provincia` WRITE;
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
INSERT INTO `provincia` VALUES (1,'Buenos Aires',1),(2,'Catamarca',1),(3,'Chaco',1),(4,'Chubut',1),(5,'Cordoba',1),(6,'Corrientes',1),(7,'Entre Rios',1),(8,'Formosa',1),(9,'Jujuy',1),(10,'La Pampa',1),(11,'La Rioja',1),(12,'Mendoza',1),(13,'Misiones',1),(14,'Neuquen',1),(15,'Rio Negro',1),(16,'Salta',1),(17,'San Juan',1),(18,'San Luis',1),(19,'Santa Cruz',1),(20,'Santa Fe',1),(21,'Santiago del Estero',1),(22,'Tierra del Fuego - Antartida e Islas del Atln',1),(23,'Tucuman',1);
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `tipo_estado_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rol_tipo_estado1_idx` (`tipo_estado_id`),
  CONSTRAINT `fk_rol_tipo_estado1` FOREIGN KEY (`tipo_estado_id`) REFERENCES `tipo_estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Administrador',1),(2,'entrenador',1),(3,'cliente',1);
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina`
--

DROP TABLE IF EXISTS `rutina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `cantidad_dias` varchar(45) DEFAULT NULL,
  `tipo_estado_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rutina_tipo_estado1_idx` (`tipo_estado_id`),
  CONSTRAINT `fk_rutina_tipo_estado1` FOREIGN KEY (`tipo_estado_id`) REFERENCES `tipo_estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina`
--

LOCK TABLES `rutina` WRITE;
/*!40000 ALTER TABLE `rutina` DISABLE KEYS */;
INSERT INTO `rutina` VALUES (4,'Cuerpo superior',NULL,1),(5,'Cuerpo superior martes',NULL,1),(6,'clase intermedia',NULL,1);
/*!40000 ALTER TABLE `rutina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina_ejercicio`
--

DROP TABLE IF EXISTS `rutina_ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina_ejercicio` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rutina_id` int(11) NOT NULL,
  `ejercicio_id` int(11) NOT NULL,
  `series` varchar(45) DEFAULT NULL,
  `repeticiones` varchar(45) DEFAULT NULL,
  `orden` int(11) DEFAULT NULL,
  `descanso` int(11) DEFAULT NULL,
  `numero_dia` int(11) DEFAULT NULL,
  `tipo_estado_id` int(11) NOT NULL,
  `dias_semana_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_rutina_ejercicio_rutina1_idx` (`rutina_id`),
  KEY `fk_rutina_ejercicio_ejercicio1_idx` (`ejercicio_id`),
  KEY `fk_rutina_ejercicio_tipo_estado1_idx` (`tipo_estado_id`),
  KEY `fk_rutina_ejercicio_dias_semana1_idx` (`dias_semana_id`),
  CONSTRAINT `fk_rutina_ejercicio_dias_semana1` FOREIGN KEY (`dias_semana_id`) REFERENCES `dias_semana` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rutina_ejercicio_ejercicio1` FOREIGN KEY (`ejercicio_id`) REFERENCES `ejercicio` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rutina_ejercicio_rutina1` FOREIGN KEY (`rutina_id`) REFERENCES `rutina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_rutina_ejercicio_tipo_estado1` FOREIGN KEY (`tipo_estado_id`) REFERENCES `tipo_estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina_ejercicio`
--

LOCK TABLES `rutina_ejercicio` WRITE;
/*!40000 ALTER TABLE `rutina_ejercicio` DISABLE KEYS */;
INSERT INTO `rutina_ejercicio` VALUES (4,4,6,'3','10',1,NULL,NULL,1,1),(5,4,17,'3','12',2,NULL,NULL,1,1),(6,5,6,'3','12',1,NULL,NULL,1,1),(7,5,3,'3','12',2,NULL,NULL,1,1),(8,6,1,'2','12',1,NULL,NULL,1,1),(9,6,3,'3','12',2,NULL,NULL,1,1),(10,6,6,'2','12',3,NULL,NULL,1,1),(11,6,11,'3','12',4,NULL,NULL,1,1);
/*!40000 ALTER TABLE `rutina_ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock`
--

DROP TABLE IF EXISTS `stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `producto_id` int(11) NOT NULL,
  `cantidad_disponible` int(11) DEFAULT NULL,
  `cantidad_minima` int(11) DEFAULT NULL,
  `precio_costo` decimal(10,0) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_stock_producto1_idx` (`producto_id`),
  CONSTRAINT `fk_stock_producto1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock`
--

LOCK TABLES `stock` WRITE;
/*!40000 ALTER TABLE `stock` DISABLE KEYS */;
INSERT INTO `stock` VALUES (1,1,6,4,14697),(2,2,4,2,14595),(3,3,8,6,14350),(4,4,10,8,13992),(5,5,9,7,6181),(6,6,6,4,9919),(7,7,5,3,12593),(8,8,10,8,10843),(9,9,12,10,6824),(10,10,10,8,16555),(11,11,8,6,11199),(12,12,12,10,6825),(13,13,10,8,6650),(14,14,4,2,45500),(15,15,6,4,66500),(16,16,5,3,12600),(17,17,6,4,12593),(18,18,8,6,11892),(19,19,10,8,12592),(20,20,5,3,14693),(21,21,6,4,22470),(22,22,15,13,3609),(23,23,10,8,9631),(24,24,20,18,4238),(25,25,16,14,8977),(26,26,18,16,7835);
/*!40000 ALTER TABLE `stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_estado`
--

DROP TABLE IF EXISTS `tipo_estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_estado` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_estado`
--

LOCK TABLES `tipo_estado` WRITE;
/*!40000 ALTER TABLE `tipo_estado` DISABLE KEYS */;
INSERT INTO `tipo_estado` VALUES (1,'activo'),(2,'inactivo'),(3,'suspendido'),(4,'debe'),(5,'pagado');
/*!40000 ALTER TABLE `tipo_estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_movimiento`
--

DROP TABLE IF EXISTS `tipo_movimiento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_movimiento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_movimiento`
--

LOCK TABLES `tipo_movimiento` WRITE;
/*!40000 ALTER TABLE `tipo_movimiento` DISABLE KEYS */;
INSERT INTO `tipo_movimiento` VALUES (1,'Entrada'),(2,'Salida');
/*!40000 ALTER TABLE `tipo_movimiento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_persona`
--

DROP TABLE IF EXISTS `tipo_persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_persona` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_persona`
--

LOCK TABLES `tipo_persona` WRITE;
/*!40000 ALTER TABLE `tipo_persona` DISABLE KEYS */;
INSERT INTO `tipo_persona` VALUES (1,'fisica'),(2,'juridica');
/*!40000 ALTER TABLE `tipo_persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_pilates`
--

DROP TABLE IF EXISTS `tipo_pilates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_pilates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(45) DEFAULT NULL,
  `frecuencia_atencion` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_pilates`
--

LOCK TABLES `tipo_pilates` WRITE;
/*!40000 ALTER TABLE `tipo_pilates` DISABLE KEYS */;
INSERT INTO `tipo_pilates` VALUES (1,'clasico','60'),(2,'moderno ','60');
/*!40000 ALTER TABLE `tipo_pilates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_pilates_dia`
--

DROP TABLE IF EXISTS `tipo_pilates_dia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_pilates_dia` (
  `id` int(11) NOT NULL,
  `tipo_pilates_id` int(11) NOT NULL,
  `dia_id` int(11) NOT NULL,
  `rutina_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_tipo_pilates_dia_tipo_pilates1_idx` (`tipo_pilates_id`),
  KEY `fk_tipo_pilates_dia_dia1_idx` (`dia_id`),
  KEY `fk_tipo_pilates_dia_rutina1_idx` (`rutina_id`),
  CONSTRAINT `fk_tipo_pilates_dia_dia1` FOREIGN KEY (`dia_id`) REFERENCES `dia_horario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tipo_pilates_dia_rutina1` FOREIGN KEY (`rutina_id`) REFERENCES `rutina` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_tipo_pilates_dia_tipo_pilates1` FOREIGN KEY (`tipo_pilates_id`) REFERENCES `tipo_pilates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_pilates_dia`
--

LOCK TABLES `tipo_pilates_dia` WRITE;
/*!40000 ALTER TABLE `tipo_pilates_dia` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_pilates_dia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `turnos_alta_usuario`
--

DROP TABLE IF EXISTS `turnos_alta_usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos_alta_usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fecha_turno` date DEFAULT NULL,
  `hora` varchar(45) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `tipo_pilates_id` int(11) NOT NULL,
  `tipo_estado_id` int(11) NOT NULL,
  `dias_turno_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_turnos_user1_idx` (`user_id`),
  KEY `fk_turnos_alta_usuarion_tipo_pilates1_idx` (`tipo_pilates_id`),
  KEY `fk_turnos_alta_usuario_tipo_estado1_idx` (`tipo_estado_id`),
  KEY `fk_dias_turno` (`dias_turno_id`),
  CONSTRAINT `fk_dias_turno` FOREIGN KEY (`dias_turno_id`) REFERENCES `dias_turno` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_turnos_alta_usuario_tipo_estado1` FOREIGN KEY (`tipo_estado_id`) REFERENCES `tipo_estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_turnos_alta_usuarion_tipo_pilates1` FOREIGN KEY (`tipo_pilates_id`) REFERENCES `tipo_pilates` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_turnos_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos_alta_usuario`
--

LOCK TABLES `turnos_alta_usuario` WRITE;
/*!40000 ALTER TABLE `turnos_alta_usuario` DISABLE KEYS */;
INSERT INTO `turnos_alta_usuario` VALUES (33,'2024-10-22','08:00',51,1,1,1),(34,'2024-10-23','18:00',52,1,1,1),(35,'2024-10-25','22:00',53,1,1,2),(36,'2024-10-22','10:00',54,1,1,2),(37,'2024-10-22','21:00',55,1,1,1),(38,'2024-10-22','20:05',56,1,1,1);
/*!40000 ALTER TABLE `turnos_alta_usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(200) NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `persona_id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `tipo_estado_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_user_persona1_idx` (`persona_id`),
  KEY `fk_user_rol1_idx` (`rol_id`),
  KEY `fk_user_tipo_estado1_idx` (`tipo_estado_id`),
  CONSTRAINT `fk_user_persona1` FOREIGN KEY (`persona_id`) REFERENCES `persona` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_rol1` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_user_tipo_estado1` FOREIGN KEY (`tipo_estado_id`) REFERENCES `tipo_estado` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (45,'Pepe','$2a$10$isF4UI.BD.LIdspZ9LztDOY/oSKgkvglVK.oXdjt.XTtK84u3J1NC','2017-08-24 00:00:00','2020-08-24 00:00:00',52,1,1),(51,'LeanCG','$2a$10$b.YtHdopmSnpAy5NFdSDzed1EDiR9uFAuXiu5ebpjgkvgWgSvjswy','2024-10-22 18:20:51','2024-10-22 18:20:51',58,1,1),(52,'Nanibarro','$2a$10$ch2vK9A.m0E1SntR3QarX.9R80QFf3GIBkOJuOJv8YUKBpRoXYIWe','2024-10-22 18:28:27','2024-10-22 18:28:27',59,1,4),(53,'Marijo','$2a$10$q4RbXSjlkeNEXrnf9R.owuCAIWyEdx9m0uPEhyLHAlHIdlw9GdntW','2024-10-22 18:40:03','2024-10-22 18:40:03',60,1,1),(54,'koki','$2a$10$r4VlpqmK4Ka5b/tQduY/p.9FoZLdx0o243.W7okppFsd49uKCiIRy','2024-10-22 18:43:05','2024-10-22 18:43:05',61,3,1),(55,'kcardozo','$2a$10$2AgUyofwSXAA5AD1S7xDBuWVzO1mJs/4S/Gs/rSf/kjJkE7jRcBj6','2024-10-22 19:56:42','2024-10-22 19:56:42',62,3,1),(56,'fernandezd','$2a$10$gSaHKuzDPq9kxJu1lsuuDez.0iMisFTIt8rmM8P8RtuIdag7aQXry','2024-10-22 20:05:43','2024-10-22 20:05:43',63,3,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-25 20:32:11
