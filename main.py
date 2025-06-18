import hashlib

def crack_sha1_hash(hash, use_salts=False):
    """
    Cracks a SHA-1 hash by comparing against top 10,000 passwords (with optional salts).
    
    Args:
        hash: The SHA-1 hash to crack
        use_salts: If True, tries each password with known salts prepended/appended
    
    Returns:
        The cracked password if found, otherwise "PASSWORD NOT IN DATABASE"
    """
    # Load top passwords
    try:
        with open('top-10000-passwords.txt', 'r') as f:
            passwords = [line.strip() for line in f]
    except FileNotFoundError:
        return "PASSWORD NOT IN DATABASE"
    
    # Load salts if needed
    salts = []
    if use_salts:
        try:
            with open('known-salts.txt', 'r') as f:
                salts = [line.strip() for line in f]
        except FileNotFoundError:
            pass  # Continue without salts if file not found
    
    # Check each password variation
    for password in passwords:
        if not use_salts:
            # Hash plain password
            hashed = hashlib.sha1(password.encode()).hexdigest()
            if hashed == hash:
                return password
        else:
            # Hash with each salt combination
            for salt in salts:
                # Prepend salt
                combo = salt + password
                hashed = hashlib.sha1(combo.encode()).hexdigest()
                if hashed == hash:
                    return password
                
                # Append salt
                combo = password + salt
                hashed = hashlib.sha1(combo.encode()).hexdigest()
                if hashed == hash:
                    return password
    
    return "PASSWORD NOT IN DATABASE"