-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 03-Jun-2020 às 23:58
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
-- Estrutura da tabela `despesas_fixas`
--

CREATE TABLE `despesas_fixas` (
  `idDespesa` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estrutura da tabela `operacoes`
--

CREATE TABLE `operacoes` (
  `id` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `descricao` text DEFAULT NULL,
  `valor` float(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `operacao` enum('criar','editar','vender','estocar','excluir') NOT NULL,
  `data` timestamp NULL DEFAULT current_timestamp(),
  `produto` varchar(255) NOT NULL,
  `custo` float(10,2) NOT NULL,
  `valor_total` float(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `operacoes`
--

INSERT INTO `operacoes` (`id`, `id_user`, `usuario`, `descricao`, `valor`, `quantidade`, `operacao`, `data`, `produto`, `custo`, `valor_total`) VALUES
(3, 2, 'Petterson', 'gamer', 5000.00, 5, 'criar', '2020-05-21 00:34:13', 'computador', 1000.00, NULL),
(3, 2, 'Petterson', 'gamer', 5000.00, 5, 'editar', '2020-05-21 00:34:24', 'computador', 2500.00, NULL),
(3, 2, 'Petterson', 'gamer', 5000.00, 3, 'estocar', '2020-05-21 00:34:28', 'computador', 2500.00, NULL),
(3, 2, 'Petterson', 'gamer', 5000.00, 2, 'vender', '2020-05-21 00:34:38', 'computador', 2500.00, NULL);

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
(7, 2, 'Petterson', 35, 'admin', 'criar', '2020-05-21 00:30:52'),
(8, 2, 'Petterson', 36, 'gerente', 'criar', '2020-05-21 00:33:19'),
(9, 2, 'Petterson', 37, 'vendedor', 'criar', '2020-05-21 00:33:36'),
(10, 2, 'Petterson', 38, 'editor', 'criar', '2020-05-21 00:33:58');

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
(3, 'computador', 'gamer', 5000.00, 2, 2500.00);

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
  `salario_mensal` decimal(10,2) NOT NULL,
  `ultimo_login` timestamp NULL DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Extraindo dados da tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `login`, `senha`, `tipo`, `salario_mensal`, `ultimo_login`, `createdAt`, `updatedAt`) VALUES
(2, 'Petterson', 'petter', '$2a$10$exk0iY.g9hoBlqNbLDIVg.3hR/b87XMqgfpTGCfet7FUS6sAOLS8K', 'admin', '500.50', NULL, '2020-05-04 04:41:13', '2020-05-21 00:11:34'),
(35, 'admin', 'admin', '$2a$10$lVL.tFWHRoLvv3.WkaoNuuOpz/1RclL.yOKtzmKP20FfA1yN4GpVi', 'admin', '100.00', NULL, '2020-05-21 00:30:52', '2020-05-21 00:30:52'),
(36, 'gerente', 'gerente', '$2a$10$foI10Wex9uWUkEZ.ew8sguCbm8htDf8OANmQjZkts1sWBNiPaKZyG', 'gerente', '100.00', NULL, '2020-05-21 00:33:19', '2020-05-21 00:33:19'),
(37, 'vendedor', 'vendedor', '$2a$10$XKD65dLVMq3P0YuWHglcJ.UXOCn8GH.LWz7IeHiBJo0a3J1kkZwDK', 'vendedor', '100.00', NULL, '2020-05-21 00:33:36', '2020-05-21 00:33:36'),
(38, 'editor', 'editor', '$2a$10$yndtIEzuM9SBcOGCh8aMQOYO9sSIUcr5QeDX9wV61RQ2ZhcU7wfXW', 'editor', '200.00', NULL, '2020-05-21 00:33:58', '2020-05-21 00:33:58'),
(39, '1', '1', '$2a$10$odfW1e0q9Rdg3tyybCavVeeNBzo7mx8PQgQwJYHWtdccN867AzWfO', 'admin', '1.00', NULL, '2020-05-21 00:33:58', '2020-05-21 00:33:58');

-- --------------------------------------------------------

--
-- Estrutura da tabela `vendas`
--

CREATE TABLE `vendas` (
  `id_venda` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `dia` int(11) NOT NULL,
  `mes` int(11) NOT NULL,
  `ano` int(11) NOT NULL,
  `valor` float(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `carrinho`
--
ALTER TABLE `carrinho`
  ADD PRIMARY KEY (`id_usuario`,`id_produto`);

--
-- Índices para tabela `despesas_fixas`
--
ALTER TABLE `despesas_fixas`
  ADD PRIMARY KEY (`idDespesa`);

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
-- Índices para tabela `vendas`
--
ALTER TABLE `vendas`
  ADD PRIMARY KEY (`id_venda`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `despesas_fixas`
--
ALTER TABLE `despesas_fixas`
  MODIFY `idDespesa` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `operacoes_usuarios`
--
ALTER TABLE `operacoes_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `produtos`
--
ALTER TABLE `produtos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de tabela `vendas`
--
ALTER TABLE `vendas`
  MODIFY `id_venda` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
