document.addEventListener('DOMContentLoaded', () => {
    loadConfigs();

    document.getElementById('btnGenUUID').addEventListener('click', () => {
        const uuid = crypto.randomUUID();
        document.getElementById('uuid').value = uuid;
    });

    document.getElementById('configForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            protocol: document.getElementById('protocol').value,
            host: document.getElementById('host').value,
            port: document.getElementById('port').value,
            uuid: document.getElementById('uuid').value,
            sni: document.getElementById('sni').value,
            path: document.getElementById('path').value,
            date: new Date().toLocaleDateString()
        };

        const configStr = generateConfigString(formData);
        formData.fullConfig = configStr;

        await DB.saveConfig(formData);
        loadConfigs();
        showModal(configStr);
    });

    document.getElementById('closeBtn').addEventListener('click', () => {
        document.getElementById('modal').classList.add('hidden');
    });

    document.getElementById('copyBtn').addEventListener('click', () => {
        const text = document.getElementById('resultArea');
        text.select();
        document.execCommand('copy');
        alert('Config Copied!');
    });
});

function generateConfigString(data) {
    if (data.protocol === 'vmess') {
        const vmessObj = {
            v: "2",
            ps: `Tunnel-${data.host}`,
            add: data.host,
            port: data.port,
            id: data.uuid,
            aid: "0",
            scy: "auto",
            net: "ws",
            type: "none",
            host: data.sni || data.host,
            path: data.path,
            tls: data.port == 443 ? "tls" : "none",
            sni: data.sni || ""
        };
        return "vmess://" + btoa(JSON.stringify(vmessObj));
    } 
    else if (data.protocol === 'vless') {
        // Format: vless://uuid@host:port?security=tls&encryption=none&type=ws&host=sni&path=%2F#remark
        const security = data.port == 443 ? 'tls' : 'none';
        const sniPart = data.sni ? `&host=${data.sni}&sni=${data.sni}` : `&host=${data.host}`;
        return `vless://${data.uuid}@${data.host}:${data.port}?security=${security}&encryption=none&type=ws&path=${encodeURIComponent(data.path)}${sniPart}#Tunnel-${data.host}`;
    }
    else if (data.protocol === 'trojan') {
        return `trojan://${data.uuid}@${data.host}:${data.port}?security=tls&type=ws&path=${encodeURIComponent(data.path)}&sni=${data.sni || data.host}#Tunnel-${data.host}`;
    }
    else {
        // Simple SSH format
        return `ssh ${data.uuid}@${data.host} -p ${data.port} -o "ServerAliveInterval 60"`;
    }
}

async function loadConfigs() {
    const list = document.getElementById('configList');
    list.innerHTML = '';
    const configs = await DB.getConfigs();

    configs.forEach(conf => {
        const li = document.createElement('li');
        li.className = 'config-item';
        li.innerHTML = `
            <div class="config-info">
                <strong>${conf.protocol.toUpperCase()}</strong> - ${conf.host}
                <small>${conf.date}</small>
            </div>
            <div>
                <button class="secondary-btn" onclick="showModal('${conf.fullConfig}')">View</button>
                <button class="secondary-btn" style="background:#ef4444" onclick="deleteConf(${conf.id})">X</button>
            </div>
        `;
        list.appendChild(li);
    });
}

window.deleteConf = async (id) => {
    if(confirm('Delete this config?')) {
        await DB.deleteConfig(id);
        loadConfigs();
    }
};

window.showModal = (content) => {
    document.getElementById('resultArea').value = content;
    document.getElementById('modal').classList.remove('hidden');
};