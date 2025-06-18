import socket
from socket import gaierror

# Common ports dictionary (would normally be imported from common_ports.py)
COMMON_PORTS = {
    20: "ftp-data",
    21: "ftp",
    22: "ssh",
    23: "telnet",
    25: "smtp",
    53: "domain",
    80: "http",
    110: "pop3",
    143: "imap",
    443: "https",
    465: "smtps",
    587: "submission",
    993: "imaps",
    995: "pop3s",
    3306: "mysql",
    3389: "rdp",
    5432: "postgresql",
    8080: "http-proxy",
}

def get_open_ports(target, port_range, verbose=False):
    """
    Scan a range of ports on a target IP or URL to find open ports.
    
    Args:
        target: IP address or URL to scan
        port_range: List containing start and end ports (inclusive)
        verbose: If True, returns formatted string with service names
    
    Returns:
        List of open ports if verbose=False
        Formatted string if verbose=True
        Error message if target is invalid
    """
    # Validate port range
    if len(port_range) != 2 or port_range[0] > port_range[1]:
        return "Invalid port range"
    
    start_port, end_port = port_range
    if start_port < 1 or end_port > 65535:
        return "Ports must be between 1 and 65535"
    
    try:
        # Determine if target is IP or URL
        is_ip = True
        try:
            socket.inet_aton(target)
        except socket.error:
            is_ip = False
        
        # Resolve target to IP address
        if not is_ip:
            try:
                target_ip = socket.gethostbyname(target)
            except gaierror:
                return "Error: Invalid hostname"
        else:
            target_ip = target
        
    except Exception:
        return "Error: Invalid IP address"
    
    open_ports = []
    
    for port in range(start_port, end_port + 1):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(1)
                result = s.connect_ex((target_ip, port))
                if result == 0:
                    open_ports.append(port)
        except Exception:
            continue
    
    if not verbose:
        return open_ports
    
    # Verbose output formatting
    output = []
    if not is_ip:
        output.append(f"Open ports for {target} ({target_ip})")
    else:
        output.append(f"Open ports for {target_ip}")
    
    output.append("PORT     SERVICE")
    for port in open_ports:
        service = COMMON_PORTS.get(port, "unknown")
        output.append(f"{port:<9}{service}")
    
    return "\n".join(output)