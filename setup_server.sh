#!/bin/bash

# SCRIPT AUTO INSTALL XRAY (VLESS/VMESS/TROJAN)
# Run this on your VPS (Ubuntu/Debian)

# 1. Update & Install Dependencies
apt update && apt install -y curl socat unzip

# 2. Install Xray Core
bash -c "$(curl -L https://github.com/XTLS/Xray-install/raw/main/install-release.sh)" @ install

# 3. Generate UUID
UUID=$(cat /proc/sys/kernel/random/uuid)

# 4. Create Config
cat <<EOF > /usr/local/etc/xray/config.json
{
  "inbounds": [
    {
      "port": 443,
      "protocol": "vless",
      "settings": {
        "clients": [
          {
            "id": "$UUID",
            "flow": "xtls-rprx-vision"
          }
        ],
        "decryption": "none"
      },
      "streamSettings": {
        "network": "tcp",
        "security": "tls",
        "tlsSettings": {
          "certificates": [
            {
              "certificateFile": "/usr/local/etc/xray/fullchain.crt",
              "keyFile": "/usr/local/etc/xray/private.key"
            }
          ]
        }
      }
    }
  ],
  "outbounds": [
    {
      "protocol": "freedom"
    }
  ]
}
EOF

# 5. Output Info
echo "=================================="
echo " XRAY INSTALLED SUCCESSFULLY"
echo "=================================="
echo " UUID: $UUID"
echo " PORT: 443"
echo " PROTOCOL: VLESS + XTLS"
echo "=================================="
echo " NOTE: You need to place your SSL certs at:"
echo " /usr/local/etc/xray/fullchain.crt"
echo " /usr/local/etc/xray/private.key"
echo " Then restart: systemctl restart xray"
echo "=================================="