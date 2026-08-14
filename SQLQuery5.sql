SELECT
    protocol_type_desc,
    local_net_address,
    local_tcp_port
FROM sys.dm_exec_connections
WHERE session_id = @@SPID;

SELECT
    SERVERPROPERTY('IsIntegratedSecurityOnly') AS WindowsOnly;