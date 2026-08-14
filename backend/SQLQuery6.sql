USE master;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.sql_logins
    WHERE name = 'TravelStoriesUser'
)
BEGIN

    CREATE LOGIN TravelStoriesUser
    WITH PASSWORD = 'TravelStories@2026Secure';

END
GO

USE TravelStoriesDB;
GO

IF NOT EXISTS
(
    SELECT 1
    FROM sys.database_principals
    WHERE name = 'TravelStoriesUser'
)
BEGIN

    CREATE USER TravelStoriesUser
    FOR LOGIN TravelStoriesUser;

END
GO

ALTER ROLE db_datareader
ADD MEMBER TravelStoriesUser;
GO

ALTER ROLE db_datawriter
ADD MEMBER TravelStoriesUser;
GO