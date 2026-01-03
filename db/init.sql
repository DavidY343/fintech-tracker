-- ============================================
-- INIT.SQL - Script de inicialización de BD
-- Sistema: Financial Tracker
-- Autor: [Tu Nombre]
-- Fecha: $(date)
-- ============================================

-- Configuración inicial
SET client_encoding = 'UTF8';
SET TIME ZONE 'UTC';


-- ============================================
-- 1. CREAR BASE DE DATOS Y USUARIO
-- ============================================
\echo 'Creando base de datos y usuario...'

-- Solo si no existe (para evitar errores)
SELECT 'CREATE DATABASE finance_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'finance_db')\gexec

-- Conectar a la nueva BD
\c finance_db
