CREATE DATABASE TravelStoriesDB;
GO

USE TravelStoriesDB;
GO

CREATE TABLE Stories
(
    Id BIGINT PRIMARY KEY,

    Title NVARCHAR(300) NOT NULL,

    StartPlace NVARCHAR(200) NOT NULL,

    Destination NVARCHAR(200) NOT NULL,

    Transport NVARCHAR(200) NOT NULL,

    Cost DECIMAL(10,2) NOT NULL,

    Route NVARCHAR(MAX) NOT NULL,

    Experience NVARCHAR(MAX) NOT NULL,

    Tips NVARCHAR(MAX) NULL,

    CreatedAt DATETIME2 NOT NULL
        DEFAULT GETDATE()
);
GO

SELECT *
FROM Stories;
SELECT
    local_net_address,
    local_tcp_port
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;