SELECT
    DB_NAME() AS DatabaseName,
    CONNECTIONPROPERTY('local_net_address') AS LocalAddress,
    CONNECTIONPROPERTY('local_tcp_port') AS TCPPort,
    CONNECTIONPROPERTY('net_transport') AS Transport;