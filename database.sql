-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 15-Maio-2020 às 18:43
-- Versão do servidor: 10.4.11-MariaDB
-- versão do PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `crud`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `carrinho`
--

CREATE TABLE `carrinho` (
  `id_usuario` int(11) NOT NULL,
  `id_produto` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `valor` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `operacoes`
--

CREATE TABLE `operacoes` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor` float(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `operacao` enum('criar','editar','vender','estocar','excluir') NOT NULL,
  `data` timestamp NULL DEFAULT current_timestamp(),
  `produto` varchar(255) NOT NULL,
  `custo` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `operacoes`
--

INSERT INTO `operacoes` (`id`, `usuario`, `descricao`, `valor`, `quantidade`, `operacao`, `data`, `produto`, `custo`) VALUES
(18, 'gabriel', 'suahsuasuahsau', 10.00, 100, 'criar', '2020-05-13 05:22:12', 'Sistema', 1.00),
(24, 'gabriel', 'saushhusua', 10.00, 100, 'criar', '2020-05-13 05:25:59', 'Primeiro teste', 1.00),
(15, 'gabriel', '', 10.00, 99, 'vender', '2020-05-13 05:45:35', 'Figado', 1.00),
(15, 'gabriel', '', 10.00, 990, 'estocar', '2020-05-13 05:47:49', 'Figado', 1.00),
(15, 'gabriel', '', 10.00, 990, 'editar', '2020-05-13 05:48:16', 'Figado', 100.00),
(17, 'gabriel', '', 10.00, 100, 'excluir', '2020-05-13 05:49:55', 'Margarina', 1.00),
(31, 'petterson', '1', 1.00, 1, 'excluir', '2020-05-15 05:29:37', 'tetse', 1.00),
(18, 'petterson', 'suahsuasuahsau', 10.00, 99, 'estocar', '2020-05-15 05:30:22', 'Sistema', 1.00),
(18, 'petterson', 'suahsuasuahsau', 10.00, 99, 'editar', '2020-05-15 05:30:51', 'Sistem', 1.00),
(18, 'petterson', 'suahsuasuahsau', 10.00, 98, 'estocar', '2020-05-15 05:31:20', 'Sistem', 1.00),
(18, 'petterson', 'suahsuasuahsau', 10.00, 50, 'estocar', '2020-05-15 05:32:10', 'Sistem', 1.00),
(18, 'petterson', 'algo', 100.00, 50, 'editar', '2020-05-15 05:32:53', 'Sistema', 20.00),
(18, 'petterson', 'algo', 100.00, 20, 'vender', '2020-05-15 05:35:03', 'Sistema', 20.00),
(19, 'petterson', 'suahshaushahsua1', 100.00, 75, 'vender', '2020-05-15 05:35:03', 'Caralho', 10.00),
(20, 'petterson', '1', 1.00, 0, 'vender', '2020-05-15 05:35:03', 'teste', 1.00),
(18, 'Petterson', 'algo', 1000.00, 20, 'editar', '2020-05-15 05:36:25', 'Sistema', 20.00),
(20, 'Petterson', '1', 1.00, 0, 'criar', '2020-05-15 05:37:48', 'teste', 1.00);

-- --------------------------------------------------------

--
-- Estrutura da tabela `operacoes_usuarios`
--

CREATE TABLE `operacoes_usuarios` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nome_usuario` varchar(255) NOT NULL,
  `id_usuario_modificado` int(11) NOT NULL,
  `nome_usuario_modificado` varchar(255) NOT NULL,
  `operacao` enum('editar','excluir','criar','') NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `operacoes_usuarios`
--

INSERT INTO `operacoes_usuarios` (`id`, `id_usuario`, `nome_usuario`, `id_usuario_modificado`, `nome_usuario_modificado`, `operacao`, `data`) VALUES
(2, 2, 'Petterson', 27, 'z', 'criar', '2020-05-15 16:28:00'),
(3, 2, 'Petterson', 28, 'a', 'criar', '2020-05-15 16:37:53'),
(4, 2, 'Petterson', 28, 'a', 'excluir', '2020-05-15 16:38:04'),
(5, 2, 'Petterson', 8, 'editor', 'editar', '2020-05-15 16:39:35');

-- --------------------------------------------------------

--
-- Estrutura da tabela `produtos`
--

CREATE TABLE `produtos` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor` float(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `custo` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `produtos`
--

INSERT INTO `produtos` (`id`, `nome`, `descricao`, `valor`, `quantidade`, `custo`) VALUES
(18, 'Sistema', 'algo', 1000.00, 20, 20.00),
(19, 'Caralho', 'suahshaushahsua1', 100.00, 75, 10.00),
(20, 'teste', '1', 1.00, 0, 1.00),
(21, 'a', '1', 1.00, 1, 1.00),
(22, 'aaaaaaaaaaa', '1', 1.00, 1, 1.00),
(23, 'bbbb', '1', 1.00, 1, 1.00),
(24, 'Primeiro teste', 'saushhusua', 10.00, 100, 1.00),
(25, 'Segundo teste', '1', 1.00, 1, 1.00),
(26, 'ccc', '1', 1.00, 1, 1.00),
(27, 'ccccc', '111', 1.00, 1, 1.00),
(28, 'cccc', '1', 1.00, 1, 1.00),
(29, 'suahsahsuahSUAs', 'aushuashau', 1.00, 1, 1.00),
(30, 'kkkk', 'saysuas', 1.00, 1, 1.00),
(32, 'teste', 'asdjal', 30.40, 2, 20.30);

-- --------------------------------------------------------

--
-- Estrutura da tabela `transacoes`
--

CREATE TABLE `transacoes` (
  `id` int(11) NOT NULL,
  `produto` varchar(255) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `transacoes`
--

INSERT INTO `transacoes` (`id`, `produto`, `quantidade`, `usuario`, `data`) VALUES
(13, 'Computador', 1, 'gabriel', '2020-05-12 01:03:49'),
(11, 'Macarrão', 1, 'gabriel', '2020-05-12 01:31:14'),
(10, 'Sopa', 1, 'vendedor', '2020-05-12 17:09:30');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `login` varchar(255) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `tipo` enum('admin','gerente','vendedor','editor') NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `login`, `senha`, `tipo`, `createdAt`, `updatedAt`) VALUES
(2, 'Petterson', 'pitter', '$2a$10$JF7tK5ShW6eUVqbutrclu.7tgqcglCwCLtPV3.KIpWAUEwm6Xv.Na', 'admin', '2020-05-04 04:41:13', '2020-05-15 05:36:10'),
(4, 'gabriel', 'gabriel', '$2a$10$KnBzFoRAsTiXSMxA.Y.gju2TjlOhMjdz92YXoDijyANOpuBV4Tdii', 'admin', '2020-05-05 18:47:32', '2020-05-05 18:47:32'),
(5, 'gerente', 'gerente', '$2a$10$C7OoDxLGQa.w06S3FdxURONpLECSWdoNIvacFX.BecQqWFYQbNG56', 'gerente', '2020-05-05 19:57:26', '2020-05-05 19:57:26'),
(7, 'vendedor', 'vendedor', '$2a$10$7dxRyofu.GoF7.wGlvpKle4.sMHUTnkWx1uA9mxgIfP7E8yl9k4Y6', 'vendedor', '2020-05-05 19:59:24', '2020-05-05 19:59:24'),
(8, 'editor', 'editor', '$2a$10$hoxKhCw46UXWPoCuKpvYhe9b78lEo/IZFhCviOsFqihHtSryWop7e', 'gerente', '2020-05-05 20:00:47', '2020-05-15 16:39:35');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `carrinho`
--
ALTER TABLE `carrinho`
  ADD PRIMARY KEY (`id_usuario`,`id_produto`);

--
-- Índices para tabela `operacoes_usuarios`
--
ALTER TABLE `operacoes_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `operacoes_usuarios`
--
ALTER TABLE `operacoes_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
