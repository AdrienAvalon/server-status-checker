<template>
  <div class="server-status">
    <div class="dashboard-container">
      <!-- En-tête avec animation -->
      <div class="header">
        <h1 class="title animated-gradient">Dashboard Serveurs</h1>
        <div class="search-container">
          <i class="fas fa-search search-icon"></i>
          <input
            type="text"
            v-model="searchTerm"
            placeholder="Rechercher un serveur..."
            class="search-bar"
          />
        </div>
      </div>

      <!-- Stats avec compteurs animés -->
      <div class="stats-summary">
        <div class="stat-card online-stats">
          <i class="fas fa-server stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number counter">{{ onlineServers }}</span>
            <span class="stat-label">Serveurs en ligne</span>
          </div>
        </div>
        <div class="stat-card offline-stats">
          <i class="fas fa-exclamation-triangle stat-icon"></i>
          <div class="stat-content">
            <span class="stat-number counter">{{ offlineServers }}</span>
            <span class="stat-label">Serveurs hors ligne</span>
          </div>
        </div>
      </div>

      <!-- Grille de serveurs avec nouvelles animations -->
      <transition-group name="flip-list" tag="div" class="servers-grid">
        <div
          v-for="server in filteredServers"
          :key="server.ip"
          class="server-card"
          :class="{ 'server-offline': !server.status }"
        >
          <div class="server-header">
            <div class="server-info">
              <span class="server-name">{{ server.name }}</span>
              <span class="server-ip">
                <i class="fas fa-network-wired"></i> {{ server.ip }}
              </span>
            </div>
            <div class="status-container">
              <div
                :class="['status-indicator', server.status ? 'online' : 'offline']"
              ></div>
              <span class="status-text">{{ server.status ? 'En ligne' : 'Hors ligne' }}</span>
            </div>
          </div>
          <div class="server-details">
            <div class="details-row">
              <i class="fas fa-clock"></i>
              <span>Dernière vérification: {{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import yaml from 'js-yaml';

export default {
  data() {
    return {
      servers: [],
      intervalId: null,
      searchTerm: '',
    };
  },
  async created() {
    const response = await axios.get('/servers.yaml');
    const data = yaml.load(response.data);
    this.servers = data.servers.map(server => ({
      ...server,
      status: false,
    }));
    this.checkServerStatus();
  },
  mounted() {
    this.intervalId = setInterval(this.checkServerStatus, 30000);
  },
  beforeUnmount() {
    clearInterval(this.intervalId);
  },
  computed: {
    filteredServers() {
      if (!this.searchTerm) {
        return this.servers;
      }
      return this.servers.filter(server =>
        server.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        || server.ip.includes(this.searchTerm)
      );
    },
    onlineServers() {
      return this.servers.filter(s => s.status).length;
    },
    offlineServers() {
      return this.servers.filter(s => !s.status).length;
    }
  },
  methods: {
    async checkServerStatus() {
      for (const server of this.servers) {
        try {
          const res = await axios.get(`http://localhost:3000/ping?ip=${server.ip}`);
          server.status = res.data.status;
        } catch {
          server.status = false;
        }
      }
    },
  },
};
</script>

<style scoped>
.server-status {
  padding: 2rem;
  background: radial-gradient(circle at top right, #1a1f35 0%, #2d364c 100%);
  color: #fff;
  font-family: 'Segoe UI', 'Trebuchet MS', sans-serif;
  min-height: 100vh;
}

.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Animation du titre */
.animated-gradient {
  font-size: 2.8rem;
  font-weight: bold;
  background: linear-gradient(
    45deg,
    #00ffcc,
    #3399ff,
    #6600ff,
    #00ffcc
  );
  background-size: 300% 300%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
}

@keyframes gradient {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

/* Barre de recherche améliorée */
.search-container {
  position: relative;
  max-width: 600px;
  margin: 2rem auto;
}

.search-icon {
  position: absolute;
  left: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  color: #00ffcc;
}

.search-bar {
  width: 100%;
  padding: 1.2rem 1rem 1.2rem 3.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  color: #fff;
  font-size: 1.1rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.search-bar:focus {
  outline: none;
  border-color: #00ffcc;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.2);
  transform: scale(1.02);
}

/* Cartes de statistiques */
.stats-summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 2rem;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px) scale(1.02);
}

.online-stats {
  border-left: 4px solid #00ffcc;
}

.offline-stats {
  border-left: 4px solid #ff4757;
}

.stat-icon {
  font-size: 2.5rem;
  margin-right: 1.5rem;
  background: linear-gradient(45deg, #00ffcc, #3399ff);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Grille de serveurs */
.servers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

.server-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.server-card:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 255, 204, 0.2);
}

.server-offline:hover {
  box-shadow: 0 8px 25px rgba(255, 71, 87, 0.2);
}

.status-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
}

.online {
  background: #00ffcc;
  box-shadow: 0 0 20px rgba(0, 255, 204, 0.5);
  animation: pulse 2s infinite;
}

.offline {
  background: #ff4757;
  box-shadow: 0 0 20px rgba(255, 71, 87, 0.5);
}

.details-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a0a0a0;
  font-size: 0.9rem;
}

/* Animations */
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 255, 204, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 255, 204, 0); }
}

.flip-list-enter-active,
.flip-list-leave-active {
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.flip-list-enter-from,
.flip-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Responsive */
@media (max-width: 768px) {
  .servers-grid {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .animated-gradient {
    font-size: 2rem;
  }
}
</style>